import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

def start_server():
    PORT = 8000
    root_dir = Path(__file__).parent.parent
    os.chdir(root_dir)
    
    Handler = http.server.SimpleHTTPRequestHandler
    
    print(f"Starting local preview server at http://localhost:{PORT}")
    print("Serving from:", root_dir)
    print("Available previews:")
    print(f"- Visual Review: http://localhost:{PORT}/docs/visual-review.html")
    print(f"- Markdown Viewer (via browser extension if available): http://localhost:{PORT}/README.md")
    print("\nPress Ctrl+C to stop the server.")
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        webbrowser.open(f"http://localhost:{PORT}/docs/visual-review.html")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

if __name__ == "__main__":
    start_server()
