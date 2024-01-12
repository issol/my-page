import React, { ReactElement, Suspense, useState } from 'react'
import { Box } from '@mui/material'
import {
  GridItem,
  SectionTitle,
  SubDateDescription,
  Title,
} from '@src/views/dashboard/dashboardItem'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import Grid from '@mui/material/Grid'
import styled from '@emotion/styled'
import AddIcon from '@mui/icons-material/Add'
import Typography from '@mui/material/Typography'
import {
  Approval,
  CheckCircleOutline,
  DoNotDisturbAlt,
  KeyboardArrowRight,
  ReceiptLong,
  SmsFailedRounded,
} from '@mui/icons-material'
import {
  DataGrid,
  GridColumns,
  GridRowParams,
  GridSortModel,
} from '@mui/x-data-grid'

import {
  useDashboardCount,
  useDashboardCountList,
} from '@src/queries/dashnaord.query'
import { DashboardQuery, OrderType, ViewType } from '@src/types/dashboard'
import { toCapitalize } from '@src/pages/dashboards/lpm'
import { useRouter } from 'next/router'
import DefaultDataGrid from '@src/views/dashboard/dataGrid/default'
import OverlaySpinner from '@src/@core/components/spinner/overlay-spinner'
import { DashboardSuspenseProps } from '@src/views/dashboard/suspense'
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
