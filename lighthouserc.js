/** @type {import('@lhci/cli').LighthouseCIConfiguration} */
module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:3000/booker/"],
      startServerCommand: "npm run start",
      startServerReadyPattern: "ready",
      startServerReadyTimeout: 10000,
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.7 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.9 }],
        "first-contentful-paint": ["warn", { maxNumericValue: 2000 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["warn", { maxNumericValue: 300 }],
        "speed-index": ["warn", { maxNumericValue: 3000 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: "./lighthouse-reports",
    },
  },
};
