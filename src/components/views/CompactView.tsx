import type { Database } from '../../lib/database.types'

type Idea = Database['public']['Tables']['ideas']['Row']

interface CompactViewProps {
  ideas: Idea[]
  onIdeaClick: (idea: Idea) => void
}

export function CompactView({ ideas, onIdeaClick }: CompactViewProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {ideas.map((idea, index) => (
        <div
          key={idea.id}
          onClick={() => onIdeaClick(idea)}
          className="bg-card/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-border/50 hover:shadow-md hover:border-primary/50 transition-all-smooth cursor-pointer space-y-2 animate-fadeIn"
          style={{ animationDelay: `${index * 20}ms` }}
        >
          <h3 className="font-semibold text-sm text-foreground leading-tight line-clamp-2">
            {idea.title}
          </h3>

          {idea.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {idea.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-0.5 bg-accent/20 text-accent-foreground rounded-md"
                >
                  #{tag}
                </span>
              ))}
              {idea.tags.length > 2 && (
                <span className="text-xs px-2 py-0.5 text-muted-foreground">
                  +{idea.tags.length - 2}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <span className="text-xs text-muted-foreground">
              {new Date(idea.created_at).toLocaleDateString('ja-JP', {
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
