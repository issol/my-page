import { AbilityBuilder, Ability } from '@casl/ability'

export type Subjects = string
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete'

export type AppAbility = Ability<[Actions, Subjects]> | undefined

export const AppAbility = Ability as any
export type ACLObj = {
  action: Actions
  subject: string
}

export type PolicyType = {
  [key: string]: {
    create: boolean
    read: boolean
    write: boolean
    delete: boolean
  }
}

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
const defineRulesFor = (role: string, subject: string, policy: PolicyType) => {
  const { can, rules } = new AbilityBuilder(AppAbility)

  if (role === 'ADMIN') {
    can('manage', 'all')
  } else {
    const result = Object.entries(policy)
      .map(([key, value]) => {
        const res = Object.entries(value).map(([permission, data]) => {
          return data && `${key}-${permission}`
        })

        return res
      })
      .flat()
      .filter(value => value)

    can(result, role)
  }

  return rules
}

export const buildAbilityFor = (
  role: string,
  subject: string,
  policy: any,
): AppAbility => {
  return new AppAbility(defineRulesFor(role, subject, policy), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object!.type,
  })
}

export const defaultACLObj: ACLObj = {
  action: 'manage',
  subject: 'all',
}

export default defineRulesFor
