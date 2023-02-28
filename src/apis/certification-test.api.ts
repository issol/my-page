import axios from 'src/configs/axios'
import { TestMaterialFilterPayloadType } from 'src/types/certification-test/list'
import { makeQuery } from 'src/shared/transformer/query.transformer'

export const getTestMaterialList = async (
  filters: TestMaterialFilterPayloadType,
) => {
  const data = await axios.get(
    `/api/enough/cert/test/paper?${makeQuery(filters)}`,
  )

  return data.data
}
