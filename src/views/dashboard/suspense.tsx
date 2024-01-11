import React, { ReactElement, Suspense } from 'react'
import { useQueryClient } from 'react-query'
import { DEFAULT_QUERY_NAME } from '@src/queries/dashnaord.query'
import { Box, IconButton, Typography } from '@mui/material'
import { Title } from '@src/views/dashboard/dashboardItem'
import { RefreshOutlined } from '@mui/icons-material'
import FallbackSpinner from '@src/@core/components/spinner'
import { ErrorBoundary } from 'react-error-boundary'

interface DashboardSuspenseProps {
  title: string
  handleTitleClick?: () => void
  setOpenInfoDialog: (open: boolean, key: string) => void
  refreshDataQueryKey: string
}

const DashboardErrorFallback = ({
  title,
  setOpenInfoDialog,
  handleTitleClick,
  refreshDataQueryKey,
}: DashboardSuspenseProps) => {
  const queryClient = useQueryClient()

  const onChange = () => {
    queryClient.refetchQueries({
      queryKey: [DEFAULT_QUERY_NAME, refreshDataQueryKey],
    })
  }

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box>
        <Title
          title={title}
          openDialog={setOpenInfoDialog}
          handleClick={handleTitleClick}
        />
      </Box>
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        gap='20px'
        sx={{ width: '100%', height: '90%' }}
      >
        <IconButton
          color='primary'
          aria-label='refresh'
          size='large'
          onClick={() => onChange()}
        >
          <RefreshOutlined sx={{ fontSize: '32px' }} />
        </IconButton>
        <Typography>Failed to load data. Please try again.</Typography>
      </Box>
    </Box>
  )
}

interface SuspenseProps extends DashboardSuspenseProps {
  refreshDataQueryKey: string
  children: ReactElement
}
const DashboardForSuspense = <T extends SuspenseProps>(props: T) => {
  return (
    <Suspense fallback={<FallbackSpinner />}>
      <ErrorBoundary fallback={<DashboardErrorFallback {...props} />}>
        {props.children}
      </ErrorBoundary>
    </Suspense>
  )
}

export default DashboardForSuspense
