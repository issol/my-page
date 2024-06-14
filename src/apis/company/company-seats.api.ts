import axios from '@src/configs/axios'
import { SeatListType } from '@src/types/company/seats'

export const getSeats = async (): Promise<SeatListType> => {
  const { data } = await axios.get(`/api/enough/u/seat`)

  return data
}

export const assignSeat = async (userId: number) => {
  const { data } = await axios.post(`/api/enough/u/seat?userId=${userId}`)
  return data
}

export const deleteSeat = async (userId: number) => {
  const { data } = await axios.delete(`/api/enough/u/seat?userId=${userId}`)

  return data
}