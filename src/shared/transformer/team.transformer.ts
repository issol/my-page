import { ProjectTeamFormType } from '@src/types/common/orders-and-quotes.type'
import { ProjectTeamType } from '@src/types/schema/project-team.schema'

export function transformTeamData(data: ProjectTeamType) {
  let result: ProjectTeamFormType = {
    projectManagerId: 0,
    supervisorId: undefined,
    member: [],
  }

  data.teams.forEach(item => {
    if (item.type === 'supervisorId') {
      !item.id
        ? delete result.supervisorId
        : (result.supervisorId = Number(item.id))
    } else if (item.type === 'projectManagerId') {
      result.projectManagerId = Number(item.id)!
    } else if (item.type === 'member') {
      if (!item.id) {
        result.member = []
      } else {
        result?.member?.push(item.id!)
      }
    }
  })
  if (!result.member || !result?.member?.length) delete result.member
  return result
}
