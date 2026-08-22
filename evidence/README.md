# Evidence Ingestion System

This directory manages authentic engineering evidence (photos, CAD renders, CFD plots, code snippets) before it is approved for public portfolio use.

## Stages
1. `raw/` - Unmodified original evidence. May contain confidential/proprietary details.
2. `sanitized/` - Evidence with proprietary information, sensitive data, or identifying details removed.
3. `approved/` - Sanitized evidence that has passed technical review and is approved for publication.
4. `published/` - Evidence currently live in the public portfolio repository.

See `docs/evidence-ingestion-protocol.md` for the full pipeline rules.
