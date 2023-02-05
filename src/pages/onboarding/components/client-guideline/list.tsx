// ** mui
import { Button, Card, Grid, Typography } from '@mui/material'
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
  setSkip: (num: number) => void
  setPageSize: (num: number) => void
  data: Array<{
    id: number
    title: string
    client: string
    category: string
    serviceType: Array<string>
    dueAt: string
  }>
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
  setSkip,
  setPageSize,
  data,
}: Props) {
  const router = useRouter()
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
        <CategoryChip color={getChipColor(row.category)}>
          {row.client}
        </CategoryChip>
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
                    <ServiceType>{item}</ServiceType>
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
                  href='/onboarding/client-guideline/form'
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
            onPageSizeChange={setPageSize}
            rowsPerPageOptions={[1, 50, 100]}
            onPageChange={setSkip}
            rows={data.slice(0, 10)}
          />
        </Box>
      </Card>
    </Grid>
  )
}

// ** TODO : chip style 컬러 추가해야 함
const CategoryChip = styled.p<{
  color: ChipColorType
}>`
  padding: 2px 6px;
  background: ${({ color }) =>
    color === 'orange'
      ? '#FF9E90'
      : color === 'yellow'
      ? '#FFF387'
      : color === 'blue'
      ? '#A9E0FF'
      : color === 'green'
      ? '#BEEFAE'
      : color === 'pink'
      ? '#FFBFE9'
      : color === 'purple'
      ? '#CCBFFF'
      : 'rgba(76, 78, 100, 0.26)'};
  border-radius: 16px;

  color: #111111;
  font-weight: 500;
  font-size: 0.813rem;
`
const ServiceType = styled.p`
  padding: 2px 6px;
  text-align: center;
  background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.88),
      rgba(255, 255, 255, 0.88)
    ),
    #666cff;
  border: 1px solid rgba(102, 108, 255, 0.5);
  border-radius: 16px;
  font-weight: 500;
  font-size: 0.813rem;
`

const Title = styled(Typography)`
  font-weight: 600;
  font-size: 1rem;
  color: rgba(76, 78, 100, 0.87);
`
