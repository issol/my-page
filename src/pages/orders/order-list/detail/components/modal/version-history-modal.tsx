import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import {
  Box,
  Button,
  Card,
  Switch,
  Tab,
  Typography,
  styled,
} from '@mui/material'
import Icon from '@src/@core/components/icon'

import TabContext from '@mui/lab/TabContext'
import {
  MouseEvent,
  SyntheticEvent,
  useContext,
  useEffect,
  useState,
} from 'react'
import ProjectInfo from '../project-info'
import OrderDetailClient from '../client'
import ProjectTeam from '../project-team'
import {
  HistoryType,
  OrderDownloadData,
  ProjectInfoType,
  VersionHistoryType,
} from '@src/types/orders/order-detail'
import { getProjectTeamColumns } from '@src/shared/const/columns/order-detail'
import { getCurrentRole } from '@src/shared/auth/storage'
import { AuthContext } from '@src/shared/auth/auth-provider'
import { useGetStatusList } from '@src/queries/common.query'
import ClientOrder from '../client-order'

type Props = {
  history: VersionHistoryType
  project: ProjectInfoType
  onClose: any
  onClick: any
}

const VersionHistoryModal = ({ history, onClose, onClick, project }: Props) => {
  const { user } = useRecoilValue(authState)
  const [downloadData, setDownloadData] = useState<OrderDownloadData | null>(
    null,
  )
  const [downloadLanguage, setDownloadLanguage] = useState<'EN' | 'KO'>('EN')
  const { data: statusList } = useGetStatusList('Order')

  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(0)

  const currentRole = getCurrentRole()
  const [value, setValue] = useState<string>(
    currentRole?.name === 'CLIENT' ? '0' : '1',
  )
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  console.log('history', history)

  useEffect(() => {
    makePdfData()
  }, [history])

  function makePdfData() {
    const pm = history?.projectTeam?.find(
      value => value.position === 'projectManager',
    )

    const res: OrderDownloadData = {
      orderId: Number(history.id),
      adminCompanyName: 'GloZ Inc.',
      companyAddress: '3325 Wilshire Blvd Ste 626 Los Angeles CA 90010',
      corporationId: history?.projectInfo!.corporationId,
      orderedAt: history?.projectInfo!.orderedAt,
      projectDueAt: {
        date: history?.projectInfo!.projectDueAt,
        timezone: history?.projectInfo!.projectDueTimezone,
      },
      pm: {
        firstName: pm?.firstName!,
        lastName: pm?.lastName!,
        email: pm?.email!,
        middleName: pm?.middleName!,
      },
      companyName: history?.client!.client.name,
      projectName: history?.projectInfo!.projectName,
      client: history?.client!,
      contactPerson: history?.client!.contactPerson,
      clientAddress: history?.client!.clientAddress,
      langItem: history?.items!,
    }

    setDownloadData(res)
  }
  return (
    <Box
      sx={{
        maxWidth: '1266px',
        width: '100%',
        maxHeight: '900px',
        height: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
      }}
    >
      <Box
        sx={{
          padding: '50px 60px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            padding: '20px',
          }}
        >
          <img src='/images/icons/order-icons/book.svg' alt='' />
          <Typography variant='h5'>{`[${'Ver. 1'}] O-000001`}</Typography>
        </Box>
        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            aria-label='Order detail Tab menu'
            style={{ borderBottom: '1px solid rgba(76, 78, 100, 0.12)' }}
          >
            {currentRole?.name !== 'CLIENT' ? null : (
              <CustomTap
                value='0'
                label='Order'
                iconPosition='start'
                icon={<Icon icon='ic:outline-list-alt' fontSize={'18px'} />}
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              />
            )}
            <CustomTap
              value='1'
              label='Project info'
              iconPosition='start'
              icon={<Icon icon='iconoir:large-suitcase' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            <CustomTap
              value='2'
              label='Languages & Items'
              iconPosition='start'
              icon={<Icon icon='pajamas:earth' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            {currentRole && currentRole.name === 'CLIENT' ? null : (
              <CustomTap
                value='3'
                label='Client'
                iconPosition='start'
                icon={
                  <Icon icon='mdi:account-star-outline' fontSize={'18px'} />
                }
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              />
            )}

            <CustomTap
              value='4'
              label='Project team'
              iconPosition='start'
              icon={
                <Icon icon='ic:baseline-people-outline' fontSize={'18px'} />
              }
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
          </TabList>
          <TabPanel
            value='0'
            sx={{
              height: '100%',
              maxHeight: '552px',
              minHeight: '552px',
              overflow: 'scroll',
            }}
          >
            {downloadData ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'start', mb: 4 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '4px',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      fontSize={14}
                      fontWeight={downloadLanguage === 'KO' ? 400 : 600}
                      color={downloadLanguage === 'KO' ? '#BDBDBD' : '#666CFF'}
                    >
                      English
                    </Typography>
                    <Switch
                      checked={downloadLanguage === 'KO'}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                      ) => {
                        setDownloadLanguage &&
                          setDownloadLanguage(
                            event.target.checked ? 'KO' : 'EN',
                          )
                      }}
                      inputProps={{ 'aria-label': 'controlled' }}
                      sx={{
                        '.MuiSwitch-switchBase:not(.Mui-checked)': {
                          color: '#666CFF',
                          '.MuiSwitch-thumb': {
                            color: '#666CFF',
                          },
                        },
                        '.MuiSwitch-track': {
                          backgroundColor: '#666CFF',
                        },
                      }}
                    />
                    <Typography
                      fontSize={14}
                      fontWeight={downloadLanguage === 'KO' ? 600 : 400}
                      color={downloadLanguage === 'KO' ? '#666CFF' : '#BDBDBD'}
                    >
                      Korean
                    </Typography>
                  </Box>
                </Box>
                <Card>
                  <ClientOrder
                    downloadData={downloadData!}
                    user={user!}
                    downloadLanguage={downloadLanguage}
                    setDownloadLanguage={setDownloadLanguage}
                    type='history'
                    statusList={statusList!}
                    project={project!}
                  />
                </Card>
              </>
            ) : null}
          </TabPanel>
          <TabPanel
            value='1'
            sx={{ height: '100%', maxHeight: '552px', minHeight: '552px' }}
          >
            <ProjectInfo
              type='history'
              project={history.projectInfo}
              isUpdatable={false}
              role={currentRole!}
            />
          </TabPanel>
          <TabPanel
            value='2'
            sx={{ height: '100%', maxHeight: '552px', minHeight: '552px' }}
          ></TabPanel>
          <TabPanel
            value='3'
            sx={{ height: '100%', maxHeight: '552px', minHeight: '552px' }}
          >
            <OrderDetailClient
              type='history'
              client={history.client}
              isUpdatable={false}
            />
          </TabPanel>
          <TabPanel
            value='4'
            sx={{ height: '100%', maxHeight: '552px', minHeight: '552px' }}
          >
            <ProjectTeam
              type='history'
              list={history.projectTeam}
              listCount={history.projectTeam.length}
              columns={getProjectTeamColumns()}
              page={page}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
              isUpdatable={false}
            />
          </TabPanel>
        </TabContext>
        <Box
          sx={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            variant='outlined'
            color='secondary'
            sx={{ width: '226px' }}
            onClick={onClose}
          >
            Close
          </Button>
          {project.status === 10300 ||
          project.status === 10400 ||
          project.status === 10500 ||
          project.status === 10600 ||
          project.status === 10700 ||
          project.status === 10800 ? (
            <Button
              variant='contained'
              sx={{ width: '226px' }}
              onClick={onClick}
            >
              Restore this version
            </Button>
          ) : null}
        </Box>
      </Box>
    </Box>
  )
}

export default VersionHistoryModal

const CustomTap = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`
