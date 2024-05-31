// ** React Imports
import { ReactNode, ComponentType } from 'react'

export type RepeaterProps = {
  count: number
  children(i: number): ReactNode
  tag?: ComponentType | keyof JSX.IntrinsicElements
  'pricing-table-id': string
  'publishable-key': string
  'client-reference-id': string
  'customer-email': string
}
