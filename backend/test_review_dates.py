"""
Teste específico para validar datas de revisão
"""
from data_manager import DataManager
from datetime import datetime, timedelta

def test_review_dates():
    """Testa se as revisões aparecem apenas nas datas exatas."""
    print("🔧 Testando datas de revisão...\n")
    
    db = DataManager()
    
    # Cria label e conteúdo
    label = db.create_label("Teste", "#FF0000")
    print(f"✓ Label criada: {label['name']}\n")
    
    content = db.create_content("Conteúdo de Teste", label['id'])
    print(f"✓ Conteúdo criado: {content['title']}")
    print(f"✓ Criado em: {content['created_at'][:10]}\n")
    
    print("📅 Datas de revisão agendadas:")
    for review_type, date in content['review_dates'].items():
        print(f"   - {review_type}: {date}")
    print()
    
    # Testa cada data
    today = datetime.now().date()
    print("🧪 Testando aparição em diferentes datas:\n")
    
    # Dia de hoje (18/12) - NÃO deve aparecer
    today_str = today.isoformat()
    reviews_today = db.get_reviews_by_date(today_str)
    print(f"📆 {today_str} (hoje):")
    print(f"   Revisões encontradas: {len(reviews_today)}")
    if len(reviews_today) == 0:
        print("   ✅ CORRETO - Não deve aparecer no dia da criação\n")
    else:
        print("   ❌ ERRO - Não deveria aparecer hoje!\n")
    
    # Dia seguinte (19/12) - DEVE aparecer (next_day)
    tomorrow = (today + timedelta(days=1)).isoformat()
    reviews_tomorrow = db.get_reviews_by_date(tomorrow)
    print(f"📆 {tomorrow} (amanhã - dia seguinte):")
    print(f"   Revisões encontradas: {len(reviews_tomorrow)}")
    if len(reviews_tomorrow) == 1:
        print(f"   ✅ CORRETO - Aparece 1 revisão (next_day)\n")
    else:
        print(f"   ❌ ERRO - Deveria aparecer exatamente 1 revisão!\n")
    
    # Dia 20/12 - NÃO deve aparecer
    day_after = (today + timedelta(days=2)).isoformat()
    reviews_after = db.get_reviews_by_date(day_after)
    print(f"📆 {day_after} (dia 20/12):")
    print(f"   Revisões encontradas: {len(reviews_after)}")
    if len(reviews_after) == 0:
        print("   ✅ CORRETO - Não deve aparecer em dia aleatório\n")
    else:
        print("   ❌ ERRO - Não deveria aparecer!\n")
    
    # 1 semana (25/12) - DEVE aparecer (one_week)
    one_week = (today + timedelta(days=7)).isoformat()
    reviews_week = db.get_reviews_by_date(one_week)
    print(f"📆 {one_week} (1 semana depois):")
    print(f"   Revisões encontradas: {len(reviews_week)}")
    if len(reviews_week) == 1:
        print(f"   ✅ CORRETO - Aparece 1 revisão (one_week)\n")
    else:
        print(f"   ❌ ERRO - Deveria aparecer exatamente 1 revisão!\n")
    
    # Dia 26/12 - NÃO deve aparecer
    day_after_week = (today + timedelta(days=8)).isoformat()
    reviews_after_week = db.get_reviews_by_date(day_after_week)
    print(f"📆 {day_after_week} (dia 26/12):")
    print(f"   Revisões encontradas: {len(reviews_after_week)}")
    if len(reviews_after_week) == 0:
        print("   ✅ CORRETO - Não deve aparecer em dia aleatório\n")
    else:
        print("   ❌ ERRO - Não deveria aparecer!\n")
    
    # 30 dias (17/01) - DEVE aparecer (one_month)
    one_month = (today + timedelta(days=30)).isoformat()
    reviews_month = db.get_reviews_by_date(one_month)
    print(f"📆 {one_month} (30 dias depois):")
    print(f"   Revisões encontradas: {len(reviews_month)}")
    if len(reviews_month) == 1:
        print(f"   ✅ CORRETO - Aparece 1 revisão (one_month)\n")
    else:
        print(f"   ❌ ERRO - Deveria aparecer exatamente 1 revisão!\n")
    
    # 90 dias (18/03) - DEVE aparecer (three_months)
    three_months = (today + timedelta(days=90)).isoformat()
    reviews_3months = db.get_reviews_by_date(three_months)
    print(f"📆 {three_months} (90 dias depois):")
    print(f"   Revisões encontradas: {len(reviews_3months)}")
    if len(reviews_3months) == 1:
        print(f"   ✅ CORRETO - Aparece 1 revisão (three_months)\n")
    else:
        print(f"   ❌ ERRO - Deveria aparecer exatamente 1 revisão!\n")
    
    print("✅ Teste concluído!")

if __name__ == "__main__":
    test_review_dates()
