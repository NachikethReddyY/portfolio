import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parse } from "parse5";
const routes = JSON.parse(readFileSync("dist/route-manifest.json", "utf8"));
const attr = (node, name) => node.attrs?.find((a) => a.name === name)?.value;
const walk = (node) => [node, ...(node.childNodes ?? []).flatMap(walk)];
const hasClass = (node, name) =>
  (attr(node, "class") ?? "").split(" ").includes(name);
let links = 0;
for (const route of routes.filter((route) =>
  /^\/(projects|writing)\//.test(route),
)) {
  const html = readFileSync(`dist${route}/index.html`, "utf8");
  const nodes = walk(parse(html));
  const contents = nodes.find((node) => hasClass(node, "reading-contents"));
  if (contents) {
    for (const link of walk(contents).filter((node) => node.tagName === "a")) {
      const id = decodeURIComponent(attr(link, "href").split("#")[1]);
      assert.equal(
        nodes.filter((node) => attr(node, "id") === id).length,
        1,
        `${route}: ${id} has exactly one heading target`,
      );
      links++;
    }
  }
  if (route.startsWith("/projects/")) {
    assert.ok(
      nodes.some((node) => hasClass(node, "case-cover")),
      `${route}: preview before case study`,
    );
    assert.ok(
      html.indexOf("case-cover") < html.indexOf("case-facts"),
      `${route}: result before process`,
    );
  }
}
const page = (route) => readFileSync(`dist${route}/index.html`, "utf8");
assert.match(page("/projects/vsms"), /device-browser/);
assert.match(page("/projects/coreml-workshop"), /device-phone/);
assert.match(page("/projects/coreml-workshop"), /Workshop illustration/);
assert.match(page("/projects/codeprobe-scanner"), /device-desktop/);
assert.match(page("/projects/lah"), /device-artwork/);
assert.match(
  page("/projects/model-shelf"),
  /README-based project illustration/,
);
assert.ok(
  !page("/writing/lah01").includes('class="reading-contents"'),
  "legacy article without keyed headings does not expose broken contents",
);
assert.ok(links > 20, "check actual content, not an empty fixture");
console.log(
  `Work presentation passed: ${links} contents links, all project covers, four frame variants and illustrative fallbacks.`,
);

const galleryNodes = walk(parse(page("/projects/lah")));
assert.ok(
  galleryNodes.some(
    (node) =>
      node.tagName === "dialog" &&
      attr(node, "aria-label") === "Project image viewer",
  ),
);
assert.ok(
  galleryNodes.some(
    (node) =>
      node.tagName === "button" && attr(node, "aria-haspopup") === "dialog",
  ),
);
assert.ok(
  !galleryNodes.some((node) => hasClass(node, "sound-toggle")),
  "no site sound toggle",
);
const home = readFileSync("dist/index.html", "utf8");
const sections = [
  "hello-section",
  "stack-section",
  "journey-section",
  "home-work",
  "contributions shell",
  "learning-transition shell",
  "ai-section",
  "home-writing",
];
for (let i = 1; i < sections.length; i++)
  assert.ok(
    home.indexOf(sections[i]) > home.indexOf(sections[i - 1]),
    `story order: ${sections[i]}`,
  );
const homeNodes = walk(parse(home));
const demo = homeNodes.find((node) => hasClass(node, "mark-one-demo"));
assert.ok(demo);
assert.ok(
  !walk(demo).some((node) => node.tagName === "pre"),
  "model response is a summary, not code",
);
const demoHtml = home.slice(home.indexOf('class="mark-one-demo"'));
assert.ok(
  demoHtml.indexOf('class="mark-one-changes"') <
    demoHtml.indexOf('class="mark-one-composer"'),
  "changes before composer",
);
assert.match(home, /Legion/);
assert.match(home, /Education/);
console.log(
  "Verified homepage story order, chat summary, gallery controls and removed sound toggle.",
);

const toolNodes = homeNodes.filter((node) => hasClass(node, "tool-item"));
const tool = (id) =>
  toolNodes.find((node) =>
    walk(node).some((child) => hasClass(child, `app-icon--${id}`)),
  );
for (const id of [
  "html5",
  "css",
  "javascript",
  "mysql",
  "expo",
  "claudecode",
  "vision",
  "coreml",
  "foundationmodels",
  "supabase",
]) {
  assert.ok(
    hasClass(tool(id), "tool-item--older"),
    `${id}: whole item participates in de-emphasis`,
  );
  assert.equal(
    attr(tool(id), "tabindex"),
    "0",
    `${id}: keyboard restores the item`,
  );
}
assert.ok(
  !hasClass(tool("prisma"), "tool-item--older"),
  "Prisma remains sharp",
);
assert.ok(tool("tailwindcss"), "Tailwind is present");
const modelNames = walk(demo).filter(
  (node) => node.nodeName === "#text" && node.value.includes("Fleet Mark I"),
);
assert.equal(modelNames.length, 1, "model name is only in composer");
assert.ok(
  homeNodes.some(
    (node) => node.tagName === "details" && hasClass(node, "education-details"),
  ),
  "campus activities are nested",
);
console.log(
  "Verified exact whole-item blur set, Prisma exception, Tailwind, single model label and nested education.",
);

assert.ok(tool("lmstudio"), "LM Studio is shown");
assert.ok(
  !hasClass(tool("lmstudio"), "tool-item--older"),
  "LM Studio stays sharp",
);
assert.ok(hasClass(tool("ollama"), "tool-item--older"), "Ollama is less used");
const contributionApps = homeNodes.find(node => hasClass(node, "contribution-apps"));
assert.ok(contributionApps, "contributions use app icons");
const contributionLinks = walk(contributionApps).filter(node => node.tagName === "a");
assert.equal(contributionLinks.length, 2);
for (const link of contributionLinks) {
  const url = new URL(attr(link, "href"));
  assert.ok(url.pathname.endsWith("/pulls"));
  assert.equal(url.searchParams.get("q"), "is:pr author:NachikethReddyY");
  assert.ok(walk(link).some(node => node.tagName === "img"));
}
assert.match(home, /November 2024/);
assert.match(home, /six months/);
assert.ok(
  homeNodes.some((node) => hasClass(node, "work-stage")),
  "Work has a bounded scroll stage",
);
assert.ok(
  homeNodes.some((node) => hasClass(node, "models-destination")),
  "Models has a handoff destination",
);
console.log(
  "Verified current local tools, product contribution cards and local-model narrative.",
);
