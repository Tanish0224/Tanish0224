import os
import sys
import asyncio
from pathlib import Path

try:
    from playwright.async_api import async_playwright
except ImportError:
    print("BLOCKER: Playwright is not installed in the current environment.")
    print("\nTo run automated visual tests, please install it:")
    print("    pip install playwright")
    print("    playwright install chromium")
    sys.exit(1)

async def main():
    root_dir = Path(__file__).parent.parent
    screenshots_dir = root_dir / "validation" / "screenshots"
    
    viewports = {
        "desktop": {"width": 1440, "height": 900},
        "laptop": {"width": 1280, "height": 800},
        "tablet": {"width": 768, "height": 1024},
        "mobile-430": {"width": 430, "height": 932},
        "mobile-375": {"width": 375, "height": 812}
    }
    
    for vp in viewports.keys():
        (screenshots_dir / vp / "light").mkdir(parents=True, exist_ok=True)
        (screenshots_dir / vp / "dark").mkdir(parents=True, exist_ok=True)
        
    visual_review_url = f"file://{root_dir.absolute().as_posix()}/docs/visual-review.html"
    
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        
        for name, dims in viewports.items():
            print(f"Capturing {name} ({dims['width']}x{dims['height']})...")
            
            # Light mode capture
            context_light = await browser.new_context(
                viewport=dims, 
                color_scheme="light"
            )
            page_light = await context_light.new_page()
            await page_light.goto(visual_review_url)
            await page_light.wait_for_timeout(1000) # Wait for SVGs to load
            await page_light.screenshot(path=str(screenshots_dir / name / "light" / "visual-review.png"), full_page=True)
            await context_light.close()
            
            # Dark mode capture
            context_dark = await browser.new_context(
                viewport=dims, 
                color_scheme="dark"
            )
            page_dark = await context_dark.new_page()
            await page_dark.goto(visual_review_url)
            await page_dark.wait_for_timeout(1000)
            await page_dark.screenshot(path=str(screenshots_dir / name / "dark" / "visual-review.png"), full_page=True)
            await context_dark.close()
            
        await browser.close()
        
    print(f"Screenshots saved to {screenshots_dir.relative_to(root_dir)}")

if __name__ == "__main__":
    asyncio.run(main())
