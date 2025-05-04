module.exports = {
    transform: {
      "^.+\\.[tj]sx?$": "babel-jest"
    },
    testMatch: [
      "**/?(*.)+(spec|test).[jt]s?(x)"
    ],
    testPathIgnorePatterns: [
      "/node_modules/"
    ],
    collectCoverage: true,
    coverageDirectory: "./coverage",
    coverageReporters: ["lcov", "text", "html"],
    testEnvironment: "jest-environment-jsdom",
    collectCoverageFrom: [
      "**/*.js",
      "!**/node_modules/**"
    ],
    transformIgnorePatterns: [
      "/node_modules/(?!(@babel|react)/)"
    ]
  };
  