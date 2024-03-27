export function makeQuery(options: { [key: string]: any }): string {
  return (
    Object.entries(options)
      .filter(
        ([key, value]) => (value && value !== '') || typeof value === 'boolean',
      )
      .filter(([key, value]) => !(Array.isArray(value) && value.length === 0))
      .filter(([key, value]) => value[0] !== null && value[0] !== '')
      // .map(([key, value]) => {
      //   if (Array.isArray(value)) {
      //     return value.map(x => `${key}=${x}`).join('&')
      //   } else {
      //     return `${key}=${value}`
      //   }
      // })
      // .join('&')
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value
            .map((x, index) => {
              if (typeof x === 'object' && x !== null) {
                return Object.entries(x)
                  .map(
                    ([k, v]) =>
                      `${key}[${index}][${encodeURIComponent(k)}]=${encodeURIComponent(String(v))}`,
                  )
                  .join('&')
              } else {
                return `${key}=${encodeURIComponent(String(x))}`
              }
            })
            .join('&')
        } else {
          return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
        }
      })
      .join('&')
  )
}
