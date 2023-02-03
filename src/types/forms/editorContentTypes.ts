export type ContentType = {
  blocks: Array<{
    key: string
    text: string
    type: string
    depth: number
    inlineStyleRanges: Array<{
      offset?: number
      length?: number
      style?: string
    }>
    entityRanges: Array<any>
    data: any
  }>
  eontityMap: any
}
