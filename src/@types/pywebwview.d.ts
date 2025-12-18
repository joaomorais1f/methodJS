export {}

declare global {
  interface Window {
    pywebview?: {
      api: {
        // Labels
        create_label(name: string, color: string): Promise<any>
        get_labels(): Promise<any[]>
        update_label(label_id: number, name: string, color: string): Promise<any>
        delete_label(label_id: number): Promise<any>
        
        // Contents
        create_content(title: string, label_id: number): Promise<any>
        get_contents(): Promise<any[]>
        get_content(content_id: number): Promise<any>
        update_content(content_id: number, title: string, label_id: number): Promise<any>
        delete_content(content_id: number): Promise<any>
        
        // Reviews
        get_reviews_today(): Promise<any[]>
        get_reviews_by_date(date: string): Promise<any[]>
        mark_review_completed(content_id: number, review_type: string): Promise<any>
        unmark_review_completed(content_id: number, review_type: string): Promise<any>
        
        // Statistics
        get_statistics(): Promise<any>
      }
    }
  }
}