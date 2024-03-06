import axios from '@src/configs/axios'
import { FilterType } from '@src/pages/pro/linguist-team'
import { LinguistTeamListType } from '@src/types/pro/linguist-team'

export const getLinguistTeamList = async (filter: FilterType) => {
  const testData: LinguistTeamListType[] = [
    {
      id: 1,
      corporateId: 'corpId1',
      name: 'Team1',
      source: 'Source1',
      target: 'Target1',
      serviceTypeId: 1,
      client: 'Client1',
      description: 'Description1',
      pros: [{ userId: 1, firstName: 'FirstName1', lastName: 'LastName1' }],
    },
    {
      id: 2,
      corporateId: 'corpId2',
      name: 'Team2',
      source: 'Source2',
      target: 'Target2',
      serviceTypeId: 2,
      client: 'Client2',
      description: 'Description2',
      pros: [{ userId: 2, firstName: 'FirstName2', lastName: 'LastName2' }],
    },
    // 나머지 객체들...
  ]
  // const { data } = await axios.post('/api/pro/linguist-team', filter)

  const result = {
    data: testData,
    totalCount: testData.length,
    count: testData.length,
  }

  return result
}
