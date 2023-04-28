import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import {
  Box,
  Button,
  Grid,
  IconButton,
  Tab,
  Typography,
  styled,
} from '@mui/material'
import Icon from '@src/@core/components/icon'
import {
  MouseEvent,
  Suspense,
  SyntheticEvent,
  useContext,
  useState,
} from 'react'
import ProjectInfo from './components/project-info'
import OrderDetailClient from './components/client'
import {
  ProjectTeamCellType,
  ProjectTeamType,
  VersionHistoryType,
} from '@src/types/orders/order-detail'
import { GridColumns } from '@mui/x-data-grid'
import ProjectTeam from './components/project-team'
import VersionHistory from './components/version-history'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { AuthContext } from '@src/context/AuthContext'
import useModal from '@src/hooks/useModal'
import VersionHistoryModal from './components/modal/version-history-modal'
import { getProjectTeamColumns } from '@src/shared/const/columns/order-detail'
import { useRouter } from 'next/router'
import {
  useGetClient,
  useGetProjectInfo,
  useGetProjectTeam,
} from '@src/queries/order/order.query'
import DownloadOrderModal from './components/modal/download-order-modal'

const OrderDetail = () => {
  const router = useRouter()

  const { id } = router.query

  const [value, setValue] = useState<string>('project')

  const { data: projectInfo, isLoading } = useGetProjectInfo(Number(id!))
  const { data: projectTeam } = useGetProjectTeam(Number(id!))
  const { data: client } = useGetClient(Number(id!))

  const { user } = useContext(AuthContext)
  const { openModal, closeModal } = useModal()
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  const [projectTeamListPage, setProjectTeamListPage] = useState<number>(0)
  const [projectTeamListPageSize, setProjectTeamListPageSize] =
    useState<number>(10)

  const [versionHistoryListPage, setVersionHistoryListPage] =
    useState<number>(0)

  const [versionHistoryListPageSize, setVersionHistoryListPageSize] =
    useState<number>(5)

  const onClickVersionHistoryRow = (history: VersionHistoryType) => {
    openModal({
      type: 'versionHistoryModal',
      children: <VersionHistoryModal history={history} />,
    })
  }

  const onClickDownloadOrder = () => {
    openModal({ type: 'DownloadOrderModal', children: <DownloadOrderModal /> })
  }

  const versionHistoryColumns: GridColumns<VersionHistoryType> = [
    {
      field: 'position',
      flex: 0.3,
      minWidth: 419,
      headerName: 'Position',
      disableColumnMenu: true,
      renderHeader: () => <Box>Version</Box>,
      renderCell: ({ row }: { row: VersionHistoryType }) => {
        return <Box>Ver. {row.version}</Box>
      },
    },
    {
      minWidth: 420,
      field: 'member',
      headerName: 'Member',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Account</Box>,
      renderCell: ({ row }: { row: VersionHistoryType }) => {
        return <Box>{row.email}</Box>
      },
    },
    {
      minWidth: 410,
      field: 'jobTitle',
      headerName: 'Job title',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Date&Time</Box>,
      renderCell: ({ row }: { row: VersionHistoryType }) => {
        return (
          <Box>{FullDateTimezoneHelper(row.downloadedAt, user?.timezone!)}</Box>
        )
      },
    },
  ]
  return (
    <Grid item xs={12} sx={{ pb: '100px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            background: '#ffffff',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <IconButton sx={{ padding: '0 !important', height: '24px' }}>
              <Icon icon='mdi:chevron-left' width={24} height={24} />
            </IconButton>
            <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <img src='/images/icons/order-icons/book.svg' alt='' />
              <Typography variant='h5'>{projectInfo?.corporationId}</Typography>
            </Box>
          </Box>
          <Box>
            <Button
              variant='outlined'
              sx={{ display: 'flex', gap: '8px' }}
              onClick={onClickDownloadOrder}
            >
              <Icon icon='material-symbols:request-quote' />
              Download order
            </Button>
          </Box>
        </Box>
        <Box>
          <TabContext value={value}>
            <TabList
              onChange={handleChange}
              aria-label='Order detail Tab menu'
              style={{ borderBottom: '1px solid rgba(76, 78, 100, 0.12)' }}
            >
              <CustomTap
                value='project'
                label='Project info'
                iconPosition='start'
                icon={<Icon icon='iconoir:large-suitcase' fontSize={'18px'} />}
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              />
              <CustomTap
                value='item'
                label='Languages & Items'
                iconPosition='start'
                icon={<Icon icon='pajamas:earth' fontSize={'18px'} />}
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              />
              <CustomTap
                value='client'
                label='Client'
                iconPosition='start'
                icon={
                  <Icon icon='mdi:account-star-outline' fontSize={'18px'} />
                }
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              />
              <CustomTap
                value='team'
                label='Project team'
                iconPosition='start'
                icon={
                  <Icon icon='ic:baseline-people-outline' fontSize={'18px'} />
                }
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              />
              <CustomTap
                value='history'
                label='Version history'
                iconPosition='start'
                icon={<Icon icon='ic:outline-history' fontSize={'18px'} />}
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              />
            </TabList>
            <TabPanel value='project' sx={{ pt: '24px' }}>
              <Suspense>
                <ProjectInfo type={'detail'} projectInfo={projectInfo!} />
              </Suspense>
            </TabPanel>
            <TabPanel value='item' sx={{ pt: '24px' }}></TabPanel>
            <TabPanel value='client' sx={{ pt: '24px' }}>
              <OrderDetailClient type={'detail'} client={client!} />
            </TabPanel>
            <TabPanel value='team' sx={{ pt: '24px' }}>
              <Suspense>
                <ProjectTeam
                  list={projectTeam!}
                  listCount={projectTeam?.length!}
                  columns={getProjectTeamColumns()}
                  page={projectTeamListPage}
                  setPage={setProjectTeamListPage}
                  pageSize={projectTeamListPageSize}
                  setPageSize={setProjectTeamListPageSize}
                />
              </Suspense>
            </TabPanel>
            <TabPanel value='history' sx={{ pt: '24px' }}>
              {/* <VersionHistory
                list={versionHistory}
                listCount={versionHistory.length}
                columns={versionHistoryColumns}
                page={versionHistoryListPage}
                setPage={setVersionHistoryListPage}
                pageSize={versionHistoryListPageSize}
                setPageSize={setVersionHistoryListPageSize}
                onClickRow={onClickVersionHistoryRow}
              /> */}
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
    </Grid>
  )
}

export default OrderDetail

OrderDetail.acl = {
  subject: 'order_list',
  action: 'read',
}

const CustomTap = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`
