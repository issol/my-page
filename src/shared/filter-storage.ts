export function saveUserFilters(key: string, filters: any) {
  if (typeof window === 'object') {
    window.localStorage.setItem(key, JSON.stringify(filters))
  }
}

export function getUserFilters(key: string) {
  if (typeof window === 'object') {
    return window.localStorage.getItem(key)
  }
}

export function removeUserFilters(key: string) {
  if (typeof window === 'object') {
    window.localStorage.removeItem(key)
  }
}
