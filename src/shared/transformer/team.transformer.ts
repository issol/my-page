import { ProjectTeamFormType } from '@src/types/common/orders-and-quotes.type'
import { ProjectTeamType } from '@src/types/schema/project-team.schema'

export function transformTeamData(data: ProjectTeamType) {
  let result: ProjectTeamFormType = {
    projectManagerId: 0,
    supervisorId: undefined,
    members: [],
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
        result.members = []
      } else {
        result?.members?.push(Number(item.id))
      }
    }
  })
  if (!result.members || !result?.members?.length) delete result.members
  return result
}
