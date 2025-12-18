/**
 * API Service - Comunicação com o backend Python via pywebview
 */

// Tipos para TypeScript
export interface Label {
  id: number
  name: string
  color: string
  created_at: string
}

export interface Content {
  id: number
  title: string
  label_id: number
  created_at: string
  label_name?: string
  label_color?: string
  reviews?: {
    next_day?: ReviewStatus
    one_week?: ReviewStatus
    one_month?: ReviewStatus
    three_months?: ReviewStatus
  }
}

export interface ReviewStatus {
  scheduled_date: string
  completed: boolean
  completed_at?: string
}

export interface Review {
  content_id: number
  title: string
  label_id: number
  label_name: string
  label_color: string
  review_id: number
  review_type: 'next_day' | 'one_week' | 'one_month' | 'three_months'
  scheduled_date: string
  completed: boolean
  completed_at?: string
  created_at: string
}

export interface Statistics {
  total_contents: number
  total_labels: number
  pending_today: number
  completed_reviews: number
  total_reviews: number
}

// Classe API para gerenciar chamadas ao backend
class PythonAPI {
  private isReady = false

  constructor() {
    // Verifica se pywebview está disponível
    if (typeof window !== 'undefined' && window.pywebview) {
      this.isReady = true
    }
  }

  private async checkReady(): Promise<void> {
    if (!this.isReady) {
      // Aguarda pywebview estar disponível (para desenvolvimento)
      return new Promise((resolve) => {
        const check = setInterval(() => {
          if (window.pywebview) {
            this.isReady = true
            clearInterval(check)
            resolve()
          }
        }, 100)

        // Timeout após 5 segundos
        setTimeout(() => {
          clearInterval(check)
          resolve()
        }, 5000)
      })
    }
  }

  private async call<T>(
    method: string,
    ...args: unknown[]
  ): Promise<T | null> {
    await this.checkReady()

    if (!this.isReady || !window.pywebview) {
      console.warn(
        `[API] pywebview não disponível. Chamada: ${method}`,
        args,
      )
      return null
    }

    try {
      // @ts-expect-error - Dynamic method call
      const result = await window.pywebview.api[method](...args)
      return result
    } catch (error) {
      console.error(`[API] Erro ao chamar ${method}:`, error)
      throw error
    }
  }

  // ==================== LABELS ====================

  async createLabel(name: string, color: string): Promise<Label | null> {
    return this.call<Label>('create_label', name, color)
  }

  async getLabels(): Promise<Label[]> {
    const result = await this.call<Label[]>('get_labels')
    return result || []
  }

  async updateLabel(
    labelId: number,
    name: string,
    color: string,
  ): Promise<{ success: boolean; error?: string } | null> {
    return this.call('update_label', labelId, name, color)
  }

  async deleteLabel(
    labelId: number,
  ): Promise<{ success: boolean; error?: string } | null> {
    return this.call('delete_label', labelId)
  }

  // ==================== CONTENTS ====================

  async createContent(title: string, labelId: number): Promise<Content | null> {
    return this.call<Content>('create_content', title, labelId)
  }

  async getContents(): Promise<Content[]> {
    const result = await this.call<Content[]>('get_contents')
    return result || []
  }

  async getContent(contentId: number): Promise<Content | null> {
    return this.call<Content>('get_content', contentId)
  }

  async updateContent(
    contentId: number,
    title: string,
    labelId: number,
  ): Promise<{ success: boolean; error?: string } | null> {
    return this.call('update_content', contentId, title, labelId)
  }

  async deleteContent(
    contentId: number,
  ): Promise<{ success: boolean; error?: string } | null> {
    return this.call('delete_content', contentId)
  }

  // ==================== REVIEWS ====================

  async getReviewsToday(): Promise<Review[]> {
    const result = await this.call<Review[]>('get_reviews_today')
    return result || []
  }

  async getReviewsByDate(date: string): Promise<Review[]> {
    const result = await this.call<Review[]>('get_reviews_by_date', date)
    return result || []
  }

  async markReviewCompleted(
    contentId: number,
    reviewType: 'next_day' | 'one_week' | 'one_month' | 'three_months',
  ): Promise<{ success: boolean; completed_at: string; error?: string } | null> {
    return this.call('mark_review_completed', contentId, reviewType)
  }

  async unmarkReviewCompleted(
    contentId: number,
    reviewType: 'next_day' | 'one_week' | 'one_month' | 'three_months',
  ): Promise<{ success: boolean; error?: string } | null> {
    return this.call('unmark_review_completed', contentId, reviewType)
  }

  // ==================== STATISTICS ====================

  async getStatistics(): Promise<Statistics | null> {
    return this.call<Statistics>('get_statistics')
  }
}

// Exporta instância única
export const api = new PythonAPI()
