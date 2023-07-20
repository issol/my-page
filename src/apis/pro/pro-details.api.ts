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

export const getMyOffDays = async (
  userId: number,
  year: number,
  month: number,
): Promise<Array<OffDayEventType>> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/pro/${userId}/work-days?year=${year}&month=${month}`,
    )
    return data
  } catch (e: any) {
    return []
  }
}

export const createMyOffDays = async (
  userId: number,
  start: string,
  end: string,
  reason?: string,
): Promise<Array<OffDayEventType>> => {
  try {
    const { data } = await axios.post(
      `/api/enough/u/pro/${userId}/unavailable-day`,
      {
        start,
        end,
        reason,
      },
    )
    return data
  } catch (e: any) {
    throw new Error(e.response.status)
  }
}

export const updateMyOffDays = async (
  offDayId: number,
  start: string,
  end: string,
  reason?: string,
): Promise<OffDayEventType> => {
  try {
    const { data } = await axios.patch(
      `/api/enough/u/pro/unavailable-day/${offDayId}`,
      {
        start,
        end,
        reason,
      },
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const updateWeekends = async (
  userId: number,
  offOnWeekends: 0 | 1,
): Promise<Array<OffDayEventType>> => {
  try {
    const { data } = await axios.put(
      `/api/enough/u/pro/${userId}/off-weekends`,
      { offOnWeekends },
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const deleteOffDays = async (
  offDayId: number,
): Promise<Array<OffDayEventType>> => {
  try {
    const { data } = await axios.delete(
      `/api/enough/u/pro/unavailable-day/${offDayId}`,
    )
    return data
  } catch (e: any) {
    throw new Error(e)
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
