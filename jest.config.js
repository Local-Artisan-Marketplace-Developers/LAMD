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
  coverageReporters: [
    "text",
    "lcov",
    ["html", { "projectRoot": "./" }]
  ],
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
