import {
  Fragment,
  MouseEvent,
  Suspense,
  SyntheticEvent,
  useContext,
  useEffect,
  useState,
} from 'react'

// ** style components
import { Icon } from '@iconify/react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { v4 as uuidv4 } from 'uuid'
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Switch,
  Tab,
  Typography,
} from '@mui/material'
import styled from 'styled-components'
import { DataGrid, GridColumns } from '@mui/x-data-grid'

// ** contexts
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { AbilityContext } from '@src/layouts/components/acl/Can'

// ** store
import { useAppDispatch, useAppSelector } from '@src/hooks/useRedux'
import { setIsReady, setQuote, setQuoteLang } from '@src/store/quote'

// ** Next
import { useRouter } from 'next/router'

// ** components
import QuotesProjectInfoDetail from './components/project-info'
import QuotesLanguageItemsDetail from './components/language-items'
import QuotesClientDetail from './components/client'
import ClientQuotesFormContainer from '@src/pages/components/form-container/clients/client-container'
import DiscardModal from '@src/@core/components/common-modal/discard-modal'
import EditSaveModal from '@src/@core/components/common-modal/edit-save-modal'
import ProjectInfoForm from '@src/pages/components/forms/quotes-project-info-form'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import DeleteConfirmModal from '@src/pages/client/components/modals/delete-confirm-modal'
import ProjectTeamFormContainer from '../components/form-container/project-team-container'
import ModalWithButtonName from '@src/pages/client/components/modals/modal-with-button-name'
import VersionHistory from './components/version-history'
import VersionHistoryModal from './components/version-history-detail'
import DownloadQuotesModal from './components/pdf-download/download-qoutes-modal'
import PrintQuotePage from './components/pdf-download/quote-preview'

// ** react hook form
import { useFieldArray, useForm } from 'react-hook-form'

// ** type & validation
import {
  MemberType,
  ProjectTeamType,
  projectTeamSchema,
} from '@src/types/schema/project-team.schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { ClientFormType, clientSchema } from '@src/types/schema/client.schema'
import {
  ClientFormType as ClientPostType,
  LanguagePairsPostType,
  LanguagePairsType,
  ProjectTeamFormType,
} from '@src/types/common/orders-and-quotes.type'
import {
  QuoteDownloadData,
  QuoteStatusType,
  QuotesProjectInfoAddNewType,
  QuotesProjectInfoFormType,
  VersionHistoryType,
} from '@src/types/common/quotes.type'
import {
  quotesProjectInfoDefaultValue,
  quotesProjectInfoSchema,
} from '@src/types/schema/quotes-project-info.schema'
import { useGetAllClientPriceList } from '@src/queries/price-units.query'
import { ItemType, PostItemType } from '@src/types/common/item.type'
import { itemSchema } from '@src/types/schema/item.schema'
import { languageType } from '../add-new'

// ** hook
import useModal from '@src/hooks/useModal'

// ** apis
import {
  useGetClient,
  useGetLangItem,
  useGetProjectInfo,
  useGetProjectTeam,
  useGetVersionHistory,
} from '@src/queries/quotes.query'
import {
  confirmQuote,
  deleteQuotes,
  patchQuoteItems,
  patchQuoteLanguagePairs,
  patchQuoteProjectInfo,
  restoreVersion,
} from '@src/apis/quote/quotes.api'
import { getClientPriceList } from '@src/apis/company/company-price.api'

// ** helpers
import { getProjectTeamColumns } from '@src/shared/const/columns/order-detail'
import {
  FullDateTimezoneHelper,
  convertLocalTimezoneToUTC,
  formatDateToISOString,
} from '@src/shared/helpers/date.helper'
import { transformTeamData } from '@src/shared/transformer/team.transformer'

// ** react query
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'

// ** permission class
import { quotes } from '@src/shared/const/permission-class'
import { getCurrentRole } from '@src/shared/auth/storage'
import ClientQuote from './components/client-quote'
import SelectReasonModal from '../components/modal/select-reason-modal'
import { CancelReasonType } from '@src/types/requests/detail.type'
import { update } from 'lodash'
import { useGetStatusList } from '@src/queries/common.query'
import EditAlertModal from '@src/@core/components/common-modal/edit-alert-modal'
import Link from 'next/link'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { QuoteStatusChip } from '@src/@core/components/chips/chips'
import { CancelOrderReason } from '@src/shared/const/reason/reason'
import { UserRoleType } from '@src/context/types'
import { ProjectInfoType } from '@src/types/common/quotes.type'
import { ClientType, ProjectTeamListType } from '@src/types/orders/order-detail'
import { RoundingProcedureList } from '@src/shared/const/rounding-procedure/rounding-procedure'

type MenuType = 'project' | 'history' | 'team' | 'client' | 'item' | 'quote'

export type updateProjectInfoType =
  | QuotesProjectInfoFormType
  | ProjectTeamFormType
  | ClientPostType
  | { tax: null | number; isTaxable: boolean }
  | { tax: null | number; isTaxable: boolean; subtotal: number }
  | { status: number }
  | { status: number; reason: CancelReasonType }
  | { status: number; isConfirmed: boolean }
  | { languagePairs: Array<LanguagePairsType> }
  | { items: Array<PostItemType> }
  | { languagePairs: Array<LanguagePairsType>; items: Array<PostItemType> }

