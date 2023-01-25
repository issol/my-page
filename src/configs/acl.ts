import { AbilityBuilder, Ability } from '@casl/ability'
import { RoleType } from 'src/types/apps/userTypes'

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

interface PerObjType {
  [key: string]: {
    subject: string
    can: string[]
    option?: any
  }
}

/* for test start */
const perObj: PerObjType = {
  RE0008: { subject: 'User', can: ['read', 'update'] },
  BU1152: { subject: 'Manager-Profile', can: ['read', 'update'] },
  BU1777: {
    subject: 'Pro-Profile',
    can: ['read', 'update'],
    option: { update: { authorOnly: true } },
  }, //profile update
}

export type Action = 'all' | 'create' | 'read' | 'update' | 'delete'
export type Subjects = Array<string>

/* for test end */

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

const defineRulesFor = (perObj: PerObjType, permission: Subjects) => {
  const { can, rules } = new AbilityBuilder(AppAbility)

  permission.forEach(per => {
    can(perObj[per].can, perObj[per].subject)
  })
  return rules
}

export const buildAbilityFor = (permission: Subjects): AppAbility => {
  return new AppAbility(defineRulesFor(perObj, permission), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object!.type,
  })
}

export const defaultACLObj: ACLObj = {
  action: 'create',
  subject: ['User'],
}

export default defineRulesFor
