import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Tab,
  Typography,
  styled,
} from '@mui/material'
import {
  useGetReceivableClient,
  useGetReceivableHistory,
  useGetReceivableInvoiceDetail,
  useGetReceivableInvoicePrices,
  useGetReceivableTeam,
} from '@src/queries/invoice/receivable.query'
import { useRouter } from 'next/router'
import InvoiceInfo from './components/invoice-info'
import {
  useState,
  MouseEvent,
  SyntheticEvent,
  useContext,
  useEffect,
  Suspense,
} from 'react'
import TabPanel from '@mui/lab/TabPanel'
import { Icon } from '@iconify/react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import useModal from '@src/hooks/useModal'
import EditAlertModal from '@src/@core/components/common-modal/edit-alert-modal'
import InvoiceLanguageAndItem from './components/language-item'
import { ItemType } from '@src/types/common/item.type'
import { yupResolver } from '@hookform/resolvers/yup'
import { itemSchema } from '@src/types/schema/item.schema'
import { useFieldArray, useForm } from 'react-hook-form'
import { defaultOption, languageType } from '../add-new'
import { useGetAllClientPriceList } from '@src/queries/price-units.query'
import {
  MemberType,
  ProjectTeamType,
  projectTeamSchema,
} from '@src/types/schema/project-team.schema'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import InvoiceClient from './components/client'
import InvoiceProjectTeam from './components/project-team'
import { getProjectTeamColumns } from '@src/shared/const/columns/order-detail'
import { GridColumns } from '@mui/x-data-grid'
import {
  InvoiceDownloadData,
  InvoiceReceivablePatchParamsType,
  InvoiceVersionHistoryType,
} from '@src/types/invoice/receivable.type'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import InvoiceVersionHistory from './components/version-history'
import VersionHistoryModal from '@src/pages/quotes/detail/components/version-history-detail'
import { ClientFormType, clientSchema } from '@src/types/schema/client.schema'
import { InvoiceProjectInfoFormType } from '@src/types/invoice/common.type'
import { useMutation, useQueryClient } from 'react-query'
import {
  confirmInvoiceByLpm,
  patchInvoiceInfo,
  restoreVersion,
} from '@src/apis/invoice/receivable.api'
import toast from 'react-hot-toast'
import { useGetClientPriceList } from '@src/queries/company/standard-price'
import {
  invoiceProjectInfoDefaultValue,
  invoiceProjectInfoSchema,
} from '@src/types/schema/invoice-project-info.schema'
import { useAppDispatch, useAppSelector } from '@src/hooks/useRedux'
import { setInvoice, setInvoiceLang, setIsReady } from '@src/store/invoice'
import SelectTemplateLanguageModal from '@src/@core/components/common-modal/select-template-language-modal'

import {
  formatByRoundingProcedure,
  formatCurrency,
} from '@src/shared/helpers/price.helper'
import InvoiceVersionHistoryModal from './components/modal/version-history-detail'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import Link from 'next/link'
import { AbilityContext } from '@src/layouts/components/acl/Can'
import {
  account_manage,
  invoice_receivable,
  invoice_receivable_accounting_info,
} from '@src/shared/const/permission-class'
import { useGetStatusList } from '@src/queries/common.query'
import { StyledNextLink } from '@src/@core/components/customLink'

import { getCurrentRole } from '@src/shared/auth/storage'
import { InvoiceReceivableChip } from '@src/@core/components/chips/chips'
import ClientInvoice from './components/client-invoice'
import { StandardPriceListType } from '@src/types/common/standard-price'
import { PriceRoundingResponseEnum } from '@src/shared/const/rounding-procedure/rounding-procedure.enum'
import PrintInvoicePage from './invoice-print/print-page'
import { RoundingProcedureList } from '@src/shared/const/rounding-procedure/rounding-procedure'

type MenuType =
  | 'invoice'
  | 'invoiceInfo'
  | 'history'
  | 'team'
  | 'client'
  | 'item'
const ReceivableInvoiceDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const auth = useRecoilValueLoadable(authState)
  const ability = useContext(AbilityContext)
  const dispatch = useAppDispatch()
  const currentRole = getCurrentRole()

  const queryClient = useQueryClient()

  const [invoiceInfoEdit, setInvoiceInfoEdit] = useState(false)
  const [accountingInfoEdit, setAccountingInfoEdit] = useState(false)
  const [langItemsEdit, setLangItemsEdit] = useState(false)
  const [projectTeamEdit, setProjectTeamEdit] = useState(false)
  const invoice = useAppSelector(state => state.invoice)

  const [downloadData, setDownloadData] = useState<InvoiceDownloadData | null>(
    null,
  )

  const [downloadLanguage, setDownloadLanguage] = useState<'EN' | 'KO'>('EN')

  const [projectTeamListPage, setProjectTeamListPage] = useState<number>(0)
  const [projectTeamListPageSize, setProjectTeamListPageSize] =
    useState<number>(10)

  const [versionHistoryListPageSize, setVersionHistoryListPageSize] =
    useState<number>(5)

  const [clientEdit, setClientEdit] = useState(false)
  const [isFileUploading, setIsFileUploading] = useState(false)

  const [languagePairs, setLanguagePairs] = useState<Array<languageType>>([])
  const [value, setValue] = useState<MenuType>(
    currentRole && currentRole.name === 'CLIENT' ? 'invoice' : 'invoiceInfo',
  )
  const { openModal, closeModal } = useModal()

  const { data: priceUnitsList } = useGetAllClientPriceList()

  const User = new invoice_receivable(auth.getValue().user?.id!)
  // const AccountingTeam = new account_manage(auth.getValue().user?.id!)
  const AccountingTeam = new invoice_receivable_accounting_info(
    auth.getValue().user?.id!,
  )

  const isUpdatable = ability.can('update', User)
  const isDeletable = ability.can('delete', User)
  const isAccountInfoUpdatable = ability.can('update', AccountingTeam)

  /* 케밥 메뉴 */
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const {
    data: invoiceInfo,
    isLoading: invoiceInfoIsLoading,
    refetch: invoiceInfoRefetch,
  } = useGetReceivableInvoiceDetail(Number(id!))

  const invalidateInvoiceDetail = () =>
    queryClient.invalidateQueries({ queryKey: 'invoiceReceivableDetail' })

  const { data: langItem, isLoading: langItemLoading } =
    useGetReceivableInvoicePrices(Number(id!))
  const {
    data: client,
    isLoading: clientLoading,
    refetch: clientRefetch,
  } = useGetReceivableClient(Number(id!))
  const {
    data: projectTeam,
    isLoading: projectTeamLoading,
    refetch: projectTeamRefetch,
  } = useGetReceivableTeam(Number(id!))
  const { data: versionHistory, refetch: historyRefetch } =
    useGetReceivableHistory(Number(id!))
  const { data: prices, isSuccess } = useGetClientPriceList({
    clientId: client?.client.clientId,
  })
  const { data: statusList, isLoading: statusListLoading } =
    useGetStatusList('InvoiceReceivable')

  const [priceInfo, setPriceInfo] = useState<StandardPriceListType | null>(null)
  const [tax, setTax] = useState<number | null>(invoiceInfo?.tax! ?? null)
  const [taxable, setTaxable] = useState(invoiceInfo?.isTaxable || false)

  const invoiceStatus = invoiceInfo?.invoiceStatus
  const statusLabel = statusList?.find(
    i => i.value === invoiceInfo?.invoiceStatus,
  )?.label

  const isDownloadBtnVisible =
    invoiceStatus !== 30500 &&
    invoiceStatus !== 30000 &&
    invoiceStatus !== 30100 &&
    invoiceStatus !== 30200

  const isConfirmBtnVisible =
    isUpdatable &&
    (invoiceStatus === 30000 ||
      invoiceStatus === 30100 ||
      invoiceStatus === 30200 ||
      invoiceStatus === 30500)

  const isEditing =
    invoiceInfoEdit ||
    clientEdit ||
    projectTeamEdit ||
    accountingInfoEdit ||
    langItemsEdit ||
    isFileUploading

  const patchInvoiceInfoMutation = useMutation(
    (data: {
      id: number
      form: InvoiceReceivablePatchParamsType
      type: 'basic' | 'accounting'
    }) => patchInvoiceInfo(data.id, data.form, data.type),
    {
      onSuccess: (data: { id: number }, variables) => {
        invalidateInvoiceDetail()
        setInvoiceInfoEdit(false)
        setAccountingInfoEdit(false)
        setProjectTeamEdit(false)
        setClientEdit(false)

        if (data.id !== variables.id) {
          router.push(`/invoice/receivable/detail/${data.id}`)
        } else {
          invoiceInfoRefetch()
          historyRefetch()
          projectTeamRefetch()
          clientRefetch()
          queryClient.invalidateQueries('invoice/receivable/list')
        }
        closeModal('EditSaveModal')
      },
      onError: () => {
        onError()
        closeModal('EditSaveModal')
      },
    },
  )

  const handleChange = (event: SyntheticEvent, newValue: MenuType) => {
    if (
      invoiceInfoEdit ||
      accountingInfoEdit ||
      langItemsEdit ||
      projectTeamEdit ||
      clientEdit
    ) {
      openModal({
        type: 'EditAlertModal',
        children: (
          <EditAlertModal
            onClose={() => closeModal('EditAlertModal')}
            onClick={() => {
              closeModal('EditAlertModal')
              setValue(newValue)
              setInvoiceInfoEdit(false)
              setAccountingInfoEdit(false)
              setLangItemsEdit(false)
              setProjectTeamEdit(false)
              setClientEdit(false)
            }}
          />
        ),
      })
      return
    }

    if (newValue === 'item') {
      // initializeData()
    }

    setValue(newValue)
  }

  const restoreVersionMutation = useMutation(
    (historyId: number) => restoreVersion(historyId),
    {
      onSuccess: () => {
        invalidateInvoiceDetail()
      },
      onError: () => onError(),
    },
  )
  const handleRestoreVersion = (historyId: number) => {
    openModal({
      type: 'RestoreVersionModal',
      children: (
        <CustomModal
          title='Are you sure you want to restore this version?'
          onClose={() => closeModal('RestoreVersionModal')}
          onClick={() => {
            closeModal('RestoreVersionModal')
            closeModal('InvoiceVersionHistoryModal')
            restoreVersionMutation.mutate(historyId)
          }}
          vary='error'
          rightButtonText='Discard'
        />
      ),
    })
    // TODO API 연결
  }

  const onClickVersionHistoryRow = (history: InvoiceVersionHistoryType) => {
    if (auth.state === 'hasValue' && auth.getValue().user) {
      openModal({
        type: 'InvoiceVersionHistoryModal',
        children: (
          <InvoiceVersionHistoryModal
            invoiceInfo={invoiceInfo!}
            history={history}
            onClose={() => closeModal('InvoiceVersionHistoryModal')}
            onClick={handleRestoreVersion}
            user={auth.getValue().user!}
            prices={prices!}
            pricesSuccess={isSuccess}
            statusList={statusList || []}
            isUpdatable={isUpdatable}
            isDeletable={isDeletable}
          />
        ),
      })
    }
  }

  const {
    control: invoiceInfoControl,
    getValues: getInvoiceInfo,
    setValue: setInvoiceInfo,
    watch: invoiceInfoWatch,
    reset: invoiceInfoReset,
    formState: { errors: invoiceInfoErrors, isValid: isInvoiceInfoValid },
  } = useForm<InvoiceProjectInfoFormType>({
    mode: 'onChange',
    defaultValues: invoiceProjectInfoDefaultValue,
    resolver: yupResolver(invoiceProjectInfoSchema),
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

  const {
    control: clientControl,
    getValues: getClientValue,
    setValue: setClientValue,
    watch: clientWatch,
    reset: clientReset,
    trigger: clientTrigger,
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

  const versionHistoryColumns: GridColumns<InvoiceVersionHistoryType> = [
    {
      field: 'position',
      flex: 0.3,
      minWidth: 419,
      headerName: 'Position',
      disableColumnMenu: true,
      renderHeader: () => <Box>Version</Box>,
      renderCell: ({ row }: { row: InvoiceVersionHistoryType }) => {
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
      renderCell: ({ row }: { row: InvoiceVersionHistoryType }) => {
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
      renderCell: ({ row }: { row: InvoiceVersionHistoryType }) => {
        return (
          <Box>
            {FullDateTimezoneHelper(
              row?.clientConfirmedAt,
              row?.clientConfirmTimezone,
            )}
          </Box>
        )
      },
    },
  ]

  function getPriceOptions(source: string, target: string) {
    if (!isSuccess) return [defaultOption]
    const filteredList = prices
      .filter(item => {
        const matchingPairs = item.languagePairs.filter(
          pair => pair.source === source && pair.target === target,
        )
        return matchingPairs.length > 0
      })
      .map(item => ({
        groupName: item.isStandard ? 'Standard client price' : 'Matching price',
        ...item,
      }))
    return [defaultOption].concat(filteredList)
  }
  const onClickPreview = (lang: 'EN' | 'KO') => {
    makePdfData()
    dispatch(setInvoiceLang(lang))
    dispatch(setInvoice(downloadData))

    closeModal('PreviewModal')
  }
  const onClickDownloadInvoice = () => {
    openModal({
      type: 'DownloadInvoiceModal',
      children: (
        <SelectTemplateLanguageModal
          onClose={() => closeModal('DownloadInvoiceModal')}
          onClick={onClickPreview}
          page={'invoice'}
          clientInvoiceLang={
            currentRole && currentRole.name === 'CLIENT'
              ? downloadLanguage
              : undefined
          }
        />
      ),
    })
  }

  const confirmInvoice = useMutation((id: number) => confirmInvoiceByLpm(id), {
    onSuccess: (data, variables) => {
      closeModal('ConfirmInvoice')
      if (data.id === variables) {
        invalidateInvoiceDetail()
        // invoiceInfoRefetch()
      } else {
        router.push(`/invoice/receivable/detail/${data.id}`)
      }
    },
    onError: () => onError(),
  })
  const onClickConfirmInvoice = () => {
    if (invoiceInfo?.id) {
      openModal({
        type: 'ConfirmInvoice',
        children: (
          <CustomModal
            vary='successful'
            title='Are you sure you want to confirm this invoice? It will be delivered to the client.'
            rightButtonText='Confirm'
            onClose={() => closeModal('ConfirmInvoice')}
            onClick={() => {
              confirmInvoice.mutate(invoiceInfo.id)
            }}
          />
        ),
      })
    }
  }

  useEffect(() => {
    if (client) {
      clientReset({
        clientId: client.client.clientId,
        contactPersonId: client.contactPerson?.id,
        addressType: client.clientAddress.find(value => value.isSelected)
          ?.addressType!,
      })
    }
  }, [client, clientReset])

  useEffect(() => {
    if (langItem && prices) {


      setLanguagePairs(
        langItem?.items?.map(item => {
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
                RoundingProcedureList[item.initialPrice?.rounding!]?.label,
              languagePairs: [],
              priceUnit: [],
              catInterface: { memSource: [], memoQ: [] },
            },
          }
        }),
      )
      const result = langItem?.items?.map(item => {
        return {
          id: item.id,
          name: item.itemName,
          source: item.source,
          target: item.target,
          priceId: item.priceId,
          detail: !item?.detail?.length ? [] : item.detail,
          contactPersonId: item.contactPersonId,
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
    if (projectTeam) {
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
      resetTeam({ teams })
    }
  }, [langItem, projectTeam, prices])

  function makePdfData() {
    if (langItem) {
      const pm = projectTeam!.find(value => value.position === 'projectManager')

      // const subtotal = langItem.items.reduce((acc, cur) => {
      //   return acc + cur.totalPrice
      // }, 0)
      const subtotal = Number(invoiceInfo!.subtotal!)
      const tax = subtotal * (invoiceInfo!.tax! / 100)

      const res: InvoiceDownloadData = {
        invoiceId: Number(id!),
        adminCompanyName: 'GloZ Inc.',
        companyAddress: '3325 Wilshire Blvd Ste 626 Los Angeles CA 90010',
        corporationId: invoiceInfo!.corporationId,
        orderCorporationId: invoiceInfo?.orderCorporationId ?? '',
        invoicedAt: invoiceInfo!.invoicedAt,
        paymentDueAt: {
          date: invoiceInfo!.payDueAt,
          timezone: invoiceInfo!.payDueTimezone,
        },
        pm: {
          firstName: pm?.firstName!,
          lastName: pm?.lastName!,
          email: pm?.email!,
          middleName: pm?.middleName!,
        },
        companyName: client!.client.name,
        projectName: invoiceInfo!.projectName,
        client: client!,
        contactPerson: client!.contactPerson,
        clientAddress: client!.clientAddress,
        langItem: langItem!,
        subtotal: priceInfo
          ? formatCurrency(
              formatByRoundingProcedure(
                subtotal,
                priceInfo?.decimalPlace!,
                priceInfo?.roundingProcedure!,
                priceInfo?.currency!,
              ),
              priceInfo?.currency!,
            )
          : '',
        taxPercent: invoiceInfo!.tax,
        tax:
          invoiceInfo!.isTaxable && priceInfo
            ? formatCurrency(
                formatByRoundingProcedure(
                  tax,
                  priceInfo?.decimalPlace!,
                  priceInfo?.roundingProcedure ??
                    PriceRoundingResponseEnum.Type_0,
                  priceInfo?.currency!,
                ),
                priceInfo?.currency!,
              )
            : null,
        total:
          invoiceInfo!.isTaxable && priceInfo
            ? formatCurrency(
                formatByRoundingProcedure(
                  subtotal + tax,
                  priceInfo?.decimalPlace ?? 0,
                  priceInfo?.roundingProcedure ??
                    PriceRoundingResponseEnum.Type_0,
                  priceInfo?.currency ?? 'USD',
                ),
                priceInfo?.currency ?? 'USD',
              )
            : formatCurrency(
                formatByRoundingProcedure(
                  subtotal,
                  priceInfo?.decimalPlace ?? 0,
                  priceInfo?.roundingProcedure ??
                    PriceRoundingResponseEnum.Type_0,
                  priceInfo?.currency ?? 'USD',
                ),
                priceInfo?.currency ?? 'USD',
              ),
      }
      setDownloadData(res)
    }
  }

  function handlePrint() {
    closeModal('DownloadInvoiceModal')
    router.push('/invoice/receivable/detail/invoice-print')
  }

  useEffect(() => {
    if (invoiceInfo && client && langItem && projectTeam && prices)
      makePdfData()
  }, [invoiceInfo, client, langItem, projectTeam, prices, priceInfo])

  useEffect(() => {
    if (languagePairs && prices) {
      const priceInfo =
        prices?.find(value => value.id === languagePairs[0]?.price?.id) ?? null

      setPriceInfo(priceInfo)
    }
  }, [prices, languagePairs])

  useEffect(() => {
    if (
      invoice.isReady &&
      invoice.invoiceTotalData &&
      auth.state === 'hasValue' &&
      auth.getValue().user
    ) {
      openModal({
        type: 'PreviewModal',
        isCloseable: false,
        children: (
          <Box
            sx={{
              width: '794px',
              maxHeight: '95vh',
              // height: '95vh',
              overflow: 'scroll',
              background: '#ffffff',
              boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
              paddingBottom: '24px',
              '::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            <div className='page'>
              <PrintInvoicePage
                data={invoice.invoiceTotalData}
                type='preview'
                user={auth.getValue().user!}
                lang={invoice.lang}
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
  }, [invoice.isReady])

  function onError() {
    toast.error('Something went wrong. Please try again.', {
      position: 'bottom-left',
    })
  }

  return (
    <Grid item xs={12} sx={{ pb: '100px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {invoiceInfo &&
        !invoiceInfoIsLoading &&
        auth.state === 'hasValue' &&
        auth.getValue() ? (
          <Box display='flex'>
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
                {isEditing ? null : (
                  <IconButton
                    sx={{ padding: '0 !important', height: '24px' }}
                    onClick={() => router.push('/invoice/receivable')}
                  >
                    <Icon icon='mdi:chevron-left' width={24} height={24} />
                  </IconButton>
                )}

                <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <img src='/images/icons/invoice/invoice-icon.svg' alt='' />
                  <Typography variant='h5'>
                    {invoiceInfo?.corporationId}
                  </Typography>
                </Box>

                {currentRole && currentRole.name === 'CLIENT'
                  ? InvoiceReceivableChip(
                      statusLabel ?? '',
                      invoiceInfo!.invoiceStatus,
                    )
                  : null}
                {isEditing ? null : (
                  <div>
                    <IconButton
                      aria-label='more'
                      aria-haspopup='true'
                      onClick={handleMenuClick}
                    >
                      <Icon icon='mdi:dots-vertical' />
                    </IconButton>
                    <Menu
                      elevation={8}
                      anchorEl={anchorEl}
                      id='customized-menu'
                      onClose={handleMenuClose}
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
                          href={`/orders/order-list/detail/${invoiceInfo?.orderId}`}
                        >
                          {invoiceInfo?.orderCorporationId}
                        </Link>
                      </MenuItem>
                    </Menu>
                  </div>
                )}
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                }}
              >
                {isEditing ||
                (currentRole && currentRole.name === 'CLIENT') ? null : (
                  <Button
                    variant='outlined'
                    sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                    disabled={!isDownloadBtnVisible}
                    onClick={onClickDownloadInvoice}
                  >
                    <Icon icon='mdi:download' fontSize={20} />
                    Download invoice
                  </Button>
                )}
                {isEditing ||
                (currentRole && currentRole.name === 'CLIENT')? null : (
                  <Button
                    variant='contained'
                    sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                    disabled={!isConfirmBtnVisible}
                    onClick={onClickConfirmInvoice}
                  >
                    Confirm invoice
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        ) : null}

        <Box>
          <TabContext value={value}>
            <TabList
              onChange={handleChange}
              aria-label='Order detail Tab menu'
              style={{ borderBottom: '1px solid rgba(76, 78, 100, 0.12)' }}
            >
              {currentRole && currentRole.name === 'CLIENT' ? (
                <CustomTap
                  value='invoice'
                  label='Invoice'
                  iconPosition='start'
                  icon={
                    <Icon
                      icon='material-symbols:receipt-long'
                      fontSize={'18px'}
                    />
                  }
                  onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                />
              ) : null}

              <CustomTap
                value='invoiceInfo'
                label='Invoice info'
                iconPosition='start'
                icon={
                  <Icon
                    icon='material-symbols:receipt-long'
                    fontSize={'18px'}
                  />
                }
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
            <TabPanel value='invoice' sx={{ pt: '24px' }}>
              <Suspense>
                {downloadData ? (
                  <ClientInvoice
                    downloadData={downloadData}
                    downloadLanguage={downloadLanguage}
                    setDownloadLanguage={setDownloadLanguage}
                    type='detail'
                    user={auth.getValue().user!}
                    onClickDownloadInvoice={onClickDownloadInvoice}
                  />
                ) : null}
              </Suspense>
            </TabPanel>
            <TabPanel value='invoiceInfo' sx={{ pt: '24px' }}>
              {invoiceInfo && !invoiceInfoIsLoading && !statusListLoading ? (
                <InvoiceInfo
                  type='detail'
                  invoiceInfo={invoiceInfo!}
                  edit={invoiceInfoEdit}
                  setEdit={setInvoiceInfoEdit}
                  orderId={7}
                  accountingEdit={accountingInfoEdit}
                  setAccountingEdit={setAccountingInfoEdit}
                  onSave={patchInvoiceInfoMutation.mutate}
                  invoiceInfoControl={invoiceInfoControl}
                  getInvoiceInfo={getInvoiceInfo}
                  setInvoiceInfo={setInvoiceInfo}
                  invoiceInfoWatch={invoiceInfoWatch}
                  invoiceInfoReset={invoiceInfoReset}
                  invoiceInfoErrors={invoiceInfoErrors}
                  isInvoiceInfoValid={isInvoiceInfoValid}
                  clientTimezone={
                    getClientValue('contacts.timezone') ??
                    auth.getValue().user?.timezone!
                  }
                  statusList={statusList || []}
                  isUpdatable={isUpdatable}
                  isDeletable={isDeletable}
                  isAccountInfoUpdatable={isAccountInfoUpdatable}
                  client={client}
                  isFileUploading={isFileUploading}
                  setIsFileUploading={setIsFileUploading}
                />
              ) : null}
            </TabPanel>
            <TabPanel value='item' sx={{ pt: '24px' }}>
              <Card sx={{ padding: '24px' }}>
                <Grid xs={12} container>
                  <InvoiceLanguageAndItem
                    langItem={langItem!}
                    languagePairs={languagePairs!}
                    setLanguagePairs={setLanguagePairs}
                    clientId={client?.client.clientId!}
                    itemControl={itemControl}
                    getItem={getItem}
                    setItem={setItem}
                    itemErrors={itemErrors}
                    isItemValid={isItemValid}
                    priceUnitsList={priceUnitsList || []}
                    items={items}
                    removeItems={removeItems}
                    getTeamValues={getTeamValues}
                    invoiceInfo={invoiceInfo!}
                    itemTrigger={itemTrigger}
                  />
                </Grid>
              </Card>
            </TabPanel>
            <TabPanel value='client' sx={{ pt: '24px' }}>
              <InvoiceClient
                type={'detail'}
                client={client!}
                edit={clientEdit}
                setEdit={setClientEdit}
                setTax={setTax}
                setTaxable={setTaxable}
                clientControl={clientControl}
                getClientValue={getClientValue}
                setClientValue={setClientValue}
                clientWatch={clientWatch}
                isClientValid={isClientValid}
                onSave={patchInvoiceInfoMutation.mutate}
                invoiceInfo={invoiceInfo!}
                getInvoiceInfo={getInvoiceInfo}
                isUpdatable={isUpdatable}
              />
            </TabPanel>
            <TabPanel value='team' sx={{ pt: '24px' }}>
              <InvoiceProjectTeam
                type='detail'
                list={projectTeam!}
                listCount={projectTeam?.length!}
                columns={getProjectTeamColumns()}
                page={projectTeamListPage}
                setPage={setProjectTeamListPage}
                pageSize={projectTeamListPageSize}
                setPageSize={setProjectTeamListPageSize}
                edit={projectTeamEdit}
                setEdit={setProjectTeamEdit}
                teamControl={teamControl}
                members={members}
                appendMember={appendMember}
                removeMember={removeMember}
                updateMember={updateMember}
                getTeamValues={getTeamValues}
                setTeamValues={setTeamValues}
                teamErrors={teamErrors}
                isTeamValid={isTeamValid}
                teamWatch={teamWatch}
                orderId={Number(id!)}
                onSave={patchInvoiceInfoMutation.mutate}
                getInvoiceInfo={getInvoiceInfo}
                invoiceInfo={invoiceInfo}
                isUpdatable={isUpdatable}
              />
            </TabPanel>
            <TabPanel value='history' sx={{ pt: '24px' }}>
              <InvoiceVersionHistory
                list={versionHistory!}
                listCount={versionHistory?.length!}
                columns={versionHistoryColumns}
                pageSize={versionHistoryListPageSize}
                setPageSize={setVersionHistoryListPageSize}
                onClickRow={onClickVersionHistoryRow}
              />
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
    </Grid>
  )
}
export default ReceivableInvoiceDetail

ReceivableInvoiceDetail.acl = {
  subject: 'invoice_receivable',
  action: 'read',
}
const CustomTap = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`
