import { AbilityBuilder, Ability } from '@casl/ability'
import { PermissionObjectType } from 'src/context/types'

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
  can('read', 'home')
  if (userPermission?.length) {
    userPermission.forEach(permission => {
      if (permission?.option) {
        can(permission.can, permission.subject, { ...permission.option })
      } else {
        can(permission.can, permission.subject)
      }
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
    // detectSubjectType: object => object!.type,
  })
}

export const defaultACLObj: ACLObj = {
  action: 'read',
  subject: 'acl-page',
}

export default defineRulesFor
