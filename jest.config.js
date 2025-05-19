module.exports = {
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  testMatch: [
    "**/?(*.)+(spec|test).js"
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
    "!**/*.test.js",
    "!**/*.spec.js",
    "!node_modules/**",
    "!coverage/**",
    "!dist/**"
  ],
  transformIgnorePatterns: [
    "/node_modules/"
  ]
};
