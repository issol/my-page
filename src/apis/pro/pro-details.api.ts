import axios from '@src/configs/axios'
import { OffDayEventType } from '@src/types/common/calendar.type'
import { DetailUserType } from '@src/types/common/detail-user.type'
import { OnboardingProDetailsType } from '@src/types/onboarding/details'

export const getProOverview = async (
  userId: number,
): Promise<DetailUserType> => {
  const { data } = await axios.get<DetailUserType>(
    `/api/enough/u/pro/${userId}/overview`,
  )

  return data
}

export const getProWorkDays = async (userId: number, year: number) => {
  const { data } = await axios.get(
    `/api/enough/u/pro/${userId}/work-days?year=${year}`,
  )

  return data
}

export const changeProStatus = async (userId: number, status: string) => {
  await axios.patch(`/api/enough/u/pro/${userId}/status`, { status: status })
}

//pro가 my page에서 보는 데이터
/* TODO: endpoint 수정하기 */
export const getMyOverview = async (
  userId: number,
): Promise<DetailUserType> => {
  const { data } = await axios.get<DetailUserType>(
    `/api/enough/u/pro/${userId}/overview`,
  )

  return data
}
/* TODO: endpoint 수정하기 */
export const getMyOffDays = async (
  userId: number,
  year: number,
  month: number,
): Promise<Array<OffDayEventType>> => {
  try {
    // const { data } = await axios.get(
    //   `/api/enough/u/pro/${userId}/work-days?year=${year}`,
    // )
    // return data
    return [
      {
        id: 74,
        reason: '내맴',
        start: '2023-07-24',
        end: '2023-07-28',
      },
      {
        //   id: 2,
        reason: '일하기 싫어서',
        start: '2023-07-04',
        end: '2023-07-07',
      },
      {
        id: 75,
        reason: '일하기 싫어서',
        start: '2023-08-01',
        end: '2023-08-03',
      },
      {
        id: 76,
        reason: '일하기 싫어서',
        start: '2023-06-01',
        end: '2023-06-03',
      },
    ]
  } catch (e: any) {
    return []
  }
}

/* TODO: endpoint 변경 */
export const deleteResume = async (
  userId: number,
  fileId: number,
): Promise<void> => {
  try {
    await axios.delete(`/api/enough/u/pro/${userId}/work-days?year=${fileId}`)
  } catch (e: any) {
    throw new Error(e)
  }
}
