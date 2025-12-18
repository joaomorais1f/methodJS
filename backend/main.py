import webview
import sys
import os
from data_manager import DataManager


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
    
    def __init__(self):
        """Inicializa o backend com o DataManager."""
        self.db = DataManager()
    
    # ==================== LABELS ====================
    
    def create_label(self, name: str, color: str):
        """Cria uma nova label."""
        return self.db.create_label(name, color)
    
    def get_labels(self):
        """Retorna todas as labels."""
        return self.db.get_all_labels()
    
    def update_label(self, label_id: int, name: str, color: str):
        """Atualiza uma label."""
        return self.db.update_label(label_id, name, color)
    
    def delete_label(self, label_id: int):
        """Deleta uma label."""
        return self.db.delete_label(label_id)
    
    # ==================== CONTENTS ====================
    
    def create_content(self, title: str, label_id: int):
        """Cria um novo conteúdo."""
        return self.db.create_content(title, label_id)
    
    def get_contents(self):
        """Retorna todos os conteúdos."""
        return self.db.get_all_contents()
    
    def get_content(self, content_id: int):
        """Retorna um conteúdo específico."""
        return self.db.get_content_by_id(content_id)
    
    def update_content(self, content_id: int, title: str, label_id: int):
        """Atualiza um conteúdo."""
        return self.db.update_content(content_id, title, label_id)
    
    def delete_content(self, content_id: int):
        """Deleta um conteúdo."""
        return self.db.delete_content(content_id)
    
    # ==================== REVIEWS ====================
    
    def get_reviews_today(self):
        """Retorna revisões pendentes de hoje."""
        return self.db.get_reviews_by_date()
    
    def get_reviews_by_date(self, date: str):
        """Retorna revisões de uma data específica (YYYY-MM-DD)."""
        return self.db.get_reviews_by_date(date)
    
    def mark_review_completed(self, content_id: int, review_type: str):
        """Marca uma revisão como completa.
        
        Args:
            content_id: ID do conteúdo
            review_type: 'next_day', 'one_week', 'one_month', ou 'three_months'
        """
        return self.db.mark_review_completed(content_id, review_type)
    
    # ==================== STATISTICS ====================
    
    def get_statistics(self):
        """Retorna estatísticas gerais."""
        return self.db.get_statistics()


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
