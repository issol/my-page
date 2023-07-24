export const hasObjValues = (obj?: any): boolean => {
  if (obj) {
    const values = Object.values(obj)
    return values.length > 0
  }
  return false
}

export const getStaleDuration = (dataUpdatedAt: number): number => {
  return Date.now() - dataUpdatedAt
}
