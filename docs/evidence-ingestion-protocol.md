# Evidence Ingestion Protocol

This protocol defines the strict pipeline for converting raw engineering assets into published portfolio evidence.

## The Pipeline

**RAW EVIDENCE → SANITIZATION → TECHNICAL REVIEW → APPROVAL → PORTFOLIO ASSET → PUBLICATION**

## 1. Raw Evidence Collection
- Place original files in `evidence/raw/`.
- Ensure original metadata is preserved for attribution.

## 2. Sanitization
- Remove proprietary information, company logos (if unapproved), and identifying data.
- Redact sensitive performance metrics or unpublished research data.
- Place the sanitized version in `evidence/sanitized/`.

## 3. Technical Review
Check the asset against the following criteria:
- **Authenticity:** Is this actual engineering evidence (e.g., a real CFD plot) or just explanatory artwork?
- **Confidentiality:** Does this violate NDA or research embargoes?
- **Publication Permission:** Is there explicit permission to publish?
- **Reproducibility:** Can the metric or result be technically reproduced or cited?
- **Source Attribution:** Is the source properly attributed?
- **Validation Status:** Is the result preliminary or validated?

## 4. Approval
- Generate an `evidence-record-template.json` for the asset.
- Fill in the technical review status.
- Move the asset to `evidence/approved/`.

## 5. Portfolio Asset
- Copy the asset to `assets/visuals/` or `assets/figures/`.
- Update `docs/asset-manifest.md`.
- Integrate into `README.md`.

## 6. Publication
- Once published, move the evidence record to `evidence/published/`.
