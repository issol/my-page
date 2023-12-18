import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { DashboardForm, getRangeDateTitle } from '@src/pages/dashboards/lpm'
import useInfoDialog from '@src/hooks/useInfoDialog'
import dayjs from 'dayjs'

export const DEFAULT_START_DATE = dayjs().set('date', 1).toDate()
export const DEFAULT_LAST_DATE = dayjs()
  .set('date', dayjs().daysInMonth())
  .toDate()

const UseDashboardControl = () => {
  const headerRef = useRef<HTMLElement>(null)
  const formHook = useForm<DashboardForm>({
    defaultValues: {
      dateRange: [DEFAULT_START_DATE, DEFAULT_LAST_DATE],
      userViewDate: getRangeDateTitle(DEFAULT_START_DATE, DEFAULT_LAST_DATE),
      selectedRangeDate: 'month',
      viewSwitch: true,
    },
  })
  const [isShowInfoDialog, key, setOpenInfoDialog, close] = useInfoDialog()
  const [memberView, setMemberView] = useState(false)

  const hiddenMemberView = () => {
    setMemberView(false)
  }

  const showMemberView = () => {
    setMemberView(true)
  }

  return {
    formHook,
    header: {
      headerRef,
    },
    infoDialog: {
      isShowInfoDialog,
      infoDialogKey: key,
      setOpenInfoDialog,
      close,
    },
    memberView: {
      isShowMemberView: memberView,
      hiddenMemberView,
      showMemberView,
    },
  }
}

export default UseDashboardControl
