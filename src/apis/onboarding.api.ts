import axios from 'axios'

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
