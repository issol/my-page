import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import { GridColumns, GridRowParams, GridSortModel } from '@mui/x-data-grid'
import { DashboardQuery, ViewType } from '@src/types/dashboard'
import OngoingStatus from '@src/views/dashboard/dataGrid/status/ongoing'
import OngoingList from '@src/views/dashboard/dataGrid/status/list'

export interface StatusAndListProps<T extends { id: number; orderId?: number }>
  extends DashboardQuery {
  type: 'job' | 'order' | 'application'
  setOpenInfoDialog?: (open: boolean, key: string) => void
  statusColumn: GridColumns<T>
  initSort: GridSortModel
  userViewDate: string
  movePage?: () => void
  moveDetailPage?: (params: GridRowParams<T>) => void
}

const StatusAndDataGrid = <T extends { id: number; orderId?: number }>(
  props: StatusAndListProps<T>,
) => {
  const [activeStatus, setActiveStatus] = useState<ViewType>('ongoing')

  return (
    <Grid container flexDirection='row' gap='24px'>
      <OngoingStatus
        {...props}
        activeStatus={activeStatus}
        setActiveStatus={setActiveStatus}
      />
      <OngoingList
        {...props}
        activeStatus={activeStatus}
        setActiveStatus={setActiveStatus}
      />
    </Grid>
  )
}

export default StatusAndDataGrid
