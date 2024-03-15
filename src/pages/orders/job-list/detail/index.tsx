import { Icon } from '@iconify/react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Tab,
  Typography,
  styled,
} from '@mui/material'
import { ServiceTypeChip } from '@src/@core/components/chips/chips'
import { useGetJobInfo, useGetJobPrices } from '@src/queries/order/job.query'
import Image from 'next/image'
import { useRouter } from 'next/router'
import {
  useEffect,
  useState,
  MouseEvent,
  SyntheticEvent,
  useMemo,
  Dispatch,
  SetStateAction,
} from 'react'
import AssignPro from './components/assign-pro'
import {
  useGetServiceType,
  useGetSimpleClientList,
} from '@src/queries/common.query'
import { ProListType } from '@src/types/pro/list'
import { v4 as uuidv4 } from 'uuid'
import LegalNameEmail from '@src/pages/onboarding/components/list/list-item/legalname-email'
import { GridSelectionModel } from '@mui/x-data-grid'
import {
  useGetLinguistTeam,
  useGetLinguistTeamDetail,
} from '@src/queries/pro/linguist-team'
import { hexToRGBA } from '@src/@core/utils/hex-to-rgba'
import { useGetProList } from '@src/queries/pro/pro-list.query'
import { LinguistTeamProListFilterType } from '@src/types/pro/linguist-team'
import { getGloLanguage } from '@src/shared/transformer/language.transformer'

type MenuType = 'info' | 'prices' | 'assign' | 'history'

export type TabType = 'linguistTeam' | 'pro'

