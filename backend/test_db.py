"""
Script de teste para verificar o funcionamento do SQLite
"""
from data_manager import DataManager
from datetime import datetime

def test_database():
    """Testa todas as operações do banco."""
    print("🔧 Iniciando testes do SQLite...\n")
    
    db = DataManager()
    
    # Teste 1: Criar Labels
    print("1️⃣ Testando criação de labels...")
    label1 = db.create_label("Matemática", "#FFFF00")
    label2 = db.create_label("Física", "#00FF00")
    label3 = db.create_label("Química", "#0000FF")
    print(f"   ✓ Labels criadas: {label1['name']}, {label2['name']}, {label3['name']}\n")
    
    # Teste 2: Listar Labels
    print("2️⃣ Testando listagem de labels...")
    labels = db.get_all_labels()
    print(f"   ✓ Total de labels: {len(labels)}")
    for label in labels:
        print(f"     - {label['name']} ({label['color']})")
    print()
    
    # Teste 3: Criar Conteúdos
    print("3️⃣ Testando criação de conteúdos...")
    content1 = db.create_content(
        "Equação do 2º Grau",
        label1['id']
    )
    content2 = db.create_content(
        "Leis de Newton",
        label2['id']
    )
    print(f"   ✓ Conteúdos criados: {content1['title']}, {content2['title']}")
    print(f"   ✓ Datas de revisão do conteúdo 1:")
    for review_type, date in content1['review_dates'].items():
        print(f"     - {review_type}: {date}")
    print()
    
    # Teste 4: Listar Conteúdos
    print("4️⃣ Testando listagem de conteúdos...")
    contents = db.get_all_contents()
    print(f"   ✓ Total de conteúdos: {len(contents)}")
    for content in contents:
        print(f"     - {content['title']} | Label: {content['label_name']}")
    print()
    
    # Teste 5: Buscar revisões de hoje
    print("5️⃣ Testando busca de revisões de hoje...")
    today = datetime.now().date().isoformat()
    reviews = db.get_reviews_by_date(today)
    print(f"   ✓ Revisões pendentes até hoje: {len(reviews)}")
    for review in reviews:
        print(f"     - {review['title']} ({review['review_type']}) - Data: {review['scheduled_date']}")
    print()
    
    # Teste 6: Marcar revisão como completa
    if reviews:
        print("6️⃣ Testando marcar revisão como completa...")
        first_review = reviews[0]
        result = db.mark_review_completed(first_review['id'], first_review['review_type'])
        print(f"   ✓ Revisão marcada como completa: {first_review['title']}")
        print(f"   ✓ Completada em: {result['completed_at']}\n")
    
    # Teste 7: Estatísticas
    print("7️⃣ Testando estatísticas...")
    stats = db.get_statistics()
    print(f"   ✓ Total de conteúdos: {stats['total_contents']}")
    print(f"   ✓ Total de labels: {stats['total_labels']}")
    print(f"   ✓ Revisões pendentes hoje: {stats['pending_today']}")
    print(f"   ✓ Revisões completadas: {stats['completed_reviews']}")
    print(f"   ✓ Total de revisões: {stats['total_reviews']}\n")
    
    # Teste 8: Localização do banco
    print("8️⃣ Localização do banco de dados...")
    print(f"   ✓ Pasta: {db.data_dir}")
    print(f"   ✓ Arquivo: {db.db_path}")
    print()
    
    print("✅ Todos os testes concluídos com sucesso!")
    print(f"📁 Acesse a pasta: {db.data_dir}")

if __name__ == "__main__":
    test_database()
