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
import {
  useGetJobAssignProRequests,
  useGetJobInfo,
  useGetJobPrices,
} from '@src/queries/order/job.query'
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
import { JobType } from '@src/types/common/item.type'
import {
  JobAssignProRequestsType,
  JobBulkRequestFormType,
  JobPricesDetailType,
  JobRequestFormType,
  jobPriceHistoryType,
} from '@src/types/jobs/jobs.type'
import select from '@src/@core/theme/overrides/select'
import useModal from '@src/hooks/useModal'
import CustomModalV2 from '@src/@core/components/common-modal/custom-modal-v2'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import RequestSummaryModal from './components/assign-pro/request-summary-modal'
import { UseQueryResult, useMutation, useQueryClient } from 'react-query'
import {
  createBulkRequestJobToPro,
  createRequestJobToPro,
  handleJobAssignStatus,
} from '@src/apis/jobs/job-detail.api'
import { displayCustomToast } from '@src/shared/utils/toast'

type MenuType = 'info' | 'prices' | 'assign' | 'history'

export type TabType = 'linguistTeam' | 'pro'

const JobDetail = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { openModal, closeModal } = useModal()
  const menuQuery = router.query.menu as MenuType
  const orderId = router.query.orderId as string
  const roundQuery = router.query.round as string | undefined
  const proId = router.query.proId as string | undefined

  const [jobDetail, setJobDetail] = useState<
    Array<{
      jobId: number
      jobInfo: JobType | undefined
      jobPrices: JobPricesDetailType | undefined
      jobAssign: JobAssignProRequestsType[]
    }>
  >([])

  const [selectedJobInfo, setSelectedJobInfo] = useState<{
    jobId: number
    jobInfo: JobType
    jobPrices: JobPricesDetailType
    jobAssign: JobAssignProRequestsType[]
  } | null>(null)

  const [selectedAssign, setSelectedAssign] =
    useState<JobAssignProRequestsType | null>(
      selectedJobInfo?.jobAssign[0] ?? null,
    )
  const [menu, setMenu] = useState<TabType>('linguistTeam')
  const [pastLinguistTeam, setPastLinguistTeam] = useState<{
    value: number
    label: string
  } | null>(null)

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
  const [addRoundMode, setAddRoundMode] = useState(false)
  const [addProsMode, setAddProsMode] = useState(false)
  const [assignProMode, setAssignProMode] = useState(false)

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

  const jobInfoList = (
    useGetJobInfo(jobId, false) as UseQueryResult<JobType, unknown>[]
  ).map(value => value.data)
  const jobPriceList = (
    useGetJobPrices(jobId, false) as UseQueryResult<
      JobPricesDetailType | jobPriceHistoryType,
      unknown
    >[]
  ).map(value => value.data)
  const jobAssignList = (
    useGetJobAssignProRequests(jobId) as UseQueryResult<
      {
        requests: JobAssignProRequestsType[]
        id: number
      },
      unknown
    >[]
  ).map(value => value.data)

  const { data: serviceTypeList } = useGetServiceType()
  const { data: clientList } = useGetSimpleClientList()
  const { data: proList, isLoading } = useGetProList(activeFilter)

  console.log(value, 'value')

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
    if (!selectedJobInfo || !serviceTypeList || !clientList) return null

    const serviceTypeId = serviceTypeList.find(
      value => value.label === selectedJobInfo.jobInfo.serviceType,
    )?.value
    const defaultLinguistTeam = linguistTeamList.find(
      i =>
        i.client === selectedJobInfo.jobInfo.clientId &&
        i.serviceType === serviceTypeId &&
        i.sourceLanguage === selectedJobInfo.jobInfo.sourceLanguage &&
        i.targetLanguage === selectedJobInfo.jobInfo.targetLanguage,
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

  const createRequestMutation = useMutation(
    (data: JobRequestFormType) => createRequestJobToPro(data),
    {
      onSuccess: () => {
        displayCustomToast('Requested successfully', 'success')
        setSelectionModel({})
        setSelectedRows({})
        setSelectedLinguistTeam(null)

        // queryClient.invalidateQueries('jobRequest')
      },
    },
  )

  const createBulkRequestMutation = useMutation(
    (data: JobBulkRequestFormType) => createBulkRequestJobToPro(data),
    {
      onSuccess: () => {
        displayCustomToast('Requested successfully', 'success')
        setSelectionModel({})
        setSelectedRows({})
        setSelectedLinguistTeam(null)
      },
    },
  )

  const assignJobMutation = useMutation(
    (data: { jobId: number; proId: number; status: number }) =>
      handleJobAssignStatus(data.jobId, data.proId, data.status, 'lpm'),
    {
      onSuccess: (data, variables) => {
        closeModal('AssignProModal')
        displayCustomToast('Assigned successfully', 'success')
        queryClient.invalidateQueries(['jobInfo'])
        queryClient.invalidateQueries(['jobPrices'])
        queryClient.invalidateQueries(['jobAssignProRequests'])
      },
    },
  )

  const onSearch = () => {
    setActiveFilter({
      ...filter,
      skip: filter.skip * activeFilter.take,
      take: activeFilter.take,
    })
  }

  const handleRequest = (
    selectedRequestOption: number,
    requestTerm: number | null,
    selectedProList: ProListType[],
    existingProsLength: number,
  ) => {
    closeModal('RequestModal')

    if (selectedRequestOption === 0) {
      const result: JobRequestFormType = {
        type:
          selectedRequestOption === 0
            ? 'relayRequest'
            : selectedRequestOption === 1
              ? 'bulkAutoAssign'
              : 'bulkManualAssign',
        interval: requestTerm ?? undefined,

        pros: selectedProList.map((value, index) => {
          return {
            userId: value.userId,
            order: index + 1 + existingProsLength,
          }
        }),
        round: (selectedJobInfo?.jobAssign.length ?? 0) + 1,
        jobId: selectedJobInfo?.jobInfo.id!,
      }
      createRequestMutation.mutate(result)
      //TODO 수정 API 요청
    } else {
      const result: JobBulkRequestFormType = {
        requestType:
          selectedRequestOption === 0
            ? 'relayRequest'
            : selectedRequestOption === 1
              ? 'bulkAutoAssign'
              : 'bulkManualAssign',
        remindTime: requestTerm ?? undefined,
        proIds: selectedProList.map(value => value.userId),
        jobId: selectedJobInfo?.jobInfo.id!,
      }

      createBulkRequestMutation.mutate(result)
    }
  }

  const onClickRequest = () => {
    openModal({
      type: 'RequestModal',
      children: (
        <RequestSummaryModal
          onClick={handleRequest}
          onClose={() => closeModal('RequestModal')}
          selectedPros={Object.values(selectedRows)
            .map(value => value.data)
            .flat()}
          existingPros={
            selectedJobInfo?.jobAssign.find(
              value => value.round === selectedAssign?.round,
            ) ?? null
          }
          type={addProsMode ? 'add' : 'create'}
        />
      ),
      isCloseable: true,
    })
  }

  const onClickAssign = (selectedRows: {
    [key: string]: {
      data: Array<ProListType>
      isPrivate?: boolean | undefined
      isPrioritized?: boolean | undefined
    }
  }) => {
    const pro = Object.values(selectedRows)[0].data[0]
    const isOngoingRequest = selectedJobInfo?.jobAssign.filter(job =>
      job.pros.every(pro => pro.assignmentStatus !== 70300),
    )
    if (isOngoingRequest && isOngoingRequest.length > 0) {
      openModal({
        type: 'AssignModal',
        children: (
          <CustomModalV2
            onClick={() => closeModal('AssignModal')}
            onClose={() => closeModal('AssignModal')}
            title='Assign Pro?'
            subtitle={
              <>
                Are you sure you want to assign{' '}
                <Typography color='#666CFF' fontSize={16} fontWeight={600}>
                  {getLegalName({
                    firstName: pro.firstName,
                    middleName: pro.middleName,
                    lastName: pro.lastName,
                  })}
                </Typography>{' '}
                to this job? Other request(s) will be terminated.
              </>
            }
            vary='successful'
            rightButtonText='Assign'
          />
        ),
      })
    } else {
      openModal({
        type: 'AssignModal',
        children: (
          <CustomModalV2
            onClick={() => closeModal('AssignModal')}
            onClose={() => closeModal('AssignModal')}
            title='Assign Pro?'
            subtitle={
              <>
                Are you sure you want to assign{' '}
                <Typography color='#666CFF' fontSize={16} fontWeight={600}>
                  {getLegalName({
                    firstName: pro.firstName,
                    middleName: pro.middleName,
                    lastName: pro.lastName,
                  })}
                </Typography>{' '}
                to this job?
              </>
            }
            vary='successful'
            rightButtonText='Assign'
          />
        ),
      })
    }
  }

  useEffect(() => {
    if (!router.isReady) return
    const ids = router.query.jobId
    console.log(ids)

    if (!ids) return
    if (typeof ids === 'string') {
      setJobId([Number(ids)])
    } else {
      setJobId(ids.map(id => Number(id)))
    }
  }, [router, menuQuery])

  useEffect(() => {
    if (
      menuQuery &&
      ['info', 'prices', 'assign', 'history'].includes(menuQuery)
    ) {
      setValue(menuQuery)
    }
  }, [menuQuery])

  useEffect(() => {
    console.log(jobAssignList)

    if (
      jobInfoList.includes(undefined) ||
      jobPriceList.includes(undefined) ||
      jobAssignList.includes(undefined)
    )
      return
    const combinedList = jobInfoList.map(jobInfo => {
      const jobPrices = jobPriceList.find(price => price!.id === jobInfo!.id)
      const jobAssign = jobAssignList.find(assign => assign!.id === jobInfo!.id)
      return {
        jobInfo: jobInfo!,
        jobPrices: jobPrices!,
        jobId: jobInfo!.id,
        jobAssign: jobAssign?.requests!,
      }
    })
    if (JSON.stringify(combinedList) !== JSON.stringify(jobDetail)) {
      setJobDetail(combinedList)
      setSelectedJobInfo(combinedList[0])
    }
  }, [jobInfoList, jobPriceList, jobAssignList])

  useEffect(() => {
    if (roundQuery && selectedJobInfo) {
      setSelectedAssign(
        selectedJobInfo.jobAssign.find(
          assign => assign.round === Number(roundQuery),
        ) ?? null,
      )
    }
  }, [roundQuery, selectedJobInfo])

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
                onClick={() => {
                  if (addRoundMode) {
                    setAddRoundMode(false)
                    return
                  } else if (addProsMode) {
                    setAddProsMode(false)
                    return
                  } else if (assignProMode) {
                    setAssignProMode(false)
                    return
                  }
                  router.push({
                    pathname: '/orders/job-list/details/',
                    query:
                      jobId.length === 1
                        ? {
                            orderId: orderId,
                            jobId: jobId[0],
                          }
                        : {
                            orderId: orderId,
                          },
                  })
                }}
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
              {jobDetail.map((value, index) => {
                return (
                  <Box
                    key={index}
                    sx={{
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      cursor: 'pointer',
                      background:
                        value.jobId === selectedJobInfo?.jobInfo.id
                          ? 'rgba(76, 78, 100, 0.05)'
                          : 'inherit',
                    }}
                    onClick={() => {
                      setSelectedJobInfo({
                        jobId: value.jobId,
                        jobInfo: value.jobInfo!,
                        jobPrices: value.jobPrices!,
                        jobAssign: value.jobAssign!,
                      })
                      setValue('info')
                    }}
                  >
                    <Typography fontSize={14}>
                      {value?.jobInfo?.corporationId}
                    </Typography>
                    <ServiceTypeChip label={value?.jobInfo?.serviceType} />
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Grid>

        <Grid
          item
          xs={
            (selectedJobInfo &&
              (selectedJobInfo.jobInfo.name === null ||
                selectedJobInfo.jobPrices.priceId === null)) ||
            (selectedJobInfo?.jobAssign &&
              selectedJobInfo?.jobAssign.length > 0 &&
              !addRoundMode &&
              !addProsMode &&
              !assignProMode)
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
            {selectedJobInfo && (
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
                  {selectedJobInfo &&
                  (selectedJobInfo.jobInfo.name === null ||
                    selectedJobInfo.jobPrices.priceId === null) ? (
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
                          {!selectedJobInfo.jobInfo.name
                            ? 'Fill out job info'
                            : !selectedJobInfo.jobPrices.priceId
                              ? 'Fill out prices'
                              : 'Fill out job info'}
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <AssignPro
                      jobInfo={selectedJobInfo?.jobInfo!}
                      jobAssign={selectedJobInfo?.jobAssign!}
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
                      onSearch={onSearch}
                      roundQuery={roundQuery}
                      proId={proId}
                      addRoundMode={addRoundMode}
                      setAddRoundMode={setAddRoundMode}
                      addProsMode={addProsMode}
                      setAddProsMode={setAddProsMode}
                      assignProMode={assignProMode}
                      setAssignProMode={setAssignProMode}
                      selectedAssign={selectedAssign}
                      setSelectedAssign={setSelectedAssign}
                      assignJobMutation={assignJobMutation}
                    />
                  )}
                </TabPanel>
                <TabPanel value='history' sx={{ height: '100%' }}>
                  123123
                </TabPanel>
              </TabContext>
            )}
          </Box>
        </Grid>
        {selectedJobInfo &&
        (selectedJobInfo.jobInfo.name === null ||
          selectedJobInfo.jobPrices.priceId === null) ? null : (
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
                  minHeight: '64px',
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

                    flexDirection: 'column',
                  }}
                >
                  <Typography
                    sx={{ padding: '20px' }}
                    fontSize={14}
                    fontWeight={600}
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
                  {assignProMode ? null : (
                    <Button
                      variant={addProsMode ? 'contained' : 'outlined'}
                      onClick={onClickRequest}
                    >
                      Request
                    </Button>
                  )}

                  {addProsMode ? (
                    <Button
                      variant='outlined'
                      onClick={() => {
                        setAddProsMode(false)
                        setAssignProMode(false)
                        setSelectionModel({})
                        setSelectedRows({})
                        setSelectedLinguistTeam(null)
                      }}
                    >
                      Cancel
                    </Button>
                  ) : (
                    <Button
                      variant={assignProMode ? 'contained' : 'outlined'}
                      disabled={
                        Object.values(selectedRows).reduce(
                          (sum, array) => sum + array.data.length,
                          0,
                        ) !== 1
                      }
                      onClick={() => {
                        onClickAssign(selectedRows)
                      }}
                    >
                      Assign
                    </Button>
                  )}
                  {assignProMode ? (
                    <Button
                      variant='outlined'
                      onClick={() => {
                        setAssignProMode(false)
                        setSelectionModel({})
                        setSelectedRows({})
                        setSelectedLinguistTeam(null)
                      }}
                    >
                      Cancel
                    </Button>
                  ) : null}
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
