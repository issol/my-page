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
import { AuthContext } from '@src/context/AuthContext'
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

type MenuType = 'project' | 'history' | 'team' | 'client' | 'item' | 'quote'

export type updateProjectInfoType =
  | QuotesProjectInfoFormType
  | ProjectTeamFormType
  | ClientPostType
  | { tax: null | number; isTaxable: boolean }
  | { status: number }
  | { status: number; reason: CancelReasonType }
  | { status: number; isConfirmed: boolean }

export default function QuotesDetail() {
  const router = useRouter()
  const { data: statusList } = useGetStatusList('Quote')
  const ability = useContext(AbilityContext)
  const { user } = useContext(AuthContext)
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

  const User = new quotes(user?.id!)

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
              project?.status === 'Internal Review' ||
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
            project?.status === 'Quote sent' ||
            project?.status === 'Client review' ||
            project?.status === 'Revision requested' ||
            project?.status === 'Revised' ||
            project?.status === 'Accepted' ||
            project?.status === 'Changed into order' ||
            project?.status === 'Expired' ||
            project?.status === 'Rejected'
        case 'button-CreateOrder':
          flag =
            !project?.linkedOrder &&
            (project?.status === 'Revision requested' ||
              project?.status === 'Revised' ||
              project?.status === 'Accepted' ||
              project?.status === 'Expired')
          break
        case 'button-ConfirmQuote':
          flag =
            project?.status === 'New' ||
            project?.status === 'In preparation' ||
            project?.status === 'Internal Review' ||
            project?.status === 'Under revision' ||
            (project?.status === 'Expired' && project?.confirmedAt === null)
          break
        case 'button-CancelQuote':
          flag =
            project?.status !== 'Changed into order' &&
            project?.status !== 'Canceled'
          break
        case 'button-DeleteQuote':
          flag =
            (isDeletable &&
              !!client?.contactPerson?.userId &&
              (project?.status === 'New' ||
                project?.status === 'In preparation' ||
                project?.status === 'Internal Review' ||
                (project?.status === 'Expired' &&
                  project?.confirmedAt === null))) ||
            (!!client?.contactPerson?.userId &&
              (project?.status === 'New' ||
                project?.status === 'In preparation' ||
                project?.status === 'Internal Review' ||
                project?.status === 'Expired'))
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
          team.some(item => item.userId === user?.id!)),
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
          itemsWithLang?.languagePairs?.map(item => {
            return {
              id: String(item.id),
              source: item.source,
              target: item.target,
              price: !item?.price
                ? null
                : priceList.find(price => price.id === item?.price?.id) || null,
            }
          }),
        )
        const result = itemsWithLang?.items?.map(item => {
          return {
            id: item.id,
            name: item.name,
            source: item.source,
            target: item.target,
            priceId: item.priceId,
            detail: !item?.detail?.length ? [] : item.detail,
            analysis: item.analysis ?? [],
            totalPrice: item?.totalPrice ?? 0,
            dueAt: item?.dueAt ?? '',
            contactPerson: item?.contactPerson ?? {},
          }
        })
        itemReset({ items: result })
        itemTrigger()
      })()
    }
  }, [isItemLoading])

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
          id: user?.userId!,
          name: getLegalName({
            firstName: user?.firstName!,
            middleName: user?.middleName,
            lastName: user?.lastName!,
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

  useEffect(() => {
    if (!isTeamLoading && team) {
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
      if (teams.length) resetTeam({ teams })
    }
  }, [isTeamLoading])

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
          <Box>{FullDateTimezoneHelper(row.downloadedAt, user?.timezone!)}</Box>
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
    // TODO: TAD, LPM role을 둘다 가지고 있는 경우 롤 스위치 상황에 따라 이 조건이 동작하지 않을 수 있음
    if (currentRole && currentRole.name === 'LPM') {
      if (project && project.status === 'Revision requested') {
        patchQuoteProjectInfo(Number(id), { status: 20600 })
          .then(res => {
            refetch()
          })
          .catch(e => onMutationError())
      }
    }
  }, [])

  const updateProject = useMutation(
    (form: updateProjectInfoType) => patchQuoteProjectInfo(Number(id), form),
    {
      onSuccess: () => {
        setEditProject(false)
        setEditClient(false)
        setEditTeam(false)
        queryClient.invalidateQueries({
          queryKey: ['quotesDetail'],
        })
        queryClient.invalidateQueries(['quotesList'])
      },
      onError: () => onMutationError(),
    },
  )

  function onProjectInfoSave() {
    const projectInfo = getProjectInfoValues()

    onSave(() => updateProject.mutate(projectInfo))
  }

  async function onItemSave() {
    const items: PostItemType[] = getItem().items.map(item => ({
      ...item,
      analysis: item.analysis?.map(anal => anal?.data?.id!) || [],
      showItemDescription: item.showItemDescription ? '1' : '0',
    }))
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

    onSave(async () => {
      try {
        await patchQuoteLanguagePairs(Number(id), langs)
        await patchQuoteItems(Number(id), items)
        updateProject.mutate({ tax, isTaxable: taxable })
        setEditItems(false)
        queryClient.invalidateQueries({
          queryKey: ['quotesDetailItems'],
        })
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
      router.push('/quotes')
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
    patchQuoteProjectInfo(Number(id), { downloadedAt: currentTime }).catch(e =>
      onMutationError(),
    )
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
                user={user!}
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
            updateProject.mutate(
              { isConfirmed: true, status: projectStatus() },
              {
                onSuccess: () => {
                  closeModal('ConfirmQuoteModal')
                },
              },
            )
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
          project?.status !== 'Internal Review' &&
          project?.status !== 'Expired')
      )
    } else {
      return (
        !isDeletable ||
        (project?.status !== 'New' &&
          project?.status !== 'In preparation' &&
          project?.status !== 'Internal Review' &&
          project?.status === 'Expired' &&
          project?.confirmedAt !== null)
      )
    }
  }

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
                onClick={() => router.push('/quotes')}
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
                  user={user!}
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
                            disabled={!canUseFeature('button-CancelQuote')}
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
                />
                {editItems
                  ? renderSubmitButton({
                      onCancel: () =>
                        onDiscard({ callback: () => setEditItems(false) }),
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
                    setTax={setTax}
                    setTaxable={setTaxable}
                    type='quotes'
                    formType='edit'
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
                      autoHeight
                      getRowId={row => row.userId}
                      columns={getProjectTeamColumns(
                        (currentRole && currentRole.name) ?? '',
                      )}
                      rows={team ?? []}
                      rowCount={team?.length ?? 0}
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
