# Portfolio Development Guide

This is the master technical workflow for maintaining this portfolio locally before publication.

## 1. Editing Portfolio Content
All narrative and structural changes must be made directly in `README.md`. It is the source of truth. Do not edit `README.md` if it violates the `REVIEW_GATE.md` protocol.

## 2. Adding an SVG
1. Place the SVG in `assets/diagrams/` or `assets/identity/`.
2. Ensure the SVG contains a `viewBox` and no external HTTP links.
3. Update `docs/visual-review.html` to include the new SVG.

## 3. Adding Authentic Engineering Evidence
All authentic evidence (CAD, CFD, Photos) must follow the `docs/evidence-ingestion-protocol.md`:
1. Place raw files in `evidence/raw/`.
2. Sanitize and place in `evidence/sanitized/`.
3. Complete `evidence-record-template.json` and move to `evidence/approved/`.
4. Copy the final asset to `assets/visuals/` or `assets/figures/`.

## 4. Running Validation
To technically validate the portfolio state:
```bash
python tools/validate_portfolio.py
```
This script checks for broken links, missing assets, placeholders, secrets, and structural integrity.

## 5. Generating the Asset Manifest
To inventory all assets:
```bash
python tools/generate_asset_manifest.py
```

## 6. Starting Local Preview
To view the portfolio visually before publishing:
```bash
python tools/start_preview.py
```
This opens `docs/visual-review.html` to inspect SVG assets in light and dark modes.

## 7. Running Visual Tests
*(Requires Playwright)*
```bash
python tools/capture_screenshots.py
```
Captures multi-viewport screenshots (Desktop, Laptop, Tablet, Mobile) in both light and dark modes.

## 8. Reviewing Generated Screenshots
Inspect the output in `validation/screenshots/` to detect rendering failures, missing assets, or text disappearance.

## 9. Checking Evidence Safety
Run the validation script (`tools/validate_portfolio.py`) and manually inspect the `evidence/approved/` directory to ensure no confidential data is leaked.

## 10. Preparing a Future Project Case Study
1. Copy the `templates/project-case-study/` directory to a new project folder.
2. Fill out the template placeholders.
3. Complete the `PROJECT_CHECKLIST.md`.

## 11. Publication Preparation
Once all validation passes, evidence is approved, and the `REVIEW_GATE.md` human review is signed off, the portfolio can be published via Git/GitHub. (Publication instructions deferred).
