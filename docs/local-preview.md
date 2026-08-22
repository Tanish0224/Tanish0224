# Local Preview Infrastructure

This document describes how to start and use the local preview system to inspect the portfolio assets and visual layout locally before any publication.

## Starting Preview
Run the following command from the repository root:

```bash
python tools/start_preview.py
```

This will start a local HTTP server on port 8000 and automatically open your default browser.

## Stopping Preview
Press `Ctrl+C` in the terminal where the server is running.

## Viewing Visual Review
The script automatically opens the visual review page, or you can manually navigate to:
`http://localhost:8000/docs/visual-review.html`

This page renders all SVG assets in both light and dark modes to check responsiveness and color-scheme compliance.

## Viewing Generated Validation Output
To view validation outputs locally, navigate to:
`http://localhost:8000/validation/portfolio-validation.md`
`http://localhost:8000/validation/asset-manifest.generated.md`

*(Note: Install a Markdown viewer browser extension to render `.md` files natively in your browser.)*
