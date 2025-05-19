module.exports = {
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest"
  },
  testMatch: [
    "**/?(*.)+(spec|test).[jt]s?(x)"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/"
  ],
  collectCoverage: true,
  coverageDirectory: "./coverage",
  coverageReporters: ["lcov", "text", "html"],
  testEnvironment: "jsdom",
  collectCoverageFrom: [
    "**/*.js",
    "!**/node_modules/**",
    "!**/*.test.js",
    "!**/*.spec.js",
    "!coverage/**",
    "!dist/**"
  ],
  transformIgnorePatterns: [
    "/node_modules/"
  ]
};
