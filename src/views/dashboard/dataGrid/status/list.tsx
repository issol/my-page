import { GridItem, Title } from '@src/views/dashboard/dashboardItem'
import { Box } from '@mui/material'
import { toCapitalize } from '@src/pages/dashboards/lpm'
import DefaultDataGrid from '@src/views/dashboard/dataGrid/default'
import React, { Suspense, useState } from 'react'
import { GridSortModel } from '@mui/x-data-grid'
import {
  useDashboardCount,
  useDashboardCountList,
} from '@src/queries/dashnaord.query'
import { OngoingProps } from '@src/views/dashboard/dataGrid/status/ongoing'
import FallbackSpinner from '@src/@core/components/spinner'
import { ErrorBoundary } from 'react-error-boundary'
import { TryAgain } from '@src/views/dashboard/suspense'

const List = <T extends { id: number; orderId?: number }>(
  props: OngoingProps<T>,
) => {
  const {
    type = 'order',
    to,
    from,
    statusColumn,
    initSort,
    movePage,
    moveDetailPage,
    activeStatus,
  } = props
  const [skip, setSkip] = useState(0)
  const [sortModel, setSortModel] = useState<GridSortModel>(initSort)

  const { data: countData } = useDashboardCount({ countType: type, to, from })
  const { data } = useDashboardCountList({
    countType: type,
    type: activeStatus,
    to,
    from,
    skip: skip,
    take: 6,
    sort: sortModel[0]?.field,
    ordering: sortModel[0]?.sort || undefined,
  })

  return (
    <GridItem sm height={489} padding='0'>
      <Box sx={{ width: '100%', height: '100%' }}>
        <Title
          title={`Ongoing ${type}s > ${toCapitalize(activeStatus)}`}
          postfix={`(${
            countData && (countData[activeStatus] || 0).toLocaleString()
          })`}
          marginBottom='20px'
          padding='20px 20px 0'
          handleClick={movePage && movePage}
        />
        <Box
          sx={{
            width: '100%',
            height: `calc(100% - 84px)`,
            padding: 0,
            margin: 0,
          }}
        >
          <DefaultDataGrid<T>
            overlayTitle={`There are no ${type}s`}
            data={data}
            columns={statusColumn}
            defaultPageSize={6}
            sortModel={sortModel}
            setSortModel={setSortModel}
            setSkip={setSkip}
            onRowClick={params => moveDetailPage && moveDetailPage(params)}
          />
        </Box>
      </Box>
    </GridItem>
  )
}

const OngoingList = <T extends { id: number; orderId?: number }>(
  props: OngoingProps<T>,
) => {
  return (
    <Suspense fallback={<FallbackSpinner />}>
      <ErrorBoundary
        fallback={
          <GridItem sm height={489} padding='0'>
            <TryAgain refreshDataQueryKey={['ongoingCount', props.type]} />
          </GridItem>
        }
      >
        <List {...props} />
      </ErrorBoundary>
    </Suspense>
  )
}
export default OngoingList
