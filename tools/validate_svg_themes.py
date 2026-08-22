import os
import re
from pathlib import Path

def validate_svg_themes():
    root_dir = Path(__file__).parent.parent
    assets_dir = root_dir / "assets"
    
    val_dir = root_dir / "validation"
    val_dir.mkdir(exist_ok=True)
    
    report_lines = [
        "# SVG Light/Dark Mode Validation",
        "",
        "| Asset | Theme CSS Detected (`@media (prefers-color-scheme: dark)`) | Status |",
        "|---|---|---|"
    ]
    
    svgs = list(assets_dir.rglob("*.svg"))
    failures = 0
    
    for svg in svgs:
        content = open(svg, "r", encoding="utf-8").read()
        rel_path = svg.relative_to(root_dir)
        
        has_dark_mode = "@media" in content and "prefers-color-scheme" in content and "dark" in content
        
        if has_dark_mode:
            status = "PASS"
        else:
            status = "WARNING (No explicit dark mode logic found)"
            
        report_lines.append(f"| `{rel_path}` | {'Yes' if has_dark_mode else 'No'} | {status} |")
        
    with open(val_dir / "theme-validation.md", "w", encoding="utf-8") as f:
        f.write("\n".join(report_lines))
        f.write("\n\n**Note**: Objective rendering checks require visual inspection via `docs/visual-review.html` or automated screenshot comparison (Phase 5).")
        
    print("Theme validation report generated at validation/theme-validation.md")

if __name__ == "__main__":
    validate_svg_themes()