const JobDetail = () => {
  const router = useRouter()
  const menuQuery = router.query.menu as MenuType
  const [menu, setMenu] = useState<TabType>('linguistTeam')
  const [pastLinguistTeam, setPastLinguistTeam] = useState<{
    value: number
    label: string
  } | null>(null)
  // const [proPage, setProPage] = useState(0)
  // const [proPageSize, setProPageSize] = useState(10)

  const [filter, setFilter] = useState<LinguistTeamProListFilterType>({
    sourceLanguage: [],
    targetLanguage: [],
    status: [],
    clientId: [],
    take: 10,
    skip: 0,
    genre: [],
    serviceTypeId: [],
    category: [],
    hide: '1',
  })

  const [activeFilter, setActiveFilter] =
    useState<LinguistTeamProListFilterType>({
      sourceLanguage: [],
      targetLanguage: [],
      status: [],
      clientId: [],
      take: 10,
      skip: 0,
      genre: [],
      serviceTypeId: [],
      category: [],
      hide: '1',
    })

  // const jobId = router.query.jobId
  const [jobId, setJobId] = useState<number[]>([])
  const [value, setValue] = useState<MenuType>('info')
  const [selectionModel, setSelectionModel] = useState<{
    [key: string]: GridSelectionModel
  }>({})
  const [selectedRows, setSelectedRows] = useState<{
    [key: string]: {
      data: Array<ProListType>
      isPrivate?: boolean
      isPrioritized?: boolean
    }
  }>({})

  const languageList = getGloLanguage()
  const { data: jobInfo } = useGetJobInfo(Number(jobId), false)
  const { data: jobPrices } = useGetJobPrices(Number(jobId), false)
  const { data: serviceTypeList } = useGetServiceType()
  const { data: clientList } = useGetSimpleClientList()
  const { data: proList, isLoading } = useGetProList(activeFilter)

  console.log(proList)

  const { data: linguistTeam, isLoading: linguistTeamLoading } =
    useGetLinguistTeam({
      take: 1000,
      skip: 0,
    })

  const linguistTeamList = useMemo(
    () =>
      linguistTeam?.data?.map(i => ({
        label: i.name,
        value: i.id,
        client: i.clientId,
        serviceType: i.serviceTypeId,
        sourceLanguage: i.sourceLanguage,
        targetLanguage: i.targetLanguage,
        pros: i.pros,
      })) || [],
    [linguistTeam],
  )

  const handleChange = (event: SyntheticEvent, newValue: MenuType) => {
    setValue(newValue)
  }

  const getDefaultLinguistTeam = () => {
    if (!jobInfo || !serviceTypeList || !clientList) return null

    const serviceTypeId = serviceTypeList.find(
      value => value.label === jobInfo.serviceType,
    )?.value
    const defaultLinguistTeam = linguistTeamList.find(
      i =>
        i.client === jobInfo.clientId &&
        i.serviceType === serviceTypeId &&
        i.sourceLanguage === jobInfo.sourceLanguage &&
        i.targetLanguage === jobInfo.targetLanguage,
    )
    if (defaultLinguistTeam) {
      return {
        value: defaultLinguistTeam.value,
        label: defaultLinguistTeam.label,
      }
    }
    return null
  }

  const [selectedLinguistTeam, setSelectedLinguistTeam] = useState<{
    value: number
    label: string
  } | null>(getDefaultLinguistTeam())

  const { data: detail } = useGetLinguistTeamDetail(
    selectedLinguistTeam?.value || 0,
  )

  useEffect(() => {
    if (
      menuQuery &&
      ['info', 'prices', 'assign', 'history'].includes(menuQuery)
    ) {
      setValue(menuQuery)
    }
  }, [menuQuery])

  useEffect(() => {
    if (!router.isReady) return
    const ids = router.query.jobId
    if (!ids) return
    if (typeof ids === 'string') {
      setJobId([Number(ids)])
    } else {
      setJobId(ids.map(id => Number(id)))
    }
  }, [router])

  console.log(selectionModel)

  return (
    <Card sx={{ height: '100%' }}>
      <Grid container sx={{ height: '100%' }}>
        <Grid item xs={1.584} sx={{ height: '100%' }}>
          <Box
            sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <Box
              sx={{
                padding: '20px',
                height: '64px',
                borderBottom: '1px solid rgba(76, 78, 100, 0.12)',
              }}
            >
              <IconButton
                sx={{
                  padding: '0 !important',
                  height: '24px',
                }}
                onClick={() => router.push('/orders/order-list')}
              >
                <Icon icon='mdi:chevron-left' width={24} height={24} />
              </IconButton>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',

                height: '100%',
                borderRight: '1px solid rgba(76, 78, 100, 0.12)',
              }}
            >
              {Array.from({ length: 5 }).map((_, index) => {
                return (
                  <Box
                    key={index}
                    sx={{
                      padding: '20px',
                    }}
                  >
                    <Typography fontSize={14}>TRA-00{index}</Typography>
                    <ServiceTypeChip label='Audio Description' />
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={
            jobInfo &&
            jobPrices &&
            (jobInfo.name === null || jobPrices.priceId === null)
              ? 10.416
              : 7.632
          }
          sx={{ height: '100%' }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              borderRight: '1px solid rgba(76, 78, 100, 0.12)',
            }}
          >
            <TabContext value={value}>
              <TabList
                onChange={handleChange}
                aria-label='Order detail Tab menu'
                sx={{
                  minHeight: '64px',
                  height: '64px',
                  paddingLeft: '20px',
                  borderBottom: '1px solid rgba(76, 78, 100, 0.12)',
                  display: 'flex',
                  alignItems: 'end',
                }}
              >
                <CustomTab
                  value='info'
                  label='Job info'
                  iconPosition='start'
                  icon={
                    <Icon icon='iconoir:large-suitcase' fontSize={'18px'} />
                  }
                  onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                />

                <CustomTab
                  value='prices'
                  label='Prices'
                  iconPosition='start'
                  icon={<Icon icon='mdi:dollar' fontSize={'18px'} />}
                  onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                />
                <CustomTab
                  value='assign'
                  label='Assign pro'
                  iconPosition='start'
                  icon={<Icon icon='mdi:account-outline' fontSize={'18px'} />}
                  onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                />

                <CustomTab
                  value='history'
                  label='Request history'
                  iconPosition='start'
                  icon={<Icon icon='ic:outline-history' fontSize={'18px'} />}
                  onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                />
              </TabList>
              <TabPanel value='info' sx={{ height: '100%' }}>
                123
              </TabPanel>
              <TabPanel value='prices' sx={{ height: '100%' }}>
                123
              </TabPanel>
              <TabPanel value='assign' sx={{ height: '100%', padding: 0 }}>
                {jobInfo &&
                jobPrices &&
                (jobInfo.name === null || jobPrices.priceId === null) ? (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <Image
                        src='/images/icons/job-icons/required-lock.png'
                        alt='lock'
                        width={150}
                        height={150}
                        quality={100}
                      />
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          mt: '10px',
                        }}
                      >
                        <Typography fontSize={20} fontWeight={500}>
                          Unfilled required field exists
                        </Typography>
                        <Typography fontSize={16} color='#8D8E9A'>
                          Please enter all required fields first
                        </Typography>
                      </Box>
                      <Button variant='contained' sx={{ mt: '32px' }}>
                        {!jobInfo.name
                          ? 'Fill out job info'
                          : !jobPrices.priceId
                            ? 'Fill out prices'
                            : 'Fill out job info'}
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <AssignPro
                    jobInfo={jobInfo!}
                    serviceTypeList={serviceTypeList || []}
                    clientList={clientList || []}
                    setSelectedRows={setSelectedRows}
                    selectedRows={selectedRows}
                    selectionModel={selectionModel}
                    setSelectionModel={setSelectionModel}
                    isLoading={linguistTeamLoading}
                    linguistTeamList={linguistTeamList}
                    selectedLinguistTeam={selectedLinguistTeam}
                    detail={detail!}
                    setSelectedLinguistTeam={setSelectedLinguistTeam}
                    menu={menu}
                    setMenu={setMenu}
                    filter={filter}
                    activeFilter={activeFilter}
                    setFilter={setFilter}
                    setActiveFilter={setActiveFilter}
                    proList={proList || { data: [], totalCount: 0 }}
                    setPastLinguistTeam={setPastLinguistTeam}
                    pastLinguistTeam={pastLinguistTeam}
                    languageList={languageList}
                  />
                )}
              </TabPanel>
              <TabPanel value='history' sx={{ height: '100%' }}>
                123123
              </TabPanel>
            </TabContext>
          </Box>
        </Grid>
        {jobInfo &&
        jobPrices &&
        (jobInfo.name === null || jobPrices.priceId === null) ? null : (
          <Grid item xs={2.784} sx={{}}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                position: 'relative',

                paddingBottom: '156px',
              }}
            >
              <Box
                sx={{
                  padding: '20px',
                  height: '64px',
                  borderBottom: '1px solid rgba(76, 78, 100, 0.12)',
                }}
              ></Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',

                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',

                    // height: '100%',
                    // maxHeight: 'calc(100% - 156px)',
                    flexDirection: 'column',
                  }}
                >
                  <Typography
                    sx={{ padding: '20px' }}
                    fontSize={14}
                    fontWeight={500}
                  >
                    Selected Pros (
                    {Object.values(selectedRows).reduce(
                      (sum, array) => sum + array.data.length,
                      0,
                    )}
                    )
                  </Typography>
                  <Box
                    sx={{
                      overflowY: 'scroll',
                      maxHeight: 'calc(85vh - 210px)',
                      height: '100%',
                      '&::-webkit-scrollbar': {
                        width: 6,
                      },
                      '&::-webkit-scrollbar-thumb': {
                        borderRadius: 20,
                        background: hexToRGBA('#57596C', 0.6),
                      },
                      '&::-webkit-scrollbar-track': {
                        borderRadius: 20,
                        background: 'transparent',
                      },
                    }}
                  >
                    {Object.keys(selectedRows).map((key, index) => (
                      <Box key={uuidv4()}>
                        {selectedRows[key].data.length === 0 ? null : (
                          <Box
                            sx={{
                              display: 'flex',
                              padding: '8px 16px 8px 20px',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                gap: '8px',
                                alignItems: 'center',
                              }}
                            >
                              {selectedRows[key].isPrivate ? (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 20,
                                    height: 20,
                                    borderRadius: '5px',
                                    background: '#F7F7F9',
                                  }}
                                >
                                  <Icon icon='mdi:lock' color='#8D8E9A' />
                                </Box>
                              ) : null}
                              <Typography
                                fontSize={12}
                                fontWeight={400}
                                color='#8D8E9A'
                                sx={{
                                  width: '100%',
                                  maxWidth: '210px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {key}
                              </Typography>
                            </Box>
                            <IconButton
                              sx={{ padding: 0 }}
                              onClick={() => {
                                const newSelectedRows = { ...selectedRows }

                                delete newSelectedRows[key]
                                setSelectedRows(newSelectedRows)
                                setSelectionModel(prev => {
                                  const newState = { ...prev }
                                  delete newState[
                                    selectedLinguistTeam?.label || ''
                                  ]
                                  return newState
                                })
                                // setSelectionModel(prev => {
                                //   return prev.filter(
                                //     value => !removeRow.includes(Number(value)),
                                //   )
                                // })
                              }}
                            >
                              <Icon
                                icon='mdi:close'
                                color='#8D8E9A'
                                fontSize={20}
                              />
                            </IconButton>
                          </Box>
                        )}

                        {selectedRows[key].data.map((pro, index) => (
                          <Box
                            key={uuidv4()}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Box sx={{ display: 'flex' }}>
                              {selectedRows[key].isPrioritized ? (
                                <Typography
                                  fontSize={14}
                                  fontWeight={600}
                                  sx={{
                                    padding: '16px 16px 16px 20px',
                                  }}
                                >
                                  {pro.order}
                                  {/* {index + 1} */}
                                </Typography>
                              ) : null}
                              <Box
                                sx={{
                                  display: 'flex',
                                  maxWidth: selectedRows[key].isPrioritized
                                    ? '210px'
                                    : '250px',
                                  padding: selectedRows[key].isPrioritized
                                    ? 'inherit'
                                    : '0 0 0 20px',
                                }}
                              >
                                <LegalNameEmail
                                  row={{
                                    isOnboarded: pro.isOnboarded,
                                    isActive: pro.isActive,

                                    firstName: pro.firstName,
                                    middleName: pro.middleName,
                                    lastName: pro.lastName,
                                    email: pro.email,
                                  }}
                                />
                              </Box>
                            </Box>
                            <Box
                              sx={{
                                display: 'flex',

                                width: '40px',
                                height: '100%',
                                padding: '16px 20px 16px 4px',
                              }}
                            >
                              <IconButton
                                sx={{ padding: 0 }}
                                onClick={() => {
                                  const newSelectedRows = { ...selectedRows }
                                  newSelectedRows[key].data.splice(index, 1)
                                  setSelectedRows(newSelectedRows)
                                  setSelectionModel(prev => {
                                    const newState = { ...prev }
                                    newState[
                                      selectedLinguistTeam?.label || ''
                                    ] = prev[
                                      selectedLinguistTeam?.label || ''
                                    ]?.filter(value => value !== pro.userId)
                                    return newState
                                  })
                                }}
                              >
                                <Icon
                                  icon='mdi:close'
                                  color='#8D8E9A'
                                  fontSize={20}
                                />
                              </IconButton>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box
                  sx={{
                    padding: '32px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    height: '156px',
                    // flex: 1,
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                    // position: 'relative',
                    // transform: 'translateY(-100%)',
                    // position: 'absolute',
                    // bottom: 0,
                  }}
                >
                  <Button variant='outlined'>Request</Button>
                  <Button variant='contained'>Assign</Button>
                </Box>
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>
    </Card>
  )
}

export default JobDetail

JobDetail.acl = {
  subject: 'job_list',
  action: 'read',
}

const CustomTab = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`
