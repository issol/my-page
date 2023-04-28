import axios from '@src/configs/axios'
import {
  ClientType,
  ProjectInfoType,
  ProjectTeamType,
} from '@src/types/orders/order-detail'

export const getProjectInfo = async (id: number): Promise<ProjectInfoType> => {
  const { data } = await axios.get(`/api/enough/u/order/${id}/project`)

  return data
}

export const getProjectTeam = async (
  id: number,
): Promise<ProjectTeamType[]> => {
  const { data } = await axios.get(`/api/enough/u/order/${id}/team`)

  return data
}

export const getClient = async (id: number): Promise<ClientType> => {
  const { data } = await axios.get(`/api/enough/u/order/${id}/client`)

  return data
}
