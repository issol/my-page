import axios from 'src/configs/axios'
import { makeQuery } from 'src/shared/transformer/query.transformer'

export type ProProjectType = {
  id: number
  workName: string
  role: string
  client: string
  sourceLanguage: string
  targetLanguage: string
  dueDate: string
  status: string
  timezone: string
  projectName: string
  orderDate: string
  description: string
  category: string
  projectId: string
}
