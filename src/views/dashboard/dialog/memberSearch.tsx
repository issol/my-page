import { Icon } from '@iconify/react'
import {
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogContent,
  Grid,
  InputAdornment,
  OutlinedInput,
  Radio,
  Typography,
} from '@mui/material'

import { Box } from '@mui/system'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { useGetOrderList } from '@src/queries/order/order.query'
import { OrderListType } from '@src/types/orders/order-list'
import { useEffect, useState } from 'react'
import {
  DEFAULT_QUERY_NAME,
  useDashboardMemberList,
} from '@src/queries/dashboard/dashnaord-lpm'
import { MemberItem } from '@src/types/dashboard'
import Divider from '@mui/material/Divider'
import { useRecoilState } from 'recoil'
import { dashboardState } from '@src/states/dashboard'
import { useQueryClient } from 'react-query'

type Props = {
  open: boolean
  onClose: () => void
}

const MemberSearchList = ({ open, onClose }: Props) => {
  const queryClient = useQueryClient()

  const [selected, setSelected] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  const [activeSearch, setActiveSearch] = useState('')
  const [skip, setSkip] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const [state, setState] = useRecoilState(dashboardState)

  const { data, isLoading } = useDashboardMemberList({
    search: activeSearch,
    take: pageSize,
    skip: skip * pageSize,
  })

  useEffect(() => {
    if (open) {
      setSelected(null)
      setActiveSearch('')
      setSkip(0)
      setPageSize(10)
    }
  }, [open])

  const columns: GridColumns = [
    {
      minWidth: 60,
      field: 'radiobutton',
      headerName: '',
      sortable: false,
      disableColumnMenu: true,
      renderHeader: () => <></>,
      renderCell: ({ row }: { row: MemberItem }) => {
        return (
          <Radio
            sx={{ padding: 0 }}
            value={row.userId}
            size='small'
            onChange={() => setSelected(row.userId)}
            checked={!selected ? false : selected === row.userId}
          />
        )
      },
    },
    {
      field: 'name',
      minWidth: 220,
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Project name</Box>,
      renderCell: ({ row }: { row: MemberItem }) => {
        return (
          <Box>
            <Typography fontSize='16px' fontWeight={600}>{`${row.firstName} ${
              row?.middleName || ''
            } ${row.lastName}`}</Typography>
            <Typography fontSize='14px' color='rgba(76, 78, 100, 0.6)'>
              {row.email}
            </Typography>
          </Box>
        )
      },
    },
    {
      field: 'department',
      minWidth: 180,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Department</Box>,
      renderCell: ({ row }: { row: MemberItem }) => {
        return <Box>{row.department || '-'}</Box>
      },
    },
    {
      minWidth: 290,
      field: 'jobTitle',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Job Title</Box>,
      renderCell: ({ row }: { row: MemberItem }) => {
        return <Box>{row.jobTitle}</Box>
      },
    },
  ]

  const NoList = () => {
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
        <Typography variant='subtitle1'>There are no LPM members</Typography>
      </Box>
    )
  }

  const onSelectedMember = async () => {
    const item = data.find((item: any) => item.userId === selected)
    setState({ ...state, userId: selected || state.userId, userInfo: item })
    await queryClient.invalidateQueries(DEFAULT_QUERY_NAME)
    onClose()
  }

  return (
    <Dialog maxWidth='md' aria-labelledby='member-select' open={open}>
      <Box sx={{ padding: '50px 60px' }}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Typography variant='h5'>Select member</Typography>
          </Grid>
          <Grid item xs={12}>
            <OutlinedInput
              value={search}
              onChange={e => setSearch(e.target.value)}
              fullWidth
              placeholder='Search projects'
              aria-describedby='icons-weight-helper-text'
              endAdornment={
                <InputAdornment position='end'>
                  <Icon fontSize={20} icon='material-symbols:search' />
                </InputAdornment>
              }
              inputProps={{
                'aria-label': 'weight',
              }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            display='flex'
            justifyContent='flex-end'
            gap='16px'
          >
            <Button
              variant='outlined'
              size='medium'
              color='secondary'
              type='button'
              onClick={() => {
                setSearch('')
                setActiveSearch('')
              }}
            >
              Reset
            </Button>
            <Button
              variant='contained'
              size='medium'
              onClick={() => setActiveSearch(search)}
            >
              Search
            </Button>
          </Grid>
        </Grid>
        <Divider sx={{ paddingTop: '20px' }} />
        <Grid container spacing={6} sx={{ marginTop: '20px' }}>
          <Grid item xs={12}>
            <DataGrid
              getRowId={row => row.userId}
              autoHeight
              components={{
                NoRowsOverlay: () => NoList(),
                NoResultsOverlay: () => NoList(),
              }}
              sx={{
                '.MuiDataGrid-row': {
                  cursor: 'pointer',
                },
              }}
              columns={columns}
              rows={data ?? []}
              rowCount={data?.length || 0}
              loading={isLoading}
              onCellClick={params => setSelected(params.row.userId)}
              rowsPerPageOptions={[10, 25, 50]}
              pagination
              page={skip}
              pageSize={pageSize}
              onPageChange={setSkip}
              disableSelectionOnClick
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            />
          </Grid>
        </Grid>
        <Grid container spacing={6} sx={{ width: '100%' }}>
          <Grid
            item
            xs={12}
            display='flex'
            justifyContent='center'
            gap='15px'
            sx={{ overflow: 'hidden' }}
          >
            <Button
              variant='outlined'
              size='medium'
              color='secondary'
              type='button'
              onClick={() => onClose()}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              size='medium'
              disabled={!selected}
              onClick={onSelectedMember}
            >
              Select
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  )
}

export default MemberSearchList
