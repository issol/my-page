import axios from 'axios'
import { AddRoleType, CommentsOnProType } from 'src/types/onboarding/list'
import { JobList } from 'src/shared/const/personalInfo'

export const certifyRole = async (userId: number, jobInfoId: number) => {
  const data = await axios.delete('/api/pro/details/jobInfo', {
    params: { userId: userId, id: jobInfoId },
  })

  return data
}

export const testAction = async (
  userId: number,
  jobInfoId: number,
  status: string,
) => {
  try {
    const data = await axios.post('/api/pro/details/jobInfo/item', {
      data: { userId: userId, id: jobInfoId, status: status },
    })

    return data
  } catch (e) {}
}

export const getReviewer = async () => {
  const data = await axios.get('/api/pro/details/reviewer')

  return data.data
}

export const assignReviewer = async (id: number, status: string) => {
  try {
    const data = await axios.post('/api/pro/details/reviewer/action', {
      data: { id: id, status: status },
    })

    return data
  } catch (e) {}
}

export const addTest = async (userId: number, jobInfo: AddRoleType) => {
  try {
    // const res = jobInfo.jobInfo.map(value => ({
    //   ...value,
    //   jobType: JobList.filter(data => data.value === value.jobType)[0].label,
    // }))
    // console.log(res)

    const data = await axios.post('/api/pro/details/test', {
      data: { userId: userId, jobInfo: jobInfo },
    })

    return data
  } catch (e) {}
}

export const deleteComment = async (userId: number, commentId: number) => {
  const data = await axios.delete('/api/pro/details/comments', {
    params: { userId: userId, id: commentId },
  })

  return data
}

export const editComment = async (
  userId: number,
  comment: CommentsOnProType,
) => {
  const data = await axios.post('/api/pro/details/comments', {
    data: { userId: userId, comment: comment },
  })
}

export const addingComment = async (
  userId: number,
  comment: CommentsOnProType,
) => {
  const data = await axios.post('/api/pro/details/comments/add', {
    data: { userId: userId, comment: comment },
  })
}
