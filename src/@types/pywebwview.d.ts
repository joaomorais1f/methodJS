export {}

declare global {
  interface Window {
    pywebview: {
      api: {
        create_label(name: string, color: string): Promise<any>;
        get_labels(): Promise<any[]>;
        update_label(label_id: number, name: string, color: string): Promise<any>;
        delete_label(label_id: number): Promise<void>;
        create_content(title: string, label_id: number): Promise<any>;
        update_content(content_id: number, title: string, label_id: number): Promise<any>;
        get_contents(): Promise<any[]>;
        get_content_by_id(content_id: number): Promise<any>;
        delete_content(content_id: number): Promise<void>;
        create_review(content_id: number, review_type: string, scheduled_date: string): Promise<any>;
        get_reviews(): Promise<any[]>;
        update_review(review_id: number, review_type: string, scheduled_date: string, completed: boolean): Promise<any>;
        delete_review(review_id: number): Promise<void>;
      }
    }
  }
}