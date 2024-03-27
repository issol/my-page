import { Icon } from '@iconify/react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Tab,
  TextField,
  Typography,
  styled,
} from '@mui/material'
import { ServiceTypeChip } from '@src/@core/components/chips/chips'
import {
  useGetAssignableProList,
  useGetJobAssignProRequests,
  useGetJobDetails,
  useGetJobInfo,
  useGetJobPriceHistory,
  useGetJobPrices,
  useGetSourceFile,
} from '@src/queries/order/job.query'
import Image from 'next/image'
import { useRouter } from 'next/router'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import {
  useEffect,
  useState,
  MouseEvent,
  SyntheticEvent,
  useMemo,
  Dispatch,
  SetStateAction,
  useRef,
  useContext,
} from 'react'
import AssignPro from './components/assign-pro'
import {
  useGetServiceType,
  useGetSimpleClientList,
  useGetStatusList,
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
import { ItemType, JobType } from '@src/types/common/item.type'
import {
  JobAddProsFormType,
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
  addJobFeedback,
  addProCurrentRequest,
  createBulkRequestJobToPro,
  createRequestJobToPro,
  forceAssign,
  getAssignableProList,
  handleJobAssignStatus,
  handleJobReAssign,
  requestRedelivery,
  saveJobPrices,
  setJobStatus,
} from '@src/apis/jobs/job-detail.api'
import { displayCustomToast } from '@src/shared/utils/toast'
import JobInfo from './components/info'
import {
  AssignProFilterPostType,
  AssignProListType,
  SaveJobPricesParamsType,
} from '@src/types/orders/job-detail'
import {
  useGetLangItem,
  useGetProjectInfo,
  useGetProjectTeam,
} from '@src/queries/order/order.query'
import FileItem from '@src/@core/components/fileItem'
import { FileType } from '@src/types/common/file.type'
import { S3FileType } from '@src/shared/const/signedURLFileType'
import {
  DownloadAllFiles,
  DownloadFile,
} from '@src/shared/helpers/downlaod-file'
import { byteToGB, formatFileSize } from '@src/shared/helpers/file-size.helper'
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'

import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { timezoneSelector } from '@src/states/permission'
import { useGetProJobDeliveriesFeedbacks } from '@src/queries/jobs/jobs.query'

import { ReasonType } from '@src/types/quotes/quote'
import { RequestRedeliveryReason } from '@src/shared/const/reason/reason'
import SelectRequestRedeliveryReasonModal from './components/info/request-redelivery-modal'
import SourceFileUpload from './components/info/source-file'
import Chip from '@src/@core/components/mui/chip'
import { FormErrors } from '@src/shared/const/formErrors'
import EditPrices from './components/prices/edit-prices'
import ViewPrices from './components/prices/view-prices'
import { useGetAllClientPriceList } from '@src/queries/price-units.query'
import { Resolver, useFieldArray, useForm } from 'react-hook-form'
import { languageType } from '../../add-new'
import { yupResolver } from '@hookform/resolvers/yup'
import { jobItemSchema } from '@src/types/schema/item.schema'
import { useGetProPriceList } from '@src/queries/company/standard-price'
import toast from 'react-hot-toast'
import { job_list } from '@src/shared/const/permission-class'
import { AbilityContext } from '@src/layouts/components/acl/Can'

type MenuType = 'info' | 'prices' | 'assign' | 'history'

export type TabType = 'linguistTeam' | 'pro'

const JobDetail = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const MAXIMUM_FILE_SIZE = FILE_SIZE.JOB_SAMPLE_FILE
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)
  const ability = useContext(AbilityContext)

  const { openModal, closeModal } = useModal()
  const menuQuery = router.query.menu as MenuType
  const orderId = router.query.orderId as string
  const roundQuery = router.query.round as string | undefined
  const proId = router.query.proId as string | undefined
  const selectedJobId = router.query.selectedJobId as string

  const [jobDetail, setJobDetail] = useState<
    Array<{
      jobId: number
      jobInfo: JobType | undefined
      jobPrices: JobPricesDetailType | undefined
      jobAssign: JobAssignProRequestsType[]
      jobAssignDefaultRound: number
    }>
  >([])

  const [selectedJobInfo, setSelectedJobInfo] = useState<{
    jobId: number
    jobInfo: JobType
    jobPrices: JobPricesDetailType
    jobAssign: JobAssignProRequestsType[]
    jobAssignDefaultRound: number
  } | null>(null)

  const [selectedAssign, setSelectedAssign] =
    useState<JobAssignProRequestsType | null>(
      selectedJobInfo?.jobAssign[0] ?? null,
    )

  console.log(selectedAssign, 'selectedAssign')

  const [menu, setMenu] = useState<TabType>('linguistTeam')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [pastLinguistTeam, setPastLinguistTeam] = useState<{
    value: number
    label: string
  } | null>(null)

  const [filter, setFilter] = useState<AssignProFilterPostType>({
    source: [],
    target: [],

    client: [],
    take: 10,
    skip: 0,
    genre: [],
    serviceType: [],
    category: [],
    isOffBoard: '1',
  })

  const [activeFilter, setActiveFilter] = useState<AssignProFilterPostType>({
    source: [],
    target: [],

    client: [],
    take: 10,
    skip: 0,
    genre: [],
    serviceType: [],
    category: [],
    isOffBoard: '1',
  })

  // const jobId = router.query.jobId
  const [jobId, setJobId] = useState<number[]>([])
  const [value, setValue] = useState<MenuType>('info')
  const [addRoundMode, setAddRoundMode] = useState(false)
  const [addProsMode, setAddProsMode] = useState(false)
  const [assignProMode, setAssignProMode] = useState(false)
  const [expanded, setExpanded] = useState<string | false>(false)
  const [useJobFeedbackForm, setUseJobFeedbackForm] = useState(false)
  const [addJobFeedbackData, setAddJobFeedbackData] = useState<string | null>(
    '',
  )
  const [priceId, setPriceId] = useState<number | null>(null)
  const [editPrices, setEditPrices] = useState(false)

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const [selectionModel, setSelectionModel] = useState<{
    [key: string]: GridSelectionModel
  }>({})
  const [selectedRows, setSelectedRows] = useState<{
    [key: string]: {
      data: Array<ProListType | AssignProListType>
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
        frontRound: number
      },
      unknown
    >[]
  ).map(value => value.data)

  const { data: jobStatusList } = useGetStatusList('Job')
  const { data: serviceTypeList } = useGetServiceType()
  const { data: clientList } = useGetSimpleClientList()
  const { data: proList } = useGetAssignableProList(
    selectedJobInfo?.jobId!,
    activeFilter,
    false,
  )
  const {
    data: prices,
    refetch: pricesRefetch,
    isSuccess,
  } = useGetProPriceList({})

  const { data: priceUnitsList } = useGetAllClientPriceList()
  const { data: projectTeam } = useGetProjectTeam(Number(orderId))
  const { data: jobDetails, refetch: jobDetailsRefetch } = useGetJobDetails(
    Number(orderId),
    true,
  )
  const { data: langItem, refetch: langItemRefetch } = useGetLangItem(
    Number(orderId),
  )
  const {
    data: sourceFileList,
    isLoading,
    refetch: refetchSourceFileList,
  } = useGetSourceFile(selectedJobInfo?.jobId!)

  const {
    data: jobDeliveriesFeedbacks,
    isLoading: isJobDeliveriesFeedbacksLoading,
    refetch: jobDeliveriesFeedbacksRefetch,
  } = useGetProJobDeliveriesFeedbacks(selectedJobInfo?.jobId!)

  const { data: jobPriceHistory, isLoading: isJobPriceHistoryLoading } =
    useGetJobPriceHistory(selectedJobInfo?.jobId!)

  const {
    data: linguistTeam,
    refetch: linguistTeamRefetch,
    isLoading: linguistTeamLoading,
  } = useGetLinguistTeam({
    take: 1000,
    skip: 0,
  })

  // 페이지가 처음 로딩될때 필요한 데이터를 모두 리패치 한다
  useEffect(() => {
    pricesRefetch()
    langItemRefetch()
    jobDetailsRefetch()
    linguistTeamRefetch()
  }, [])

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

  const {
    control: itemControl,
    getValues: getItem,
    setValue: setItem,
    trigger: itemTrigger,
    reset: itemReset,
    formState: { errors: itemErrors, isValid: itemValid },
  } = useForm<{ items: ItemType[]; languagePairs: languageType[] }>({
    mode: 'onBlur',
    defaultValues: { items: [], languagePairs: [] },
    resolver: yupResolver(jobItemSchema) as unknown as Resolver<{
      items: ItemType[]
      languagePairs: languageType[]
    }>,
    context: {
      priceId: priceId,
    },
  })

  const {
    fields: items,
    append: appendItems,
    remove: removeItems,
    update: updateItems,
  } = useFieldArray({
    control: itemControl,
    name: 'items',
  })

  const handleChange = (event: SyntheticEvent, newValue: MenuType) => {
    setAddRoundMode(false)
    setAddProsMode(false)
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

  console.log(router.asPath)

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
      onSuccess: (data, variables) => {
        setAddRoundMode(false)
        displayCustomToast('Requested successfully', 'success')
        setSelectionModel({})
        setSelectedRows({})
        setSelectedLinguistTeam(null)
        queryClient.invalidateQueries(['jobInfo', variables.jobId, false])
        queryClient.invalidateQueries(['jobPrices', variables.jobId, false])
        queryClient.invalidateQueries(['jobAssignProRequests', variables.jobId])

        // queryClient.invalidateQueries('jobRequest')
      },
    },
  )

  const createBulkRequestMutation = useMutation(
    (data: JobBulkRequestFormType) => createBulkRequestJobToPro(data),
    {
      onSuccess: (data, variables) => {
        setAddRoundMode(false)
        displayCustomToast('Requested successfully', 'success')
        setSelectionModel({})
        setSelectedRows({})
        setSelectedLinguistTeam(null)
        queryClient.invalidateQueries(['jobInfo', variables.jobId, false])
        queryClient.invalidateQueries(['jobPrices', variables.jobId, false])
        queryClient.invalidateQueries(['jobAssignProRequests', variables.jobId])
      },
    },
  )

  const assignJobMutation = useMutation(
    (data: {
      jobId: number
      proId: number
      status: number
      type: 'force' | 'normal'
    }) =>
      data.type === 'normal'
        ? handleJobAssignStatus(data.jobId, data.proId, data.status, 'lpm')
        : forceAssign(data.jobId, data.proId),
    {
      onSuccess: (data, variables) => {
        closeModal('AssignProModal')
        setAssignProMode(false)
        displayCustomToast('Assigned successfully', 'success')
        queryClient.invalidateQueries('jobAssignProRequests')
        queryClient.invalidateQueries('jobInfo')
        queryClient.invalidateQueries('jobPrices')
      },
    },
  )

  const reAssignJobMutation = useMutation(
    (data: { jobId: number }) => handleJobReAssign(data.jobId),
    {
      onSuccess: (data, variables) => {
        if (data.id === variables.jobId) {
          queryClient.invalidateQueries('jobAssignProRequests')
          queryClient.invalidateQueries('jobInfo')
          queryClient.invalidateQueries('jobPrices')
        } else {
          const path = router.asPath
          const newPath = path
            .replace(`jobId=${variables.jobId}`, `jobId=${data.id}`)
            .replace(
              `selectedJobId=${variables.jobId}`,
              `selectedJobId=${data.id}`,
            )
          router.push(newPath, undefined, {
            shallow: true,
          })

          setJobId(prev =>
            prev.map(id => (id === variables.jobId ? data.id : id)),
          )
        }
      },
    },
  )

  const addProCurrentRequestMutation = useMutation(
    (data: JobAddProsFormType) => addProCurrentRequest(data),
    {
      onSuccess: (data, variables) => {
        console.log(variables)

        setAddProsMode(false)
        displayCustomToast('Requested successfully', 'success')
        setSelectionModel({})
        setSelectedRows({})
        setSelectedLinguistTeam(null)
        queryClient.invalidateQueries(['jobInfo', variables.jobId, false])
        queryClient.invalidateQueries(['jobPrices', variables.jobId, false])
        queryClient.invalidateQueries(['jobAssignProRequests', variables.jobId])
      },
    },
  )

  const requestRedeliveryMutation = useMutation(
    (data: { jobId: number; deleteReason: string[]; message?: string }) =>
      requestRedelivery(data),
    {
      onSuccess: (data, variables) => {
        closeModal('RequestRedeliveryModal')
        queryClient.invalidateQueries(['jobInfo', variables.jobId, false])
        queryClient.invalidateQueries(['jobPrices', variables.jobId, false])
        queryClient.invalidateQueries(['jobAssignProRequests', variables.jobId])
      },
    },
  )

  const addJobFeedbackMutation = useMutation(
    (data: { jobId: number; data: string }) =>
      addJobFeedback(data.jobId, data.data),
    {
      onSuccess: (data, variables) => {
        if (data.job.id === variables.jobId) {
          queryClient.invalidateQueries(['jobInfo', variables.jobId, false])
          queryClient.invalidateQueries(['proJobDeliveries', variables.jobId])
          jobDetailsRefetch && jobDetailsRefetch()
        } else {
          setJobId(prev =>
            prev.map(id => (id === variables.jobId ? data.job.id : id)),
          )
        }
      },
    },
  )

  const saveJobPricesMutation = useMutation(
    (data: { jobId: number; prices: SaveJobPricesParamsType }) =>
      saveJobPrices(data.jobId, data.prices),
    {
      onSuccess: (data, variables) => {
        // toast.success('Job info added successfully', {
        //   position: 'bottom-left',
        // })

        if (data.id === variables.jobId) {
          displayCustomToast('Saved successfully', 'success')
          queryClient.invalidateQueries(['jobInfo', variables.jobId, false])
          queryClient.invalidateQueries(['jobPrices', variables.jobId, false])
        } else {
          const path = router.asPath
          const newPath = path
            .replace(`jobId=${variables.jobId}`, `jobId=${data.id}`)
            .replace(
              `selectedJobId=${variables.jobId}`,
              `selectedJobId=${data.id}`,
            )
          router.push(newPath, undefined, {
            shallow: true,
          })
          displayCustomToast('Saved successfully', 'success')
          setJobId(prev =>
            prev.map(id => (id === variables.jobId ? data.id : id)),
          )
        }
        setEditPrices(false)
      },
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
        setEditPrices(false)
      },
    },
  )

  const setJobStatusMutation = useMutation(
    (data: { jobId: number; status: number }) =>
      setJobStatus(data.jobId, data.status),
    {
      onSuccess: (data, variables) => {
        displayCustomToast('Saved successfully', 'success')
        queryClient.invalidateQueries(['jobInfo', variables.jobId, false])
        queryClient.invalidateQueries(['jobPrices', variables.jobId, false])
        queryClient.invalidateQueries(['jobAssignProRequests', variables.jobId])
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
    selectedProList: ProListType[] | AssignProListType[],
    existingProsLength: number,
    type: 'create' | 'add',
  ) => {
    closeModal('RequestModal')

    if (selectedRequestOption === 0) {
      if (type === 'create') {
        const createResult: JobRequestFormType = {
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
        createRequestMutation.mutate(createResult)
      } else {
        const addResult: JobAddProsFormType = {
          jobId: selectedJobInfo?.jobInfo.id!,
          round: selectedAssign?.round!,
          pros: selectedProList.map((value, index) => {
            return {
              userId: value.userId,
              order: index + 1 + existingProsLength,
            }
          }),
        }
        console.log(addResult)

        addProCurrentRequestMutation.mutate(addResult)
      }

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
          selectedPros={
            Object.values(selectedRows)
              .map(value => value.data)
              .flat() as ProListType[] | AssignProListType[]
          }
          existingPros={
            selectedJobInfo?.jobAssign.find(
              value => value.round === selectedAssign?.round,
            ) ?? null
          }
          type={addProsMode ? 'add' : 'create'}
          statusList={jobStatusList || []}
        />
      ),
      isCloseable: true,
    })
  }

  const onClickAssign = (selectedRows: {
    [key: string]: {
      data: Array<ProListType | AssignProListType>
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
            onClick={() => {
              assignJobMutation.mutate({
                jobId: selectedJobInfo?.jobInfo.id!,
                proId: pro.userId,
                status: 70300,
                type: 'force',
              })
              closeModal('AssignModal')
            }}
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
            onClick={() => {
              assignJobMutation.mutate({
                jobId: selectedJobInfo?.jobInfo.id!,
                proId: pro.userId,
                status: 70300,
                type: 'force',
              })
              closeModal('AssignModal')
            }}
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

  const fileList = (file: FileType[], type: string) => {
    return file.map((value: FileType) => {
      if (value.type === type) {
        return (
          <Box key={uuidv4()}>
            <FileItem
              key={value.name}
              file={value}
              onClick={() => DownloadFile(value, S3FileType.JOB)}
            />
          </Box>
        )
      }
    })
  }

  const getFileSize = (file: FileType[], type: string) => {
    const files = file.filter((file: FileType) => file.type === type)
    let size = 0
    files.forEach((file: FileType) => {
      size += file.size
    })

    return size
  }

  const onClickUploadSourceFile = () => {
    if (jobDetails) {
      openModal({
        type: 'UploadSourceFileModal',
        children: (
          <SourceFileUpload
            info={selectedJobInfo?.jobInfo.pro!}
            row={selectedJobInfo?.jobInfo!}
            item={
              jobDetails.items.find(item =>
                item.jobs.some(job => job.id === selectedJobInfo?.jobId),
              )!
            }
            refetch={jobDetailsRefetch!}
            statusList={jobStatusList!}
          />
        ),
      })
    }
  }

  const onClickRequestRedelivery = () => {
    openModal({
      type: 'RequestRedeliveryModal',
      children: (
        <SelectRequestRedeliveryReasonModal
          onClose={() => closeModal('RequestRedeliveryModal')}
          onClick={(deleteReason: string[], message?: string) =>
            requestRedeliveryMutation.mutate({
              jobId: selectedJobInfo?.jobInfo.id!,
              deleteReason,
              message,
            })
          }
        />
      ),
    })
  }

  const onClickDiscardFeedback = () => {
    if (addJobFeedbackData === '' || addJobFeedbackData === null) {
      setAddJobFeedbackData('')
      setUseJobFeedbackForm(false)
      return
    }
    openModal({
      type: 'DiscardFeedbackModal',
      children: (
        <CustomModalV2
          title='Discard feedback?'
          subtitle={'Are you sure you want to discard this feedback?'}
          vary='error-alert'
          rightButtonText='Discard'
          onClick={() => {
            setAddJobFeedbackData('')
            setUseJobFeedbackForm(false)
            closeModal('DiscardFeedbackModal')
          }}
          onClose={() => closeModal('DiscardFeedbackModal')}
        />
      ),
    })
  }

  const onClickAddFeedback = () => {
    if (addJobFeedbackData === '') {
      setAddJobFeedbackData(null)
      return
    }
    openModal({
      type: 'AddFeedbackModal',
      children: (
        <CustomModalV2
          title='Add feedback?'
          subtitle={
            'Are you sure you want to add this feedback? It will be delivered to the Pro as well.'
          }
          vary='successful'
          rightButtonText='Add'
          onClick={() => {
            closeModal('DiscardFeedbackModal')
            addJobFeedbackMutation.mutate(
              {
                jobId: selectedJobInfo?.jobId!,
                data: addJobFeedbackData!,
              },
              {
                onSuccess: () => {
                  setAddJobFeedbackData('')
                  setUseJobFeedbackForm(false)
                },
              },
            )
          }}
          onClose={() => closeModal('AddFeedbackModal')}
        />
      ),
    })
  }

  const onSubmit = () => {
    const data = getItem(`items.${0}`)

    // toast('Job info added successfully')

    const res: SaveJobPricesParamsType = {
      jobId: selectedJobInfo?.jobId!,
      priceId: data.priceId!,
      totalPrice: data.totalPrice,
      currency: data.detail![0].currency,
      detail: data.detail!,
    }
    saveJobPricesMutation.mutate({ jobId: res.jobId, prices: res })
  }

  console.log(selectedJobInfo, 'selectedJob')

  const onClickUpdatePrice = () => {
    openModal({
      type: 'UpdatePriceModal',
      children: (
        <CustomModalV2
          onClose={() => closeModal('UpdatePriceModal')}
          title='Save all changes?'
          subtitle='Are you sure you want to save all changes? The notification will be sent to Pro after the change.'
          vary='successful'
          rightButtonText='Save'
          onClick={() => {
            closeModal('UpdatePriceModal')
            onSubmit()
          }}
        />
      ),
    })
  }

  const onClickUpdatePriceCancel = () => {
    openModal({
      type: 'UpdatePriceCancelModal',
      children: (
        <CustomModalV2
          onClose={() => closeModal('UpdatePriceCancelModal')}
          title='Discard all changes?'
          subtitle='Are you sure you want to discard all changes?'
          vary='error'
          rightButtonText='Discard'
          onClick={() => {
            closeModal('UpdatePriceCancelModal')
            itemReset()
            setEditPrices(false)
          }}
        ></CustomModalV2>
      ),
    })
  }

  const selectedJobUpdatable = () => {
    if (selectedJobInfo) {
      const Writer = new job_list(selectedJobInfo?.jobInfo.authorId)
      const isUpdatable = ability.can('update', Writer)
      return isUpdatable
    } else {
      return false
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
    if (
      jobInfoList.includes(undefined) ||
      jobPriceList.includes(undefined) ||
      jobAssignList.includes(undefined)
    )
      return
    const combinedList = jobInfoList
      .sort((a, b) => a?.sortingOrder! - b?.sortingOrder!)
      .map(jobInfo => {
        const jobPrices = jobPriceList.find(price => price!.id === jobInfo!.id)
        const jobAssign = jobAssignList.find(
          assign => assign!.id === jobInfo!.id,
        )

        return {
          jobInfo: jobInfo!,

          jobPrices: jobPrices!,
          jobId: jobInfo!.id,
          jobAssign: jobAssign?.requests!,
          jobAssignDefaultRound: jobAssign?.frontRound ?? 1,
        }
      })

    if (JSON.stringify(combinedList) !== JSON.stringify(jobDetail)) {
      if (selectedJobInfo) {
        setJobDetail(combinedList)
        const selectedJob = combinedList.find(
          value => value.jobId === selectedJobInfo.jobInfo.id,
        )
        console.log(selectedJob, 'hihi')

        if (selectedJob) {
          setSelectedJobInfo(selectedJob)
          const defaultRound = selectedJob.jobAssignDefaultRound ?? 1
          setSelectedAssign(
            selectedJob.jobAssign.find(value => value.round === defaultRound) ??
              null,
          )
        } else {
          const selectedJob =
            combinedList.find(value => value.jobId === Number(selectedJobId)) ??
            combinedList[0]
          setJobDetail(combinedList)
          setSelectedJobInfo(selectedJob)
          const defaultRound = selectedJob?.jobAssignDefaultRound ?? 1

          setSelectedAssign(
            selectedJob.jobAssign.find(value => value.round === defaultRound) ??
              null,
          )
        }
      } else {
        const selectedJob =
          combinedList.find(value => value.jobId === Number(selectedJobId)) ??
          combinedList[0]

        setJobDetail(combinedList)
        setSelectedJobInfo(selectedJob)
        const defaultRound = selectedJob?.jobAssignDefaultRound ?? 1

        setSelectedAssign(
          selectedJob.jobAssign.find(value => value.round === defaultRound) ??
            null,
        )
      }
    }
  }, [
    jobInfoList,
    jobPriceList,
    jobAssignList,
    selectedJobInfo,
    jobDetail,
    selectedJobId,
  ])

  useEffect(() => {
    if (roundQuery && selectedJobInfo) {
      setSelectedAssign(
        selectedJobInfo.jobAssign.find(
          assign => assign.round === Number(roundQuery),
        ) ?? null,
      )
    }
  }, [roundQuery, selectedJobInfo])

  useEffect(() => {
    if (selectedJobId && jobDetail) {
      const selectedJob = jobDetail.find(
        value => value.jobId === Number(selectedJobId),
      )
      if (selectedJob) {
        const result = {
          jobId: selectedJob.jobId,
          jobInfo: selectedJob.jobInfo!,
          jobPrices: selectedJob.jobPrices!,
          jobAssign: selectedJob.jobAssign!,
          jobAssignDefaultRound: selectedJob.jobAssignDefaultRound,
        }
        setSelectedJobInfo(result)
      }
    }
  }, [selectedJobId, jobDetail])

  useEffect(() => {
    if (selectedJobInfo && jobDetails) {
      const { jobPrices, jobInfo } = selectedJobInfo
      const item = jobDetails.items.find(item =>
        item.jobs.some(job => job.id === selectedJobInfo?.jobId),
      )
      if (jobPrices && jobInfo && item) {
        const result = [
          {
            id: jobPrices.priceId!,
            name: jobPrices.priceName!,
            itemName: jobPrices.priceName!,
            source: jobPrices.sourceLanguage ?? item.sourceLanguage,
            target: jobPrices.targetLanguage ?? item.targetLanguage,
            priceId: jobPrices.initialPrice?.priceId!,
            detail:
              !jobPrices.detail || jobPrices.detail?.length === 0
                ? []
                : jobPrices.detail.map(value => ({
                    ...value,
                    priceUnitId: value.priceUnitId ?? value.id,
                    currency: value.currency
                      ? value.currency
                      : jobInfo.currency ?? null,
                  })),
            minimumPrice: jobPrices.minimumPrice,
            minimumPriceApplied: jobPrices.minimumPriceApplied,
            initialPrice: jobPrices.initialPrice,
            totalPrice: Number(jobPrices?.totalPrice!),
            priceFactor: Number(jobPrices.languagePair?.priceFactor ?? 0),
          },
        ]

        itemReset({ items: result })
      } else {
        appendItems({
          itemName: '',
          source: 'en',
          target: 'ko',
          priceId: null,
          detail: [],
          totalPrice: 0,
          minimumPrice: null,
          minimumPriceApplied: false,
          initialPrice: null,
          priceFactor: 0,
          currency: null,
        })
      }
    }
  }, [selectedJobInfo, jobDetails])

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
                    setMenu('linguistTeam')
                    setSelectedLinguistTeam(null)
                    if (selectedJobInfo) {
                      setSelectedAssign(
                        selectedJobInfo.jobAssign.find(
                          value =>
                            value.round ===
                            selectedJobInfo.jobAssignDefaultRound,
                        ) ?? null,
                      )
                    }
                  } else if (addProsMode) {
                    setAddProsMode(false)
                    setMenu('linguistTeam')
                    setSelectedLinguistTeam(null)
                    if (selectedJobInfo) {
                      setSelectedAssign(
                        selectedJobInfo.jobAssign.find(
                          value =>
                            value.round ===
                            selectedJobInfo.jobAssignDefaultRound,
                        ) ?? null,
                      )
                    }
                  } else if (assignProMode) {
                    setAssignProMode(false)
                    setMenu('linguistTeam')
                    setSelectedLinguistTeam(null)
                    if (selectedJobInfo) {
                      setSelectedAssign(
                        selectedJobInfo.jobAssign.find(
                          value =>
                            value.round ===
                            selectedJobInfo.jobAssignDefaultRound,
                        ) ?? null,
                      )
                    }
                  } else {
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
                  }
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
                        jobAssignDefaultRound: value.jobAssignDefaultRound,
                      })
                      setValue('info')
                      const path = router.asPath
                      const newPath = path.replace(
                        `selectedJobId=${selectedJobInfo?.jobId}`,
                        `selectedJobId=${value.jobId}`,
                      )
                      router.push(newPath, undefined, {
                        shallow: true,
                      })
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
            value === 'assign'
              ? (selectedJobInfo &&
                  (selectedJobInfo.jobInfo.name === null ||
                    selectedJobInfo.jobPrices.priceId === null)) ||
                (selectedJobInfo?.jobAssign &&
                  selectedJobInfo?.jobAssign.length > 0 &&
                  !addRoundMode &&
                  !addProsMode &&
                  !assignProMode)
                ? 10.416
                : 7.632
              : value === 'info'
                ? selectedJobInfo?.jobInfo.pro === null
                  ? 10.416
                  : 7.632
                : value === 'prices'
                  ? 10.416
                  : 7.632
            // (selectedJobInfo &&
            //   (selectedJobInfo.jobInfo.name === null ||
            //     selectedJobInfo.jobPrices.priceId === null)) ||
            // (selectedJobInfo?.jobAssign &&
            //   selectedJobInfo?.jobAssign.length > 0 &&
            //   value === 'assign') ||
            // (!addRoundMode && !addProsMode && !assignProMode) ||
            // (selectedJobInfo?.jobInfo.pro === null && value === 'info')
            //   ? 10.416
            //   : 7.632
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
                    label={
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center',
                        }}
                      >
                        Job Info
                        {selectedJobInfo.jobInfo.name === null ? (
                          <Badge
                            variant='dot'
                            color='error'
                            sx={{ marginLeft: '4px' }}
                          ></Badge>
                        ) : null}
                      </Box>
                    }
                    iconPosition='start'
                    icon={
                      <Icon icon='iconoir:large-suitcase' fontSize={'18px'} />
                    }
                    onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                  />

                  <CustomTab
                    value='prices'
                    label={
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center',
                        }}
                      >
                        Prices
                        {selectedJobInfo.jobPrices.priceId === null ? (
                          <Badge
                            variant='dot'
                            color='error'
                            sx={{ marginLeft: '4px' }}
                          ></Badge>
                        ) : null}
                      </Box>
                    }
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
                    disabled
                    icon={<Icon icon='ic:outline-history' fontSize={'18px'} />}
                    onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                  />
                </TabList>
                <TabPanel value='info' sx={{ height: '100%' }}>
                  {jobDetails && langItem ? (
                    <JobInfo
                      jobInfo={selectedJobInfo?.jobInfo!}
                      jobInfoList={jobInfoList}
                      jobAssign={selectedJobInfo?.jobAssign!}
                      projectTeam={projectTeam ?? []}
                      items={jobDetails.items.find(item =>
                        item.jobs.some(
                          job => job.id === selectedJobInfo?.jobId,
                        ),
                      )}
                      languagePair={langItem.languagePairs || []}
                      setJobId={setJobId}
                      setJobStatusMutation={setJobStatusMutation}
                    />
                  ) : null}
                </TabPanel>
                <TabPanel value='prices' sx={{ height: '100%' }}>
                  {selectedJobInfo.jobInfo.status === 60000 || editPrices ? (
                    <>
                      <EditPrices
                        priceUnitsList={priceUnitsList ?? []}
                        itemControl={itemControl}
                        itemErrors={itemErrors}
                        getItem={getItem}
                        setItem={setItem}
                        itemTrigger={itemTrigger}
                        itemReset={itemReset}
                        isItemValid={itemValid}
                        appendItems={appendItems}
                        fields={items}
                        row={selectedJobInfo.jobInfo}
                        jobPrices={selectedJobInfo.jobPrices!}
                        item={jobDetails?.items.find(item =>
                          item.jobs.some(
                            job => job.id === selectedJobInfo?.jobId,
                          ),
                        )}
                        prices={prices}
                        orderItems={langItem?.items || []}
                        setPriceId={setPriceId}
                      />

                      <Box
                        mt='20px'
                        sx={{
                          display: 'flex',
                          justifyContent:
                            selectedJobInfo.jobInfo.status === 60000
                              ? 'flex-end'
                              : 'center',
                          width: '100%',
                        }}
                      >
                        {selectedJobInfo.jobInfo.status === 60000 ? (
                          <Button
                            variant='contained'
                            onClick={onSubmit}
                            disabled={!itemValid}
                          >
                            Save draft
                          </Button>
                        ) : (
                          <Box display='flex' alignItems='center' gap='32px'>
                            <Button
                              variant='outlined'
                              onClick={() => {
                                onClickUpdatePriceCancel()
                              }}
                              // disabled={!isItemValid}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant='contained'
                              onClick={onClickUpdatePrice}
                              disabled={!itemValid}
                            >
                              Save
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </>
                  ) : (
                    <ViewPrices
                      row={selectedJobInfo.jobInfo}
                      priceUnitsList={priceUnitsList ?? []}
                      itemControl={itemControl}
                      itemErrors={itemErrors}
                      getItem={getItem}
                      setItem={setItem}
                      itemTrigger={itemTrigger}
                      itemReset={itemReset}
                      isItemValid={itemValid}
                      appendItems={appendItems}
                      fields={items}
                      setEditPrices={setEditPrices}
                      jobPriceHistory={jobPriceHistory!}
                      type='view'
                    />
                  )}
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
                        <Button
                          variant='contained'
                          sx={{ mt: '32px' }}
                          onClick={() => {
                            if (!selectedJobInfo.jobInfo.name) {
                              setValue('info')
                            } else if (!selectedJobInfo.jobPrices.priceId) {
                              setValue('prices')
                            } else {
                              setValue('info')
                            }
                          }}
                        >
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
                      proList={proList || { data: [], totalCount: 0, count: 0 }}
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
                      reAssignJobMutation={reAssignJobMutation}
                    />
                  )}
                </TabPanel>
                <TabPanel value='history' sx={{ height: '100%' }}></TabPanel>
              </TabContext>
            )}
          </Box>
        </Grid>
        {selectedJobInfo &&
        (selectedJobInfo.jobInfo.name === null ||
          selectedJobInfo.jobPrices.priceId === null) ? null : (
          <Grid item xs={2.784}>
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
              {value === 'info' && selectedJobInfo?.jobInfo ? (
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
                    <Accordion
                      expanded={expanded === 'panel1'}
                      onChange={handleAccordionChange('panel1')}
                      sx={{
                        borderRadius: '0 !important',
                        boxShadow: 'none !important',
                        background: expanded === 'panel1' ? '#F7F8FF' : '#FFF',
                        padding: '20px',
                        margin: '0 !important',
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='panel1bh-content'
                        id='panel1bh-header'
                        sx={{ padding: 0 }}
                      >
                        <Typography fontSize={16} fontWeight={600}>
                          Source files to Pro
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ padding: 0 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography
                            fontSize={12}
                            fontWeight={400}
                            color='rgba(76, 78, 100, 0.60)'
                          >
                            {formatFileSize(
                              sourceFileList
                                ? getFileSize(sourceFileList, 'SOURCE')
                                : 0,
                            )}
                            / {byteToGB(MAXIMUM_FILE_SIZE)}
                          </Typography>
                          <Button
                            fullWidth
                            variant='contained'
                            sx={{ mt: '8px' }}
                            onClick={() => onClickUploadSourceFile()}
                          >
                            Upload files
                          </Button>
                          {sourceFileList && sourceFileList.length > 0
                            ? Object.entries(
                                sourceFileList.reduce(
                                  (acc: { [key: string]: any[] }, cur) => {
                                    const date = cur.createdAt!
                                    if (!acc[date]) {
                                      acc[date] = []
                                    }
                                    acc[date].push(cur)
                                    return acc
                                  },
                                  {},
                                ),
                              ).map(([key, value]) => {
                                return (
                                  <Box key={uuidv4()}>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',

                                        marginBottom: '10px',
                                        mt: '20px',
                                      }}
                                    >
                                      <Typography
                                        variant='body1'
                                        fontWeight={600}
                                      >
                                        {key
                                          ? convertTimeToTimezone(
                                              key,
                                              auth?.getValue().user?.timezone!,
                                              timezone.getValue(),
                                            )
                                          : '-'}
                                      </Typography>
                                      <IconButton
                                        sx={{
                                          border: '1px solid #666CFF',
                                          borderRadius: '10px',
                                          background: '#FFF',
                                          padding: '4px',
                                        }}
                                        onClick={() => {
                                          DownloadAllFiles(
                                            value,
                                            S3FileType.JOB,
                                          )
                                        }}
                                      >
                                        <Icon
                                          icon='ic:sharp-download'
                                          color='#666CFF'
                                          fontSize={24}
                                        />
                                      </IconButton>
                                    </Box>

                                    <Box
                                      sx={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(1, 1fr)',
                                        width: '100%',
                                        gap: '8px',
                                      }}
                                    >
                                      {fileList(value, 'SOURCE')}
                                    </Box>
                                  </Box>
                                )
                              })
                            : null}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                    <Accordion
                      expanded={expanded === 'panel2'}
                      onChange={handleAccordionChange('panel2')}
                      sx={{
                        borderRadius: '0 !important',
                        boxShadow: 'none !important',
                        background: expanded === 'panel2' ? '#F7F8FF' : '#FFF',
                        padding: '20px',
                        margin: '0 !important',
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='panel1bh-content'
                        id='panel1bh-header'
                        sx={{ padding: 0 }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <Typography fontSize={16} fontWeight={600}>
                            Target files from Pro
                          </Typography>
                          {(selectedJobInfo.jobInfo.status === 60300 ||
                            selectedJobInfo.jobInfo.status === 60400 ||
                            selectedJobInfo.jobInfo.status === 60500) &&
                          selectedJobUpdatable() ? (
                            <>
                              {' '}
                              <IconButton
                                onClick={e => {
                                  e.stopPropagation()
                                  handleMenuClick(e)
                                }}
                                sx={{ padding: 0 }}
                              >
                                <Icon icon='mdi:dots-horizontal' />
                              </IconButton>
                              <Menu
                                elevation={8}
                                anchorEl={anchorEl}
                                id='customized-menu'
                                onClose={(e: React.MouseEvent) => {
                                  e.stopPropagation()
                                  handleClose()
                                }}
                                open={Boolean(anchorEl)}
                                anchorOrigin={{
                                  vertical: 'bottom',
                                  horizontal: 'left',
                                }}
                                transformOrigin={{
                                  vertical: 'top',
                                  horizontal: 'right',
                                }}
                              >
                                <MenuItem
                                  sx={{
                                    gap: 2,
                                    '&:hover': {
                                      background: 'inherit',
                                      cursor: 'default',
                                    },
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-start',
                                    padding: 0,
                                  }}
                                >
                                  <Button
                                    startIcon={
                                      <Icon
                                        icon='ic:sharp-refresh'
                                        color='#4C4E648A'
                                        fontSize={24}
                                      />
                                    }
                                    fullWidth
                                    onClick={e => {
                                      e.stopPropagation()
                                      handleClose()
                                      onClickRequestRedelivery()
                                      // onClickEdit()
                                    }}
                                    sx={{
                                      justifyContent: 'flex-start',
                                      padding: '6px 16px',
                                      fontSize: 16,
                                      fontWeight: 400,
                                      color: 'rgba(76, 78, 100, 0.87)',
                                      borderRadius: 0,
                                    }}
                                  >
                                    Request redelivery
                                  </Button>
                                </MenuItem>
                              </Menu>
                            </>
                          ) : null}
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ padding: 0 }}>
                        {jobDeliveriesFeedbacks?.deliveries && (
                          <Box>
                            <Typography
                              fontSize={12}
                              fontWeight={400}
                              color='rgba(76, 78, 100, 0.60)'
                            >
                              {formatFileSize(
                                jobDeliveriesFeedbacks.deliveries.flatMap(
                                  delivery => delivery.files,
                                )
                                  ? getFileSize(
                                      jobDeliveriesFeedbacks.deliveries.flatMap(
                                        delivery => delivery.files,
                                      ),
                                      'TARGET',
                                    )
                                  : 0,
                              )}
                              / {byteToGB(MAXIMUM_FILE_SIZE)}
                            </Typography>
                            {jobDeliveriesFeedbacks?.deliveries.map(
                              delivery => (
                                <Box key={delivery.id}>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      gap: '10px',
                                      marginBottom: '10px',
                                    }}
                                  >
                                    <Typography
                                      variant='body1'
                                      fontWeight={600}
                                    >
                                      {delivery.deliveredDate
                                        ? convertTimeToTimezone(
                                            delivery.deliveredDate,
                                            auth?.getValue().user?.timezone!,
                                            timezone.getValue(),
                                          )
                                        : '-'}
                                    </Typography>

                                    {delivery.files.length ? (
                                      <IconButton
                                        sx={{
                                          border: '1px solid #666CFF',
                                          borderRadius: '10px',
                                          background: '#FFF',
                                          padding: '4px',
                                        }}
                                        onClick={() => {
                                          DownloadAllFiles(
                                            delivery.files,
                                            S3FileType.JOB,
                                          )
                                        }}
                                      >
                                        <Icon
                                          icon='ic:sharp-download'
                                          color='#666CFF'
                                          fontSize={24}
                                        />
                                      </IconButton>
                                    ) : null}
                                  </Box>

                                  <Box
                                    sx={{
                                      display: 'grid',
                                      gridTemplateColumns: 'repeat(1, 1fr)',
                                      width: '100%',
                                      gap: '20px',
                                    }}
                                  >
                                    {delivery.files.length ? (
                                      fileList(delivery.files, 'TARGET')
                                    ) : (
                                      <Typography variant='subtitle2'>
                                        No target files
                                      </Typography>
                                    )}
                                  </Box>

                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '10px',
                                      marginTop: '24px',
                                    }}
                                  >
                                    <Typography fontSize={14} fontWeight={400}>
                                      Notes from Pro
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',

                                      marginTop: '8px',
                                    }}
                                  >
                                    <Typography
                                      color='#8D8E9A'
                                      fontWeight={400}
                                      fontSize={14}
                                    >
                                      {delivery.note ?? '-'}
                                    </Typography>
                                  </Box>
                                </Box>
                              ),
                            )}
                          </Box>
                        )}
                      </AccordionDetails>
                    </Accordion>
                    <Accordion
                      expanded={expanded === 'panel3'}
                      onChange={handleAccordionChange('panel3')}
                      sx={{
                        borderRadius: '0 !important',
                        boxShadow: 'none !important',
                        background: expanded === 'panel3' ? '#F7F8FF' : '#FFF',
                        padding: '20px',
                        margin: '0 !important',
                        borderBottom: '1px solid #E9EAEC',
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='panel1bh-content'
                        id='panel1bh-header'
                        sx={{ padding: 0 }}
                      >
                        <Typography fontSize={16} fontWeight={600}>
                          Job feedback
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ padding: 0 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          {/* {selectedJobInfo.jobInfo.status === 60400 ||
                          selectedJobInfo.jobInfo.status === 60500 ||
                          selectedJobInfo.jobInfo.status === 60250 ? ( */}
                          <>
                            <Button
                              fullWidth
                              variant='contained'
                              sx={{ mt: '8px' }}
                              onClick={() => setUseJobFeedbackForm(true)}
                            >
                              Add feedback
                            </Button>
                            {/* <Divider /> */}
                          </>
                          {/* ) : null} */}

                          {useJobFeedbackForm ? (
                            <>
                              <Divider
                                sx={{
                                  my: '20px !important',
                                }}
                              />
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '14px',
                                  marginTop: '14px',
                                  marginBottom: '14px',
                                }}
                              >
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}
                                >
                                  <Box sx={{ display: 'flex', gap: '8px' }}>
                                    <Chip
                                      size='small'
                                      skin='light'
                                      label={'Writer'}
                                      color='error'
                                      sx={{
                                        textTransform: 'capitalize',
                                        '& .MuiChip-label': {
                                          lineHeight: '18px',
                                        },
                                        mr: 1,
                                      }}
                                    />
                                    <Typography
                                      variant='body1'
                                      sx={{
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        lineHeight: '21px',
                                        letterSpacing: '0.1px',
                                        color: '#666CFF',
                                      }}
                                    >
                                      {getLegalName({
                                        firstName:
                                          auth?.getValue().user?.firstName,
                                        middleName:
                                          auth?.getValue().user?.middleName,
                                        lastName:
                                          auth?.getValue().user?.lastName,
                                      })}
                                    </Typography>
                                  </Box>
                                </Box>

                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                  }}
                                >
                                  <TextField
                                    fullWidth
                                    autoComplete='off'
                                    rows={4}
                                    value={addJobFeedbackData}
                                    placeholder='Write down a feedback.'
                                    onChange={event => {
                                      if (event.target.value) {
                                        setAddJobFeedbackData(
                                          event.target.value,
                                        )
                                      } else {
                                        setAddJobFeedbackData(null)
                                      }
                                    }}
                                    multiline
                                    error={
                                      addJobFeedbackData === null ? true : false
                                    }
                                    helperText={
                                      addJobFeedbackData === null
                                        ? FormErrors.required
                                        : null
                                    }
                                    id='textarea-outlined-static'
                                  />
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      gap: '8px',
                                      justifyContent: 'end',
                                    }}
                                  >
                                    <Button
                                      variant='outlined'
                                      size='small'
                                      onClick={onClickDiscardFeedback}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      variant='contained'
                                      size='small'
                                      onClick={onClickAddFeedback}
                                    >
                                      Confirm
                                    </Button>
                                  </Box>
                                  {/* {feedbacks && feedbacks.length ? (
                                  <Divider
                                    sx={{
                                      my: theme =>
                                        `${theme.spacing(4)} !important`,
                                    }}
                                  />
                                ) : null} */}
                                </Box>
                              </Box>
                            </>
                          ) : null}
                          <Divider
                            sx={{
                              my: '20px !important',
                            }}
                          />
                          {jobDeliveriesFeedbacks?.feedbacks &&
                          jobDeliveriesFeedbacks.feedbacks.length > 0
                            ? jobDeliveriesFeedbacks.feedbacks.map(value => {
                                return (
                                  <Box
                                    key={uuidv4()}
                                    sx={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <Box sx={{ display: 'flex', gap: '8px' }}>
                                        <Chip
                                          size='small'
                                          skin='light'
                                          label={'Writer'}
                                          color='error'
                                          sx={{
                                            textTransform: 'capitalize',
                                            '& .MuiChip-label': {
                                              lineHeight: '18px',
                                            },
                                            mr: 1,
                                          }}
                                        />
                                        <Typography
                                          variant='body1'
                                          sx={{
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            lineHeight: '21px',
                                            letterSpacing: '0.1px',
                                            color:
                                              value.email ===
                                              auth?.getValue().user?.email
                                                ? '#666CFF'
                                                : 'rgba(76, 78, 100, 0.87)',
                                          }}
                                        >
                                          {value.name}
                                        </Typography>
                                      </Box>

                                      {/* comment edit/delete 컴포넌트, 추후 사용시 활용(맞춰야 함) */}
                                      {/* <Box sx={{ display: 'flex' }}>
                                  {selectedComment && selectedComment?.id === value.id ? (
                                    <></>
                                  ) : (
                                    <>
                                      {ability.can(
                                        'update',
                                        new pro_comment(value.userId),
                                      ) && value.userId === user.userId ? (
                                        <IconButton
                                          sx={{ padding: 1 }}
                                          onClick={() => onClickEditComment(value)}
                                        >
                                          <Icon icon='mdi:pencil-outline' />
                                        </IconButton>
                                      ) : null}
                                      {ability.can(
                                        'delete',
                                        new pro_comment(value.userId),
                                      ) ? (
                                        <IconButton
                                          sx={{ padding: 1 }}
                                          onClick={() => onClickDeleteComment(value)}
                                        >
                                          <Icon icon='mdi:delete-outline' />
                                        </IconButton>
                                      ) : null}
                                    </>
                                  )}
                                </Box> */}
                                    </Box>

                                    <Typography
                                      variant='body2'
                                      fontSize={12}
                                      sx={{ mt: '4px' }}
                                    >
                                      {convertTimeToTimezone(
                                        value.createdAt,
                                        auth?.getValue().user?.timezone,
                                        timezone.getValue(),
                                      )}
                                    </Typography>
                                    {value.isChecked ? (
                                      <Box
                                        display='flex'
                                        justifyContent='flex-end'
                                      >
                                        <Image
                                          src='/images/icons/job-icons/icon-check.svg'
                                          alt='logo'
                                          width={44}
                                          height={24}
                                        />
                                        <Typography
                                          variant='body1'
                                          sx={{
                                            color: 'rgba(76, 78, 100, 0.6)',
                                            fontWeight: 600,
                                            fontSize: '14px',
                                            lineHeight: '21px',
                                            letterSpacing: '0.15px',
                                          }}
                                        >
                                          {'Read by Pro'}
                                        </Typography>
                                      </Box>
                                    ) : null}

                                    {/* comment edit/delete 컴포넌트, 추후 사용시 활용(맞춰야 함) */}
                                    {/* {selectedComment && selectedComment?.id === value.id ? (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                  }}
                                >
                                  <TextField
                                    fullWidth
                                    rows={4}
                                    value={comment}
                                    onChange={handleCommentChange}
                                    multiline
                                    id='textarea-outlined-static'
                                  />
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      gap: '8px',
                                      justifyContent: 'end',
                                    }}
                                  >
                                    <Button
                                      variant='outlined'
                                      size='small'
                                      onClick={onClickEditCancelComment}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      variant='contained'
                                      size='small'
                                      onClick={onClickEditConfirmComment}
                                    >
                                      Confirm
                                    </Button>
                                  </Box>
                                </Box>
                              ) : (
                                <Box>{value.comment}</Box>
                              )} */}
                                    <Typography
                                      fontSize={14}
                                      fontWeight={400}
                                      sx={{ mt: '16px' }}
                                    >
                                      {value.feedback}
                                    </Typography>
                                  </Box>
                                )
                              })
                            : null}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                </Box>
              ) : value === 'assign' ? (
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
                                    delete newState[key]
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
                                    {(pro as ProListType).order}
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
                                      newState[key] = prev[key]?.filter(
                                        value => value !== pro.userId,
                                      )
                                      if (newState[key]?.length === 0) {
                                        delete newState[key]
                                      }
                                      console.log(newState, 'new')

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
                        variant={'contained'}
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
              ) : null}
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
