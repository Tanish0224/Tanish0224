import os
import re
import sys
import json
import xml.etree.ElementTree as ET
from pathlib import Path

def validate_portfolio():
    root_dir = Path(__file__).parent.parent
    readme_path = root_dir / "README.md"
    
    results = {
        "readme_checks": [],
        "asset_checks": [],
        "safety_checks": [],
        "markdown_stats": {},
        "critical_failures": 0
    }
    
    # ---------------------------
    # README VALIDATION
    # ---------------------------
    def add_readme_check(name, status, details=""):
        results["readme_checks"].append({"name": name, "status": status, "details": details})
        if status == "FAIL":
            results["critical_failures"] += 1

    if not readme_path.exists():
        add_readme_check("README.md exists", "FAIL", "README.md not found in root")
        return write_output(root_dir, results)
    
    add_readme_check("README.md exists", "PASS")
    
    with open(readme_path, "r", encoding="utf-8") as f:
        readme_content = f.read()
    
    # Check placeholders
    if "[PLACEHOLDER]" in readme_content:
        add_readme_check("No [PLACEHOLDER] tags", "FAIL", "Found [PLACEHOLDER] tags")
    else:
        add_readme_check("No [PLACEHOLDER] tags", "PASS")
        
    if "ASSET PENDING" in readme_content:
        add_readme_check("No 'ASSET PENDING' comments", "FAIL", "Found ASSET PENDING")
    else:
        add_readme_check("No 'ASSET PENDING' comments", "PASS")
        
    if "dummy.com" in readme_content or "example.com" in readme_content:
        add_readme_check("No dummy URLs", "WARNING", "Found dummy/example URLs")
    else:
        add_readme_check("No dummy URLs", "PASS")
        
    if re.search(r"[C-Z]:\\", readme_content):
        add_readme_check("No absolute Windows paths", "FAIL", "Found absolute windows paths")
    else:
        add_readme_check("No absolute Windows paths", "PASS")

    # Image refs
    img_refs = re.findall(r"!\[.*?\]\((.*?)\)", readme_content)
    broken_images = []
    for img in img_refs:
        if not (root_dir / img).exists():
            broken_images.append(img)
    if broken_images:
        add_readme_check("All local image references resolve", "FAIL", f"Broken: {broken_images}")
    else:
        add_readme_check("All local image references resolve", "PASS")

    # Expected sections
    headings = re.findall(r"^(#{1,3})\s+(.*)", readme_content, re.MULTILINE)
    h2_headings = [h[1].strip() for h in headings if h[0] == "##"]
    
    expected_h2 = [
        "The Way I Work",
        "Engineering Journey",
        "Exploration Beyond the Classroom",
        "Featured Engineering Stories",
        "Understanding Before Extending",
        "Tools I Use Along the Way",
        "What I'm Building Next",
        "Connect"
    ]
    
    missing_h2 = [h for h in expected_h2 if h not in h2_headings]
    if missing_h2:
        add_readme_check("Expected major sections detected", "FAIL", f"Missing: {missing_h2}")
    else:
        add_readme_check("Expected major sections detected", "PASS")
        
    if len(h2_headings) != len(set(h2_headings)):
        add_readme_check("No duplicate top-level section headings", "FAIL", "Duplicates found")
    else:
        add_readme_check("No duplicate top-level section headings", "PASS")

    # ---------------------------
    # ASSET VALIDATION
    # ---------------------------
    def add_asset_check(name, status, details=""):
        results["asset_checks"].append({"name": name, "status": status, "details": details})
        if status == "FAIL":
            results["critical_failures"] += 1

    svgs = list((root_dir / "assets").rglob("*.svg"))
    for svg in svgs:
        rel_path = svg.relative_to(root_dir)
        try:
            tree = ET.parse(svg)
            root = tree.getroot()
            if not root.tag.endswith("svg"):
                add_asset_check(f"{rel_path} SVG root exists", "FAIL", "Root is not svg")
                continue
            
            if "viewBox" not in root.attrib:
                add_asset_check(f"{rel_path} viewBox exists", "FAIL", "No viewBox found")
            
            svg_str = open(svg, "r", encoding="utf-8").read()
            if "<script" in svg_str:
                add_asset_check(f"{rel_path} No JavaScript", "FAIL", "Script tag found")
            if 'href="http' in svg_str or 'src="http' in svg_str:
                add_asset_check(f"{rel_path} No external asset dependencies", "FAIL", "External URL found")
                
            add_asset_check(f"{rel_path} SVG integrity", "PASS", f"Size: {svg.stat().st_size} bytes")
        except Exception as e:
            add_asset_check(f"{rel_path} valid XML", "FAIL", str(e))

    # ---------------------------
    # SAFETY CHECKS
    # ---------------------------
    def add_safety(name, status, details=""):
        results["safety_checks"].append({"name": name, "status": status, "details": details})
        if status == "FAIL":
            results["critical_failures"] += 1
            
    secret_patterns = [
        r"ghp_[a-zA-Z0-9]{36}", 
        r"AKIA[0-9A-Z]{16}",
        r"password\s*=\s*[\"'][^\"']+[\"']",
        r"secret\s*=\s*[\"'][^\"']+[\"']"
    ]
    for ext in ["*.md", "*.html", "*.py"]:
        for file in root_dir.rglob(ext):
            content = open(file, "r", encoding="utf-8").read()
            for pattern in secret_patterns:
                if re.search(pattern, content):
                    add_safety("No secrets", "FAIL", f"SECRET-LIKE CONTENT DETECTED in {file.relative_to(root_dir)}")
    
    if not any(s["status"] == "FAIL" for s in results["safety_checks"]):
        add_safety("Secret sweep", "PASS", "No obvious secrets detected")

    # ---------------------------
    # MARKDOWN STATS
    # ---------------------------
    results["markdown_stats"] = {
        "h1_count": len([h for h in headings if h[0] == "#"]),
        "h2_count": len([h for h in headings if h[0] == "##"]),
        "h3_count": len([h for h in headings if h[0] == "###"]),
        "image_count": len(img_refs),
        "horizontal_rules": len(re.findall(r"^\s*---\s*$", readme_content, re.MULTILINE)),
    }

    return write_output(root_dir, results)

def write_output(root_dir, results):
    val_dir = root_dir / "validation"
    val_dir.mkdir(exist_ok=True)
    
    with open(val_dir / "portfolio-validation.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
        
    with open(val_dir / "portfolio-validation.md", "w", encoding="utf-8") as f:
        f.write("# Portfolio Validation Report\n\n")
        
        f.write("## README Validation\n")
        for check in results["readme_checks"]:
            f.write(f"- **{check['status']}**: {check['name']} ({check['details']})\n")
            
        f.write("\n## Asset Validation\n")
        for check in results["asset_checks"]:
            f.write(f"- **{check['status']}**: {check['name']} ({check['details']})\n")
            
        f.write("\n## Safety Checks\n")
        for check in results["safety_checks"]:
            f.write(f"- **{check['status']}**: {check['name']} ({check['details']})\n")
            
        f.write("\n## Markdown Stats\n")
        for k, v in results["markdown_stats"].items():
            f.write(f"- {k}: {v}\n")
            
    print("--- VALIDATION SUMMARY ---")
    print(f"Critical Failures: {results['critical_failures']}")
    for check in results["readme_checks"] + results["safety_checks"]:
        if check["status"] != "PASS":
            print(f"[{check['status']}] {check['name']} - {check['details']}")
            
    sys.exit(1 if results["critical_failures"] > 0 else 0)

if __name__ == "__main__":
    validate_portfolio()
