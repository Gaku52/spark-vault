import type { ViewMode, SortField, SortOrder } from '../types/idea'

interface ViewToolbarProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  sortField: SortField
  sortOrder: SortOrder
  onSortChange: (field: SortField, order: SortOrder) => void
}

export function ViewToolbar({
  viewMode,
  onViewModeChange,
  sortField,
  sortOrder,
  onSortChange
}: ViewToolbarProps) {
  const viewModes: { mode: ViewMode; icon: JSX.Element; label: string }[] = [
    {
      mode: 'grid',
      label: 'グリッド',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    {
      mode: 'list',
      label: 'リスト',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )
    },
    {
      mode: 'compact',
      label: 'コンパクト',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      mode: 'table',
      label: 'テーブル',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    }
  ]

  const sortFields: { field: SortField; label: string }[] = [
    { field: 'created_at', label: '作成日時' },
    { field: 'updated_at', label: '更新日時' },
    { field: 'title', label: 'タイトル' },
    { field: 'action_type', label: 'アクションタイプ' }
  ]

  const toggleSortOrder = () => {
    onSortChange(sortField, sortOrder === 'asc' ? 'desc' : 'asc')
  }

  return (
    <div className="bg-card/80 backdrop-blur-sm p-4 rounded-2xl shadow-md border border-border/50 animate-slideIn">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        {/* View Mode Buttons */}
        <div className="flex gap-1 bg-muted/30 p-1 rounded-lg">
          {viewModes.map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              className={`p-2 rounded-md transition-all-smooth ${
                viewMode === mode
                  ? 'bg-primary text-white shadow-md'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
              title={label}
              aria-label={label}
            >
              {icon}
            </button>
          ))}
        </div>

        {/* Sort Controls */}
        <div className="flex gap-2 items-center">
          <select
            value={sortField}
            onChange={(e) => onSortChange(e.target.value as SortField, sortOrder)}
            className="px-3 py-2 border border-border rounded-lg bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all-smooth cursor-pointer"
          >
            {sortFields.map(({ field, label }) => (
              <option key={field} value={field}>
                {label}
              </option>
            ))}
          </select>

          <button
            onClick={toggleSortOrder}
            className="p-2 border border-border rounded-lg bg-background/50 hover:bg-muted transition-all-smooth"
            title={sortOrder === 'asc' ? '昇順' : '降順'}
            aria-label={sortOrder === 'asc' ? '昇順' : '降順'}
          >
            {sortOrder === 'asc' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
