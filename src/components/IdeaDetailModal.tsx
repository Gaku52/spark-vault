import type { Database } from '../lib/database.types'

type Idea = Database['public']['Tables']['ideas']['Row']
type ActionType = Database['public']['Tables']['ideas']['Row']['action_type']

interface IdeaDetailModalProps {
  idea: Idea | null
  onClose: () => void
  onEdit: (idea: Idea) => void
  onDelete: (id: string) => void
}

export function IdeaDetailModal({ idea, onClose, onEdit, onDelete }: IdeaDetailModalProps) {
  if (!idea) return null

  const getActionTypeLabel = (actionType: ActionType) => {
    const labels = {
      build_app: 'アプリ化する',
      use_existing: '既存ツールで補完',
      pending: '保留'
    }
    return labels[actionType]
  }

  const getActionTypeColor = (actionType: ActionType) => {
    const colors = {
      build_app: 'bg-purple-100 text-purple-800 border-purple-300',
      use_existing: 'bg-blue-100 text-blue-800 border-blue-300',
      pending: 'bg-gray-100 text-gray-800 border-gray-300'
    }
    return colors[actionType]
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border/50 p-6 flex justify-between items-start gap-4">
          <h2 className="text-2xl font-bold text-foreground flex-1 leading-tight">
            {idea.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-all-smooth"
            aria-label="閉じる"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Action Type & Tags */}
          <div className="flex gap-2 items-center flex-wrap">
            <span className={`text-sm px-3 py-1.5 rounded-full border font-medium ${getActionTypeColor(idea.action_type)}`}>
              {getActionTypeLabel(idea.action_type)}
            </span>
            {idea.tags.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                {idea.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-2.5 py-1 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground rounded-lg font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">内容</h3>
            <p className="text-foreground whitespace-pre-wrap leading-relaxed">
              {idea.content}
            </p>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-xs text-muted-foreground">作成日時</p>
                <p className="text-sm text-foreground">
                  {new Date(idea.created_at).toLocaleString('ja-JP', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <div>
                <p className="text-xs text-muted-foreground">更新日時</p>
                <p className="text-sm text-foreground">
                  {new Date(idea.updated_at).toLocaleString('ja-JP', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                onEdit(idea)
                onClose()
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary/30 transition-all-smooth"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              編集
            </button>
            <button
              onClick={() => {
                onDelete(idea.id)
                onClose()
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-destructive text-white rounded-xl font-medium hover:shadow-lg hover:shadow-destructive/30 transition-all-smooth"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              削除
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
