import axios from '@src/configs/axios'
import { FilterType } from '@src/pages/pro/linguist-team'
import { LinguistTeamListType } from '@src/types/pro/linguist-team'

const testData: LinguistTeamListType[] = Array.from({ length: 12 }, (_, i) => {
  const prosLength = Math.floor(Math.random() * 5) + 1
  const pros = Array.from({ length: prosLength }, (_, j) => ({
    userId: j + 1,
    firstName: `FirstName${j + 1}`,
    lastName: `LastName${j + 1}`,
  }))

  return {
    id: i + 1,
    corporateId: `LT-00000${i + 1}`,
    name: `Team${i + 1}`,
    source: `en`,
    target: `ko`,
    serviceTypeId: i + 1,
    client: `Client${i + 1}`,
    description: `Description${i + 1}`,
    isPrivate: Math.random() < 0.5,
    pros,
  }
})
export const getLinguistTeamList = async (filter: FilterType) => {
  // const { data } = await axios.post('/api/pro/linguist-team', filter)

  const result = {
    data: testData,
    totalCount: testData.length,
    count: testData.length,
  }

  return result
}
