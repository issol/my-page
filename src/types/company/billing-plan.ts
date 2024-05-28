import { Currency } from "../common/currency.type"

export interface TimezoneType {
  code?: string
  label: string
  phone?: string
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