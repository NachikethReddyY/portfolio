import fs from "node:fs/promises";
import sharp from "sharp";
const root = new URL("../", import.meta.url).pathname;
const editor = await sharp(root + ".evidence/app-refinement/vscode-window.png")
  .png()
  .toBuffer();
const image = (bytes) => "data:image/png;base64," + bytes.toString("base64");
const icons = ["finder", "vscode", "ghostty", "xcode", "orbstack", "codex"];
const dock = await Promise.all(
  icons.map(
    async (name, i) =>
      '<image x="' +
      (431 + i * 96) +
      '" y="759" width="86" height="86" href="' +
      image(await fs.readFile(root + "public/icons/apps/" + name + ".png")) +
      '"/>',
  ),
);
const contours = JSON.parse(
  await fs.readFile(root + "scripts/apple-logo-contours.json", "utf8"),
);
const apple = contours
  .map(
    (points) =>
      '<polygon points="' + points.map((p) => p.join(",")).join(" ") + '"/>',
  )
  .join("");
const svg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="870" viewBox="0 0 1440 870"><defs><linearGradient id="wall" x2="1" y2="1"><stop stop-color="#0c2748"/><stop offset="1" stop-color="#071323"/></linearGradient><clipPath id="editor"><rect x="62" y="76" width="1316" height="649" rx="16"/></clipPath></defs><rect width="1440" height="870" fill="url(#wall)"/><path d="M-200 900Q720-550 1640 390L1450 880Z" fill="#194573"/><path d="M-100 890Q620-160 1510 630L1440 890Z" fill="#113252"/><rect width="1440" height="55" fill="#080e19" opacity=".82"/><g transform="translate(24 12) scale(1.14)" fill="#fff">' +
  apple +
  '</g><g font-family="sans-serif" font-size="20" fill="#eef5ff"><text x="73" y="35" font-weight="700">Code</text><text x="142" y="35">File</text><text x="198" y="35">Edit</text><text x="259" y="35">Selection</text><text x="368" y="35">View</text><text x="441" y="35">Go</text><text x="494" y="35">Run</text><text x="554" y="35">Terminal</text><text x="1410" y="35" text-anchor="end">Fri 18 Sep　9:41 AM</text></g><g transform="translate(1025 17)" fill="none" stroke="#eef5ff" stroke-width="2.3"><rect width="32" height="18" rx="4"/><path d="M35 5v8"/><rect x="4" y="4" width="24" height="10" rx="1" fill="#eef5ff" stroke="none"/></g><g transform="translate(1092 14)" fill="none" stroke="#eef5ff" stroke-width="2.5" stroke-linecap="round"><path d="M0 5Q15-6 30 5M5 11Q15 3 25 11M10 17Q15 13 20 17"/><circle cx="15" cy="22" r="1.7" fill="#eef5ff" stroke="none"/></g><g transform="translate(1157 13)" fill="none" stroke="#eef5ff" stroke-width="2"><rect width="32" height="12" rx="6"/><rect y="17" width="32" height="12" rx="6"/><circle cx="8" cy="6" r="3" fill="#eef5ff"/><circle cx="24" cy="23" r="3" fill="#eef5ff"/></g><image x="62" y="76" width="1316" height="649" preserveAspectRatio="none" clip-path="url(#editor)" href="' +
  image(editor) +
  '"/><rect x="414" y="746" width="612" height="111" rx="30" fill="#d4e8ff" fill-opacity=".2" stroke="#e1edff" stroke-opacity=".3"/>' +
  dock.join("") +
  '<circle cx="570" cy="849" r="3" fill="#dcecff"/></svg>';
await fs.writeFile(root + "public/models/laptop-screen.svg", svg);
await sharp(Buffer.from(svg))
  .resize(2160, 1305)
  .png()
  .toFile(root + "public/models/laptop-screen.png");
