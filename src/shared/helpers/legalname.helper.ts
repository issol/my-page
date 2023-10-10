type RowType = {
  firstName?: string
  middleName?: string | null
  lastName?: string
}
export const getLegalName = (row: RowType) => {
  return !row || !row.firstName || !row.lastName
    ? '-'
    : row.firstName +
        (row.middleName ? ' (' + row.middleName + ')' : '') +
        ` ${row.lastName}`
}
