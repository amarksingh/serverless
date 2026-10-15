const tsJestPath = "/Users/amarkumarsingh/.nvm/versions/node/v24.12.0/lib/node_modules/ts-jest";

module.exports = {
    "testEnvironment": "node",
    "moduleDirectories": [
        "node_modules",
        "../foundation/node_modules"
    ],
    "coverageDirectory": "coverage",
    "collectCoverageFrom": [
        "**/*.ts",
        "!**/node_modules/**",
        "!**/coverage/**",
        "!jest.config.js",
        "!test/**"
    ],
    "coverageThreshold": {
        "global": {
            "branches": 100,
            "functions": 100,
            "lines": 100,
            "statements": 100
        }
    },
    "testMatch": [
        "**/test/**/*.test.ts",
        "**/test/**/*.test.js"
    ],
    "transform": {
        "^.+\\.ts$": [
            tsJestPath,
            {
                "tsconfig": "<rootDir>/tsconfig.json"
            }
        ]
    }
};
