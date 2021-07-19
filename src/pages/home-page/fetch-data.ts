import {getRequest} from '../../lib'

const serializeSlug = (slug: string) => slug.replace(/_/g, '-')

export const fetchData = async () => {
  const categories = await getRequest(process.env.NEXT_PUBLIC_API_CATEGORIES)

  const result = new Map()
  result.set('show-all', {
    slug: 'show-all', title: 'Show all', mockups: new Set(),
  })

  const flattenCategories = (categories, result: Map<string, any>) => {
    categories.forEach((category) => {
      const serializedSlug = serializeSlug(category.slug)
      if (!result.has(serializedSlug)) {
        result.set(serializedSlug, {slug: serializedSlug, title: category.title, mockups: new Set()})
      }

      if (category.children) {
        flattenCategories(category.children, result)
      }
    })
  }

  flattenCategories(categories, result)

  const mockups = await getRequest(process.env.NEXT_PUBLIC_API_MOCKUPS)

  const all = result.get('show-all')

  mockups.forEach((mockup) => {
    mockup.category.forEach((category) => {
      if (result.has(category)) {
        const c = result.get(category)
        c.mockups.add(mockup)
      }
    })
    all.mockups.add(mockup)
  })

  for (const [key, value] of result) {
    if (!value.mockups.size) {
      result.delete(key)
    }
  }

  return result
}
