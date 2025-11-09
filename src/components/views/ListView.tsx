import type { Database } from '../../lib/database.types'

type Idea = Database['public']['Tables']['ideas']['Row']

interface ListViewProps {
  ideas: Idea[]
  onIdeaClick: (idea: Idea) => void
}

export function ListView({ ideas, onIdeaClick }: ListViewProps) {
  return (
    <div className="space-y-2">
      {ideas.map((idea, index) => (
        <div
          key={idea.id}
          onClick={() => onIdeaClick(idea)}
          className="bg-card/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-border/50 hover:shadow-md hover:border-primary/50 transition-all-smooth cursor-pointer animate-fadeIn"
          style={{ animationDelay: `${index * 30}ms` }}
        >
          <div className="flex items-center gap-4 flex-wrap">
            <h3 className="font-semibold text-foreground flex-1 min-w-[200px]">
              {idea.title}
            </h3>

            {idea.tags.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {idea.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-0.5 bg-accent/20 text-accent-foreground rounded-md font-medium"
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
            )}

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {new Date(idea.created_at).toLocaleString('ja-JP', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>

            <svg className="w-5 h-5 text-muted-foreground flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  )
}
