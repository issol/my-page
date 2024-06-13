import { Currency } from "../common/currency.type"

export interface TimezoneType {
  code?: string
  label: string
  phone?: string
}

export type PlanListType = {
	createdAt: string
	currency: Currency
	id: number
	isActive: boolean
	name: string
	period: "Month" | "Year",
	periodDuration: number
	price: string
	stripePriceId: string
	updatedAt: string
}

export type CurrentPlanType = {
	id: number
	planName: string
	period: "Month" | "Year",
	price: number,
	currency: Currency,
	startedAt: string
	startedTimezone: TimezoneType
	expiredAt: string
	expiredTimezone: TimezoneType
	isAutoRenewalEnabled: boolean
}

export type BillingPlanHistoryType = Array<CurrentPlanType>

export type PlanPeriodType = {
	totalPeriod: number,
  usedPeriod: number,
  usedPercentage: string,
}