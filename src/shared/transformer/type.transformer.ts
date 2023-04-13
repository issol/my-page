import * as Type from '@glocalize-inc/glodex'

export const getTypeList = (
  type: string,
): Array<{ label: string; value: string }> => {
  // @ts-ignore
  const typeKeeper: any = Type[type] ? Type : undefined
  if (!typeKeeper) return []

  return typeKeeper[type]
    .toJSON()
    .map((type: { key: string; localizedValue: string }) => ({
      value: type.localizedValue,
      label: type.localizedValue,
    }))
    .sort(
      (
        a: { value: string; label: string },
        b: { value: string; label: string },
      ) => {
        if (a.value < b.value) {
          return -1
        }
        if (a.value > b.value) {
          return 1
        }
        return 0
      },
    )
}
