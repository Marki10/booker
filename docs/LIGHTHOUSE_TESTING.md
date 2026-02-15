# Lighthouse Performance Testing

This project uses Lighthouse CI to measure and enforce performance standards.

## Overview

Lighthouse CI automatically runs Lighthouse audits on the application and enforces performance budgets to catch regressions.

## Running Lighthouse Tests

### Local Development

```bash
# Run Lighthouse tests (requires server running)
npm run test:lighthouse

# Quick CI mode (single run)
npm run test:lighthouse:ci
```

### Prerequisites

1. **Start the production server**:

   ```bash
   npm run build
   npm run start
   ```

2. **Or use dev server** (not recommended for performance testing):
   ```bash
   npm run dev
   ```

## Performance Budgets

The following thresholds are enforced:

### Core Web Vitals

- **First Contentful Paint (FCP)**: < 2.0s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Total Blocking Time (TBT)**: < 300ms
- **Speed Index**: < 3.0s

### Category Scores

- **Performance**: ≥ 80
- **Accessibility**: ≥ 90
- **Best Practices**: ≥ 90
- **SEO**: ≥ 90

## Configuration

Lighthouse configuration is in `lighthouserc.js`. You can customize:

- URLs to test
- Number of runs (default: 3)
- Performance thresholds
- Server startup commands

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Lighthouse CI
on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "20"
      - run: npm ci
      - run: npm run build
      - run: npm run test:lighthouse:ci
```

## Viewing Reports

Reports are saved to `./lighthouse-reports/` directory. Each run generates:

- HTML reports for each URL
- JSON data for programmatic analysis
- Summary statistics

## Troubleshooting

### Server Not Starting

If Lighthouse can't start the server:

1. Check `startServerCommand` in `lighthouserc.js`
2. Verify `startServerReadyPattern` matches your server output
3. Increase `startServerReadyTimeout` if needed

### Failing Thresholds

If tests fail:

1. Check the HTML reports in `lighthouse-reports/`
2. Review specific metric failures
3. Use Lighthouse DevTools in Chrome for detailed analysis
4. Consider adjusting thresholds if they're too strict for your use case

### Running Against Different Environments

To test staging/production:

```javascript
// lighthouserc.js
collect: {
  url: ["https://your-staging-url.com/booker/"],
  // Remove startServerCommand for remote URLs
}
```

## Best Practices

1. **Run regularly**: Add to CI/CD pipeline
2. **Monitor trends**: Track scores over time
3. **Test production builds**: Use `npm run build && npm run start`
4. **Multiple runs**: Default is 3 runs for consistency
5. **Review reports**: Check HTML reports for actionable insights
