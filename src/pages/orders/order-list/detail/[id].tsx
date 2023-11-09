import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import {
  Box,
  Button,
  Card,
  Checkbox,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Tab,
  TextField,
  Typography,
  styled,
} from '@mui/material'
import Icon from '@src/@core/components/icon'
import {
  Fragment,
  MouseEvent,
  Suspense,
  SyntheticEvent,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import ProjectInfo from './components/project-info'
import OrderDetailClient from './components/client'
import { v4 as uuidv4 } from 'uuid'
import {
  OrderDownloadData,
  OrderFeatureType,
  ProjectInfoType,
  ProjectTeamListType,
  VersionHistoryType,
} from '@src/types/orders/order-detail'
import { GridColumns } from '@mui/x-data-grid'
import ProjectTeam from './components/project-team'
import VersionHistory from './components/version-history'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { useRecoilValueLoadable } from 'recoil'

import { authState } from '@src/states/auth'
import { AbilityContext } from '@src/layouts/components/acl/Can'

import useModal from '@src/hooks/useModal'
import VersionHistoryModal from './components/modal/version-history-modal'
import { getProjectTeamColumns } from '@src/shared/const/columns/order-detail'
import { useRouter } from 'next/router'
import {
  useGetClient,
  useGetJobInfo,
  useGetLangItem,
  useGetProjectInfo,
  useGetProjectTeam,
  useGetVersionHistory,
} from '@src/queries/order/order.query'

import DownloadOrderModal from './components/modal/download-order-modal'

import { useAppDispatch, useAppSelector } from '@src/hooks/useRedux'
import { setIsReady, setOrder, setOrderLang } from '@src/store/order'
import EditAlertModal from '@src/@core/components/common-modal/edit-alert-modal'
import { useMutation, useQueryClient } from 'react-query'
import {
  confirmOrder,
  patchOrderProjectInfo,
  patchOrderStatus,
  splitOrder,
} from '@src/apis/order-detail.api'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import LanguageAndItem from './components/language-item'
import { defaultOption, languageType } from '../../add-new'
import { useGetClientPriceList } from '@src/queries/company/standard-price'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { ItemType, PostItemType } from '@src/types/common/item.type'
import { yupResolver } from '@hookform/resolvers/yup'
import { itemSchema } from '@src/types/schema/item.schema'
import { useGetAllClientPriceList } from '@src/queries/price-units.query'
import {
  MemberType,
  ProjectTeamType,
  projectTeamSchema,
} from '@src/types/schema/project-team.schema'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import EditSaveModal from '@src/@core/components/common-modal/edit-save-modal'
import {
  LanguagePairsPostType,
  LanguagePairsType,
  ProjectTeamFormType,
} from '@src/types/common/orders-and-quotes.type'
import { patchItemsForOrder, patchLangPairForOrder } from '@src/apis/order.api'
import { OrderProjectInfoFormType } from '@src/types/common/orders.type'
import { toast } from 'react-hot-toast'
import { useGetStatusList } from '@src/queries/common.query'
import ProjectInfoForm from '@src/pages/components/forms/orders-project-info-form'
import {
  orderProjectInfoDefaultValue,
  orderProjectInfoSchema,
} from '@src/types/schema/orders-project-info.schema'
import { ClientFormType, clientSchema } from '@src/types/schema/client.schema'
import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'
import DiscardModal from '@src/@core/components/common-modal/discard-modal'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import { getCurrentRole } from '@src/shared/auth/storage'
import { CancelReasonType } from '@src/types/requests/detail.type'

import ProjectTeamFormContainer from '@src/pages/quotes/components/form-container/project-team-container'
import { transformTeamData } from '@src/shared/transformer/team.transformer'
import ClientQuotesFormContainer from '@src/pages/components/form-container/clients/client-container'
import Link from 'next/link'
import DeliveriesFeedback from './components/deliveries-feedback'
import { OrderStatusChip } from '@src/@core/components/chips/chips'
import ReasonModal from '@src/@core/components/common-modal/reason-modal'
import ClientOrder from './components/client-order'
import PrintOrderPage from '../../order-print/print-page'

import { order } from '@src/shared/const/permission-class'
import { RoundingProcedureList } from '@src/shared/const/rounding-procedure/rounding-procedure'
import { ReasonType } from '@src/types/quotes/quote'
import AlertModal from '@src/@core/components/common-modal/alert-modal'

interface Detail {
  id: number
  quantity: number
  priceUnit: string
  unit: string
  price: number
  totalPrice: number
}

export interface Row {
  id: number
  name: string
  source: string
  target: string
  detail: Detail[]
}

export type updateOrderType =
  | OrderProjectInfoFormType
  | ProjectTeamFormType
  | ClientFormType
  | { status: number }
  | { tax: null | number; isTaxable: '0' | '1'; subtotal: number }
  | { downloadedAt: string }
  | { status: number; reason: CancelReasonType }
  | { status: number; isConfirmed: boolean }
  | { isConfirmed: boolean }
  | { showDescription: '1' | '0' }
  | {
      deliveries: {
        filePath: string
        fileName: string
        fileExtension: string
        fileSize?: number
      }[]
    }
  | { feedback: string; status: number }
  | { feedback: string }
  | { languagePairs: Array<LanguagePairsType> }
  | { items: Array<PostItemType> }
  | {
      tax: null | number
      isTaxable: '0' | '1'
      subtotal: number
      languagePairs: Array<LanguagePairsType>
      items: Array<PostItemType>
    }

type RenderSubmitButtonProps = {
  onCancel: () => void
  onSave: () => void
  isValid: boolean
}

type MenuType =
  | 'order'
  | 'project'
  | 'history'
  | 'team'
  | 'client'
  | 'item'
  | 'deliveries-feedback'
const OrderDetail = () => {
  const router = useRouter()
  const ability = useContext(AbilityContext)
  const menuQuery = router.query.menu as MenuType
  const { id } = router.query
  const auth = useRecoilValueLoadable(authState)
  const currentRole = getCurrentRole()
  const [value, setValue] = useState<MenuType>(
    currentRole && currentRole.name === 'CLIENT' ? 'order' : 'project',
  )
  const { data: statusList } = useGetStatusList('Order')

  const [teams, setTeams] = useState<ProjectTeamListType[]>([])

  const fieldOrder = ['supervisorId', 'projectManagerId', 'member']
  const teamOrder = ['supervisor', 'projectManager', 'member']

  const dispatch = useAppDispatch()

  const [uploadFileProcessing, setUploadFileProcessing] = useState(false)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const [downloadData, setDownloadData] = useState<OrderDownloadData | null>(
    null,
  )

  const [downloadLanguage, setDownloadLanguage] = useState<'EN' | 'KO'>('EN')

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    if (
      menuQuery &&
      [
        'project',
        'history',
        'team',
        'client',
        'item',
        'deliveries-feedback',
      ].includes(menuQuery)
    ) {
      setValue(menuQuery)
    }
  }, [menuQuery])

  const User = new order(auth.getValue().user?.id!)

  const isUpdatable = ability.can('update', User)
  const isDeletable = ability.can('delete', User)

  console.log(isUpdatable)

  const { data: projectInfo, isLoading: projectInfoLoading } =
    useGetProjectInfo(Number(id!))
  const { data: projectTeam, isLoading: projectTeamLoading } =
    useGetProjectTeam(Number(id!))
  const { data: client, isLoading: clientLoading } = useGetClient(Number(id!))

  const { data: versionHistory, isLoading: versionHistoryLoading } =
    useGetVersionHistory(Number(id!))
  const { data: langItem, isLoading: langItemLoading } = useGetLangItem(
    Number(id!),
  )

  const { data: jobInfo, isLoading: jobInfoLoading } = useGetJobInfo(
    Number(id!),
  )

  const { data: priceUnitsList } = useGetAllClientPriceList()

  const currentStatus = useMemo(
    () => statusList?.find(item => item.label === projectInfo?.status),
    [statusList, projectInfo],
  )

  const {
    control: projectInfoControl,
    getValues: getProjectInfo,
    setValue: setProjectInfo,
    trigger: projectInfoTrigger,
    watch: projectInfoWatch,
    reset: projectInfoReset,
    formState: { errors: projectInfoErrors, isValid: isProjectInfoValid },
  } = useForm<OrderProjectInfoFormType>({
    mode: 'onChange',
    defaultValues: orderProjectInfoDefaultValue,
    resolver: yupResolver(orderProjectInfoSchema),
  })

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
      clientId: NOT_APPLICABLE,
      contactPersonId: NOT_APPLICABLE,
      addressType: 'shipping',
      contacts: {
        timezone: {
          code: '',
          label: '',
          phone: '',
        },
        phone: '',
        mobile: '',
        fax: '',
        email: '',
        addresses: [],
      },
    },
    resolver: yupResolver(clientSchema),
  })

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
  const {
    control: teamControl,
    getValues: getTeamValues,
    setValue: setTeamValues,

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

  const [projectInfoEdit, setProjectInfoEdit] = useState(false)
  const [clientEdit, setClientEdit] = useState(false)
  const [projectTeamEdit, setProjectTeamEdit] = useState(false)
  const [langItemsEdit, setLangItemsEdit] = useState(false)
  const [splitReady, setSplitReady] = useState<boolean>(false)
  const [selectedIds, setSelectedIds] = useState<
    { id: number; selected: boolean }[]
  >(getItem('items')?.map(value => ({ id: value.id!, selected: false })))
  const orderInfo = useAppSelector(state => state.order)

  const [projectTeamListPage, setProjectTeamListPage] = useState<number>(0)
  const [projectTeamListPageSize, setProjectTeamListPageSize] =
    useState<number>(10)

  const [versionHistoryListPage, setVersionHistoryListPage] =
    useState<number>(0)

  const [versionHistoryListPageSize, setVersionHistoryListPageSize] =
    useState<number>(5)

  const { openModal, closeModal } = useModal()
  const queryClient = useQueryClient()

  const [languagePairs, setLanguagePairs] = useState<Array<languageType>>([])

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

  function onSave(callBack: () => void) {
    openModal({
      type: 'EditSaveModal',
      children: (
        <CustomModal
          onClose={() => closeModal('EditSaveModal')}
          onClick={callBack}
          title='Are you sure you want to save all changes?'
          rightButtonText='Save'
          vary='successful'
        />
      ),
    })
  }

  function onDiscard({ callback }: { callback: () => void }) {
    openModal({
      type: 'DiscardModal',
      children: (
        <DiscardModal
          onClose={() => {
            // callback()
            closeModal('DiscardModal')
          }}
          onClick={() => {
            callback()
            closeModal('DiscardModal')
          }}
        />
      ),
    })
  }

  function onProjectInfoSave() {
    const projectInfo = {
      ...getProjectInfo(),
      showDescription: getProjectInfo().showDescription ? '1' : '0',
      isTaxable: getProjectInfo().isTaxable ? '1' : '0',
    }
    const { items, ...filteredProjectInfo } = projectInfo
    onSave(() =>
      updateProject.mutate(filteredProjectInfo, {
        onSuccess: () => {
          closeModal('EditSaveModal')
        },
      }),
    )
  }

  const initializeItemData = () => {
    setLanguagePairs(
      langItem?.items?.map(item => ({
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
            RoundingProcedureList[item.initialPrice?.rounding!]?.label,
          languagePairs: [],
          priceUnit: [],
          catInterface: { memSource: [], memoQ: [] },
        },
      }))!,
    )
    const result = langItem?.items?.map(item => {
      return {
        id: item.id,
        name: item.itemName,
        itemName: item.itemName,
        source: item.source,
        target: item.target,
        priceId: item.priceId,
        detail: !item?.detail?.length ? [] : item.detail,
        contactPerson: item.contactPerson ?? null,
        contactPersonId: Number(item.contactPerson?.userId!),
        description: item.description,
        analysis: item.analysis ?? [],
        totalPrice: item?.totalPrice ?? 0,
        dueAt: item?.dueAt,
        showItemDescription: item.showItemDescription,
        initialPrice: item.initialPrice,
        minimumPrice: item.minimumPrice,
        minimumPriceApplied: item.minimumPriceApplied,
      }
    })
    itemReset({ items: result })
  }

  const initializeTeamData = () => {
    if (!projectTeamLoading && projectTeam) {
      const teams: Array<{
        type: MemberType
        id: number | null
        name: string
      }> = projectTeam.map(item => ({
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
  }

  const handleChange = (event: SyntheticEvent, newValue: MenuType) => {
    if (projectInfoEdit || clientEdit || projectTeamEdit || langItemsEdit) {
      openModal({
        type: 'EditAlertModal',
        children: (
          <EditAlertModal
            onClose={() => closeModal('EditAlertModal')}
            onClick={() => {
              closeModal('EditAlertModal')
              setValue(newValue)
              setProjectInfoEdit(false)
              setClientEdit(false)
              setProjectTeamEdit(false)
              setLangItemsEdit(false)
            }}
          />
        ),
      })
      return
    }

    if (newValue === 'item') {
      initializeItemData()
      initializeTeamData()
    }

    setValue(newValue)
    queryClient.invalidateQueries(['orderDetail'])
  }

  //TODO: endpoint 교체해야함(status 업데이트 전용)
  const handleRestoreVersion = () => {
    if (canUseFeature('button-Restore'))
      // updateProject && updateProject.mutate({ status: 10500 })
      updateOrderStatusMutation.mutate({
        id: Number(id!),
        status: 10500,
      })
  }

  const onClickRestoreVersion = () => {
    openModal({
      type: 'RestoreConfirmModal',
      children: (
        <CustomModal
          onClose={() => closeModal('RestoreConfirmModal')}
          onClick={() => {
            closeModal('RestoreConfirmModal')
            closeModal('VersionHistoryModal')
            handleRestoreVersion()
          }}
          title='Are you sure you want to restore this version?'
          vary='error'
          rightButtonText='Restore'
        />
      ),
    })
  }

  const onClickVersionHistoryRow = (history: VersionHistoryType) => {
    openModal({
      type: 'VersionHistoryModal',
      children: (
        <VersionHistoryModal
          history={history}
          project={projectInfo!}
          onClose={() => closeModal('VersionHistoryModal')}
          onClick={onClickRestoreVersion}
          canUseDisableButton={canUseFeature('button-Restore')}
        />
      ),
    })
  }

  // const onClickPreview = (lang: 'EN' | 'KO') => {
  //   dispatch(setOrderLang(lang))
  //   openModal({
  //     type: 'PreviewModal',
  //     children: (
  //       <OrderPreview
  //         onClose={() => closeModal('PreviewModal')}
  //         data={order.orderTotalData!}
  //         lang={lang}
  //       />
  //     ),
  //   })
  // }

  const onClickPreview = (lang: 'EN' | 'KO') => {
    makePdfData()
    dispatch(setOrderLang(lang))
    dispatch(setOrder(downloadData))

    closeModal('PreviewModal')
  }

  const onClickDownloadOrder = () => {
    openModal({
      type: 'DownloadOrderModal',
      children: (
        <DownloadOrderModal
          onClose={() => {
            closeModal('DownloadOrderModal')
            dispatch(setIsReady(false))
          }}
          onClick={onClickPreview}
          clientOrderLang={
            currentRole && currentRole.name === 'CLIENT'
              ? downloadLanguage
              : undefined
          }
        />
      ),
    })
  }

  const onClickCreateInvoice = () => {
    openModal({
      type: 'CreateInvoiceModal',
      children: (
        <CustomModal
          onClick={() =>
            router.push({
              pathname: '/invoice/receivable/add-new',
              query: { orderId: id },
            })
          }
          onClose={() => closeModal('CreateInvoiceModal')}
          title='Are you sure you want to create an invoice with this order?'
          subtitle={`[${projectInfo?.corporationId}] ${projectInfo?.projectName}`}
          vary='successful'
          rightButtonText='Create'
        />
      ),
    })
  }

  const versionHistoryColumns: GridColumns<VersionHistoryType> = [
    {
      field: 'position',
      flex: 0.3355,

      headerName: 'Position',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Version</Box>,
      renderCell: ({ row }: { row: VersionHistoryType }) => {
        return <Box>Ver. {row.version}</Box>
      },
    },
    {
      flex: 0.3363,
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
      flex: 0.3283,
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
  function makePdfData() {
    const pm = projectTeam?.find(value => value.position === 'projectManager')

    const res: OrderDownloadData = {
      orderId: Number(id!),
      adminCompanyName: 'GloZ Inc.',
      companyAddress: '3325 Wilshire Blvd Ste 626 Los Angeles CA 90010',
      corporationId: projectInfo!.corporationId,
      orderedAt: projectInfo!.orderedAt,
      projectDueAt: {
        date: projectInfo!.projectDueAt,
        timezone: projectInfo!.projectDueTimezone,
      },
      pm: {
        firstName: pm?.firstName!,
        lastName: pm?.lastName!,
        email: pm?.email!,
        middleName: pm?.middleName!,
      },
      companyName: client!.client.name,
      projectName: projectInfo!.projectName,
      client: client!,
      contactPerson: client!.contactPerson,
      clientAddress: client!.clientAddress,
      langItem: langItem!,
      subtotal: projectInfo!.subtotal,
    }

    setDownloadData(res)
  }

  function handlePrint() {
    closeModal('DownloadOrderModal')
    router.push('/orders/order-print')
  }

  useEffect(() => {
    if (projectInfo && client && langItem && projectTeam) makePdfData()
  }, [projectInfo, client, langItem, projectTeam])

  useEffect(() => {
    if (orderInfo.isReady && orderInfo.orderTotalData) {
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
              <PrintOrderPage
                data={orderInfo.orderTotalData}
                type='preview'
                user={auth.getValue().user!}
                lang={orderInfo.lang}
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
  }, [orderInfo.isReady])

  useEffect(() => {
    if (langItem) {
      setLanguagePairs(
        langItem?.items?.map(item => ({
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
              RoundingProcedureList[item.initialPrice?.rounding!]?.label,
            languagePairs: [],
            priceUnit: [],
            catInterface: { memSource: [], memoQ: [] },
          },
        }))!,
      )
      const result = langItem?.items?.map(item => {
        return {
          id: item.id,
          name: item.itemName,
          itemName: item.itemName,
          source: item.source,
          target: item.target,
          priceId: item.priceId,
          detail: !item?.detail?.length ? [] : item.detail,
          contactPerson: item.contactPerson,
          contactPersonId: Number(item.contactPerson?.userId!),
          description: item.description,
          analysis: item.analysis ?? [],
          totalPrice: item?.totalPrice ?? 0,
          dueAt: item?.dueAt,
          showItemDescription: item.showItemDescription,
          initialPrice: item.initialPrice,
          minimumPrice: item.minimumPrice,
          minimumPriceApplied: item.minimumPriceApplied,
        }
      })
      itemReset({ items: result })
      setSelectedIds(
        langItem.items.map(value => ({ id: value.id ?? 0, selected: false })),
      )
    }
    if (projectTeam) {
      let viewTeams: ProjectTeamListType[] = [...projectTeam].map(value => ({
        ...value,
        id: uuidv4(),
      }))

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

      if (viewTeams.length) setTeams(res)

      const teams: Array<{
        type: MemberType
        id: number | null
        name: string
      }> = projectTeam.map(item => ({
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
    if (projectInfo) {
      const res = {
        ...projectInfo,
        orderedAt: new Date(projectInfo?.orderedAt),
        status: currentStatus?.value ?? 10000,
      }
      const { items, ...filteredRes } = res
      projectInfoReset(filteredRes)
    }

    if (client) {
      console.log('client', client)
      clientReset({
        clientId: client.client.clientId,
        contactPersonId: client.contactPerson?.id,
        addressType: client.clientAddress.find(value => value.isSelected)
          ?.addressType!,
        contacts: {
          ...client.contactPerson!,
          addresses: client.clientAddress,
        },
      })
    }
  }, [langItem, projectTeam, projectInfo, client])

  const patchLanguagePairs = useMutation(
    (data: { id: number; langPair: LanguagePairsType[] }) =>
      patchLangPairForOrder(data.id, data.langPair),
  )

  const patchItems = useMutation(
    (data: { id: number; items: PostItemType[] }) =>
      patchItemsForOrder(data.id, data.items),
  )

  const onSubmitItems = () => {
    const items: PostItemType[] = getItem().items.map((item, idx) => {
      const {
        contactPerson,
        minimumPrice,
        priceFactor,
        source,
        target,
        ...filterItem
      } = item
      return {
        ...filterItem,
        // contactPersonId: Number(item.contactPerson?.userId!),
        contactPersonId: Number(item.contactPersonId!),
        analysis: item.analysis?.map(anal => anal?.data?.id!) || [],
        showItemDescription: item.showItemDescription ? '1' : '0',
        minimumPriceApplied: item.minimumPriceApplied ? '1' : '0',
        // name: item.itemName,
        sourceLanguage: item.source,
        targetLanguage: item.target,
        sortingOrder: idx + 1,
      }
    })
    const langs: LanguagePairsPostType[] = languagePairs.map(item => {
      if (item?.price?.id) {
        return {
          langPairId: Number(item.id),
          source: item.source,
          target: item.target,
          priceId: item.price.id,
        }
      }
      return {
        langPairId: Number(item.id),
        source: item.source,
        target: item.target,
      }
    })

    const subtotal = items.reduce((accumulator, item) => {
      return accumulator + item.totalPrice
    }, 0)

    onSave(async () => {
      try {
        updateProject.mutate(
          {
            isTaxable: getProjectInfo('isTaxable') ? '1' : '0',
            tax: getProjectInfo('tax'),
            subtotal: subtotal,
            languagePairs: langs,
            items: items,
          },
          {
            onSuccess: () => {
              setLangItemsEdit(false)
              queryClient.invalidateQueries(`LangItem-${Number(id!)}`)
              closeModal('LanguageAndItemEditModal')
            },
          },
        )
        // patchLanguagePairs.mutate(
        //   { id: Number(id!), langPair: langs },
        //   {
        //     onSuccess: () => {
        //       patchItems.mutate(
        //         { id: Number(id!), items: items },
        //         {
        //           onSuccess: () => {
        //             updateProject.mutate(
        //               {
        //                 isTaxable: taxable ? '1' : '0',
        //                 tax,
        //                 subtotal: subtotal,
        //               },
        //               {
        //                 onSuccess: () => {
        //                   setLangItemsEdit(false)
        //                   queryClient.invalidateQueries(
        //                     `LangItem-${Number(id!)}`,
        //                   )
        //                   closeModal('LanguageAndItemEditModal')
        //                 },
        //               },
        //             )
        //           },
        //         },
        //       )
        //     },
        //   },
        // )
      } catch (e: any) {
        onMutationError()
      }
    })
  }

  const updateProject = useMutation(
    (form: updateOrderType) => patchOrderProjectInfo(Number(id), form),
    {
      onSuccess: (data: any) => {
        setProjectInfoEdit(false)
        setClientEdit(false)
        setProjectTeamEdit(false)
        setLangItemsEdit(false)
        projectInfoReset()
        itemReset()
        resetTeam()
        if (data.id === Number(id)) {
          queryClient.invalidateQueries({
            queryKey: ['orderDetail'],
          })
          queryClient.invalidateQueries(['orderList'])
        } else {
          router.replace(`/orders/order-list/detail/${data.id}`)
        }
      },
      onError: () => onMutationError(),
    },
  )

  const updateProjectWithoutControlForm = useMutation(
    (form: updateOrderType) => patchOrderProjectInfo(Number(id), form),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['orderDetail'],
        })
        queryClient.invalidateQueries(['orderList'])
      },
      onError: () => onMutationError(),
    },
  )

  const updateOrderStatusMutation = useMutation(
    (data: { id: number; status: number; reason?: ReasonType }) =>
      patchOrderStatus(Number(data.id), data.status, data.reason),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['orderDetail'],
        })
        queryClient.invalidateQueries(['orderList'])
      },
      onError: () => onMutationError(),
    },
  )

  const confirmOrderMutation = useMutation(() => confirmOrder(Number(id)), {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['orderDetail'],
      })
      queryClient.invalidateQueries(['orderList'])
      closeModal('ConfirmOrderModal')
    },
    onError: () => onMutationError(),
  })

  const splitOrderMutation = useMutation(
    (items: number[]) => splitOrder(Number(id!), items),
    {
      onSuccess: (data: { orderId: number }) => {
        setSplitReady(false)
        setSelectedIds(prevSelectedIds =>
          prevSelectedIds.map(id => ({ ...id, selected: false })),
        )

        queryClient.invalidateQueries(['orderDetail'])
        queryClient.invalidateQueries(['orderList'])

        router.push(`/orders/order-list/detail/${data.orderId}`)
      },
    },
  )

  function onMutationError() {
    toast.error('Something went wrong. Please try again.', {
      position: 'bottom-left',
    })
  }

  function onProjectTeamSave() {
    const teams = transformTeamData(getTeamValues())
    const res: ProjectTeamFormType = {
      projectManagerId: teams.projectManagerId ? teams.projectManagerId : null,
      supervisorId: teams.supervisorId ? teams.supervisorId : null,
      members: teams.members && teams.members.length ? teams.members : [],
    }

    onSave(() =>
      updateProject.mutate(res, {
        onSuccess: () => {
          closeModal('EditSaveModal')
          initializeTeamData()
        },
      }),
    )
  }

  function onClientSave() {
    const form = getClientValue()
    const clientInfo: ClientFormType = {
      addressType: form.addressType,
      clientId: form.clientId!,
      contactPersonId: form.contactPersonId,
    }
    onSave(() =>
      updateProject.mutate(clientInfo, {
        onSuccess: () => {
          closeModal('EditSaveModal')
        },
      }),
    )
  }

  const onClickConfirmOrder = () => {
    openModal({
      type: 'ConfirmOrderModal',
      children: (
        <CustomModal
          onClose={() => closeModal('ConfirmOrderModal')}
          onClick={() => {
            confirmOrderMutation.mutate()
          }}
          title='Are you sure you want to confirm this order? It will be delivered to the client.'
          vary='successful'
          rightButtonText='Confirm'
        />
      ),
    })
  }

  const handleSplitOrder = () => {
    const res = selectedIds
      .filter(value => value.selected)
      .map(value => value.id)
    splitOrderMutation.mutate(res)
  }

  const onClickSplitOrder = () => {
    if (projectInfo?.invoiceIncludedWithMultipleOrders) {
      openModal({
        type: 'SplitOrderAlertModal',
        children: (
          <AlertModal
            onClick={() => closeModal('SplitOrderAlertModal')}
            vary='error'
            title='This order cannot be split because it is already included in an invoice with multiple orders.'
            buttonText='Okay'
          />
        ),
      })
      setSplitReady(false)
    } else {
      setSplitReady(true)
    }
  }

  const onClickCancelSplitOrder = () => {
    setSplitReady(false)
    setSelectedIds(prevSelectedIds =>
      prevSelectedIds.map(id => ({ ...id, selected: false })),
    )
  }

  const onClickSplitOrderConfirm = () => {
    openModal({
      type: 'SplitOrderModal',
      children: (
        <CustomModal
          onClick={() => handleSplitOrder()}
          onClose={() => closeModal('SplitOrderModal')}
          title='Are you sure you want to create new order with selected item(s)? The selected item(s) will be removed from the original order.'
          vary='successful'
          rightButtonText='Create'
        />
      ),
    })
  }

  const onClickReason = () => {
    if (projectInfo) {
      openModal({
        type: `${projectInfo.status}ReasonModal`,
        children: (
          <ReasonModal
            onClose={() => closeModal(`${projectInfo.status}ReasonModal`)}
            reason={projectInfo.reason}
            type={
              projectInfo.status === 'Redelivery requested'
                ? 'Requested'
                : currentStatus?.label ?? ''
            }
            vary='question-info'
          />
        ),
      })
    }
  }

  // 여기서는 role, status, projectTeam 정보를 기반으로 기능을 쓸수 있는지만 체크함
  // 해당 기능에 첨부된 파일이 있는지 등의 추가 조건은 해당 컴포넌트에서 별도로 체크할 것
  const canUseFeature = (featureName: OrderFeatureType): boolean => {
    let flag = false
    if (currentRole! && currentRole.name !== 'CLIENT') {
      switch (featureName) {
        case 'button-ProjectInfo-CancelOrder':
          flag =
            isUpdatable &&
            projectInfo?.status !== 'Invoiced' &&
            projectInfo?.status !== 'Paid' &&
            projectInfo?.status !== 'Canceled' &&
            isIncludeProjectTeam()
          break
        case 'button-ProjectInfo-DeleteOrder':
          flag =
            isDeletable &&
            (projectInfo?.status === 'New' ||
              projectInfo?.status === 'In preparation' ||
              projectInfo?.status === 'Internal review') &&
            !projectInfo?.linkedInvoiceReceivable &&
            projectInfo?.linkedJobs.length === 0 &&
            isIncludeProjectTeam()
          break
        case 'button-Languages&Items-SplitOrder':
          flag =
            isUpdatable &&
            projectInfo?.status !== 'Paid' &&
            projectInfo?.status !== 'Canceled'
          break
        case 'button-Restore':
          flag =
            isUpdatable &&
            (projectInfo?.status === 'Order sent' ||
              projectInfo?.status === 'In progress' ||
              projectInfo?.status === 'Under revision' ||
              projectInfo?.status === 'Partially delivered' ||
              projectInfo?.status === 'Delivery completed' ||
              projectInfo?.status === 'Redelivery requested') &&
            isIncludeProjectTeam() &&
            !projectInfo?.hasChildOrder
          break
        case 'button-Deliveries&Feedback-Upload':
          flag =
            isUpdatable &&
            (projectInfo?.status === 'Order sent' ||
              projectInfo?.status === 'In progress' ||
              projectInfo?.status === 'Partially delivered' ||
              projectInfo?.status === 'Redelivery requested') &&
            isIncludeProjectTeam()
          break
        case 'button-Deliveries&Feedback-ImportFromJob':
          flag =
            isUpdatable &&
            (projectInfo?.status === 'In progress' ||
              projectInfo?.status === 'Partially delivered' ||
              projectInfo?.status === 'Redelivery requested') &&
            isIncludeProjectTeam()
          break
        case 'button-Deliveries&Feedback-DownloadAll':
        case 'button-Deliveries&Feedback-DownloadOnce':
        case 'button-Deliveries&Feedback-DeliverToClient':
        case 'checkBox-ProjectInfo-Description':
          flag =
            isUpdatable &&
            // isIncludeProjectTeam() &&
            projectInfo?.status !== 'Delivery confirmed' &&
            projectInfo?.status !== 'Canceled' &&
            projectInfo?.status !== 'Invoiced' &&
            projectInfo?.status !== 'Paid'
          break
        case 'button-Deliveries&Feedback-CompleteDelivery':
          flag =
            isUpdatable &&
            (projectInfo?.status === 'Under revision' ||
              projectInfo?.status === 'Partially delivered' ||
              projectInfo?.status === 'Redelivery requested') &&
            projectInfo?.deliveries?.length > 0 &&
            isIncludeProjectTeam()
          break
        case 'button-Deliveries&Feedback-ConfirmDeliveries':
          flag = projectInfo?.status === 'Delivery completed'
          break
        case 'button-Deliveries&Feedback-RequestRedelivery':
          flag =
            projectInfo?.status === 'Partially delivered' ||
            projectInfo?.status === 'Delivery completed'
          break
        case 'tab-ProjectInfo':
          flag =
            isUpdatable &&
            (projectInfo?.status === 'New' ||
              projectInfo?.status === 'In preparation' ||
              projectInfo?.status === 'Internal review' ||
              projectInfo?.status === 'Order sent' ||
              projectInfo?.status === 'In progress' ||
              projectInfo?.status === 'Under revision' ||
              projectInfo?.status === 'Partially delivered' ||
              projectInfo?.status === 'Delivery completed' ||
              projectInfo?.status === 'Redelivery requested') &&
            isIncludeProjectTeam()
          break
        case 'tab-Languages&Items':
          flag =
            isUpdatable &&
            (projectInfo?.status === 'New' ||
              projectInfo?.status === 'In preparation' ||
              projectInfo?.status === 'Internal review' ||
              projectInfo?.status === 'Order sent' ||
              projectInfo?.status === 'In progress' ||
              projectInfo?.status === 'Under revision' ||
              projectInfo?.status === 'Partially delivered' ||
              projectInfo?.status === 'Delivery completed' ||
              projectInfo?.status === 'Redelivery requested') &&
            isIncludeProjectTeam() &&
            !splitReady
          break
        case 'tab-Client':
          flag =
            isUpdatable &&
            projectInfo?.status !== 'Paid' &&
            projectInfo?.status !== 'Canceled' &&
            projectInfo?.status !== 'Delivery confirmed' &&
            !!!client?.contactPerson?.userId &&
            isIncludeProjectTeam()
          break
        case 'tab-ProjectTeam':
          flag =
            isUpdatable &&
            projectInfo?.status !== 'Paid' &&
            projectInfo?.status !== 'Canceled' &&
            projectInfo?.status !== 'Delivery confirmed' &&
            isIncludeProjectTeam()
          break
        case 'button-DownloadOrder':
          flag =
            isUpdatable &&
            (projectInfo?.status === 'Order sent' ||
              projectInfo?.status === 'In progress' ||
              projectInfo?.status === 'Partially delivered' ||
              projectInfo?.status === 'Delivery completed' ||
              projectInfo?.status === 'Redelivery requested' ||
              projectInfo?.status === 'Delivery confirmed' ||
              projectInfo?.status === 'Invoiced' ||
              projectInfo?.status === 'Paid' ||
              projectInfo?.status === 'Canceled') &&
            isIncludeProjectTeam()
          break
        case 'button-CreateInvoice':
          flag =
            isUpdatable &&
            !projectInfo?.linkedInvoiceReceivable &&
            (projectInfo?.status === 'Delivery confirmed' ||
              projectInfo?.status === 'Delivery completed' ||
              projectInfo?.status === 'Partially delivered' ||
              projectInfo?.status === 'Redelivery requested') &&
            isIncludeProjectTeam()
          break
        case 'button-ConfirmOrder':
          flag =
            isUpdatable &&
            (projectInfo?.status === 'New' ||
              projectInfo?.status === 'In preparation' ||
              projectInfo?.status === 'Internal review' ||
              projectInfo?.status === 'Under revision') &&
            isIncludeProjectTeam()
          break
        case 'button-Edit-Set-Status-To-UnderRevision':
          flag =
            isUpdatable &&
            (projectInfo?.status === 'Order sent' ||
              projectInfo?.status === 'In progress' ||
              projectInfo?.status === 'Partially delivered' ||
              projectInfo?.status === 'Delivery completed' ||
              projectInfo?.status === 'Redelivery requested')
          break
      }
    } else {
      switch (featureName) {
        case 'button-Deliveries&Feedback-ConfirmDeliveries':
          flag = projectInfo?.status === 'Delivery completed'
          break
        case 'button-Deliveries&Feedback-RequestRedelivery':
          flag =
            projectInfo?.status === 'Partially delivered' ||
            projectInfo?.status === 'Delivery completed'
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
          projectTeam?.length &&
          projectTeam.some(item => item.userId === auth.getValue().user?.id!)),
    )
  }

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
          {projectInfo && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {/* 뒤로가기 */}
                {projectInfoEdit ||
                projectTeamEdit ||
                clientEdit ||
                langItemsEdit ||
                uploadFileProcessing ? null : (
                  <IconButton
                    sx={{ padding: '0 !important', height: '24px' }}
                    onClick={() => router.push('/orders/order-list')}
                  >
                    <Icon icon='mdi:chevron-left' width={24} height={24} />
                  </IconButton>
                )}

                <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <img src='/images/icons/order-icons/book.png' alt='' />
                  <Typography variant='h5'>
                    {projectInfo?.corporationId}
                  </Typography>
                  {(projectInfo?.linkedRequest ||
                    projectInfo?.linkedQuote ||
                    projectInfo?.linkedInvoiceReceivable) &&
                  !uploadFileProcessing ? (
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
                        {projectInfo?.linkedRequest ? (
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
                                  ? `/quotes/requests/${projectInfo?.linkedRequest.id}`
                                  : `/quotes/lpm/requests/${projectInfo?.linkedRequest.id}`
                              }
                              style={{ color: 'rgba(76, 78, 100, 0.87)' }}
                            >
                              {projectInfo?.linkedRequest.corporationId ?? '-'}
                            </Link>
                          </MenuItem>
                        ) : null}
                        {projectInfo.linkedQuote ? (
                          <MenuItem
                            sx={{
                              gap: 2,
                              '&:hover': {
                                background: 'inherit',
                                cursor: 'default',
                              },
                            }}
                          >
                            Linked quote :
                            <Link
                              href={`/quotes/detail/${projectInfo.linkedQuote.id}`}
                              style={{ color: 'rgba(76, 78, 100, 0.87)' }}
                            >
                              {projectInfo?.linkedQuote.corporationId ?? '-'}
                            </Link>
                          </MenuItem>
                        ) : null}
                        {projectInfo.linkedInvoiceReceivable ? (
                          <MenuItem
                            sx={{
                              gap: 2,
                              '&:hover': {
                                background: 'inherit',
                                cursor: 'default',
                              },
                            }}
                          >
                            Linked invoice :
                            <Link
                              href={`/invoice/receivable/detail/${projectInfo.linkedInvoiceReceivable.id}`}
                              style={{ color: 'rgba(76, 78, 100, 0.87)' }}
                            >
                              {projectInfo?.linkedInvoiceReceivable
                                .corporationId ?? '-'}
                            </Link>
                          </MenuItem>
                        ) : null}
                      </Menu>
                    </Box>
                  ) : null}
                </Box>
              </Box>
              {projectInfoEdit ||
              projectTeamEdit ||
              clientEdit ||
              langItemsEdit ||
              uploadFileProcessing ||
              (currentRole && currentRole.name === 'CLIENT') ? null : (
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}
                >
                  <Button
                    variant='outlined'
                    sx={{ display: 'flex', gap: '8px' }}
                    onClick={onClickDownloadOrder}
                    disabled={!canUseFeature('button-DownloadOrder')}
                  >
                    <Icon icon='material-symbols:request-quote' />
                    Download order
                  </Button>
                  <Button
                    variant='outlined'
                    sx={{ display: 'flex', gap: '8px' }}
                    onClick={onClickCreateInvoice}
                    disabled={!canUseFeature('button-CreateInvoice')}
                  >
                    Create invoice
                  </Button>
                  <Button
                    variant='contained'
                    sx={{ display: 'flex', gap: '8px' }}
                    onClick={onClickConfirmOrder}
                    disabled={!canUseFeature('button-ConfirmOrder')}
                  >
                    Confirm order
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
        <Box>
          <TabContext value={value}>
            <TabList
              onChange={handleChange}
              aria-label='Order detail Tab menu'
              style={{ borderBottom: '1px solid rgba(76, 78, 100, 0.12)' }}
            >
              {currentRole && currentRole.name === 'CLIENT' ? (
                <CustomTap
                  value='order'
                  label='Order'
                  iconPosition='start'
                  icon={<Icon icon='ic:outline-list-alt' fontSize={'18px'} />}
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
              <CustomTap
                value='deliveries-feedback'
                label='Deliveries & Feedback'
                iconPosition='start'
                icon={<Icon icon='ic:outline-send' fontSize={'18px'} />}
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              />
            </TabList>
            <TabPanel value='order' sx={{ pt: '24px' }}>
              <Suspense>
                {downloadData ? (
                  <ClientOrder
                    downloadData={downloadData!}
                    user={auth.getValue().user!}
                    downloadLanguage={downloadLanguage}
                    setDownloadLanguage={setDownloadLanguage}
                    onClickDownloadOrder={onClickDownloadOrder}
                    type='detail'
                    updateProject={updateProject}
                    statusList={statusList!}
                    project={projectInfo!}
                  />
                ) : null}
              </Suspense>
            </TabPanel>
            <TabPanel value='project' sx={{ pt: '24px' }}>
              <Suspense>
                {projectInfoEdit ? (
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
                          getValues={getProjectInfo}
                        />
                        {renderSubmitButton({
                          onCancel: () =>
                            onDiscard({
                              callback: () => setProjectInfoEdit(false),
                            }),
                          onSave: () => onProjectInfoSave(),
                          isValid: isProjectInfoValid,
                        })}
                      </Grid>
                    </DatePickerWrapper>
                  </Card>
                ) : (
                  <Fragment>
                    <ProjectInfo
                      type={'detail'}
                      project={projectInfo!}
                      setEditMode={setProjectInfoEdit}
                      isUpdatable={canUseFeature('tab-ProjectInfo')}
                      updateStatus={(
                        status: number,
                        callback?: () => void,
                        reason?: ReasonType,
                      ) =>
                        //TODO: endpoint 교체해야함(status 업데이트 전용)
                        // updateProjectWithoutControlForm.mutate({
                        //   status: status,
                        // })
                        updateOrderStatusMutation.mutate(
                          reason
                            ? {
                                id: Number(id!),
                                status: status,
                                reason: reason,
                              }
                            : { id: Number(id!), status: status },
                          {
                            onSuccess: () => {
                              callback && callback()
                            },
                          },
                        )
                      }
                      updateProject={updateProject}
                      client={client}
                      statusList={statusList!}
                      role={currentRole!}
                      canUseFeature={canUseFeature}
                      jobInfo={jobInfo!}
                    />
                  </Fragment>
                )}
              </Suspense>
            </TabPanel>
            <TabPanel value='item' sx={{ pt: '24px' }}>
              <Card sx={{ padding: '24px' }}>
                <Grid xs={12} container>
                  <LanguageAndItem
                    langItem={langItem!}
                    languagePairs={languagePairs!}
                    setLanguagePairs={setLanguagePairs}
                    clientId={client?.client.clientId!}
                    itemControl={itemControl}
                    getItem={getItem}
                    setItem={setItem}
                    itemTrigger={itemTrigger}
                    itemErrors={itemErrors}
                    isItemValid={isItemValid}
                    priceUnitsList={priceUnitsList || []}
                    items={items}
                    removeItems={removeItems}
                    getTeamValues={getTeamValues}
                    projectTax={projectInfo!.tax}
                    appendItems={appendItems}
                    orderId={Number(id!)}
                    langItemsEdit={langItemsEdit}
                    setLangItemsEdit={setLangItemsEdit}
                    project={projectInfo!}
                    updateItems={patchItems}
                    onClickSplitOrder={onClickSplitOrder}
                    onClickCancelSplitOrder={onClickCancelSplitOrder}
                    onClickSplitOrderConfirm={onClickSplitOrderConfirm}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                    splitReady={splitReady}
                    updateStatus={(status: number) =>
                      // updateProjectWithoutControlForm.mutate({ status: status })
                      updateOrderStatusMutation.mutate({
                        id: Number(id!),
                        status: status,
                      })
                    }
                    canUseFeature={canUseFeature}
                    isIncludeProjectTeam={isIncludeProjectTeam()}
                  />

                  {/* <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '20px',
                          borderBottom: '2px solid #666CFF',
                          justifyContent: 'center',
                          width: '257px',
                        }}
                      >
                        <Typography
                          fontWeight={600}
                          variant='subtitle1'
                          sx={{
                            padding: '16px 16px 16px 20px',
                            flex: 1,
                            textAlign: 'right',
                          }}
                        >
                          Subtotal
                        </Typography>
                        <Typography
                          fontWeight={600}
                          variant='subtitle1'
                          sx={{ padding: '16px 16px 16px 20px', flex: 1 }}
                        >
                          {projectInfo?.subtotal}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid> */}

                  {currentRole?.name === 'CLIENT' || splitReady ? null : (
                    <Grid
                      item
                      xs={12}
                      display='flex'
                      padding='24px'
                      alignItems='center'
                      justifyContent='space-between'
                      mt={6}
                      mb={6}
                      sx={{ background: '#F5F5F7', marginBottom: '24px' }}
                    >
                      <Box display='flex' alignItems='center' gap='4px'>
                        {langItemsEdit ? (
                          <Controller
                            name='isTaxable'
                            control={projectInfoControl}
                            render={({ field: { value, onChange } }) => (
                              <Checkbox
                                disabled={!langItemsEdit}
                                checked={value}
                                onChange={e => {
                                  onChange(e.target.checked)
                                  projectInfoTrigger('isTaxable')
                                  if (!e.target.checked) {
                                    setProjectInfo('tax', null)
                                    projectInfoTrigger('tax')
                                  }
                                }}
                              />
                            )}
                          />
                        ) : null}

                        <Typography variant='h6'>Tax</Typography>
                      </Box>
                      <Box display='flex' alignItems='center' gap='4px'>
                        {langItemsEdit ? (
                          <>
                            <Controller
                              name='tax'
                              control={projectInfoControl}
                              render={({ field: { value, onChange } }) => (
                                <TextField
                                  size='small'
                                  type='number'
                                  value={value ? value : ''}
                                  disabled={!getProjectInfo('isTaxable')}
                                  sx={{ maxWidth: '120px', padding: 0 }}
                                  inputProps={{ inputMode: 'decimal' }}
                                  onChange={e => {
                                    if (e.target.value.length > 10) return
                                    onChange(Number(e.target.value))
                                    projectInfoTrigger('tax')
                                  }}
                                />
                              )}
                            />
                            %
                          </>
                        ) : (
                          <Typography variant='body1'>
                            {getProjectInfo('tax')
                              ? `${getProjectInfo('tax')} %`
                              : '- %'}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  )}

                  {langItemsEdit
                    ? renderSubmitButton({
                        onCancel: () =>
                          onDiscard({
                            callback: () => {
                              setLangItemsEdit(false), itemReset()
                              setProjectInfo(
                                'isTaxable',
                                projectInfo?.isTaxable!,
                              )
                              setProjectInfo('tax', projectInfo?.tax ?? null)
                            },
                          }),
                        onSave: () => {
                          onSubmitItems()
                          // openModal({
                          //   type: 'SaveLanguageAndItemModal',
                          //   children: (
                          //     <CustomModal
                          //       onClose={() =>
                          //         closeModal('SaveLanguageAndItemModal')
                          //       }
                          //       onClick={onSubmitItems}
                          //       title='Are you sure you want to save all changes? Language pair(s) not registered to the item(s) willS be deleted from the order.'
                          //       rightButtonText='Save'
                          //       vary='successful'
                          //     />
                          //   ),
                          // })
                        },
                        isValid:
                          isItemValid ||
                          !getProjectInfo('isTaxable') ||
                          (getProjectInfo('isTaxable') &&
                            getProjectInfo('tax') !== null),
                      })
                    : null}
                  {splitReady && selectedIds ? (
                    <Grid item xs={12}>
                      <Box display='flex' gap='16px' justifyContent='center'>
                        <Button
                          variant='outlined'
                          color='secondary'
                          onClick={onClickCancelSplitOrder}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant='contained'
                          // disabled={!isValid}
                          disabled={
                            selectedIds.filter(value => value.selected)
                              .length === 0
                          }
                          onClick={onClickSplitOrderConfirm}
                        >
                          Split order
                        </Button>
                      </Box>
                    </Grid>
                  ) : null}
                </Grid>
              </Card>
            </TabPanel>
            <TabPanel value='client' sx={{ pt: '24px' }}>
              <Suspense>
                {clientEdit ? (
                  <Card sx={{ padding: '24px' }}>
                    <Grid container spacing={6}>
                      <ClientQuotesFormContainer
                        control={clientControl}
                        setValue={setClientValue}
                        getValue={getClientValue}
                        reset={clientReset}
                        watch={clientWatch}
                        setTaxable={(n: boolean) =>
                          setProjectInfo('isTaxable', n)
                        }
                        setTax={(n: number | null) => setProjectInfo('tax', n)}
                        type='order'
                        formType='edit'
                        fromQuote={false}
                      />
                      {renderSubmitButton({
                        onCancel: () =>
                          onDiscard({ callback: () => setClientEdit(false) }),
                        onSave: () => onClientSave(),
                        isValid: isClientValid,
                      })}
                    </Grid>
                  </Card>
                ) : (
                  <OrderDetailClient
                    type={'detail'}
                    client={client!}
                    setEdit={setClientEdit}
                    canUseFeature={canUseFeature}
                    project={projectInfo!}
                  />
                )}
              </Suspense>
            </TabPanel>
            <TabPanel value='team' sx={{ pt: '24px' }}>
              <Suspense>
                {projectTeamEdit ? (
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
                          onDiscard({
                            callback: () => {
                              setProjectTeamEdit(false)
                              initializeTeamData()
                            },
                          }),
                        onSave: () => onProjectTeamSave(),
                        isValid: isTeamValid,
                      })}
                    </Grid>
                  </Card>
                ) : (
                  <ProjectTeam
                    type='detail'
                    list={teams}
                    listCount={projectTeam?.length!}
                    columns={getProjectTeamColumns()}
                    page={projectTeamListPage}
                    setPage={setProjectTeamListPage}
                    pageSize={projectTeamListPageSize}
                    setPageSize={setProjectTeamListPageSize}
                    setEdit={setProjectTeamEdit}
                    updateProject={updateProject}
                    canUseFeature={canUseFeature}
                  />
                )}
              </Suspense>
            </TabPanel>
            <TabPanel value='history' sx={{ pt: '24px' }}>
              <VersionHistory
                list={versionHistory!}
                listCount={versionHistory?.length!}
                columns={versionHistoryColumns}
                page={versionHistoryListPage}
                setPage={setVersionHistoryListPage}
                pageSize={versionHistoryListPageSize}
                setPageSize={setVersionHistoryListPageSize}
                onClickRow={onClickVersionHistoryRow}
              />
            </TabPanel>
            <TabPanel value='deliveries-feedback' sx={{ pt: '24px' }}>
              <Suspense>
                <DeliveriesFeedback
                  project={projectInfo!}
                  isSubmittable={true}
                  updateProject={updateProject}
                  statusList={statusList!}
                  canUseFeature={canUseFeature}
                  uploadFileProcessing={uploadFileProcessing}
                  setUploadFileProcessing={setUploadFileProcessing}
                />
              </Suspense>
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
    </Grid>
  )
}

export default OrderDetail

OrderDetail.acl = {
  subject: 'order',
  action: 'read',
}

const CustomTap = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`
