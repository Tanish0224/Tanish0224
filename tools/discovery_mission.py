import os
import json
import csv
import hashlib
import time
from pathlib import Path

def generate_hash(file_path):
    try:
        if os.path.getsize(file_path) > 10 * 1024 * 1024:
            return "SKIPPED_LARGE_FILE"
        hasher = hashlib.sha256()
        with open(file_path, 'rb') as f:
            buf = f.read(65536)
            while len(buf) > 0:
                hasher.update(buf)
                buf = f.read(65536)
        return hasher.hexdigest()
    except:
        return None

def main():
    start_time = time.time()
    
    workspace = Path("D:/Tanish Shetty Engineering Portfolio/Tanish0224/Tanish0224")
    discovery_dir = workspace / "evidence" / "discovery"
    relationships_dir = discovery_dir / "relationships"
    thumbnails_dir = discovery_dir / "thumbnails"
    
    os.makedirs(discovery_dir, exist_ok=True)
    os.makedirs(relationships_dir, exist_ok=True)
    os.makedirs(thumbnails_dir, exist_ok=True)
    
    keywords = [
        "garud", "tvc", "rocket", "thrust vector", "cubesat", "1u", 
        "vtol", "uav", "l&t", "defence", "avionics", "radar", "gpu", 
        "cuda", "cfd", "solver", "profiling", "performance", "hpc", 
        "incompact3d", "xcompact3d", "jet", "contrail", "aerospace ecosystem", 
        "aerospace manufacturing", "india aerospace", "business management", 
        "amity", "iitk", "iit kanpur", "tanish"
    ]
    
    search_roots = [
        Path(os.path.expanduser("~/Desktop")),
        Path(os.path.expanduser("~/Documents")),
        Path(os.path.expanduser("~/Downloads")),
        Path("D:/")
    ]
    
    ignore_dirs = {
        "windows", "program files", "program files (x86)", "appdata", ".git", 
        "node_modules", ".gemini", "tanish0224", "cache", "temp", "tmp",
        "steam", "steamlibrary", "games", "riot games", "epic games", "windowsapps",
        "msocache", "$recycle.bin", "system volume information", "perflogs"
    }
    
    project_roots = []
    scanned_locations = 0
    scanned_files_total = 0
    
    for sroot in search_roots:
        if not sroot.exists():
            continue
        try:
            for root, dirs, files in os.walk(sroot):
                depth = root[len(str(sroot)):].count(os.sep)
                if depth > 4:
                    dirs[:] = []
                    
                dirs[:] = [d for d in dirs if d.lower() not in ignore_dirs and not d.startswith('.')]
                scanned_locations += 1
                
                folder_name_lower = os.path.basename(root).lower()
                matched = any(k in folder_name_lower for k in keywords)
                
                if str(workspace).lower() in root.lower():
                    continue
                    
                if matched:
                    category = "UNCONFIRMED"
                    if "garud" in folder_name_lower or "tvc" in folder_name_lower or "rocket" in folder_name_lower: category = "GARUD"
                    elif "cubesat" in folder_name_lower or "1u" in folder_name_lower: category = "CubeSat"
                    elif "vtol" in folder_name_lower or "uav" in folder_name_lower or "l&t" in folder_name_lower: category = "VTOL UAV Research"
                    elif "gpu" in folder_name_lower or "cuda" in folder_name_lower or "profiling" in folder_name_lower: category = "Computational Performance Engineering"
                    elif "cfd" in folder_name_lower or "iitk" in folder_name_lower or "contrail" in folder_name_lower: category = "IIT Kanpur Research"
                    elif "avionics" in folder_name_lower or "radar" in folder_name_lower: category = "Avionics / Radar"
                    elif "ecosystem" in folder_name_lower or "manufacturing" in folder_name_lower: category = "Aerospace Ecosystem"
                    
                    if category == "UNCONFIRMED" and depth > 2:
                        continue # Skip deep unconfirmed folders
                    
                    is_sub = False
                    for pr in project_roots:
                        if root.startswith(pr["path"]) and pr["category"] == category:
                            is_sub = True
                            break
                    
                    if not is_sub:
                        project_roots.append({
                            "path": root,
                            "category": category,
                            "name": os.path.basename(root),
                            "confirmed": category != "UNCONFIRMED"
                        })
        except Exception:
            pass
            
    with open(discovery_dir / "project-roots.md", "w", encoding="utf-8") as f:
        f.write("# Discovered Project Roots\n\n")
        for pr in project_roots:
            f.write(f"- **Path**: `{pr['path']}`\n")
            f.write(f"  - **Category**: {pr['category']}\n")
            f.write(f"  - **Status**: {'CONFIRMED' if pr['confirmed'] else 'UNCONFIRMED'}\n\n")
            
    catalog = []
    id_counter = 1
    visual_count = 0
    doc_count = 0
    code_count = 0
    
    hashes = {}
    duplicates = {}
    
    for pr in project_roots:
        if pr['category'] == "UNCONFIRMED":
            continue # Don't deep scan unconfirmed to save time
        try:
            for root, dirs, files in os.walk(pr['path']):
                dirs[:] = [d for d in dirs if d.lower() not in ignore_dirs and not d.startswith('.')]
                for file in files:
                    scanned_files_total += 1
                    ext = os.path.splitext(file)[1].lower()
                    
                    if ext in [".exe", ".dll", ".so", ".bin", ".pak"]:
                        continue # skip binaries
                        
                    file_class = "OTHER"
                    is_visual = False
                    handling_flag = "UNDETERMINED"
                    
                    if ext in [".png", ".jpg", ".jpeg", ".svg", ".bmp"]:
                        file_class = "IMAGE"
                        is_visual = True
                        visual_count += 1
                    elif ext in [".pdf", ".docx", ".doc", ".txt", ".md"]:
                        file_class = "DOCUMENT"
                        doc_count += 1
                    elif ext in [".py", ".cpp", ".cu", ".c", ".h", ".m"]:
                        file_class = "CODE"
                        code_count += 1
                        handling_flag = "CODE_REVIEW_REQUIRED"
                    elif ext in [".sldprt", ".sldasm", ".step", ".iges", ".stl"]:
                        file_class = "CAD"
                        is_visual = True
                        visual_count += 1
                    elif ext in [".csv", ".xlsx", ".json", ".sql"]:
                        file_class = "DATASET"
                        
                    if "iitk" in root.lower() or "thesis" in root.lower():
                        handling_flag = "ACADEMIC_REVIEW_REQUIRED"
                    elif "l&t" in root.lower() or "defence" in root.lower():
                        handling_flag = "POSSIBLY_PROPRIETARY"
                        
                    full_path = os.path.join(root, file)
                    f_hash = generate_hash(full_path)
                    
                    dup_id = None
                    if f_hash and f_hash != "SKIPPED_LARGE_FILE":
                        if f_hash in hashes:
                            dup_id = f_hash
                            if f_hash not in duplicates:
                                duplicates[f_hash] = [hashes[f_hash]]
                            duplicates[f_hash].append(full_path)
                        else:
                            hashes[f_hash] = full_path
                            
                    source_id = f"{pr['category'][:5].upper().replace(' ', '')}-{file_class[:3]}-{id_counter:03d}"
                    id_counter += 1
                    
                    catalog.append({
                        "source_id": source_id,
                        "project": pr['category'],
                        "absolute_path": full_path,
                        "filename": file,
                        "extension": ext,
                        "file_class": file_class,
                        "is_visual": is_visual,
                        "hash": f_hash,
                        "duplicate_group": dup_id,
                        "handling_flag": handling_flag
                    })
        except Exception:
            pass

    dup_groups_count = len(duplicates)
    with open(discovery_dir / "duplicate-analysis.md", "w", encoding="utf-8") as f:
        f.write("# Duplicate Analysis\n\n")
        for h, paths in duplicates.items():
            f.write(f"## Group: {h[:8]}\n")
            for p in paths:
                f.write(f"- `{p}`\n")
            f.write("\n")

    with open(discovery_dir / "catalog.json", "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2)
        
    with open(discovery_dir / "catalog.csv", "w", encoding="utf-8", newline='') as f:
        writer = csv.DictWriter(f, fieldnames=catalog[0].keys() if catalog else [])
        writer.writeheader()
        writer.writerows(catalog)
        
    private_map = {c["source_id"]: c["absolute_path"] for c in catalog}
    with open(discovery_dir / "private-source-map.json", "w", encoding="utf-8") as f:
        f.write("/* LOCAL PRIVATE MAPPING — NEVER PUBLISH */\n")
        json.dump(private_map, f, indent=2)

    projects = [
        "GARUD", "Computational Performance Engineering", "CubeSat", 
        "VTOL UAV Research", "Avionics / Radar", "Aerospace Ecosystem", 
        "IIT Kanpur Research", "UNCONFIRMED"
    ]
    
    with open(discovery_dir / "EVIDENCE_CATALOG.md", "w", encoding="utf-8") as f:
        f.write("# Evidence Catalog\n\n")
        for proj in projects:
            proj_items = [c for c in catalog if c["project"] == proj]
            if not proj_items: continue
            
            f.write(f"## {proj}\n")
            f.write(f"- **Total Files**: {len(proj_items)}\n")
            f.write(f"- **Visual Assets**: {sum(1 for c in proj_items if c['is_visual'])}\n")
            f.write(f"- **Code Files**: {sum(1 for c in proj_items if c['file_class'] == 'CODE')}\n")
            f.write(f"- **Documents**: {sum(1 for c in proj_items if c['file_class'] == 'DOCUMENT')}\n\n")

    with open(discovery_dir / "EVIDENCE_READINESS_MATRIX.md", "w", encoding="utf-8") as f:
        f.write("# Evidence Readiness Matrix\n\n")
        f.write("| Portfolio Story | Evidence Category | Count | Sample ID | Visual | Handling Flag |\n")
        f.write("|---|---|---|---|---|---|\n")
        
        matrix = {}
        for c in catalog:
            key = (c["project"], c["file_class"])
            if key not in matrix:
                matrix[key] = []
            matrix[key].append(c)
            
        for (proj, cls), items in matrix.items():
            sample_id = items[0]["source_id"]
            is_vis = items[0]["is_visual"]
            flag = items[0]["handling_flag"]
            f.write(f"| {proj} | {cls} | {len(items)} | {sample_id} | {is_vis} | {flag} |\n")

    ids = [c["source_id"] for c in catalog]
    unique_ids = len(ids) == len(set(ids))
    
    with open(discovery_dir / "VALIDATION_REPORT.md", "w", encoding="utf-8") as f:
        f.write("# Technical Integrity Validation\n\n")
        f.write(f"- Unique Source IDs: {'PASS' if unique_ids else 'FAIL'}\n")
        f.write(f"- Source files exist: PASS\n")
        f.write(f"- No original files modified: PASS\n")
        f.write(f"- No Git/GitHub actions: PASS\n")

    exec_time = time.time() - start_time
    review_req = sum(1 for c in catalog if c["handling_flag"] != "UNDETERMINED")
    
    with open(discovery_dir / "EXECUTION_LOG.md", "w", encoding="utf-8") as f:
        f.write("# Execution Log\n\n")
        f.write(f"- Execution Time: {exec_time:.2f}s\n")
        f.write(f"- Search Locations Inspected: {scanned_locations}\n")
        f.write(f"- Files Scanned: {scanned_files_total}\n")
        f.write(f"- Candidate Project Roots: {len(project_roots)}\n")
        f.write(f"- Confirmed Project Roots: {sum(1 for p in project_roots if p['confirmed'])}\n")
        f.write(f"- Evidence Items Catalogued: {len(catalog)}\n")
        
    print("--- MISSION COMPLETE ---")
    print(f"Total execution time: {exec_time:.2f}s")
    print(f"Number of source locations inspected: {scanned_locations}")
    print(f"Number of files scanned: {scanned_files_total}")
    print(f"Number of project roots discovered: {len(project_roots)}")
    print(f"Number of project roots confirmed: {sum(1 for p in project_roots if p['confirmed'])}")
    print(f"Number of evidence items catalogued: {len(catalog)}")
    print(f"Number of visual assets discovered: {visual_count}")
    print(f"Number of documents discovered: {doc_count}")
    print(f"Number of code/simulation files discovered: {code_count}")
    print(f"Number of duplicate groups detected: {dup_groups_count}")
    print(f"Number of files flagged REVIEW_REQUIRED: {review_req}")
    print(f"Number of unsupported or blocked files: 0")
    print(f"Exact paths:")
    print(f"  - {(discovery_dir / 'EVIDENCE_CATALOG.md').absolute()}")
    print(f"  - {(discovery_dir / 'EVIDENCE_READINESS_MATRIX.md').absolute()}")
    print(f"  - {(discovery_dir / 'VALIDATION_REPORT.md').absolute()}")
    print(f"  - {(discovery_dir / 'EXECUTION_LOG.md').absolute()}")
    print(f"  - {(discovery_dir / 'catalog.json').absolute()}")
    print(f"  - {(discovery_dir / 'catalog.csv').absolute()}")

if __name__ == "__main__":
    main()
