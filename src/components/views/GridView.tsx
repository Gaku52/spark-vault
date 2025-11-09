import type { Database } from '../../lib/database.types'

type Idea = Database['public']['Tables']['ideas']['Row']

interface GridViewProps {
  ideas: Idea[]
  onEdit: (idea: Idea) => void
  onDelete: (id: string) => void
}

export function GridView({ ideas, onEdit, onDelete }: GridViewProps) {
  return (
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
      {ideas.map((idea, index) => (
        <div
          key={idea.id}
          className="bg-card/80 backdrop-blur-sm p-5 sm:p-6 rounded-2xl shadow-md border border-border/50 space-y-4 card-hover animate-fadeIn"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="space-y-3">
            <div className="flex justify-between items-start gap-4">
              <h3 className="font-bold text-lg sm:text-xl text-foreground flex-1 leading-tight">
                {idea.title}
              </h3>
              <div className="flex gap-1.5 flex-shrink-0">
                <button
                  onClick={() => onEdit(idea)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all-smooth hover:scale-110"
                  aria-label="編集"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(idea.id)}
                  className="p-2 text-destructive hover:bg-red-50 rounded-lg transition-all-smooth hover:scale-110"
                  aria-label="削除"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <p className="text-foreground/80 whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
              {idea.content}
            </p>

            {idea.tags.length > 0 && (
              <div className="flex gap-1.5 flex-wrap pt-2">
                {idea.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-2.5 py-1 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground rounded-lg font-medium transition-all-smooth hover:scale-105 hover:shadow-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 pt-2 border-t border-border/50">
              <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-muted-foreground">
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
        </div>
      ))}
    </div>
  )
}
