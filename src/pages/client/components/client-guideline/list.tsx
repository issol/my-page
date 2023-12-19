// ** mui
import { Button, Card, Chip, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { DataGrid } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'

// ** custom component
import { StyledNextLink } from 'src/@core/components/customLink'

// ** third party
import styled from 'styled-components'

// ** helpers
import { convertTimeToTimezone } from 'src/shared/helpers/date.helper'

// ** nextJS
import { useRouter } from 'next/router'
import { JobTypeChip, ServiceTypeChip } from '@src/@core/components/chips/chips'
import { UserDataType } from '@src/context/types'
import { useRecoilValueLoadable } from 'recoil'
import { timezoneSelector } from '@src/states/permission'

type CellType = {
  row: {
    id: number
    title: string
    client: string
    category: string
    serviceType: string
    createdAt: string
  }
}

type Props = {
  skip: number
  pageSize: number
  setSkip: (num: number) => void
  setPageSize: (num: number) => void
  user: UserDataType
  list: {
    data:
      | Array<{
          id: number
          title: string
          client: string
          category: string
          serviceType: string
          createdAt: string
        }>
      | []
    count: number
  }
  isLoading: boolean
  page: 'client' | 'onboarding'
}

type ChipColorType =
  | 'orange'
  | 'yellow'
  | 'blue'
  | 'green'
  | 'pink'
  | 'purple'
  | 'black'

export default function ClientGuideLineList({
  skip,
  pageSize,
  setSkip,
  setPageSize,
  list,
  isLoading,
  user,
  page,
}: Props) {
  const router = useRouter()
  const timezone = useRecoilValueLoadable(timezoneSelector)

  function moveToDetail(id: number) {
    router.push(`/${page}/client-guideline/detail/${id}`)
  }

  const columns = [
    {
      flex: 0.28,
      field: 'title',
      minWidth: 80,
      headerName: 'Title',
      renderHeader: () => <Box>Title</Box>,
      renderCell: ({ row }: CellType) => (
        <Title
          title={row.title}
          sx={{ cursor: 'pointer' }}
          onClick={() => moveToDetail(row.id)}
        >
          {row.title}
        </Title>
      ),
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'client',
      headerName: 'Client',
      renderHeader: () => <Box>Client</Box>,
      renderCell: ({ row }: CellType) => {
        return <Typography variant='body2'>{row.client}</Typography>
      },
    },
    {
      flex: 0.15,
      minWidth: 180,
      field: 'category',
      headerName: 'Category',
      renderHeader: () => <Box>Category</Box>,
      renderCell: ({ row }: CellType) => (
        <JobTypeChip type={row.category} label={row.category} size='small' />
      ),
    },
    {
      flex: 0.3,
      minWidth: 130,
      field: 'serviceType',
      headerName: 'Service type',
      renderHeader: () => <Box>Service type</Box>,
      renderCell: ({ row }: CellType) => {
        return <ServiceTypeChip label={row.serviceType} size='small' />
      },
    },
    {
      flex: 0.23,
      minWidth: 120,
      field: 'createdAt',
      headerName: 'Date & Time',
      renderHeader: () => <Box>Date & Time</Box>,
      renderCell: ({ row }: CellType) => (
        <Box sx={{ overflowX: 'scroll' }}>
          {convertTimeToTimezone(
            row.createdAt,
            user.timezone!,
            timezone.getValue(),
          )}
        </Box>
      ),
    },
  ]

  function noData() {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant='subtitle1'>
          There are no client guidelines
        </Typography>
      </Box>
    )
  }

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          title={
            <Box display='flex' justifyContent='space-between'>
              <Typography variant='h6'>
                Guidelines ({list?.count | 0})
              </Typography>{' '}
              <Button variant='contained'>
                <StyledNextLink
                  href={`/${page}/client-guideline/form/post`}
                  color='white'
                >
                  Add client guideline
                </StyledNextLink>
              </Button>
            </Box>
          }
        />
        <Box>
          <DataGrid
            autoHeight
            components={{
              NoRowsOverlay: () => noData(),
              NoResultsOverlay: () => noData(),
            }}
            rows={list.data}
            rowCount={list.count}
            loading={isLoading}
            rowsPerPageOptions={[10, 25, 50]}
            pagination
            page={skip}
            pageSize={pageSize}
            paginationMode='server'
            onPageChange={setSkip}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            columns={columns}
          />
        </Box>
      </Card>
    </Grid>
  )
}

const Title = styled(Typography)`
  font-weight: 600;
  font-size: 1rem;
  color: rgba(76, 78, 100, 0.87);
`
