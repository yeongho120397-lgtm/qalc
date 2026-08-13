import { useLocale } from '../i18n/LocaleContext'
import type { CategoryId } from '../types'
import './CategoryTabs.css'

type CategoryTabsProps = {
  categories: { id: CategoryId }[]
  activeId: CategoryId
  onChange: (id: CategoryId) => void
}

export function CategoryTabs({
  categories,
  activeId,
  onChange,
}: CategoryTabsProps) {
  const { t } = useLocale()

  return (
    <nav className="category-tabs" aria-label={t.categoryNav}>
      {categories.map((category) => {
        const isActive = category.id === activeId
        return (
          <button
            key={category.id}
            type="button"
            className={
              isActive
                ? 'category-tabs__btn category-tabs__btn--active'
                : 'category-tabs__btn'
            }
            aria-pressed={isActive}
            onClick={() => onChange(category.id)}
          >
            {t[category.id]}
          </button>
        )
      })}
    </nav>
  )
}
