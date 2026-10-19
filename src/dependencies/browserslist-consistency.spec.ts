import { readFileSync } from "fs";
import { resolve } from "path";

const YARN_LOCK = resolve(__dirname, "..", "..", "yarn.lock");

const DEPENDENCIES: Record<string, string> = {
  "baseline-browser-mapping": "^2.11.20",
  "caniuse-lite": "^1.0.30001810",
  "electron-to-chromium": "^1.5.420",
  "node-releases": "^2.0.54",
  "update-browserslist-db": "^1.3.2",
};

const STALE_TARBALLS = [
  "browserslist-4.28.2.tgz",
  "baseline-browser-mapping-2.10.37.tgz",
  "caniuse-lite-1.0.30001799.tgz",
  "electron-to-chromium-1.5.375.tgz",
  "node-releases-2.0.47.tgz",
  "update-browserslist-db-1.2.3.tgz",
];

function entryFor(lockfile: string, name: string): string {
  const entry = lockfile
    .split(/\r?\n\r?\n/)
    .find((section) => section.startsWith(`${name}@`));
  if (!entry) {
    throw new Error(`yarn.lock is missing an entry for ${name}`);
  }
  return entry;
}

function versionOf(entry: string): [number, number, number] {
  const match = entry.match(/^\s+version "(\d+)\.(\d+)\.(\d+)"/m);
  if (!match) {
    throw new Error(`Could not parse a version from lockfile entry: ${entry}`);
  }
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function minimumOf(range: string): [number, number, number] {
  const match = range.match(/(\d+)\.(\d+)\.(\d+)/);
  if (!match) {
    throw new Error(`Could not parse a minimum version from range ${range}`);
  }
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function compare(
  left: [number, number, number],
  right: [number, number, number]
): number {
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) {
      return left[index] - right[index];
    }
  }
  return 0;
}

describe("browserslist lockfile consistency", () => {
  const lockfile = readFileSync(YARN_LOCK, "utf8");
  const browserslist = entryFor(lockfile, "browserslist");

  it("locks browserslist to at least the patched 4.28.9 release", () => {
    expect(compare(versionOf(browserslist), minimumOf("4.28.9"))).toBeGreaterThanOrEqual(0);
    expect(lockfile).not.toContain("browserslist-4.28.2.tgz");
  });

  it("declares the dependency ranges required by browserslist 4.28.9", () => {
    for (const [name, range] of Object.entries(DEPENDENCIES)) {
      expect(browserslist).toContain(`${name} "${range}"`);
    }
  });

  it("locks every transitive package to at least its declared minimum", () => {
    for (const [name, range] of Object.entries(DEPENDENCIES)) {
      const locked = versionOf(entryFor(lockfile, name));
      expect(compare(locked, minimumOf(range))).toBeGreaterThanOrEqual(0);
    }
  });

  it("does not retain tarballs from the superseded dependency versions", () => {
    for (const stale of STALE_TARBALLS) {
      expect(lockfile).not.toContain(stale);
    }
  });
});
