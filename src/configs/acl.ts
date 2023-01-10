import { AbilityBuilder, Ability } from '@casl/ability'
import { forEach } from 'lodash'
import { RoleType } from 'src/types/apps/userTypes'

export type Subjects_Permission = Array<string> //permission
export type Actions_Roles = Array<RoleType>

export type AppAbility = Ability<[any, any]> | undefined

export const AppAbility = Ability as any
export type ACLObj = {
  action: Subjects_Permission
  subject: Actions_Roles
}

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
const defineRulesFor = (
  role: Array<RoleType>,
  permission: Subjects_Permission,
) => {
  const { can, rules } = new AbilityBuilder(AppAbility)
  role.forEach((item: RoleType) => {
    can(permission, item)
  })
  return rules
}

export const buildAbilityFor = (
  permission: Subjects_Permission,
  role: Array<RoleType>,
): AppAbility => {
  return new AppAbility(defineRulesFor(role, permission), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object!.type,
  })
}

export const defaultACLObj: ACLObj = {
  action: ['company-read'],
  subject: ['TAD'],
}

export default defineRulesFor
