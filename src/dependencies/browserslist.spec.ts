import { readFileSync } from "fs";
import { resolve } from "path";

const YARN_LOCK = resolve(__dirname, "..", "..", "yarn.lock");

function entryFor(lockfile: string, name: string): string {
  const entry = lockfile
    .split(/\r?\n\r?\n/)
    .find((section) => section.startsWith(`${name}@`));
  if (!entry) {
    throw new Error(`yarn.lock is missing an entry for ${name}`);
  }
  return entry;
}

describe("browserslist dependency lock", () => {
  const lockfile = readFileSync(YARN_LOCK, "utf8");
  const browserslist = entryFor(lockfile, "browserslist");

  it("resolves browserslist to at least the patched 4.28.9 release", () => {
    const version = browserslist.match(/^\s+version "(\d+)\.(\d+)\.(\d+)"$/m);
    if (!version) {
      throw new Error("yarn.lock has no parsable browserslist version");
    }
    const [major, minor, patch] = version.slice(1).map(Number);
    const patched =
      major > 4 ||
      (major === 4 && (minor > 28 || (minor === 28 && patch >= 9)));

    expect(patched).toBe(true);
    expect(lockfile).not.toContain("browserslist-4.28.2.tgz");
  });

  it("keeps the transitive browser data packages aligned", () => {
    for (const dependency of [
      "baseline-browser-mapping",
      "caniuse-lite",
      "electron-to-chromium",
      "node-releases",
      "update-browserslist-db",
    ]) {
      expect(browserslist).toContain(`${dependency} "`);
    }
  });
});
