import React, { ReactElement, Suspense } from 'react'
import { useQueryClient } from 'react-query'
import { DEFAULT_QUERY_NAME } from '@src/queries/dashnaord.query'
import { Box, IconButton, Typography } from '@mui/material'
import { SectionTitleProps, Title } from '@src/views/dashboard/dashboardItem'
import { RefreshOutlined } from '@mui/icons-material'
import FallbackSpinner from '@src/@core/components/spinner'
import { ErrorBoundary } from 'react-error-boundary'

export interface DashboardSuspenseProps {
  refreshDataQueryKey: string | Array<string>
  sectionTitle: string
  handleClick?: () => void
  setOpenInfoDialog?: (open: boolean, key: string) => void
  titleProps?: Partial<SectionTitleProps>
}

export const DashboardErrorFallback = ({
  sectionTitle,
  setOpenInfoDialog,
  handleClick,
  refreshDataQueryKey,
  titleProps,
}: DashboardSuspenseProps) => {
  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box>
        <Title
          {...titleProps}
          title={sectionTitle}
          openDialog={setOpenInfoDialog}
          handleClick={handleClick}
        />
      </Box>
      <TryAgain refreshDataQueryKey={refreshDataQueryKey} />
    </Box>
  )
}

export const TryAgain = ({
  refreshDataQueryKey,
}: Pick<DashboardSuspenseProps, 'refreshDataQueryKey'>) => {
  const queryClient = useQueryClient()

  const onChange = () => {
    if (typeof refreshDataQueryKey === 'string') {
      console.log('#@$@#$@#', refreshDataQueryKey)
      queryClient.refetchQueries({
        queryKey: [DEFAULT_QUERY_NAME, refreshDataQueryKey],
      })
      return
    }

    const keys = [DEFAULT_QUERY_NAME, ...refreshDataQueryKey]
    queryClient.refetchQueries({
      queryKey: keys,
    })
  }
  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      gap='20px'
      sx={{ width: '100%', height: '70%' }}
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
  )
}
interface SuspenseProps extends DashboardSuspenseProps {
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
