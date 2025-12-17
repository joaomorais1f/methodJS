import webview
import sys
import os


def _resource_path(*parts: str) -> str:
    """Return absolute path to resource both in dev and PyInstaller.

    Retorna caminho absoluto do recurso tanto em dev quanto no PyInstaller.
    """
    # When frozen by PyInstaller, assets are under _MEIPASS
    base = getattr(sys, "_MEIPASS", None)
    if base:
        return os.path.join(base, *parts)
    # Dev: relative to repo layout (backend/ -> ../)
    here = os.path.dirname(__file__)
    repo_root = os.path.abspath(os.path.join(here, ".."))
    return os.path.join(repo_root, *parts)


class Backend:
    """API Backend para comunicação com o webview."""
    pass


if __name__ == "__main__":
    html_path = _resource_path("dist", "index.html")
    
    # Converter para file:// URL para resolver assets corretamente
    file_url = f"file:///{html_path.replace(os.sep, '/')}"
    
    window = webview.create_window(
        title="Method 24/7",
        url=file_url,
        width=1200,
        height=800,
        resizable=True,
        js_api=Backend()
    )
    
    webview.start()
