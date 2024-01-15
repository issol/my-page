import React from 'react'
import { useUpcomingDeadline } from '@src/queries/dashnaord.query'
import { Title } from '@src/views/dashboard/dashboardItem'
import { Box, Stack } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { upcomingColumns } from '@src/shared/const/columns/dashboard'
import DashboardForSuspense from '@src/views/dashboard/suspense'

const UpcomingDeadlinesContent = () => {
  const { data: upcomingData } = useUpcomingDeadline()
  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Title padding='20px' title='Upcoming deadlines' />
      <DataGrid
        hideFooter
        components={{
          NoRowsOverlay: () => (
            <Stack height='50%' alignItems='center' justifyContent='center'>
              There are no deadlines
            </Stack>
          ),
        }}
        rows={upcomingData || []}
        columns={upcomingColumns}
        disableSelectionOnClick
        pagination={undefined}
      />
    </Box>
  )
}

const UpcomingDeadlines = () => {
  return (
    <DashboardForSuspense
      sectionTitle='Upcoming deadlines'
      refreshDataQueryKey='UpcomingDeadline'
      titleProps={{
        padding: '20px',
      }}
    >
      <UpcomingDeadlinesContent />
    </DashboardForSuspense>
  )
}

export default UpcomingDeadlines
