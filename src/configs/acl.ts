import { AbilityBuilder, Ability } from '@casl/ability'
import { forEach } from 'lodash'
import { RoleType } from 'src/types/apps/userTypes'

export type Subjects = Array<string> //permission
export type Actions = Array<RoleType>

export type AppAbility = Ability<[string, Subjects]> | undefined

export const AppAbility = Ability as any
export type ACLObj = {
  action: Subjects
  subject: Actions
}

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
const defineRulesFor = (role: Array<RoleType>, permission: Array<string>) => {
  const { can, rules } = new AbilityBuilder(AppAbility)

  const result = Object.entries(permission)
    .map(([key, value]) => {
      const res = Object.entries(value).map(([permission, data]) => {
        return data && `${key}-${permission}`
      })

      return res
    })
    .flat()
    .filter(value => value)

  role.forEach((item: RoleType) => {
    can(result, item)
  })

  return rules
}

export const buildAbilityFor = (
  role: Array<RoleType>,
  // subject: string[],
  permission: string[],
): AppAbility => {
  return new AppAbility(defineRulesFor(role, permission), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object!.type,
  })
}

export const defaultACLObj: ACLObj = {
  action: [''],
  subject: ['PRO'],
}

export default defineRulesFor
