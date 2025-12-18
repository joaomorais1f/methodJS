"""
Data Manager - Gerenciamento de dados com SQLite
Sistema de revisão espaçada: Dia seguinte, 1 semana, 1 mês, 3 meses
"""
import sqlite3
import os
from pathlib import Path
from datetime import datetime, timedelta
from typing import List, Dict, Optional


class DataManager:
    """Gerencia o banco de dados SQLite para conteúdos e labels."""
    
    def __init__(self):
        """Inicializa o DataManager e cria o banco se não existir."""
        # Pasta Documents/MethodJS
        self.data_dir = Path.home() / "Documents" / "MethodJS"
        self.data_dir.mkdir(parents=True, exist_ok=True)
        
        self.db_path = self.data_dir / "study_data.db"
        self._create_tables()
    
    def _get_connection(self):
        """Retorna uma conexão com o banco."""
        conn = sqlite3.connect(str(self.db_path))
        conn.row_factory = sqlite3.Row  # Permite acessar colunas por nome
        return conn
    
    def _create_tables(self):
        """Cria as tabelas se não existirem."""
        conn = self._get_connection()
        cursor = conn.cursor()
        
        # Tabela de Labels
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS labels (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                color TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        ''')
        
        # Tabela de Conteúdos
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS contents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                label_id INTEGER NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY (label_id) REFERENCES labels(id)
            )
        ''')
        
        # Tabela de Revisões
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS reviews (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content_id INTEGER NOT NULL,
                review_type TEXT NOT NULL,
                scheduled_date TEXT NOT NULL,
                completed INTEGER DEFAULT 0,
                completed_at TEXT,
                FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE
            )
        ''')
        
        # Índices para performance
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_reviews_date ON reviews(scheduled_date, completed)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_reviews_content ON reviews(content_id)')
        
        conn.commit()
        conn.close()
    
    # ==================== LABELS ====================
    
    def create_label(self, name: str, color: str) -> Dict:
        """Cria uma nova label."""
        conn = self._get_connection()
        cursor = conn.cursor() 
        
        created_at = datetime.now().isoformat()
        
        try:
            cursor.execute(
                'INSERT INTO labels (name, color, created_at) VALUES (?, ?, ?)',
                (name, color, created_at)
            )
            conn.commit()
            label_id = cursor.lastrowid
            
            return {
                'id': label_id,
                'name': name,
                'color': color,
                'created_at': created_at
            }
        except sqlite3.IntegrityError:
            return {'error': 'Label já existe'}
        finally:
            conn.close()
    
    def get_all_labels(self) -> List[Dict]:
        """Retorna todas as labels."""
        conn = self._get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM labels ORDER BY name')
        labels = [dict(row) for row in cursor.fetchall()]
        
        conn.close()
        return labels
    
    def update_label(self, label_id: int, name: str, color: str) -> Dict:
        """Atualiza uma label."""
        conn = self._get_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            'UPDATE labels SET name = ?, color = ? WHERE id = ?',
            (name, color, label_id)
        )
        conn.commit()
        
        if cursor.rowcount == 0:
            conn.close()
            return {'error': 'Label não encontrada'}
        
        conn.close()
        return {'success': True}
    
    def delete_label(self, label_id: int) -> Dict:
        """Deleta uma label (apenas se não tiver conteúdos)."""
        conn = self._get_connection()
        cursor = conn.cursor()
        
        # Verifica se há conteúdos com essa label
        cursor.execute('SELECT COUNT(*) as count FROM contents WHERE label_id = ?', (label_id,))
        count = cursor.fetchone()['count']
        
        if count > 0:
            conn.close()
            return {'error': f'Não é possível deletar. Existem {count} conteúdo(s) com esta label.'}
        
        cursor.execute('DELETE FROM labels WHERE id = ?', (label_id,))
        conn.commit()
        conn.close()
        
        return {'success': True}
    
    # ==================== CONTENTS ====================
    
    def _calculate_review_dates(self, created_at: datetime) -> Dict[str, str]:
        """Calcula as datas de revisão baseado na data de criação."""
        return {
            'next_day': (created_at + timedelta(days=1)).date().isoformat(),
            'one_week': (created_at + timedelta(weeks=1)).date().isoformat(),
            'one_month': (created_at + timedelta(days=30)).date().isoformat(),
            'three_months': (created_at + timedelta(days=90)).date().isoformat()
        }
    
    def create_content(self, title: str, label_id: int) -> Dict:
        """Cria um novo conteúdo e agenda as revisões."""
        conn = self._get_connection()
        cursor = conn.cursor()
        
        created_at = datetime.now()
        created_at_str = created_at.isoformat()
        
        try:
            # Insere o conteúdo
            cursor.execute(
                'INSERT INTO contents (title, label_id, created_at) VALUES (?, ?, ?)',
                (title, label_id, created_at_str)
            )
            content_id = cursor.lastrowid
            
            # Calcula e agenda as revisões
            review_dates = self._calculate_review_dates(created_at)
            
            for review_type, scheduled_date in review_dates.items():
                cursor.execute(
                    'INSERT INTO reviews (content_id, review_type, scheduled_date) VALUES (?, ?, ?)',
                    (content_id, review_type, scheduled_date)
                )
            
            conn.commit()
            
            return {
                'id': content_id,
                'title': title,
                'label_id': label_id,
                'created_at': created_at_str,
                'review_dates': review_dates
            }
        finally:
            conn.close()
    
    def get_all_contents(self) -> List[Dict]:
        """Retorna todos os conteúdos com suas labels e status de revisão."""
        conn = self._get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT 
                c.id, c.title, c.created_at,
                l.id as label_id, l.name as label_name, l.color as label_color
            FROM contents c
            JOIN labels l ON c.label_id = l.id
            ORDER BY c.created_at DESC
        ''')
        
        contents = []
        for row in cursor.fetchall():
            content = dict(row)
            
            # Busca as revisões do conteúdo
            cursor.execute('''
                SELECT review_type, scheduled_date, completed, completed_at
                FROM reviews
                WHERE content_id = ?
                ORDER BY scheduled_date
            ''', (content['id'],))
            
            reviews = {}
            for review_row in cursor.fetchall():
                review = dict(review_row)
                reviews[review['review_type']] = {
                    'scheduled_date': review['scheduled_date'],
                    'completed': bool(review['completed']),
                    'completed_at': review['completed_at']
                }
            
            content['reviews'] = reviews
            contents.append(content)
        
        conn.close()
        return contents
    
    def get_content_by_id(self, content_id: int) -> Optional[Dict]:
        """Retorna um conteúdo específico."""
        conn = self._get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT 
                c.id, c.title, c.created_at,
                l.id as label_id, l.name as label_name, l.color as label_color
            FROM contents c
            JOIN labels l ON c.label_id = l.id
            WHERE c.id = ?
        ''', (content_id,))
        
        row = cursor.fetchone()
        if not row:
            conn.close()
            return None
        
        content = dict(row)
        
        # Busca as revisões
        cursor.execute('''
            SELECT review_type, scheduled_date, completed, completed_at
            FROM reviews
            WHERE content_id = ?
        ''', (content_id,))
        
        reviews = {}
        for review_row in cursor.fetchall():
            review = dict(review_row)
            reviews[review['review_type']] = {
                'scheduled_date': review['scheduled_date'],
                'completed': bool(review['completed']),
                'completed_at': review['completed_at']
            }
        
        content['reviews'] = reviews
        conn.close()
        return content
    
    def update_content(self, content_id: int, title: str, label_id: int) -> Dict:
        """Atualiza um conteúdo (não altera as datas de revisão)."""
        conn = self._get_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            'UPDATE contents SET title = ?, label_id = ? WHERE id = ?',
            (title, label_id, content_id)
        )
        conn.commit()
        
        if cursor.rowcount == 0:
            conn.close()
            return {'error': 'Conteúdo não encontrado'}
        
        conn.close()
        return {'success': True}
    
    def delete_content(self, content_id: int) -> Dict:
        """Deleta um conteúdo e suas revisões."""
        conn = self._get_connection()
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM contents WHERE id = ?', (content_id,))
        conn.commit()
        
        if cursor.rowcount == 0:
            conn.close()
            return {'error': 'Conteúdo não encontrado'}
        
        conn.close()
        return {'success': True}
    
    # ==================== REVIEWS ====================
    
    def get_reviews_by_date(self, date: str = None) -> List[Dict]:
        """Retorna todos os conteúdos que devem ser revisados em uma data específica.
        
        Args:
            date: Data no formato ISO (YYYY-MM-DD). Se None, usa a data de hoje.
        """
        if date is None:
            date = datetime.now().date().isoformat()
        
        conn = self._get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT 
                c.id, c.title, c.created_at,
                l.id as label_id, l.name as label_name, l.color as label_color,
                r.id as review_id, r.review_type, r.scheduled_date, 
                r.completed, r.completed_at
            FROM reviews r
            JOIN contents c ON r.content_id = c.id
            JOIN labels l ON c.label_id = l.id
            WHERE r.scheduled_date <= ? AND r.completed = 0
            ORDER BY r.scheduled_date, c.title
        ''', (date,))
        
        reviews = []
        for row in cursor.fetchall():
            reviews.append(dict(row))
        
        conn.close()
        return reviews
    
    def mark_review_completed(self, content_id: int, review_type: str) -> Dict:
        """Marca uma revisão específica como completa."""
        conn = self._get_connection()
        cursor = conn.cursor()
        
        completed_at = datetime.now().isoformat()
        
        cursor.execute('''
            UPDATE reviews 
            SET completed = 1, completed_at = ?
            WHERE content_id = ? AND review_type = ?
        ''', (completed_at, content_id, review_type))
        
        conn.commit()
        
        if cursor.rowcount == 0:
            conn.close()
            return {'error': 'Revisão não encontrada'}
        
        conn.close()
        return {'success': True, 'completed_at': completed_at}
    
    def get_statistics(self) -> Dict:
        """Retorna estatísticas gerais do sistema."""
        conn = self._get_connection()
        cursor = conn.cursor()
        
        # Total de conteúdos
        cursor.execute('SELECT COUNT(*) as count FROM contents')
        total_contents = cursor.fetchone()['count']
        
        # Total de labels
        cursor.execute('SELECT COUNT(*) as count FROM labels')
        total_labels = cursor.fetchone()['count']
        
        # Revisões pendentes hoje
        today = datetime.now().date().isoformat()
        cursor.execute('''
            SELECT COUNT(*) as count FROM reviews 
            WHERE scheduled_date <= ? AND completed = 0
        ''', (today,))
        pending_today = cursor.fetchone()['count']
        
        # Revisões completadas
        cursor.execute('SELECT COUNT(*) as count FROM reviews WHERE completed = 1')
        completed_reviews = cursor.fetchone()['count']
        
        # Total de revisões
        cursor.execute('SELECT COUNT(*) as count FROM reviews')
        total_reviews = cursor.fetchone()['count']
        
        conn.close()
        
        return {
            'total_contents': total_contents,
            'total_labels': total_labels,
            'pending_today': pending_today,
            'completed_reviews': completed_reviews,
            'total_reviews': total_reviews
        }
