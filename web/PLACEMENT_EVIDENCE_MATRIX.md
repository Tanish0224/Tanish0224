# Placement Evidence Traceability Matrix

**Audit Date:** 2026-08-24
**Master Resume Source:** OCR/PDF provided in execution context.

## 1. Project & Experience Traceability

| Resume Section | Exact Claim / Bullet | Portfolio Location | Supporting Evidence | Evidence Strength | GitHub / Repository | Status | Required Action |
|---|---|---|---|---|---|---|---|
| M.Tech Thesis | "Established the temporal turbulent-jet baseline in Incompact3D using LES... Extended the temporal-jet study toward jet-vortex interaction" | DNS / LES of Turbulent Jets | `CONTEXT.md` mentions ongoing thesis. No direct code or plots found in repo. | WEAK | None | IN PROGRESS | Remove misattributed `vorticity_Re75.png`. Retain `[IN PROGRESS]` label. |
| B.Tech Major Project | "Design, Analysis, Fabrication and Testing of Thrust Vector Control Model Rocket... Fusion 360, SOLIDWORKS, MATLAB/Simulink, RockSim" | GARUD TVC Model Rocket | `garud-tvc-rocket/README.md` | MODERATE | None | VERIFIED | No changes needed. (CAD files missing locally) |
| Course Project | "GPU-Accelerated Finite Volume Method Solver... CuPy and CUDA C... RTX 6000 Pro... 2D Sod shock-tube validation" | GPU-Accelerated FVM Solver | `gpu-accelerated-cfd/docs/Final_Report_HPC_Compressible_Solvers.pdf`, `validation/` plots | STRONG | None | VERIFIED | Link PDF and validation plots in portfolio. Correct RTX 6000 Ada to match README. |
| Course Project | "2D Flow Past a Confined Square Cylinder... Fortran based MAC finite difference CFD solver... Re = 20, 30 and 75" | Not currently listed | `confined-square-cylinder-cfd/figures/*.png` | STRONG | None | MISSING PORTFOLIO EVIDENCE | The figure `vorticity_Re75.png` was wrongly placed in the M.Tech thesis section. Remove from thesis. |
| Internship (L&T) | "Built a VTOL UAV performance database... Exceeded the 100 aircraft target by researching 200+ VTOL UAVs, screening... 195 usable records" | VTOL UAV Database Architecture | `vtol-uav-performance-analysis/docs/vtol_performance_analysis_report.pdf` | STRONG | None | VERIFIED | Link report PDF. Adjust copy to mention 195 records if not present. |
| Internship (STAR) | "Led a six-member team in designing and developing a 1U CubeSat structure, meeting the 250 g mass constraint... Reduced final structural mass to approximately 194 g" | 1U CubeSat Structural Design | `1u-cubesat-structure/README.md` | MODERATE | None | PARTIALLY VERIFIED | Add specific metrics (250g constraint, 194g final) to the portfolio card to strengthen the engineering claim. |

## 2. Technical Skills Evidence Map

| Skill | Resume | Evidence | Project | Evidence Strength | Portfolio Action |
|---|---|---|---|---|---|
| Incompact3D / LES | Yes | Context | M.Tech Thesis | WEAK | Retain text, do not exaggerate. |
| Fusion 360 / SolidWorks | Yes | Context/README | GARUD / CubeSat | MODERATE | Retain tags. |
| CUDA C / CuPy | Yes | Source/Report | GPU-Accelerated FVM | STRONG | Ensure tags present. |
| Python / SQL | Yes | Report | VTOL UAV Database | STRONG | Ensure tags present. |
| Fortran | Yes | Plots | Confined Square Cylinder | STRONG | Mention in skills if added. |

## 3. Link & Identity Traceability

| Identity Target | Resume Handle | Verified Source | Portfolio Status |
|---|---|---|---|
| LinkedIn | `tanish-shetty02` | Resume OCR | Previously disabled. Will activate. |
| GitHub | `Tanish0224` | Resume OCR / `.git/config` | Previously disabled. Will activate. |
| Email | `tanishs25@iitk.ac.in` | Resume OCR | Will add `mailto:` to Connect button. |
| Resume PDF | N/A | Missing from filesystem | Remains disabled/placeholder. |
