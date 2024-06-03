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
  styled,
  Tab,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { ServiceTypeChip } from '@src/@core/components/chips/chips'
import {
  useGetAssignableProList,
  useGetJobAssignProRequests,
  useGetJobDetails,
  useGetJobInfo,
  useGetJobPriceHistory,
  useGetJobPrices,
  useGetJobRequestHistory,
  useGetSourceFile,
} from '@src/queries/order/job.query'
import Image from 'next/image'
import { useRouter } from 'next/router'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import {
  MouseEvent,
  SyntheticEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
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
import { getGloLanguage } from '@src/shared/transformer/language.transformer'
import { ItemType, JobType } from '@src/types/common/item.type'
import {
  JobAddProsFormType,
  JobAssignProRequestsType,
  JobBulkRequestFormType,
  jobPriceHistoryType,
  JobPricesDetailType,
  JobRequestFormType,
  JobRequestHistoryType,
} from '@src/types/jobs/jobs.type'
import useModal from '@src/hooks/useModal'
import CustomModalV2 from '@src/@core/components/common-modal/custom-modal-v2'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import RequestSummaryModal from './components/assign-pro/request-summary-modal'
import { useMutation, useQueryClient, UseQueryResult } from 'react-query'
import {
  addJobFeedback,
  addProCurrentRequest,
  createBulkRequestJobToPro,
  createRequestJobToPro,
  forceAssign,
  getRequestAttachment,
  handleJobAssignStatus,
  handleJobReAssign,
  requestRedelivery,
  saveJobPrices,
  setFileLock,
  setFileUnlock,
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
  useGetProjectTeam,
} from '@src/queries/order/order.query'
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
import SelectRequestRedeliveryReasonModal from './components/info/request-redelivery-modal'
import SourceFileUpload from './components/info/source-file'
import Chip from '@src/@core/components/mui/chip'
import { FormErrors } from '@src/shared/const/formErrors'
import EditPrices from './components/prices/edit-prices'
import ViewPrices from './components/prices/view-prices'
import { useGetAllClientPriceList } from '@src/queries/price-units.query'
import { FieldErrors, Resolver, useFieldArray, useForm } from 'react-hook-form'
import { languageType, proDefaultOption } from '../../add-new'
import { yupResolver } from '@hookform/resolvers/yup'
import { jobItemSchema } from '@src/types/schema/item.schema'
import { useGetProPriceList } from '@src/queries/company/standard-price'
import toast from 'react-hot-toast'
import { job_list } from '@src/shared/const/permission-class'
import OverlaySpinner from '@src/@core/components/spinner/overlay-spinner'
import {
  formatByRoundingProcedure,
  formatCurrency,
} from '@src/shared/helpers/price.helper'
import { PriceRoundingResponseEnum } from '@src/shared/const/rounding-procedure/rounding-procedure.enum'
import RequestHistory from './components/request-history'
import {
  getCurrentRole,
  getUserTokenFromBrowser,
} from '@src/shared/auth/storage'
import ReviewRequest from './components/review-request'
import { useGetCompanyOptions } from '@src/queries/options.query'
import { extractFileExtension } from '@src/shared/transformer/file-extension.transformer'
import { videoExtensions } from '@src/shared/const/upload-file-extention/file-extension'

type MenuType = 'info' | 'review' | 'prices' | 'assign' | 'history'

export type TabType = 'linguistTeam' | 'pro'

const subtitleExtensions = ['srt', 'dxfp', 'itt', 'cap']
const JobDetail = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const MAXIMUM_FILE_SIZE = FILE_SIZE.JOB_SAMPLE_FILE
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)
  const currentRole = getCurrentRole()
  const theme = useTheme()

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
      // jobRequestReview:
      //   | { jobId: number; data: JobRequestReviewListType[] }
      //   | undefined
      jobPrices: JobPricesDetailType | undefined
      jobAssign: JobAssignProRequestsType[]
      jobRequestHistory:
        | {
            data: JobRequestHistoryType[]
            count: number
            totalCount: number
          }
        | undefined
      jobAssignDefaultRound: number
    }>
  >([])

  const [selectedJobInfo, setSelectedJobInfo] = useState<{
    jobId: number
    jobInfo: JobType
    jobPrices: JobPricesDetailType
    // jobRequestReview: { jobId: number; data: JobRequestReviewListType[] }
    jobAssign: JobAssignProRequestsType[]
    jobAssignDefaultRound: number
    jobRequestHistory: {
      data: JobRequestHistoryType[]
      count: number
      totalCount: number
    }
  } | null>(null)

  const [selectedAssign, setSelectedAssign] =
    useState<JobAssignProRequestsType | null>(
      selectedJobInfo?.jobAssign[0] ?? null,
    )

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
  const errorRefs = useRef<(HTMLInputElement | null)[]>([])

  const jobInfoList = (
    useGetJobInfo(jobId, false) as UseQueryResult<JobType, unknown>[]
  ).map(value => value)
  const jobPriceList = (
    useGetJobPrices(jobId, false) as UseQueryResult<
      JobPricesDetailType | jobPriceHistoryType,
      unknown
    >[]
  ).map(value => value)
  // const jobRequestReviewList = (
  //   useGetJobRequestReview(jobId) as UseQueryResult<
  //     { jobId: number; data: JobRequestReviewListType[] },
  //     unknown
  //   >[]
  // ).map(value => value)
  const jobAssignList = (
    useGetJobAssignProRequests(jobId) as UseQueryResult<
      {
        requests: JobAssignProRequestsType[]
        id: number
        frontRound: number
      },
      unknown
    >[]
  ).map(value => value)

  const jobRequestHistoryList = (
    useGetJobRequestHistory(jobId) as UseQueryResult<
      {
        data: JobRequestHistoryType[]
        count: number
        totalCount: number
        jobId: number
      },
      unknown
    >[]
  ).map(value => value)

  const { data: jobStatusList } = useGetStatusList('Job')
  const { data: lspList, isLoading: lspListLoading } =
    useGetCompanyOptions('LSP')
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
    data: sourceFiles,
    isLoading,
    refetch: refetchSourceFileList,
  } = useGetSourceFile(selectedJobInfo?.jobId!)

  const [sourceFileList, setSourceFileList] = useState<FileType[]>([])

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
    watch: itemWatch,
    setFocus: itemSetFocus,
    handleSubmit: itemHandleSubmit,
    formState: { errors: itemErrors, isValid: itemValid },
  } = useForm<{ items: ItemType[]; languagePairs: languageType[] }>({
    mode: 'onSubmit',
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

  const itemName: `items.${number}.detail` = `items.${0}.detail`

  const {
    fields: details,
    append,
    update,
    remove,
  } = useFieldArray({
    control: itemControl,
    name: itemName,
  })

  const [isNotApplicable, setIsNotApplicable] = useState<boolean>(false)
  const itemData = getItem(`items.${0}`)

  const currentInitialItem = getItem(`items.${0}.initialPrice`)

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
      type: 'force' | 'normal' | 'cancel'
    }) =>
      data.type === 'normal' || data.type === 'cancel'
        ? handleJobAssignStatus(data.jobId, data.proId, data.status, 'lpm')
        : forceAssign(data.jobId, data.proId),
    {
      onSuccess: (data, variables) => {
        closeModal('AssignProModal')
        setAssignProMode(false)
        displayCustomToast(
          variables.type === 'cancel'
            ? 'Canceled successfully'
            : 'Assigned successfully',
          'success',
        )
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

        queryClient.invalidateQueries('jobInfo')
        queryClient.invalidateQueries('jobPrices')
        queryClient.invalidateQueries('jobDetails')
        if (data.id === variables.jobId) {
          displayCustomToast('Saved successfully', 'success')
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
              assignJobMutation.mutate(
                {
                  jobId: selectedJobInfo?.jobInfo.id!,
                  proId: pro.userId,
                  status: 70300,
                  type: 'force',
                },
                {
                  onSuccess: () => {
                    setAddRoundMode(false)
                    setAssignProMode(false)
                    closeModal('AssignModal')
                  },
                },
              )
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
              assignJobMutation.mutate(
                {
                  jobId: selectedJobInfo?.jobInfo.id!,
                  proId: pro.userId,
                  status: 70300,
                  type: 'force',
                },
                {
                  onSuccess: () => {
                    setAddRoundMode(false)
                    setAssignProMode(false)
                    closeModal('AssignModal')
                  },
                },
              )
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
          <Box
            key={uuidv4()}
            sx={{
              display: 'flex',
              marginBottom: '8px',
              width: '100%',
              justifyContent: 'space-between',
              borderRadius: '8px',
              padding: '10px 12px',
              border: '1px solid rgba(76, 78, 100, 0.22)',
              background: '#f9f8f9',
              cursor: type === 'SOURCE' ? 'pointer' : 'default',
            }}
            onClick={() => DownloadFile(value, S3FileType.JOB)}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  marginRight: '8px',
                  display: 'flex',
                }}
              >
                {/* <Icon
                  icon='material-symbols:file-present-outline'
                  style={{
                    color: 'rgba(76, 78, 100, 0.54)',
                  }}
                  fontSize={24}
                /> */}
                <Image
                  src={`/images/icons/file-icons/${extractFileExtension(value.name)}.svg`}
                  alt=''
                  width={32}
                  height={32}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Tooltip title={value.name}>
                  <Typography
                    variant='body1'
                    fontSize={14}
                    fontWeight={600}
                    lineHeight={'20px'}
                    sx={{
                      overflow: 'hidden',
                      wordBreak: 'break-all',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {value.name}
                  </Typography>
                </Tooltip>

                <Typography variant='caption' lineHeight={'14px'}>
                  {formatFileSize(value.size)}
                </Typography>
              </Box>
            </Box>
            {type === 'SOURCE' ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
                onClick={() => {
                  if (value.downloadAvailable)
                    DownloadFile(value, S3FileType.JOB)
                  else return
                }}
              >
                {videoExtensions.includes(
                  value.name?.split('.').pop()?.toLowerCase() ?? '',
                ) ? (
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                      // color: file.downloadAvailable
                      //   ? '#4C4E64'
                      //   : 'rgba(76, 78, 100, 0.54)',

                      cursor: 'pointer',
                      padding: '4px',
                      '& :hover': {
                        borderRadius: '50%',
                        backgroundColor: theme.palette.grey[300],
                      },
                    }}
                    onClick={event => {
                      event.stopPropagation()
                      if (value.downloadAvailable) {
                        openModal({
                          type: 'blockDownloadModal',
                          children: (
                            <CustomModalV2
                              rightButtonText='Block'
                              onClick={() => {
                                setFileLock(value.id!).then(res => {
                                  // queryClient.invalidateQueries('jobInfo')
                                  closeModal('blockDownloadModal')
                                  refetchSourceFileList()
                                })
                              }}
                              onClose={() => closeModal('blockDownloadModal')}
                              vary='error-report'
                              title='Block download'
                              subtitle="Are you sure you want to block Pro from downloading this video file? There's a chance that Pro has already downloaded the file."
                            />
                          ),
                        })
                      } else {
                        openModal({
                          type: 'unblockDownloadModal',
                          children: (
                            <CustomModalV2
                              rightButtonText='Unblock'
                              onClick={() => {
                                setFileUnlock(value.id!).then(res => {
                                  // queryClient.invalidateQueries('jobInfo')
                                  closeModal('unblockDownloadModal')
                                  refetchSourceFileList()
                                })
                              }}
                              onClose={() => closeModal('unblockDownloadModal')}
                              vary='error-report'
                              title='Unblock download'
                              subtitle='Are you sure you want to allow Pro to download this video file?'
                            />
                          ),
                        })
                      }
                      // file.downloadAvailable = !file.downloadAvailable
                      // setFiles(prevFiles =>
                      //   prevFiles.map(f => (f.name === file.name ? file : f)),
                      // )
                      // // handleRemoveFile(file)
                    }}
                  >
                    <Icon
                      icon={
                        value.downloadAvailable
                          ? 'mdi:unlocked-outline'
                          : 'mdi:lock'
                      }
                      fontSize={20}
                    />
                  </Box>
                ) : null}
              </Box>
            ) : (
              <IconButton
                onClick={() => {
                  DownloadFile(value, S3FileType.JOB)
                }}
                sx={{
                  padding: 0,
                }}
              >
                <Icon icon='ic:sharp-download' />
              </IconButton>
            )}
          </Box>
        )
      }
    })
  }

  const getFileSize = (file: FileType[], type: string) => {
    const files = file.filter((file: FileType) => file.type === type)

    let size = 0
    files.forEach((file: FileType) => {
      size += Number(file.size)
    })

    return size
  }

  const onError = (
    errors: FieldErrors<{
      items: ItemType[]
      languagePairs: languageType[]
    }>,
  ) => {
    const error = (errors.items && errors.items[0]) ?? {}

    const detailErrorIndex = Number(Object.keys(error.detail ?? {})[0])
    const detailError = (error.detail && error.detail[detailErrorIndex]) ?? {}

    if (Object.keys(error).includes('priceId')) {
      errorRefs.current[0]?.focus()
    } else {
      const firstErrorName = Object.keys(detailError)[0]

      errorRefs.current[
        detailErrorIndex +
          (firstErrorName === 'quantity'
            ? 1
            : firstErrorName === 'priceUnitId'
              ? 2
              : firstErrorName === 'unitPrice'
                ? 3
                : 4) +
          (detailErrorIndex > 0
            ? (isNotApplicable ? 3 : 2) * detailErrorIndex
            : 0)
      ]?.focus()
    }
  }

  const onClickUploadSourceFile = () => {
    if (jobDetails) {
      openModal({
        type: 'UploadSourceFileModal',
        children: (
          <SourceFileUpload
            info={selectedJobInfo?.jobInfo.pro!}
            row={selectedJobInfo?.jobInfo!}
            statusList={jobStatusList || []}
            type='upload'
            importFile={[]}
          />
        ),
      })
    }
  }

  const onClickImportFiles = () => {
    if (selectedJobInfo) {
      getRequestAttachment(selectedJobInfo?.jobId).then(res => {
        if (res.code) {
          if (res.code === 'Request.requestAttachment.requestNotFound') {
            openModal({
              type: 'NoRequestModal',
              children: (
                <CustomModalV2
                  vary='error-report'
                  title='No linked request'
                  subtitle='There is no linked request for this job.'
                  soloButton
                  onClick={() => closeModal('NoRequestModal')}
                  onClose={() => closeModal('NoRequestModal')}
                  rightButtonText='Okay'
                />
              ),
            })
          } else if (
            res.code === 'Request.requestAttachment.requestAttachmentNotFound'
          ) {
            openModal({
              type: 'NoRequestAttachmentModal',
              children: (
                <CustomModalV2
                  vary='error-report'
                  title='No files'
                  subtitle='There are no files in the request.'
                  soloButton
                  onClick={() => closeModal('NoRequestModal')}
                  onClose={() => closeModal('NoRequestModal')}
                  rightButtonText='Okay'
                />
              ),
            })
          }
        } else {
          const files = res.data || []
          openModal({
            type: 'ImportFileModal',
            children: (
              <SourceFileUpload
                info={selectedJobInfo?.jobInfo.pro!}
                row={selectedJobInfo?.jobInfo!}
                type='import'
                importFile={files}
                statusList={jobStatusList || []}
              />
            ),
          })
        }
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

  const onClickUpdatePrice = () => {
    if (selectedJobInfo && selectedJobInfo.jobInfo.pro) {
      openModal({
        type: 'RevisePriceModal',
        children: (
          <CustomModalV2
            onClose={() => closeModal('RevisePriceModal')}
            title='Revise price information?'
            subtitle={
              <>
                Are you sure you want to revise the price information?
                <br />
                <br /> It will directly impact the Pro, and the updated pricing
                information will be communicated to the Pro.
              </>
            }
            vary='error-alert'
            rightButtonText='Proceed'
            onClick={() => {
              onSubmit()
              closeModal('RevisePriceModal')
            }}
          />
        ),
      })
    } else {
      onSubmit()
    }

    // openModal({
    //   type: 'UpdatePriceModal',
    //   children: (
    //     <CustomModalV2
    //       onClose={() => closeModal('UpdatePriceModal')}
    //       title='Save all changes?'
    //       subtitle='Are you sure you want to save all changes? The notification will be sent to Pro after the change.'
    //       vary='successful'
    //       rightButtonText='Save'
    //       onClick={() => {
    //         closeModal('UpdatePriceModal')
    //         onSubmit()
    //       }}
    //     />
    //   ),
    // })
  }

  const onClickUpdatePriceCancel = () => {
    openModal({
      type: 'UpdatePriceCancelModal',
      children: (
        <CustomModalV2
          onClose={() => closeModal('UpdatePriceCancelModal')}
          title='Discard changes?'
          subtitle='Are you sure you want to discard all changes?'
          vary='error-alert'
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
      const isTeamMember =
        auth.getValue().user?.userId ===
        selectedJobInfo?.jobInfo?.contactPerson?.userId
      const isMasterManager = auth
        .getValue()
        .user?.roles?.some(
          role =>
            ['Master', 'Manager'].includes(role.type) && role.name === 'LPM',
        )
      return Boolean(isTeamMember || isMasterManager)
    } else {
      return false
    }
  }

  const getPriceOptions = (source: string, target: string) => {
    // if (!isSuccess) return [proDefaultOption]
    if (!prices) return [proDefaultOption]

    // const filteredPriceUnit = prices.priceUnit.filter(value => value !== null)
    const filteredList = prices
      .map(item => ({
        ...item,
        priceUnit: item.priceUnit.filter(value => value !== null),
      }))
      .filter(item => {
        const matchingPairs = item.languagePairs.filter(
          pair => pair.source === source && pair.target === target,
        )
        return matchingPairs.length > 0
      })
      .map(item => ({
        groupName: item.isStandard ? 'Standard pro price' : 'Matching price',

        ...item,
      }))

    return [proDefaultOption].concat(filteredList)
  }

  const handleShowMinimum = (value: boolean) => {
    const minimumPrice = Number(getItem(`items.${0}.minimumPrice`))
    const totalPrice = Number(getItem(`items.${0}.totalPrice`))
    const minimumPriceApplied = getItem(`items.${0}.minimumPriceApplied`)

    if (minimumPriceApplied && minimumPrice < totalPrice) return //데이터가 잘못된 케이스
    if (minimumPrice) {
      if (value) {
        if (minimumPrice && minimumPrice >= totalPrice) {
          setItem(`items.${0}.minimumPriceApplied`, true, {
            shouldDirty: true,
            shouldValidate: true,
          })
        } else {
          setItem(`items.${0}.minimumPriceApplied`, false, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
      } else if (!value) {
        setItem(`items.${0}.minimumPriceApplied`, false, {
          shouldDirty: true,
          shouldValidate: true,
        })
      }
    } else {
      setItem(`items.${0}.minimumPriceApplied`, false, {
        shouldDirty: true,
        shouldValidate: true,
      })
    }
    itemTrigger(`items.${0}.minimumPriceApplied`)
    getTotalPrice()
  }

  function getTotalPrice() {
    const itemMinimumPrice = Number(getItem(`items.${0}.minimumPrice`))
    const showMinimum = getItem(`items.${0}.minimumPriceApplied`)
    const itemName: `items.${number}.detail` = `items.${0}.detail`

    let total = 0
    const data = getItem(itemName)

    if (data?.length) {
      const price = data.reduce((res, item) => (res += Number(item.prices)), 0)
      if (isNaN(price)) return

      if (itemMinimumPrice && price < itemMinimumPrice && showMinimum) {
        data.forEach(item => {
          total += item.unit === 'Percent' ? Number(item.prices) : 0
        })
        // handleShowMinimum(true)
        total = itemMinimumPrice
      } else if (itemMinimumPrice && price >= itemMinimumPrice && showMinimum) {
        total = price
        // 아래 코드 활성화시 미니멈 프라이스가 활성화 되었으나 미니멈 프라이스 값이 없는 경우 무한루프에 빠짐
        if (showMinimum === true) handleShowMinimum(false)
      } else {
        total = price
      }
    } else if (!data?.length && showMinimum) {
      // 최초 상태, row는 없이 미니멈프라이스만 설정되어 있는 상태
      total = itemMinimumPrice!
    }
    if (itemData && total === itemData.totalPrice) return

    setItem(`items.${0}.totalPrice`, total, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const updateTotalPrice = () => {
    getTotalPrice()
  }

  const priceData = () => {
    if (!itemData) return null
    return (
      getPriceOptions(itemData.source!, itemData.target!).find(
        price => price.id === itemData.priceId,
      ) || null
    )
  }

  const viewProgressInfoButtonStatus = () => {
    const status = selectedJobInfo?.jobInfo.status
    if (status) {
      if (
        status === 60200 ||
        status === 60250 ||
        status === 60300 ||
        status === 60400
      ) {
        return 'active'
      } else {
        if (status === 60000 || status === 60100) {
          return 'No Pro has been assigned to this job yet.'
        } else if (status === 60110) {
          return 'This job is not in progress yet.'
        } else if (
          status === 60500 ||
          status === 60600 ||
          status === 60700 ||
          status === 60800 ||
          status === 60900
        ) {
          return 'This job is already completed.'
        } else if (status === 601000 || status === 601100) {
          return 'This job is no longer available.'
        } else {
          return 'deActive'
        }
      }
    } else {
      return 'deActive'
    }
  }

  const getFileExtension = (fileName: string) => {
    const parts = fileName.split('.')
    return parts.length > 1 ? parts.pop()?.toUpperCase() : ''
  }

  const hiddenGlosubButton = useMemo(() => {
    const sourceFiles =
      selectedJobInfo?.jobInfo.files?.filter(file => file.type === 'SOURCE') ||
      []

    const findVideoFile = sourceFiles.find(item => {
      const name = item.name || ''
      return videoExtensions.includes(getFileExtension(name) || '')
    })
    return !!findVideoFile
  }, [selectedJobInfo?.jobInfo])

  const reviewInGlosubButtonStatus = () => {
    const status = selectedJobInfo?.jobInfo.status

    if (status) {
      if (
        status === 60600 ||
        status === 60700 ||
        status === 60800 ||
        status === 60900
      ) {
        return 'This job is already completed.'
      } else if (status === 601000 || status === 601100) {
        return 'This job is no longer available.'
      } else {
        return 'active'
      }
    } else {
      return 'deActive'
    }
  }

  const onClickViewProgressInfoButton = () => {
    openModal({
      type: 'ViewProgressInfoModal',
      isCloseable: true,
      children: (
        <CustomModalV2
          title='View job progress'
          subtitle='You can see the progress of a Pro’s job in Glosub. You can view the draft saves that the Pro hasn’t delivered yet, but cannot edit them.'
          vary='info'
          rightButtonText=''
          noButton
          onClose={() => closeModal('ViewProgressInfoModal')}
          onClick={() => closeModal('ViewProgressInfoModal')}
          closeButton
        />
      ),
    })
  }

  const onClickReviewInGloSubInfoButton = () => {
    openModal({
      type: 'reviewInGlosubInfoModal',
      isCloseable: true,
      children: (
        <CustomModalV2
          title='Review in GloSub'
          subtitle='Subtitle files among the target files that a Pro delivered can be reviewed in Glosub. You can review only the files that have been delivered by the Pro in the Target files from Pro section, and cannot review draft saves.'
          vary='info'
          rightButtonText=''
          noButton
          onClose={() => closeModal('reviewInGlosubInfoModal')}
          onClick={() => closeModal('reviewInGlosubInfoModal')}
          closeButton
        />
      ),
    })
  }

  useEffect(() => {
    if (!router.isReady) return
    const ids = router.query.jobId

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
    const jobInfo = jobInfoList.map(value => value.data)
    // const jobRequestReview = jobRequestReviewList.map(value => value.data)
    const jobPrice = jobPriceList.map(value => value.data)
    const jobAssign = jobAssignList.map(value => value.data)
    const jobRequestHistory = jobRequestHistoryList.map(value => value.data)
    if (
      jobInfo.includes(undefined) ||
      // jobRequestReview.includes(undefined) ||
      jobPrice.includes(undefined) ||
      jobAssign.includes(undefined) ||
      jobRequestHistory.includes(undefined)
    )
      return
    const combinedList = jobInfo
      .sort((a, b) => a?.sortingOrder! - b?.sortingOrder!)
      .map(job => {
        const jobPrices = jobPrice.find(price => price!.id === job!.id)
        const jobAssigns = jobAssign.find(assign => assign!.id === job!.id)
        // const jobRequestReviews = jobRequestReview.find(
        //   review => review!.jobId === job!.id,
        // )
        const jobRequestHistories = jobRequestHistory.find(
          history => history!.jobId === job!.id,
        )

        return {
          jobInfo: job!,
          jobPrices: jobPrices!,
          // jobRequestReview: jobRequestReviews!,
          jobId: job!.id,
          jobAssign: jobAssigns?.requests ?? [],
          jobRequestHistory: {
            data: jobRequestHistories?.data ?? [],
            totalCount: jobRequestHistories?.totalCount ?? 0,
            count: jobRequestHistories?.count ?? 0,
          },
          jobAssignDefaultRound: jobAssigns?.frontRound ?? 1,
        }
      })

    if (JSON.stringify(combinedList) !== JSON.stringify(jobDetail)) {
      if (selectedJobInfo) {
        setJobDetail(combinedList)
        const selectedJob = combinedList.find(
          value => value.jobId === selectedJobInfo.jobInfo.id,
        )

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
    // jobRequestReviewList,
    jobPriceList,
    jobAssignList,
    selectedJobInfo,
    jobDetail,
    selectedJobId,
    jobRequestHistoryList,
  ])

  useEffect(() => {
    if (selectedJobInfo) {
      queryClient.invalidateQueries(['jobInfo', selectedJobInfo.jobId, false])
      queryClient.invalidateQueries(['jobPrices', selectedJobInfo.jobId, false])
      queryClient.invalidateQueries([
        'jobAssignProRequests',
        selectedJobInfo.jobId,
      ])
    }
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
          // jobRequestReview: selectedJob.jobRequestReview!,
          jobPrices: selectedJob.jobPrices!,
          jobAssign: selectedJob.jobAssign!,
          jobRequestHistory: selectedJob.jobRequestHistory!,
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

  useEffect(() => {
    if (
      jobInfoList.map(value => value.status).includes('error') ||
      jobPriceList.map(value => value.status).includes('error') ||
      jobAssignList.map(value => value.status).includes('error') ||
      jobRequestHistoryList.map(value => value.status).includes('error')
    ) {
      throw new Error('Server error')
    }
  }, [jobInfoList, jobPriceList, jobAssignList, jobRequestHistoryList])

  useEffect(() => {
    if (sourceFiles) {
      setSourceFileList(sourceFiles)
    }
  }, [sourceFiles])

  return (
    <Card sx={{ height: '100%' }}>
      {assignJobMutation.isLoading ||
      createRequestMutation.isLoading ||
      createBulkRequestMutation.isLoading ||
      assignJobMutation.isLoading ||
      reAssignJobMutation.isLoading ||
      addProCurrentRequestMutation.isLoading ||
      requestRedeliveryMutation.isLoading ||
      addJobFeedbackMutation.isLoading ||
      saveJobPricesMutation.isLoading ||
      setJobStatusMutation.isLoading ||
      linguistTeamLoading ? (
        <OverlaySpinner />
      ) : null}
      {jobInfoList.map(value => value.status).includes('loading') ||
      jobPriceList.map(value => value.status).includes('loading') ||
      jobAssignList.map(value => value.status).includes('loading') ||
      jobRequestHistoryList.map(value => value.status).includes('loading') ? (
        <OverlaySpinner />
      ) : (
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
                        query: {
                          orderId: orderId,
                          jobId: selectedJobId,
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
                          // jobRequestReview: value.jobRequestReview!,
                          jobPrices: value.jobPrices!,
                          jobAssign: value.jobAssign!,
                          jobAssignDefaultRound: value.jobAssignDefaultRound,
                          jobRequestHistory: value.jobRequestHistory!,
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
                      selectedJobInfo.jobPrices?.priceId === null)) ||
                  (selectedJobInfo?.jobAssign &&
                    selectedJobInfo?.jobAssign.length > 0 &&
                    !addRoundMode &&
                    !addProsMode &&
                    !assignProMode) ||
                  !selectedJobUpdatable()
                  ? 10.416
                  : 7.632
                : value === 'info'
                  ? selectedJobInfo?.jobInfo.pro === null
                    ? 10.416
                    : 7.632
                  : value === 'prices'
                    ? 10.416
                    : value === 'history'
                      ? 10.416
                      : value === 'review'
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
                      onClick={(e: MouseEvent<HTMLElement>) =>
                        e.preventDefault()
                      }
                    />

                    <CustomTab
                      value='review'
                      label='Review request'
                      iconPosition='start'
                      icon={
                        <Icon
                          icon='material-symbols:rate-review-outline'
                          fontSize={18}
                        />
                      }
                      onClick={(e: MouseEvent<HTMLElement>) =>
                        e.preventDefault()
                      }
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
                          {selectedJobInfo.jobPrices?.priceId === null ? (
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
                      onClick={(e: MouseEvent<HTMLElement>) =>
                        e.preventDefault()
                      }
                    />
                    <CustomTab
                      value='assign'
                      label='Assign pro'
                      iconPosition='start'
                      icon={
                        <Icon icon='mdi:account-outline' fontSize={'18px'} />
                      }
                      onClick={(e: MouseEvent<HTMLElement>) =>
                        e.preventDefault()
                      }
                    />

                    <CustomTab
                      value='history'
                      label='Request history'
                      iconPosition='start'
                      // disabled
                      icon={
                        <Icon icon='ic:outline-history' fontSize={'18px'} />
                      }
                      onClick={(e: MouseEvent<HTMLElement>) =>
                        e.preventDefault()
                      }
                    />
                  </TabList>
                  <TabPanel value='info' sx={{ height: '100%' }}>
                    {selectedJobInfo.jobInfo && jobDetails && langItem ? (
                      <JobInfo
                        jobInfo={selectedJobInfo?.jobInfo!}
                        jobInfoList={jobInfoList.map(value => value.data)}
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
                        selectedJobUpdatable={selectedJobUpdatable()}
                        jobDetail={jobDetail}
                      />
                    ) : null}
                  </TabPanel>
                  <TabPanel value='review' sx={{ height: '100%' }}>
                    {/* {selectedJobInfo.jobRequestReview && lspList ? (
                      <ReviewRequest
                        requestReviewList={selectedJobInfo.jobRequestReview}
                        lspList={lspList ?? []}
                      />
                    ) : null} */}
                    {selectedJobInfo.jobInfo ? (
                      <ReviewRequest
                        jobId={selectedJobInfo.jobId}
                        // requestReviewList={selectedJobInfo.jobRequestReview}
                        lspList={lspList ?? []}
                        jobInfo={selectedJobInfo.jobInfo}
                      />
                    ) : null}
                  </TabPanel>
                  <TabPanel value='prices' sx={{ height: '100%' }}>
                    <Box sx={{ height: '100%' }}>
                      <Box
                        sx={{
                          padding: '10px 20px',
                          background: '#FFF6E5',
                          borderRadius: '10px',
                          mb: '8px',
                        }}
                      >
                        <Typography
                          fontSize={12}
                          fontWeight={400}
                          color='#4C4E64'
                        >
                          {selectedJobInfo?.jobAssign.length === 0
                            ? 'The information will be delivered to Pro along with the job request'
                            : selectedJobInfo?.jobAssign.length > 0 &&
                                selectedJobInfo.jobInfo.pro === null
                              ? 'Changes will only be applied to new requests'
                              : selectedJobInfo.jobInfo.pro !== null
                                ? 'Changes will also be applied to the Pro’s job detail page'
                                : null}
                        </Typography>
                      </Box>
                      <Card
                        sx={{
                          height: 'calc(100% - 50px)',
                          maxHeight: 'calc(100% - 50px)',
                          position: 'relative',
                        }}
                      >
                        <form
                          onSubmit={itemHandleSubmit(
                            onClickUpdatePrice,
                            onError,
                          )}
                          style={{
                            height: '100%',
                          }}
                        >
                          {selectedJobInfo.jobPrices?.priceId === null ||
                          editPrices ? (
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
                                setIsNotApplicable={setIsNotApplicable}
                                errorRefs={errorRefs}
                                details={details}
                                append={append}
                                remove={remove}
                                update={update}
                              />
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
                              selectedJobUpdatable={selectedJobUpdatable()}
                              details={details}
                              append={append}
                              remove={remove}
                              update={update}
                            />
                          )}

                          <Box
                            display='flex'
                            alignItems='center'
                            justifyContent={
                              !editPrices &&
                              selectedJobInfo.jobPrices?.priceId !== null
                                ? 'flex-end'
                                : 'space-between'
                            }
                            sx={{
                              width: '100%',
                              borderTop: '1px solid #E9EAEC',
                              padding: '32px 20px',
                              height: '100px',
                              position: 'absolute',
                              bottom: 0,
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography fontWeight='bold' fontSize={14}>
                                Total price
                              </Typography>
                              <Box
                                display='flex'
                                alignItems='center'
                                marginLeft={20}
                                marginRight={5}
                              >
                                {!editPrices ||
                                selectedJobInfo.jobPrices.priceId !== null ? (
                                  <Typography fontWeight='bold' fontSize={14}>
                                    {priceData()
                                      ? isNotApplicable
                                        ? formatCurrency(
                                            formatByRoundingProcedure(
                                              Number(
                                                getItem(
                                                  `items.${0}.totalPrice`,
                                                ),
                                              ),
                                              getItem().items?.[0]?.detail?.[0]
                                                ?.currency === 'USD' ||
                                                getItem().items?.[0]
                                                  ?.detail?.[0]?.currency ===
                                                  'SGD'
                                                ? 2
                                                : getItem().items?.[0]
                                                      ?.detail?.[0]
                                                      ?.currency === 'KRW'
                                                  ? 10
                                                  : 0,
                                              0,
                                              getItem().items?.[0]?.detail?.[0]
                                                ?.currency ?? 'KRW',
                                            ),
                                            getItem().items?.[0]?.detail?.[0]
                                              ?.currency ?? null,
                                          )
                                        : formatCurrency(
                                            formatByRoundingProcedure(
                                              // getValues로 가져오면 폼에서 계산된 값이 반영됨
                                              // fields에서 가져오면 서버에서 넘어온 값이 반영됨
                                              Number(
                                                getItem(
                                                  `items.${0}.totalPrice`,
                                                ),
                                              ),
                                              // fields?.[index].totalPrice! ?? 0,
                                              priceData()?.decimalPlace ??
                                                (priceData()?.currency ===
                                                  'USD' ||
                                                  priceData()?.currency ===
                                                    'SGD')
                                                ? 2
                                                : priceData()?.currency ===
                                                    'KRW'
                                                  ? 10
                                                  : 0,
                                              priceData()?.roundingProcedure ??
                                                PriceRoundingResponseEnum.Type_0,
                                              priceData()?.currency ?? null,
                                            ),
                                            priceData()?.currency ?? null,
                                          )
                                      : '-'}
                                  </Typography>
                                ) : (
                                  <Typography fontWeight='bold' fontSize={14}>
                                    {isNotApplicable
                                      ? getItem().items?.[0]?.detail?.[0]
                                          ?.currency
                                        ? formatCurrency(
                                            formatByRoundingProcedure(
                                              Number(
                                                getItem(
                                                  `items.${0}.totalPrice`,
                                                ),
                                              ),
                                              getItem().items?.[0]?.detail?.[0]
                                                ?.currency === 'USD' ||
                                                getItem().items?.[0]
                                                  ?.detail?.[0]?.currency ===
                                                  'SGD'
                                                ? 2
                                                : getItem().items?.[0]
                                                      ?.initialPrice
                                                      ?.currency === 'KRW'
                                                  ? 10
                                                  : 1,
                                              0,
                                              getItem().items?.[0]?.detail?.[0]
                                                ?.currency ?? 'KRW',
                                            ),
                                            getItem().items?.[0]?.detail?.[0]
                                              ?.currency ?? null,
                                          )
                                        : formatCurrency(
                                            formatByRoundingProcedure(
                                              Number(
                                                getItem(
                                                  `items.${0}.totalPrice`,
                                                ),
                                              ),
                                              getItem().items?.[0]?.initialPrice
                                                ?.currency === 'USD' ||
                                                getItem().items?.[0]
                                                  ?.initialPrice?.currency ===
                                                  'SGD'
                                                ? 2
                                                : getItem().items?.[0]
                                                      ?.initialPrice
                                                      ?.currency === 'KRW'
                                                  ? 10
                                                  : 1,
                                              0,
                                              getItem().items?.[0]?.initialPrice
                                                ?.currency ?? 'KRW',
                                            ),
                                            getItem().items?.[0]?.initialPrice
                                              ?.currency ?? null,
                                          )
                                      : priceData()
                                        ? formatCurrency(
                                            formatByRoundingProcedure(
                                              Number(
                                                getItem(
                                                  `items.${0}.totalPrice`,
                                                ),
                                              ) ?? 0,
                                              priceData()?.decimalPlace!,
                                              priceData()?.roundingProcedure!,
                                              priceData()?.currency! ?? 'KRW',
                                            ),
                                            priceData()?.currency! ?? null,
                                          )
                                        : currentInitialItem
                                          ? formatCurrency(
                                              formatByRoundingProcedure(
                                                Number(
                                                  getItem(
                                                    `items.${0}.totalPrice`,
                                                  ),
                                                ) ?? 0,
                                                getItem(
                                                  `items.${0}.initialPrice.numberPlace`,
                                                ),
                                                getItem(
                                                  `items.${0}.initialPrice.rounding`,
                                                ),
                                                getItem(
                                                  `items.${0}.initialPrice.currency`,
                                                ) || 'KRW',
                                              ),
                                              getItem(
                                                `items.${0}.initialPrice.currency`,
                                              ) || null,
                                            )
                                          : 0}
                                  </Typography>
                                )}
                                {editPrices ||
                                selectedJobInfo.jobPrices?.priceId === null ? (
                                  <IconButton
                                    onClick={() => {
                                      // getTotalPrice()
                                      updateTotalPrice()
                                    }}
                                  >
                                    <Icon icon='material-symbols:refresh' />
                                  </IconButton>
                                ) : null}
                              </Box>
                            </Box>
                            {editPrices ||
                            selectedJobInfo.jobPrices?.priceId === null ? (
                              <Box
                                display='flex'
                                alignItems='center'
                                gap='16px'
                              >
                                {selectedJobInfo.jobPrices?.priceId ===
                                null ? null : (
                                  <Button
                                    variant='outlined'
                                    onClick={() => {
                                      onClickUpdatePriceCancel()
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                )}

                                <Button
                                  variant='contained'
                                  // onClick={onClickUpdatePrice}
                                  type='submit'
                                  // disabled={!itemValid}
                                >
                                  {selectedJobInfo.jobInfo.pro
                                    ? 'Save changes'
                                    : 'Save'}
                                </Button>
                              </Box>
                            ) : null}
                          </Box>
                        </form>
                      </Card>
                    </Box>
                  </TabPanel>
                  <TabPanel value='assign' sx={{ height: '100%', padding: 0 }}>
                    {(selectedJobInfo &&
                      (selectedJobInfo?.jobInfo?.name === null ||
                        selectedJobInfo?.jobPrices?.priceId === null ||
                        selectedJobInfo?.jobAssign === null)) ||
                    (selectedJobInfo?.jobAssign.length === 0 &&
                      !selectedJobUpdatable()) ? (
                      selectedJobUpdatable() ? (
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',

                            height: '100%',
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
                      ) : (
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Typography fontSize={14} color='#8D8E9A'>
                            There are no requests or assigned Pro yet
                          </Typography>
                        </Box>
                      )
                    ) : selectedJobInfo.jobAssign ? (
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
                        proList={
                          proList || { data: [], totalCount: 0, count: 0 }
                        }
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
                        selectedJobUpdatable={selectedJobUpdatable()}
                      />
                    ) : null}
                  </TabPanel>
                  <TabPanel value='history' sx={{ height: '100%' }}>
                    <RequestHistory
                      history={selectedJobInfo.jobRequestHistory}
                      jobId={selectedJobInfo.jobId}
                    />
                  </TabPanel>
                </TabContext>
              )}
            </Box>
          </Grid>
          {(selectedJobInfo &&
            (selectedJobInfo.jobInfo.name === null ||
              selectedJobInfo.jobPrices?.priceId === null ||
              selectedJobInfo.jobAssign === null)) ||
          value === 'history' ||
          value === 'review' ? null : (
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
                    // padding: '20px',
                    padding: sourceFileList.some(file =>
                      videoExtensions.includes(
                        file.name.split('.').pop()?.toLowerCase() ?? '',
                      ),
                    )
                      ? '20px'
                      : '14px 20px',
                    // height:
                    minHeight: sourceFileList.some(file =>
                      videoExtensions.includes(
                        file.name.split('.').pop()?.toLowerCase() ?? '',
                      ),
                    )
                      ? 'none'
                      : '64px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    borderBottom: '1px solid rgba(76, 78, 100, 0.12)',
                  }}
                >
                  {sourceFileList.some(file =>
                    videoExtensions.includes(
                      file.name.split('.').pop()?.toLowerCase() ?? '',
                    ),
                  ) ? (
                    <Box
                      sx={{
                        display: hiddenGlosubButton ? 'none' : 'flex',
                        gap: '10px',
                        width: '100%',
                        alignItems: 'center',
                      }}
                    >
                      <Tooltip
                        title={viewProgressInfoButtonStatus()}
                        disableHoverListener={
                          viewProgressInfoButtonStatus() === 'active'
                        }
                      >
                        <Box sx={{ width: '100%' }}>
                          <Button
                            variant='outlined'
                            fullWidth
                            disabled={
                              viewProgressInfoButtonStatus() !== 'active'
                            }
                            sx={{ borderColor: '#B3B6FF' }}
                            onClick={() => {
                              window.open(
                                `${process.env.NEXT_PUBLIC_GLOSUB_DOMAIN ?? 'https://glosub-dev.gloground.com'}/?jobId=${selectedJobId}&token=${getUserTokenFromBrowser()}&role=${currentRole?.name}`,
                                '_blank',
                              )
                            }}
                          >
                            <Icon icon='tabler:progress' fontSize={20} />
                            {/* <Image
                              src='/images/icons/job-icons/glosub.svg'
                              alt=''
                              width={20}
                              height={20}
                            /> */}
                            &nbsp; View job progress
                          </Button>
                        </Box>
                      </Tooltip>

                      <IconButton
                        sx={{ padding: 0 }}
                        onClick={onClickViewProgressInfoButton}
                      >
                        <Icon
                          icon='material-symbols:info-outline'
                          fontSize={20}
                          color='#8D8E9A'
                        ></Icon>
                      </IconButton>
                    </Box>
                  ) : null}
                  {sourceFileList.some(file =>
                    videoExtensions.includes(
                      file.name.split('.').pop()?.toLowerCase() ?? '',
                    ),
                  ) ? (
                    <Box
                      sx={{
                        display: hiddenGlosubButton ? 'none' : 'flex',
                        gap: '10px',
                        width: '100%',
                        alignItems: 'center',
                      }}
                    >
                      <Tooltip
                        title={reviewInGlosubButtonStatus()}
                        disableHoverListener={
                          reviewInGlosubButtonStatus() === 'active'
                        }
                      >
                        <Box sx={{ width: '100%' }}>
                          <Button
                            variant='outlined'
                            fullWidth
                            disabled={reviewInGlosubButtonStatus() !== 'active'}
                            sx={{ borderColor: '#B3B6FF' }}
                            onClick={() => {
                              window.open(
                                `${process.env.NEXT_PUBLIC_GLOSUB_DOMAIN ?? 'https://glosub-dev.gloground.com'}/?jobId=${selectedJobId}&token=${getUserTokenFromBrowser()}&role=${currentRole?.name}&mode=qc`,
                                '_blank',
                              )
                            }}
                          >
                            <Icon
                              icon='material-symbols:rate-review-outline'
                              fontSize={20}
                            />
                            &nbsp; Review in GloSub
                          </Button>
                        </Box>
                      </Tooltip>

                      <IconButton
                        sx={{ padding: 0 }}
                        onClick={onClickReviewInGloSubInfoButton}
                      >
                        <Icon
                          icon='material-symbols:info-outline'
                          fontSize={20}
                          color='#8D8E9A'
                        ></Icon>
                      </IconButton>
                    </Box>
                  ) : null}
                </Box>
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
                          background:
                            expanded === 'panel1' ? '#F7F8FF' : '#FFF',
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
                          <Box
                            sx={{ display: 'flex', flexDirection: 'column' }}
                          >
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
                            {selectedJobUpdatable() &&
                              (selectedJobInfo.jobInfo.status === 60200 ||
                                selectedJobInfo.jobInfo.status === 60250 ||
                                selectedJobInfo.jobInfo.status === 60300 ||
                                selectedJobInfo.jobInfo.status === 60400 ||
                                selectedJobInfo.jobInfo.status === 60500) && (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    mt: '8px',
                                  }}
                                >
                                  <Button
                                    fullWidth
                                    variant='contained'
                                    sx={{ display: 'flex', flex: 1 }}
                                    onClick={() => onClickUploadSourceFile()}
                                  >
                                    Upload files
                                  </Button>
                                  <Button
                                    fullWidth
                                    variant='contained'
                                    sx={{ display: 'flex', flex: 1 }}
                                    onClick={() => onClickImportFiles()}
                                  >
                                    Import files
                                  </Button>
                                </Box>
                              )}
                            {sourceFileList && sourceFileList.length > 0
                              ? Object.entries(
                                  sourceFileList.reduce(
                                    (acc: { [key: string]: any[] }, cur) => {
                                      const date = cur.savedAt!
                                      if (!acc[date]) {
                                        acc[date] = []
                                      }
                                      acc[date].push(cur)
                                      acc[date].sort((a, b) => a.id - b.id)
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
                                                auth?.getValue().user
                                                  ?.timezone!,
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
                                              value.filter(
                                                value =>
                                                  value.downloadAvailable,
                                              ),
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
                          background:
                            expanded === 'panel2' ? '#F7F8FF' : '#FFF',
                          // padding: '20px',
                          margin: '0 !important',
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls='panel1bh-content'
                          id='panel1bh-header'
                          sx={{ padding: '20px' }}
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
                            jobDeliveriesFeedbacks?.deliveries &&
                            jobDeliveriesFeedbacks?.deliveries?.length > 0 &&
                            selectedJobUpdatable() ? (
                              <>
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
                                sx={{
                                  padding: '0 20px 16px 20px',
                                }}
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
                              <Box>
                                {jobDeliveriesFeedbacks?.deliveries
                                  .sort((a, b) => {
                                    const dateA = new Date(a.deliveredDate)
                                    const dateB = new Date(b.deliveredDate)
                                    return dateB.getTime() - dateA.getTime()
                                  })
                                  .map((delivery, index) => (
                                    <Box
                                      key={delivery.id}
                                      sx={{ borderBottom: '1px solid #E9EAEC' }}
                                    >
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                          gap: '10px',
                                          padding:
                                            index !== 0
                                              ? '20px'
                                              : '0 20px 20px 20px',
                                        }}
                                      >
                                        <Typography
                                          variant='body1'
                                          fontWeight={600}
                                        >
                                          {delivery.deliveredDate
                                            ? convertTimeToTimezone(
                                                delivery.deliveredDate,
                                                auth?.getValue().user
                                                  ?.timezone!,
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
                                          gap: '8px',
                                          padding: '0 20px 20px 20px',
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
                                          padding: '0 20px 0 20px',
                                        }}
                                      >
                                        <Typography
                                          fontSize={14}
                                          fontWeight={400}
                                          color='#4C4E64'
                                        >
                                          Notes from Pro
                                        </Typography>
                                      </Box>
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',

                                          padding: '8px 20px 20px 20px',
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
                                  ))}
                              </Box>
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
                          background:
                            expanded === 'panel3' ? '#F7F8FF' : '#FFF',
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
                          <Box
                            sx={{ display: 'flex', flexDirection: 'column' }}
                          >
                            {/* {selectedJobInfo.jobInfo.status === 60400 ||
                          selectedJobInfo.jobInfo.status === 60500 ||
                          selectedJobInfo.jobInfo.status === 60250 ? ( */}
                            {selectedJobUpdatable() && (
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
                            )}
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
                                        addJobFeedbackData === null
                                          ? true
                                          : false
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
                                        <Box
                                          sx={{ display: 'flex', gap: '8px' }}
                                        >
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
                                      const newSelectedRows = {
                                        ...selectedRows,
                                      }
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
      )}
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
