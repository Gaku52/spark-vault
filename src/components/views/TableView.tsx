import type { Database } from '../../lib/database.types'

type Idea = Database['public']['Tables']['ideas']['Row']

interface TableViewProps {
  ideas: Idea[]
  onIdeaClick: (idea: Idea) => void
  onEdit: (idea: Idea) => void
  onDelete: (id: string) => void
}

export function TableView({ ideas, onIdeaClick, onEdit, onDelete }: TableViewProps) {
  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-md border border-border/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                タイトル
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                タグ
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                作成日時
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {ideas.map((idea, index) => (
              <tr
                key={idea.id}
                className="hover:bg-muted/30 transition-colors animate-fadeIn cursor-pointer"
                style={{ animationDelay: `${index * 20}ms` }}
                onClick={() => onIdeaClick(idea)}
              >
                <td className="px-4 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">
                      {idea.title}
                    </p>
                    <p className="text-sm text-muted-foreground truncate max-w-md">
                      {idea.content}
                    </p>
                  </div>
                </td>

                <td className="px-4 py-4 hidden lg:table-cell">
                  <div className="flex gap-1 flex-wrap max-w-xs">
                    {idea.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-0.5 bg-accent/20 text-accent-foreground rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                    {idea.tags.length > 3 && (
                      <span className="text-xs px-2 py-0.5 text-muted-foreground">
                        +{idea.tags.length - 3}
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-4 py-4 hidden sm:table-cell">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(idea.created_at).toLocaleString('ja-JP', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <div className="flex gap-1 justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit(idea)
                      }}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all-smooth"
                      aria-label="編集"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(idea.id)
                      }}
                      className="p-1.5 text-destructive hover:bg-red-50 rounded-lg transition-all-smooth"
                      aria-label="削除"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
