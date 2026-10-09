import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";
import ts from "typescript";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const healthEntry = join(projectRoot, "api/health.ts");
const tsconfigPath = join(projectRoot, "tsconfig.json");

const emittedJavaScriptFiles = (directory) => {
  const files = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...emittedJavaScriptFiles(path));
    else if (entry.isFile() && path.endsWith(".js")) files.push(path);
  }

  return files;
};

const formatDiagnostics = (diagnostics) =>
  diagnostics
    .map((diagnostic) =>
      ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
    )
    .join("\n");

test("compiled health function runs from a fresh package", () => {
  const temporaryRoot = mkdtempSync(
    join(tmpdir(), "portfolio-function-package-"),
  );
  const outputDirectory = join(temporaryRoot, "compiled");

  try {
    const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
    assert.equal(
      configFile.error,
      undefined,
      configFile.error ? formatDiagnostics([configFile.error]) : undefined,
    );

    const parsedConfig = ts.parseJsonConfigFileContent(
      configFile.config,
      ts.sys,
      projectRoot,
    );
    assert.equal(
      parsedConfig.errors.length,
      0,
      formatDiagnostics(parsedConfig.errors),
    );

    const program = ts.createProgram({
      rootNames: [healthEntry],
      options: {
        ...parsedConfig.options,
        noEmit: false,
        outDir: outputDirectory,
      },
    });
    const diagnostics = ts.getPreEmitDiagnostics(program);
    assert.equal(diagnostics.length, 0, formatDiagnostics(diagnostics));

    const emitResult = program.emit();
    assert.equal(
      emitResult.emitSkipped,
      false,
      formatDiagnostics(emitResult.diagnostics),
    );

    const emittedFiles = emittedJavaScriptFiles(outputDirectory);
    assert.ok(
      emittedFiles.length > 0,
      "TypeScript emitted no JavaScript files",
    );
    assert.ok(
      existsSync(join(outputDirectory, "api/health.js")),
      "compiled health handler is missing",
    );
    for (const file of emittedFiles) {
      const source = readFileSync(file, "utf8");
      assert.doesNotMatch(
        source,
        /["'][^"']+\.ts["']/,
        `${relative(outputDirectory, file)} retains a .ts import`,
      );
    }

    writeFileSync(
      join(temporaryRoot, "package.json"),
      JSON.stringify({ type: "module" }),
    );
    symlinkSync(
      join(projectRoot, "node_modules"),
      join(temporaryRoot, "node_modules"),
      "dir",
    );

    const healthUrl = pathToFileURL(
      join(outputDirectory, "api/health.js"),
    ).href;
    const runner = `
      import handler from ${JSON.stringify(healthUrl)};

      const headers = {};
      const response = {
        statusCode: 0,
        setHeader(name, value) {
          headers[name] = value;
        },
        end(body = "") {
          this.body = body;
        },
      };

      await handler({ method: "GET" }, response);
      process.stdout.write(JSON.stringify({
        statusCode: response.statusCode,
        headers,
        body: response.body,
      }));
    `;
    const result = JSON.parse(
      execFileSync(
        process.execPath,
        ["--input-type=module", "--eval", runner],
        {
          cwd: temporaryRoot,
          env: { ...process.env, VITE_SANITY_ENABLED: "false" },
          encoding: "utf8",
        },
      ),
    );

    assert.equal(result.statusCode, 200);
    assert.equal(
      result.headers["Content-Type"],
      "application/json; charset=utf-8",
    );
    assert.deepEqual(JSON.parse(result.body), {
      status: "ok",
      contentSource: "local",
    });
  } finally {
    rmSync(temporaryRoot, { recursive: true, force: true });
  }

  assert.equal(
    existsSync(temporaryRoot),
    false,
    "temporary package was not cleaned up",
  );
});
