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
import { FullDateTimezoneHelper } from 'src/shared/helpers/date.helper'

// ** nextJS
import { useRouter } from 'next/router'

type CellType = {
  row: {
    id: number
    title: string
    client: string
    category: string
    serviceType: Array<string>
    dueAt: string
  }
}

type Props = {
  pageSize: number
  setSkip: (num: number) => void
  setPageSize: (num: number) => void
  list: {
    data:
      | Array<{
          id: number
          title: string
          client: string
          category: string
          serviceType: Array<string>
          dueAt: string
        }>
      | []
    count: number
  }
  isLoading: boolean
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
  pageSize,
  setSkip,
  setPageSize,
  list,
  isLoading,
}: Props) {
  const router = useRouter()
  /* TODO: 값 업데이트 되어서 수정해야 할 수 있음 */
  function getChipColor(type: string): ChipColorType {
    switch (type) {
      case 'Documents/Text':
        return 'orange'
      case 'Dubbing':
        return 'yellow'
      case 'OTT/Subtitle':
        return 'blue'
      case 'Webcomics':
        return 'green'
      case 'Webnovel':
        return 'pink'
      case 'YouTube':
        return 'purple'
      default:
        return 'black'
    }
  }

  function moveToDetail(id: number) {
    router.push(`/onboarding/client-guideline/detail/${id}`)
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
        <CategoryChip
          cl={getChipColor(row.category)}
          size='small'
          label={row.client}
        />
      ),
    },
    {
      flex: 0.3,
      minWidth: 130,
      field: 'serviceType',
      headerName: 'Service type',
      renderHeader: () => <Box>Service type</Box>,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ overflow: 'scroll', display: 'flex', gap: '5px' }}>
            {!row?.serviceType.length
              ? '-'
              : row?.serviceType?.map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', gap: '8px' }}>
                    <ServiceType label={item} size='small' />
                  </Box>
                ))}
          </Box>
        )
      },
    },
    {
      flex: 0.23,
      minWidth: 120,
      field: 'dueAt',
      headerName: 'Date & Time',
      renderHeader: () => <Box>Date & Time</Box>,
      renderCell: ({ row }: CellType) => (
        <Box sx={{ overflowX: 'scroll' }}>
          {FullDateTimezoneHelper(row.dueAt)}
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
              <Typography variant='h6'>Guidelines (0)</Typography>{' '}
              <Button variant='contained'>
                <StyledNextLink
                  href='/onboarding/client-guideline/form/post'
                  color='white'
                >
                  Add client guideline
                </StyledNextLink>
              </Button>
            </Box>
          }
        />
        <Box sx={{ height: 500 }}>
          <DataGrid
            components={{
              NoRowsOverlay: () => noData(),
              NoResultsOverlay: () => noData(),
            }}
            columns={columns}
            autoHeight
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            rowsPerPageOptions={[10, 25, 50]}
            onPageChange={setSkip}
            rowCount={list.count || 0}
            rows={list.data}
            loading={isLoading}
          />
        </Box>
      </Card>
    </Grid>
  )
}

const CategoryChip = styled(Chip)<{ cl: ChipColorType }>`
  background: ${({ cl }) =>
    cl === 'orange'
      ? '#FF9E90'
      : cl === 'yellow'
      ? '#FFF387'
      : cl === 'blue'
      ? '#A9E0FF'
      : cl === 'green'
      ? '#BEEFAE'
      : cl === 'pink'
      ? '#FFBFE9'
      : cl === 'purple'
      ? '#CCBFFF'
      : 'rgba(76, 78, 100, 0.26)'};

  color: #111111;
`
const ServiceType = styled(Chip)`
  background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.88),
      rgba(255, 255, 255, 0.88)
    ),
    #666cff;
  border: 1px solid rgba(102, 108, 255, 0.5);
`

const Title = styled(Typography)`
  font-weight: 600;
  font-size: 1rem;
  color: rgba(76, 78, 100, 0.87);
`