export default function QuotesDetail() {
  const router = useRouter()
  const { data: statusList } = useGetStatusList('Quote')
  const ability = useContext(AbilityContext)
  const auth = useRecoilValueLoadable(authState)
  const currentRole = getCurrentRole()
  const { id } = router.query

  const { openModal, closeModal } = useModal()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const menuQuery = router.query.menu as MenuType
  const [menu, setMenu] = useState<MenuType>(
    currentRole && currentRole.name === 'CLIENT' ? 'quote' : 'project',
  )
  const [downloadData, setDownloadData] = useState<QuoteDownloadData | null>(
    null,
  )

  const [downloadLanguage, setDownloadLanguage] = useState<'EN' | 'KO'>('EN')

  const User = new quotes(auth.getValue().user?.id!)

  const isUpdatable = ability.can('update', User)
  const isDeletable = ability.can('delete', User)

  const canUseFeature = (
    /**
     * featureName Convention
     * feature-name
     * tab-projectInfo
     * button-confirmQuote
     * button-cancelQuote
     *  */
    featureName:
      | 'tab-ProjectInfo'
      | 'tab-Languages&Items'
      | 'tab-Client'
      | 'tab-ProjectTeam'
      | 'tab-Restore'
      | 'button-DownloadQuote'
      | 'button-CreateOrder'
      | 'button-ConfirmQuote'
      | 'button-CancelQuote'
      | 'button-DeleteQuote',
  ): boolean => {
    let flag = false
    if (currentRole! && currentRole.name !== 'CLIENT') {
      switch (featureName) {
        case 'tab-ProjectInfo':
        case 'tab-Languages&Items':
          flag =
            isUpdatable &&
            (project?.status === 'New' ||
              project?.status === 'In preparation' ||
              project?.status === 'Internal review' ||
              project?.status === 'Revision requested' ||
              project?.status === 'Under revision' ||
              (project?.status === 'Expired' &&
                project?.confirmedAt === null)) &&
            isIncludeProjectTeam()
          break
        case 'tab-Client':
          flag =
            isUpdatable &&
            project?.status !== 'Changed into order' &&
            project?.status !== 'Rejected' &&
            project?.status !== 'Canceled' &&
            !!!client?.contactPerson?.userId &&
            isIncludeProjectTeam()
          break
        case 'tab-ProjectTeam':
          flag =
            isUpdatable &&
            project?.status !== 'Changed into order' &&
            project?.status !== 'Rejected' &&
            project?.status !== 'Canceled' &&
            isIncludeProjectTeam()
          break
        case 'tab-Restore':
          flag =
            isUpdatable &&
            (project?.status === 'Revision requested' ||
              project?.status === 'Under revision') &&
            isIncludeProjectTeam()
          break
        case 'button-DownloadQuote':
          flag =
            (project?.status === 'Quote sent' ||
              project?.status === 'Client review' ||
              project?.status === 'Revision requested' ||
              project?.status === 'Revised' ||
              project?.status === 'Accepted' ||
              project?.status === 'Changed into order' ||
              project?.status === 'Expired' ||
              project?.status === 'Rejected') &&
            isIncludeProjectTeam()
          break
        case 'button-CreateOrder':
          flag =
            !project?.linkedOrder &&
            (project?.status === 'Revision requested' ||
              project?.status === 'Revised' ||
              project?.status === 'Accepted' ||
              project?.status === 'Expired') &&
            isIncludeProjectTeam()
          break
        case 'button-ConfirmQuote':
          flag =
            project?.status === 'New' ||
            project?.status === 'In preparation' ||
            project?.status === 'Internal review' ||
            project?.status === 'Under revision' ||
            (project?.status === 'Expired' &&
              project?.confirmedAt === null &&
              isIncludeProjectTeam())
          break
        case 'button-CancelQuote':
          flag =
            project?.status !== 'Changed into order' &&
            project?.status !== 'Canceled' &&
            isIncludeProjectTeam()
          break
        case 'button-DeleteQuote':
          flag = isDeletable
            ? client?.isEnrolledClient
              ? project?.status === 'New' ||
                project?.status === 'In preparation' ||
                project?.status === 'Internal review' ||
                (project?.status === 'Expired' && project?.confirmedAt === null)
              : (project?.status === 'New' ||
                  project?.status === 'In preparation' ||
                  project?.status === 'Internal review' ||
                  project?.status === 'Expired') &&
                isIncludeProjectTeam()
            : false

          break
      }
    }
    return flag
  }

  // 로그인 한 유저가 project team에 속해있는지 체크, 만약 Master, Manager일 경우 true 리턴
  const isIncludeProjectTeam = () => {
    return Boolean(
      (currentRole?.name !== 'CLIENT' &&
        (currentRole?.type === 'Master' || currentRole?.type === 'Manager')) ||
        (currentRole?.type === 'General' &&
          team?.length &&
          team.some(item => item.userId === auth.getValue().user?.id!)),
    )
  }

  // ** store
  const dispatch = useAppDispatch()
  const quote = useAppSelector(state => state.quote)

  useEffect(() => {
    if (
      menuQuery &&
      ['project', 'history', 'team', 'client', 'item'].includes(menuQuery)
    ) {
      setMenu(menuQuery)
    }
  }, [menuQuery])

  useEffect(() => {
    if (!router.isReady) return
    router.replace(`/quotes/detail/${id}?menu=${menu}`)
  }, [menu, id])

  const queryClient = useQueryClient()

  // ** 1. Project info
  const [editProject, setEditProject] = useState(false)
  const {
    data: project,
    isLoading: isProjectLoading,
    refetch,
  } = useGetProjectInfo(Number(id))

  const {
    control: projectInfoControl,
    getValues: getProjectInfoValues,
    setValue: setProjectInfo,
    watch: projectInfoWatch,
    reset: projectInfoReset,
    formState: { errors: projectInfoErrors, isValid: isProjectInfoValid },
  } = useForm<QuotesProjectInfoAddNewType>({
    mode: 'onChange',
    defaultValues: {
      status: 20000,
      projectName: '',
      showDescription: false,
    },
    resolver: yupResolver(quotesProjectInfoSchema),
  })

  const setProjectInfoData = () => {
    if (!isProjectLoading && project && statusList) {
      // console.log(project.quoteDateTimezone)

      const defaultTimezone = {
        code: '',
        phone: '',
        label: '',
      }
      projectInfoReset({
        status:
          statusList?.find(value => value.label === project.status)?.value ??
          20000,
        workName: project.workName,
        projectName: project.projectName,
        projectDescription: project.projectDescription,
        category: project.category,
        serviceType: project.serviceType,
        expertise: project.expertise,
        showDescription: false,

        quoteDate: {
          date: project.quoteDate,
          timezone: project.quoteDateTimezone ?? defaultTimezone,
        },
        projectDueDate: {
          date: project.projectDueAt,
          timezone: project.projectDueTimezone ?? defaultTimezone,
        },
        quoteDeadline: {
          date: project.quoteDeadline,
          timezone: project.quoteDeadlineTimezone ?? defaultTimezone,
        },
        quoteExpiryDate: {
          date: project.quoteExpiryDate,
          timezone: project.quoteExpiryDateTimezone ?? defaultTimezone,
        },
        estimatedDeliveryDate: {
          date: project.estimatedDeliveryDate,
          timezone: project.estimatedDeliveryDateTimezone ?? defaultTimezone,
        },
      })

      setTax(project.tax ?? null)
      setTaxable(project.isTaxable)
      setProjectInfo('quoteDate', {
        date: project.quoteDate,
        timezone: project.quoteDateTimezone ?? defaultTimezone,
      })
    }
  }
  useEffect(() => {
    setProjectInfoData()
  }, [isProjectLoading, statusList, project])

  // console.log(getProjectInfoValues())

  // ** 2. Language & Items
  const [editItems, setEditItems] = useState(false)
  const { data: itemsWithLang, isLoading: isItemLoading } = useGetLangItem(
    Number(id),
  )
  const [languagePairs, setLanguagePairs] = useState<Array<languageType>>([])
  const {
    control: itemControl,
    getValues: getItem,
    setValue: setItem,
    trigger: itemTrigger,
    reset: itemReset,
    formState: { errors: itemErrors, isValid: isItemValid },
  } = useForm<{ items: ItemType[] }>({
    mode: 'onBlur',
    defaultValues: { items: [] },
    resolver: yupResolver(itemSchema),
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

  useEffect(() => {
    if (!isItemLoading && itemsWithLang) {
      ;(async function () {
        const priceList = await getClientPriceList({})
        setLanguagePairs(
          itemsWithLang?.items?.map(item => {
            if (!item.initialPrice) throw new Error('NO_InitialPrice')
            return {
              id: String(item.id),
              source: item.source!,
              target: item.target!,
              price: {
                id: item.initialPrice?.priceId!,
                isStandard: item.initialPrice?.isStandard!,
                priceName: item.initialPrice?.name!,
                groupName: 'Current price',
                category: item.initialPrice?.category!,
                serviceType: item.initialPrice?.serviceType!,
                currency: item.initialPrice?.currency!,
                catBasis: item.initialPrice?.calculationBasis!,
                decimalPlace: item.initialPrice?.numberPlace!,
                roundingProcedure:
                  RoundingProcedureList[item.initialPrice?.rounding!].label,

                languagePairs: [],
                priceUnit: [],
                catInterface: { memSource: [], memoQ: [] },
              },
            }
          }),
        )
        const result = itemsWithLang?.items?.map(item => {
          return {
            id: item.id,
            name: item.itemName,
            itemName: item.itemName,
            source: item.source,
            target: item.target,
            priceId: item.priceId,
            detail: !item?.detail?.length ? [] : item.detail,
            analysis: item.analysis ?? [],
            totalPrice: item?.totalPrice ?? 0,
            dueAt: item?.dueAt ?? '',
            contactPerson: item?.contactPerson ?? {},
            // initialPrice는 quote 생성시점에 선택한 price의 값을 담고 있음
            // name, currency, decimalPlace, rounding 등 price와 관련된 계산이 필요할때는 initialPrice 내 값을 쓴다
            initialPrice: item.initialPrice ?? {},
            description: item.description,
            showItemDescription: item.showItemDescription,
            minimumPrice: item.minimumPrice,
            minimumPriceApplied: item.minimumPriceApplied,
            priceFactor: 0,
          }
        })
        itemReset({ items: result })
        itemTrigger()
      })()
    }
  }, [isItemLoading, itemsWithLang])

  // ** 3. Client
  const [editClient, setEditClient] = useState(false)
  const { data: client, isLoading: isClientLoading } = useGetClient(Number(id))
  const {
    control: clientControl,
    getValues: getClientValue,
    setValue: setClientValue,
    watch: clientWatch,
    reset: clientReset,
    formState: { errors: clientErrors, isValid: isClientValid },
  } = useForm<ClientFormType>({
    mode: 'onChange',
    defaultValues: {
      clientId: null,
      contactPersonId: null,
      addressType: 'shipping',
    },
    resolver: yupResolver(clientSchema),
  })

  useEffect(() => {
    if (!isClientLoading && client) {
      const addressType = client.clientAddress.find(
        address => address.isSelected,
      )?.addressType
      clientReset({
        clientId: client?.client?.clientId,
        contactPersonId: client?.contactPerson?.id ?? null,
        addressType: addressType === 'additional' ? 'shipping' : addressType,
      })
    }
  }, [isClientLoading])

  // ** 4. Project team
  const [editTeam, setEditTeam] = useState(false)
  const [teamPage, setTeamPage] = useState(0)
  const [teamPageSize, setTeamPageSize] = useState(10)
  const { data: team, isLoading: isTeamLoading } = useGetProjectTeam(Number(id))

  const [teams, setTeams] = useState<ProjectTeamListType[]>([])
  const {
    control: teamControl,
    getValues: getTeamValues,
    setValue: setTeamValues,
    handleSubmit: submitTeam,
    watch: teamWatch,
    reset: resetTeam,
    formState: { errors: teamErrors, isValid: isTeamValid },
  } = useForm<ProjectTeamType>({
    mode: 'onChange',
    defaultValues: {
      teams: [
        { type: 'supervisorId', id: null },
        {
          type: 'projectManagerId',
          id: auth.getValue().user?.userId!,
          name: getLegalName({
            firstName: auth.getValue().user?.firstName!,
            middleName: auth.getValue().user?.middleName,
            lastName: auth.getValue().user?.lastName!,
          }),
        },
        { type: 'member', id: null },
      ],
    },
    resolver: yupResolver(projectTeamSchema),
  })

  const {
    fields: members,
    append: appendMember,
    remove: removeMember,
    update: updateMember,
  } = useFieldArray({
    control: teamControl,
    name: 'teams',
  })

  // useEffect(() => {
  //   console.log(teams, 'team')
  // }, [teams])

  const fieldOrder = ['supervisorId', 'projectManagerId', 'member']
  const teamOrder = ['supervisor', 'projectManager', 'member']

  useEffect(() => {
    if (!isTeamLoading && team) {
      let viewTeams: ProjectTeamListType[] = [...team]

      if (!viewTeams.some(item => item.position === 'supervisor')) {
        viewTeams.unshift({
          id: uuidv4(),
          position: 'supervisor',
          userId: -1,
          firstName: '',
          middleName: '',
          lastName: '',
          jobTitle: '',
          email: '',
        })
      }
      if (!viewTeams.some(item => item.position === 'member')) {
        viewTeams.push({
          id: uuidv4(),
          position: 'member',
          userId: 0,
          firstName: '',
          middleName: '',
          lastName: '',
          jobTitle: '',
          email: '',
        })
      }

      const res = viewTeams.sort((a, b) => {
        const aIndex = teamOrder.indexOf(a.position)
        const bIndex = teamOrder.indexOf(b.position)
        return aIndex - bIndex
      })

      console.log(res)

      if (viewTeams.length) setTeams(res)

      const teams: Array<{
        type: MemberType
        id: number | null
        name: string
      }> = team.map(item => ({
        type:
          item.position === 'projectManager'
            ? 'projectManagerId'
            : item.position === 'supervisor'
            ? 'supervisorId'
            : 'member',
        id: item.userId,
        name: getLegalName({
          firstName: item?.firstName!,
          middleName: item?.middleName,
          lastName: item?.lastName!,
        }),
      }))
      if (!teams.some(item => item.type === 'supervisorId')) {
        teams.unshift({ type: 'supervisorId', id: null, name: '' })
      }

      if (!teams.some(item => item.type === 'member')) {
        teams.push({ type: 'member', id: null, name: '' })
      }
      if (teams.length) {
        const res = teams.sort((a, b) => {
          const aIndex = fieldOrder.indexOf(a.type)
          const bIndex = fieldOrder.indexOf(b.type)
          return aIndex - bIndex
        })

        resetTeam({ teams: res })
      }
    }
  }, [isTeamLoading, team])

  const { data: priceUnitsList } = useGetAllClientPriceList()

  const [tax, setTax] = useState<number | null>(project!.tax)
  const [taxable, setTaxable] = useState(project?.isTaxable || false)

  // ** Version history
  const [historyPageSize, setHistoryPageSize] = useState(10)
  const { data: versionHistory, isLoading: versionHistoryLoading } =
    useGetVersionHistory(Number(id!))

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
          <Box>
            {FullDateTimezoneHelper(
              row.downloadedAt,
              auth.getValue().user?.timezone!,
            )}
          </Box>
        )
      },
    },
  ]

  const restoreMutation = useMutation((id: number) => restoreVersion(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['quotesDetail'])
    },
    onError: () => onMutationError(),
  })

  const reloadQuoteDetail = () => {
    // tax 정보 변경 시 setTax를 하게 되는데 이때 cancel하게 되면 서버와 화면 데이터가 달라짐
    queryClient.invalidateQueries(['quotesDetail']).then(() => {
      setProjectInfoData()
    })
  }

  const onClickRestoreVersion = () => {
    openModal({
      type: 'RestoreConfirmModal',
      children: (
        <ModalWithButtonName
          message='Are you sure you want to restore this version?'
          onClick={() => restoreMutation.mutate(Number(id))}
          onClose={() => closeModal('RestoreConfirmModal')}
          iconType='error'
          rightButtonName='Restore'
        />
      ),
    })
  }

  const onClickVersionHistoryRow = (history: VersionHistoryType) => {
    openModal({
      type: 'VersionHistoryModal',
      children: (
        <Dialog
          open={true}
          onClose={() => closeModal('VersionHistoryModal')}
          maxWidth='lg'
          fullWidth
        >
          <DialogContent sx={{ padding: '50px 60px', minHeight: '900px' }}>
            <Grid container spacing={6}>
              <VersionHistoryModal id={Number(id)} history={history} />
              {currentRole && currentRole.name === 'CLIENT' ? null : (
                <Grid
                  item
                  xs={12}
                  display='flex'
                  gap='12px'
                  alignItems='center'
                  justifyContent='center'
                >
                  <Button
                    variant='outlined'
                    color='secondary'
                    sx={{ width: '226px' }}
                    onClick={() => closeModal('VersionHistoryModal')}
                  >
                    Close
                  </Button>
                  {canUseFeature('tab-Restore') ? (
                    <Button
                      variant='contained'
                      sx={{ width: '226px' }}
                      onClick={onClickRestoreVersion}
                    >
                      Restore this version
                    </Button>
                  ) : null}
                </Grid>
              )}
            </Grid>
          </DialogContent>
        </Dialog>
      ),
    })
  }

  // ** Submits(save)
  function onSave(callBack: () => void) {
    openModal({
      type: 'EditSaveModal',
      children: (
        <EditSaveModal
          onClose={() => closeModal('EditSaveModal')}
          onClick={() => {
            closeModal('EditSaveModal')
            callBack()
          }}
        />
      ),
    })
  }

  useEffect(() => {
    // ** Client가 Status가 New(20300)인 Quote를 열람할 경우, 자동으로 Status를 Under review(20400)로 바꾸고 데이터를 리패치한다.
    if (currentRole && currentRole.name === 'CLIENT') {
      if (project && project.status === 'New') {
        patchQuoteProjectInfo(Number(id), { status: 20400 })
          .then(res => {
            refetch()
          })
          .catch(e => onMutationError())
      }
    }
    // LPM에서 status가 Revision requested일때 quote의 편집화면에 진입하면 status를 Under revision(20600) 으로 패치한다.
    console.log('currentRole', currentRole)
    if (currentRole && currentRole.name === 'LPM') {
      if (
        project &&
        project.status === 'Revision requested' &&
        (editProject || editItems || editClient || editTeam)
      ) {
        patchQuoteProjectInfo(Number(id), { status: 20600 })
          .then(res => {
            refetch()
          })
          .catch(e => onMutationError())
      }
    }
  }, [currentRole, project, editProject, editItems, editClient, editTeam])

  const updateProject = useMutation(
    (form: updateProjectInfoType) => patchQuoteProjectInfo(Number(id), form),
    {
      onSuccess: data => {
        setEditProject(false)
        setEditClient(false)
        setEditTeam(false)

        let res

        if (typeof data === 'number' || typeof data === 'string') {
          res = Number(data)
        } else if (typeof data === 'object' && data !== null) {
          res = Number(data.id)
        }

        if (res === Number(id)) {
          queryClient.invalidateQueries({
            queryKey: ['quotesDetail'],
          })
          queryClient.invalidateQueries(['quotesList'])
        } else {
          router.push(`/quotes/detail/${res}`)
        }
      },
      onError: () => onMutationError(),
    },
  )

  const confirmQuoteMutation = useMutation(() => confirmQuote(Number(id)), {
    onSuccess: data => {
      closeModal('ConfirmQuoteModal')

      let res

      if (typeof data === 'number' || typeof data === 'string') {
        res = Number(data)
      } else if (typeof data === 'object' && data !== null) {
        res = Number(data.id)
      }

      if (res === Number(id)) {
        queryClient.invalidateQueries({
          queryKey: ['quotesDetail'],
        })
        queryClient.invalidateQueries(['quotesList'])
      } else {
        router.push(`/quotes/detail/${res}`)
      }
    },
    onError: () => onMutationError(),
  })

  function onProjectInfoSave() {
    const projectInfo = getProjectInfoValues()

    onSave(() => updateProject.mutate(projectInfo))
  }

  async function onItemSave() {
    const items: PostItemType[] = getItem().items.map(item => {
      const { contactPerson, minimumPrice, priceFactor, source, target, ...filterItem } = item
      return {
        ...filterItem,
        contactPersonId: Number(item.contactPerson?.id!),
        description: item.description || '',
        analysis: item.analysis?.map(anal => anal?.data?.id!) || [],
        showItemDescription: item.showItemDescription ? '1' : '0',
        minimumPriceApplied: item.minimumPriceApplied ? '1' : '0',
        // name: item.itemName,
        sourceLanguage: item.source,
        targetLanguage: item.target,
      }
    })
    const langs: LanguagePairsType[] = languagePairs.map(item => {
      if (item?.price?.id) {
        return {
          // langPairId: Number(item.id),
          source: item.source,
          target: item.target,
          priceId: item.price.id,
        }
      }

      return {
        // langPairId: Number(item.id),
        source: item.source,
        target: item.target,
      }
    })
    const subtotal = items.reduce((accumulator, item) => {
      return accumulator + item.totalPrice
    }, 0)

    onSave(async () => {
      try {
        // await patchQuoteLanguagePairs(Number(id), langs)
        // await patchQuoteItems(Number(id), items)
        updateProject.mutate(
          {
            tax,
            isTaxable: taxable,
            subtotal: subtotal,
            languagePairs: langs,
            items: items,
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: ['quotesDetailItems'],
              })
              setEditItems(false)
            },
          },
        )
      } catch (e: any) {
        onMutationError()
      }
    })
  }

  function onClientSave() {
    const form = getClientValue()
    const clientInfo: ClientPostType = {
      //@ts-ignore
      addressType: form.addressType,
      clientId: form.clientId!,
      contactPersonId: form.contactPersonId,
    }
    onSave(() => updateProject.mutate(clientInfo))
  }

  function onProjectTeamSave() {
    const teams = transformTeamData(getTeamValues())
    onSave(() => updateProject.mutate(teams))
  }

  function onDiscard({ callback }: { callback: () => void }) {
    openModal({
      type: 'DiscardModal',
      children: (
        <DiscardModal
          onClose={() => {
            callback()
            closeModal('DiscardModal')
          }}
          onClick={() => {
            callback()
            closeModal('DiscardModal')
            reloadQuoteDetail()
          }}
        />
      ),
    })
  }

  type RenderSubmitButtonProps = {
    onCancel: () => void
    onSave: () => void
    isValid: boolean
  }

  function renderSubmitButton({
    onCancel,
    onSave,
    isValid,
  }: RenderSubmitButtonProps) {
    return (
      <Grid item xs={12}>
        <Box display='flex' gap='16px' justifyContent='center'>
          <Button variant='outlined' color='secondary' onClick={onCancel}>
            Cancel
          </Button>
          <Button variant='contained' disabled={!isValid} onClick={onSave}>
            Save
          </Button>
        </Box>
      </Grid>
    )
  }

  const deleteQuotesMutation = useMutation((id: number) => deleteQuotes(id), {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['quotesList'],
      })
      router.push('/quotes/quote-list')
    },
    onError: () => onMutationError(),
  })

  const onClickCancel = () => {
    openModal({
      type: 'CancelQuoteModal',
      children: (
        <SelectReasonModal
          onClose={() => closeModal('CancelQuoteModal')}
          onClick={(status: number, reason: CancelReasonType) =>
            updateProject.mutate(
              { status: status, reason: reason },
              {
                onSuccess: () => {
                  closeModal('CancelQuoteModal')
                },
              },
            )
          }
          title='Are you sure you want to cancel this quote?'
          vary='error'
          rightButtonText='Cancel'
          action='Canceled'
          from='lsp'
          statusList={statusList!}
          type='canceled'
          reasonList={CancelOrderReason}
        />
      ),
    })
  }

  const onClickDelete = () => {
    openModal({
      type: 'DeleteQuoteModal',
      children: (
        <DeleteConfirmModal
          onClose={() => closeModal('DeleteQuoteModal')}
          onDelete={() => deleteQuotesMutation.mutate(Number(id))}
          message='Are you sure you want to delete this quote?'
          title={`[${project?.corporationId}] ${project?.projectName}`}
        />
      ),
    })
  }

  function onMutationError() {
    toast.error('Something went wrong. Please try again.', {
      position: 'bottom-left',
    })
  }

  // ** Download pdf
  const onClickPreview = (lang: 'EN' | 'KO') => {
    const currentTime = formatDateToISOString(
      convertLocalTimezoneToUTC(new Date()),
    )
    makePdfData()
    dispatch(setQuoteLang(lang))
    dispatch(setQuote(downloadData))
    // patchQuoteProjectInfo(Number(id), { downloadedAt: currentTime }).catch(e =>
    //   onMutationError(),
    // )
    closeModal('PreviewModal')
  }

  function handlePrint() {
    closeModal('DownloadQuotesModal')
    router.push('/quotes/print')
  }

  const handleChange = (event: SyntheticEvent, newValue: MenuType) => {
    if (editProject || editItems || editClient || editTeam) {
      openModal({
        type: 'EditAlertModal',
        children: (
          <EditAlertModal
            onClose={() => closeModal('EditAlertModal')}
            onClick={() => {
              closeModal('EditAlertModal')
              setMenu(newValue)
              setEditProject(false)
              setEditItems(false)
              setEditClient(false)
              setEditTeam(false)
            }}
          />
        ),
      })
      return
    }

    setMenu(newValue)
  }

  useEffect(() => {
    if (quote.isReady && quote.quoteTotalData) {
      openModal({
        type: 'PreviewModal',
        isCloseable: false,
        children: (
          <Box
            sx={{
              width: '789px',
              height: '95vh',
              overflow: 'scroll',
              background: '#ffffff',
              boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
              paddingBottom: '24px',
            }}
          >
            <div className='page'>
              <PrintQuotePage
                data={quote.quoteTotalData}
                type='preview'
                user={auth.getValue().user!}
                lang={quote.lang}
              />
            </div>

            <Box display='flex' justifyContent='center' gap='10px'>
              <Button
                variant='outlined'
                sx={{ width: 226 }}
                onClick={() => {
                  closeModal('PreviewModal')
                  dispatch(setIsReady(false))
                }}
              >
                Close
              </Button>
              <Button
                variant='contained'
                sx={{ width: 226 }}
                onClick={() => {
                  handlePrint()
                  closeModal('PreviewModal')
                }}
              >
                Download
              </Button>
            </Box>
          </Box>
        ),
      })
    }
  }, [quote.isReady])

  const onClickDownloadQuotes = () => {
    openModal({
      type: 'DownloadQuotesModal',
      children: (
        <DownloadQuotesModal
          onClose={() => {
            closeModal('DownloadQuotesModal')
            dispatch(setIsReady(false))
          }}
          onClick={onClickPreview}
          clientQuoteLang={
            currentRole && currentRole.name === 'CLIENT'
              ? downloadLanguage
              : undefined
          }
        />
      ),
    })
  }

  const onClickConfirmQuote = () => {
    const projectStatus = () => {
      if (project?.status === 'Under revision') return 20700 // Revised로 변경
      else return 20300 // Quote sent로 변경, 초기값
    }
    openModal({
      type: 'ConfirmQuoteModal',
      children: (
        <CustomModal
          onClose={() => closeModal('ConfirmQuoteModal')}
          onClick={() =>
            // updateProject.mutate(
            //   { isConfirmed: true, status: projectStatus() },
            //   {
            //     onSuccess: () => {
            //       closeModal('ConfirmQuoteModal')
            //     },
            //   },
            // )
            confirmQuoteMutation.mutate()
          }
          title='Are you sure you want to confirm this quote? It will be delivered to the client.'
          vary='successful'
          rightButtonText='Confirm'
        />
      ),
    })
  }

  function makePdfData() {
    const pm = team?.find(value => value.position === 'projectManager')

    const res: QuoteDownloadData = {
      quoteId: Number(id!),
      adminCompanyName: 'GloZ Inc.',
      companyAddress: '3325 Wilshire Blvd Ste 626 Los Angeles CA 90010',
      corporationId: project?.corporationId ?? '',
      quoteDate: {
        date: project?.quoteDate ?? '',
        timezone: project?.quoteDateTimezone,
      },
      projectDueDate: {
        date: project?.projectDueAt ?? '',
        timezone: project?.projectDueTimezone,
      },
      quoteDeadline: {
        date: project?.quoteDeadline ?? '',
        timezone: project?.quoteDeadlineTimezone,
      },
      quoteExpiryDate: {
        date: project?.quoteExpiryDate ?? '',
        timezone: project?.quoteExpiryDateTimezone,
      },
      estimatedDeliveryDate: {
        date: project?.estimatedDeliveryDate ?? '',
        timezone: project?.estimatedDeliveryDateTimezone,
      },
      pm: {
        firstName: pm?.firstName!,
        lastName: pm?.lastName!,
        email: pm?.email!,
        middleName: pm?.middleName!,
      },
      companyName: client!.client.name,
      projectName: project?.projectName ?? '',
      client: client,
      contactPerson: client?.contactPerson ?? null,
      clientAddress: client?.clientAddress ?? [],
      langItem: itemsWithLang,
      subtotal: project?.subtotal,
    }

    setDownloadData(res)
  }
  useEffect(() => {
    makePdfData()
  }, [project, client])

  const deleteButtonDisabled = () => {
    if (client?.contactPerson?.userId === null) {
      return (
        !isDeletable ||
        (project?.status !== 'New' &&
          project?.status !== 'In preparation' &&
          project?.status !== 'Internal review' &&
          project?.status !== 'Expired')
      )
    } else {
      return (
        !isDeletable ||
        (project?.status !== 'New' &&
          project?.status !== 'In preparation' &&
          project?.status !== 'Internal review' &&
          project?.status === 'Expired' &&
          project?.confirmedAt !== null)
      )
    }
  }

  console.log(teams)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
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
            {editProject || editItems || editClient || editTeam ? null : (
              <IconButton
                sx={{ padding: '0 !important', height: '24px' }}
                onClick={() => router.push('/quotes/quote-list')}
              >
                <Icon icon='mdi:chevron-left' width={24} height={24} />
              </IconButton>
            )}

            <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <img
                src='/images/icons/quotes-icons/book.png'
                alt=''
                width='50px'
                height='50px'
              />
              <Typography variant='h5'>{project?.corporationId}</Typography>
              {project?.linkedOrder || project?.linkedRequest ? (
                <Box>
                  <IconButton
                    sx={{ width: '24px', height: '24px', padding: 0 }}
                    onClick={handleClick}
                  >
                    <Icon icon='mdi:dots-vertical' />
                  </IconButton>
                  <Menu
                    elevation={8}
                    anchorEl={anchorEl}
                    id='customized-menu'
                    onClose={handleClose}
                    open={Boolean(anchorEl)}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                  >
                    {project?.linkedRequest ? (
                      <MenuItem
                        sx={{
                          gap: 2,
                          '&:hover': {
                            background: 'inherit',
                            cursor: 'default',
                          },
                        }}
                      >
                        Linked requests :
                        <Link
                          href={
                            currentRole && currentRole.name === 'CLIENT'
                              ? `/quotes/requests/${project?.linkedRequest.id}`
                              : `/quotes/lpm/requests/${project?.linkedRequest.id}`
                          }
                        >
                          {project?.linkedRequest.corporationId ?? '-'}
                        </Link>
                      </MenuItem>
                    ) : null}
                    {project.linkedOrder ? (
                      <MenuItem
                        sx={{
                          gap: 2,
                          '&:hover': {
                            background: 'inherit',
                            cursor: 'default',
                          },
                        }}
                      >
                        Linked order :
                        <Link
                          href={`/orders/order-list/detail/${project.linkedOrder.id}`}
                        >
                          {project?.linkedOrder.corporationId ?? '-'}
                        </Link>
                      </MenuItem>
                    ) : null}
                  </Menu>
                </Box>
              ) : null}
              {currentRole && currentRole.name === 'CLIENT' ? (
                <QuoteStatusChip
                  size='small'
                  label={project?.status ?? '-'}
                  status={project?.status!}
                />
              ) : null}
            </Box>
          </Box>
          {currentRole && currentRole.name === 'CLIENT' ? null : (
            <Box display='flex' alignItems='center' gap='14px'>
              <Button
                variant='outlined'
                sx={{ display: 'flex', gap: '8px' }}
                onClick={onClickDownloadQuotes}
                disabled={
                  // TODO: General 계정의 download 제한 유무 체크해야함
                  !canUseFeature('button-DownloadQuote')
                }
              >
                <Icon icon='material-symbols:request-quote' />
                Download quote
              </Button>
              {isIncludeProjectTeam() ? (
                <Button
                  variant='outlined'
                  onClick={() =>
                    router.push({
                      pathname: `/orders/add-new`,
                      query: { quoteId: id },
                    })
                  }
                  disabled={!canUseFeature('button-CreateOrder')}
                >
                  Create order
                </Button>
              ) : null}
              {isIncludeProjectTeam() ? (
                <Button
                  variant='contained'
                  onClick={onClickConfirmQuote}
                  disabled={!canUseFeature('button-ConfirmQuote')}
                >
                  Confirm quote
                </Button>
              ) : null}
            </Box>
          )}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TabContext value={menu}>
          <TabList
            onChange={handleChange}
            aria-label='Quote detail Tab menu'
            style={{ borderBottom: '1px solid rgba(76, 78, 100, 0.12)' }}
          >
            {currentRole && currentRole.name === 'CLIENT' ? (
              <CustomTap
                value='quote'
                label='Quote'
                iconPosition='start'
                icon={<Icon icon='iconoir:large-suitcase' fontSize={'18px'} />}
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              />
            ) : null}

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
            {currentRole && currentRole.name === 'CLIENT' ? null : (
              <CustomTap
                value='client'
                label='Client'
                iconPosition='start'
                icon={
                  <Icon icon='mdi:account-star-outline' fontSize={'18px'} />
                }
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              />
            )}

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

          <TabPanel value='quote' sx={{ pt: '24px' }}>
            <Suspense>
              {downloadData ? (
                <ClientQuote
                  downloadData={downloadData!}
                  user={auth.getValue().user!}
                  downloadLanguage={downloadLanguage}
                  setDownloadLanguage={setDownloadLanguage}
                  onClickDownloadQuotes={onClickDownloadQuotes}
                  type='detail'
                  updateProject={updateProject}
                  statusList={statusList!}
                  project={project!}
                />
              ) : null}
            </Suspense>
          </TabPanel>
          {/* Project info */}
          <TabPanel value='project' sx={{ pt: '24px' }}>
            <Suspense>
              {editProject ? (
                <Card sx={{ padding: '24px' }}>
                  <DatePickerWrapper>
                    <Grid container spacing={6}>
                      <ProjectInfoForm
                        control={projectInfoControl}
                        setValue={setProjectInfo}
                        watch={projectInfoWatch}
                        errors={projectInfoErrors}
                        clientTimezone={getClientValue('contacts.timezone')}
                        getClientValue={getClientValue}
                        getValues={getProjectInfoValues}
                      />
                      {renderSubmitButton({
                        onCancel: () =>
                          onDiscard({ callback: () => setEditProject(false) }),
                        onSave: () => onProjectInfoSave(),
                        isValid: isProjectInfoValid,
                      })}
                    </Grid>
                  </DatePickerWrapper>
                </Card>
              ) : (
                <Fragment>
                  <Card sx={{ padding: '24px' }}>
                    <QuotesProjectInfoDetail
                      project={project}
                      setEditMode={setEditProject}
                      isUpdatable={canUseFeature('tab-ProjectInfo')}
                      updateStatus={(status: number) =>
                        updateProject.mutate({ status: status })
                      }
                      role={currentRole!}
                      client={client}
                      type='detail'
                      updateProject={updateProject}
                      statusList={statusList!}
                    />
                  </Card>
                  {(currentRole && currentRole.name === 'CLIENT') ||
                  !isIncludeProjectTeam() ? null : (
                    <Grid container sx={{ mt: '24px' }} xs={12} spacing={4}>
                      <Grid item xs={4}>
                        <Card sx={{ padding: '20px', width: '100%' }}>
                          <Button
                            variant='outlined'
                            fullWidth
                            color='error'
                            size='large'
                            disabled={!canUseFeature('button-CancelQuote')}
                            onClick={onClickCancel}
                          >
                            Cancel this quote
                          </Button>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card sx={{ padding: '20px', width: '100%' }}>
                          <Button
                            variant='outlined'
                            fullWidth
                            color='error'
                            size='large'
                            disabled={!canUseFeature('button-DeleteQuote')}
                            onClick={onClickDelete}
                          >
                            Delete this quote
                          </Button>
                        </Card>
                      </Grid>
                    </Grid>
                  )}
                </Fragment>
              )}
            </Suspense>
          </TabPanel>

          {/* Languages & Items */}
          <TabPanel value='item' sx={{ pt: '24px' }}>
            <Card>
              <CardContent sx={{ padding: '24px' }}>
                <QuotesLanguageItemsDetail
                  languagePairs={languagePairs}
                  setLanguagePairs={setLanguagePairs}
                  clientId={getClientValue('clientId') ?? null}
                  priceUnitsList={priceUnitsList || []}
                  itemControl={itemControl}
                  items={items}
                  getItem={getItem}
                  setItem={setItem}
                  itemErrors={itemErrors}
                  isItemValid={isItemValid}
                  removeItems={removeItems}
                  getTeamValues={getTeamValues}
                  appendItems={appendItems}
                  tax={tax}
                  setTax={setTax}
                  taxable={taxable}
                  setTaxable={setTaxable}
                  isEditMode={editItems}
                  setIsEditMode={setEditItems}
                  isUpdatable={canUseFeature('tab-Languages&Items')}
                  role={currentRole!}
                  itemTrigger={itemTrigger}
                  project={project}
                />
                {editItems
                  ? renderSubmitButton({
                      onCancel: () =>
                        onDiscard({
                          callback: () => {
                            setEditItems(false)
                            itemReset()
                          },
                        }),
                      onSave: () => onItemSave(),
                      isValid: isItemValid || !taxable || (taxable && tax! > 0),
                    })
                  : null}
              </CardContent>
            </Card>
          </TabPanel>

          {/* Client */}
          <TabPanel value='client' sx={{ pt: '24px' }}>
            <Card sx={{ padding: '24px' }}>
              {editClient ? (
                <Grid container spacing={6}>
                  <ClientQuotesFormContainer
                    control={clientControl}
                    setValue={setClientValue}
                    watch={clientWatch}
                    setTaxable={setTaxable}
                    type='quotes'
                    formType='edit'
                    getValue={getClientValue}
                    fromQuote={false}
                  />
                  <Grid item xs={12}>
                    {renderSubmitButton({
                      onCancel: () =>
                        onDiscard({ callback: () => setEditClient(false) }),
                      onSave: () => onClientSave(),
                      isValid: isClientValid,
                    })}
                  </Grid>
                </Grid>
              ) : (
                <QuotesClientDetail
                  client={client}
                  setIsEditMode={setEditClient}
                  isUpdatable={canUseFeature('tab-Client')}
                />
              )}
            </Card>
          </TabPanel>

          {/* Team */}
          <TabPanel value='team' sx={{ pt: '24px' }}>
            <Suspense>
              {editTeam ? (
                <Card sx={{ padding: '24px' }}>
                  <Grid container spacing={6}>
                    <ProjectTeamFormContainer
                      control={teamControl}
                      field={members}
                      append={appendMember}
                      remove={removeMember}
                      update={updateMember}
                      setValue={setTeamValues}
                      errors={teamErrors}
                      isValid={isTeamValid}
                      watch={teamWatch}
                      getValue={getTeamValues}
                    />
                    {renderSubmitButton({
                      onCancel: () =>
                        onDiscard({ callback: () => setEditTeam(false) }),
                      onSave: () => onProjectTeamSave(),
                      isValid: isTeamValid,
                    })}
                  </Grid>
                </Card>
              ) : (
                <Card>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '15px 20px',
                    }}
                  >
                    <Typography variant='h6'>
                      Project team ({team?.length})
                    </Typography>
                    {canUseFeature('tab-ProjectTeam') ? (
                      <IconButton onClick={() => setEditTeam(!editTeam)}>
                        <Icon icon='mdi:pencil-outline' />
                      </IconButton>
                    ) : null}
                  </Box>
                  <Box
                    sx={{
                      '& .MuiDataGrid-columnHeaderTitle': {
                        textTransform: 'none',
                      },
                    }}
                  >
                    <DataGrid
                      sx={{
                        '& .MuiDataGrid-row:hover': {
                          backgroundColor: 'inherit',
                        },
                      }}
                      autoHeight
                      getRowId={row => row.id!}
                      columns={getProjectTeamColumns(
                        (currentRole && currentRole.name) ?? '',
                      )}
                      rows={teams ?? []}
                      rowCount={teams?.length ?? 0}
                      rowsPerPageOptions={[10, 25, 50]}
                      pagination
                      page={teamPage}
                      pageSize={teamPageSize}
                      onPageChange={setTeamPage}
                      onPageSizeChange={setTeamPageSize}
                      disableSelectionOnClick
                    />
                  </Box>
                </Card>
              )}
            </Suspense>
          </TabPanel>

          {/* Version history */}
          <TabPanel value='history' sx={{ pt: '24px' }}>
            <VersionHistory
              list={versionHistory || []}
              listCount={versionHistory?.length!}
              columns={versionHistoryColumns}
              pageSize={historyPageSize}
              setPageSize={setHistoryPageSize}
              onClickRow={onClickVersionHistoryRow}
            />
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  )
}

QuotesDetail.acl = {
  subject: 'quote',
  action: 'read',
}

const CustomTap = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`
