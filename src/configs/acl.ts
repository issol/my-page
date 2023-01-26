import { AbilityBuilder, Ability } from '@casl/ability'
import { PermissionObjectType } from 'src/context/types'

/* TODO :
서버에서 받는 값
  - user permission에 대한 값
  - permission에 대한 정보 object (Array<{name:"RE008", description:"Refresh 엑세스 토큰", accessPoint:'/api/..', method:'GET'}>)


1. defineRulesFor
  - user permission을 받아 조건문으로 각 permission 당 어떤 것을 허용해줄 지 정의해야 함
  - ex: RE008은 user READ, UPDATE가 가능
    if(permission.includes(RE008)) {
      can(['read','update'], user)
    }
  - 만약 서버에서 permission 오브젝트를 아래와 같이 준다면
    {
      RE008: {description :"User", can:["read","update"]}
    }

    permission.forEach((per)=> {
      can(perObj[per].can, perObj[per].description)
    })
    으로 가능.
  
*/

export type Action = 'all' | 'create' | 'read' | 'update' | 'delete'
export type Subjects = string

export type AppAbility = Ability<[string, Subjects]> | undefined
export const AppAbility = Ability as any

export type ACLObj = {
  action: Action
  subject: Subjects
}

export type PolicyType = {
  [key: string]: {
    create: boolean
    read: boolean
    write: boolean
    delete: boolean
  }
}

const defineRulesFor = (userPermission: PermissionObjectType) => {
  const { can, rules } = new AbilityBuilder(AppAbility)
  if (userPermission.length) {
    userPermission.forEach(permission => {
      can(permission.can, permission.subject)
    })
  }
  return rules
}

export const buildAbilityFor = (
  userPermission: PermissionObjectType,
): AppAbility => {
  return new AppAbility(defineRulesFor(userPermission), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object!.type,
  })
}

export const defaultACLObj: ACLObj = {
  action: 'read',
  subject: '',
}

export default defineRulesFor
