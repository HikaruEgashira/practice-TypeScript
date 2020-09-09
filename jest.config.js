/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json",
    },
  },
  testEnvironment: "node",
  rootDir: ".",
  //   setupFilesAfterEnv: ["<rootDir>/src/__helpers__/setup.ts"],
  testMatch: ["<rootDir>/src/**/*.spec.ts"],
  testPathIgnorePatterns: ["<rootDir>/src/__mocks__/*"],
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/**/*.d.ts",
    "!<rootDir>/src/**/*.spec.ts",
    "!<rootDir>/src/**/*.test.ts",
    "!<rootDir>/src/**/__*__/*",
    "!<rootDir>/src/utils/testing.ts",
  ],
  //   snapshotSerializers: ["<rootDir>/src/__serializers__/processed-source.ts"],
  cacheDirectory: "<rootDir>/.cache/unit",
};
