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
import { useGetAllPriceList } from '@src/queries/price-units.query'
import {
  MemberType,
  ProjectTeamType,
  projectTeamSchema,
} from '@src/types/schema/project-team.schema'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { AuthContext } from '@src/context/AuthContext'
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
import { useMutation } from 'react-query'
import { patchInvoiceInfo } from '@src/apis/invoice/receivable.api'
import toast from 'react-hot-toast'
import { useGetPriceList } from '@src/queries/company/standard-price'
import {
  invoiceProjectInfoDefaultValue,
  invoiceProjectInfoSchema,
} from '@src/types/schema/invoice-project-info.schema'
import { useAppDispatch, useAppSelector } from '@src/hooks/useRedux'
import { setInvoice, setInvoiceLang } from '@src/store/invoice'
import SelectTemplateLanguageModal from '@src/@core/components/common-modal/select-template-language-modal'
import InvoicePreview from './components/invoice-preview'
import {
  formatByRoundingProcedure,
  formatCurrency,
} from '@src/shared/helpers/price.helper'
import InvoiceVersionHistoryModal from './components/modal/version-history-detail'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
type MenuType = 'invoiceInfo' | 'history' | 'team' | 'client' | 'item'
const ReceivableInvoiceDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const { user } = useContext(AuthContext)
  const dispatch = useAppDispatch()

  const [invoiceInfoEdit, setInvoiceInfoEdit] = useState(false)
  const [accountingInfoEdit, setAccountingInfoEdit] = useState(false)
  const [langItemsEdit, setLangItemsEdit] = useState(false)
  const [projectTeamEdit, setProjectTeamEdit] = useState(false)
  const invoice = useAppSelector(state => state.invoice)

  const [projectTeamListPage, setProjectTeamListPage] = useState<number>(0)
  const [projectTeamListPageSize, setProjectTeamListPageSize] =
    useState<number>(10)

  const [versionHistoryListPage, setVersionHistoryListPage] =
    useState<number>(0)
  const [versionHistoryListPageSize, setVersionHistoryListPageSize] =
    useState<number>(5)

  const [clientEdit, setClientEdit] = useState(false)
  const [languagePairs, setLanguagePairs] = useState<Array<languageType>>([])
  const [value, setValue] = useState<MenuType>('invoiceInfo')
  const { openModal, closeModal } = useModal()

  const { data: priceUnitsList } = useGetAllPriceList()

  const {
    data: invoiceInfo,
    isLoading: invoiceInfoIsLoading,
    refetch: invoiceInfoRefetch,
  } = useGetReceivableInvoiceDetail(Number(id!))
  const { data: langItem, isLoading: langItemLoading } =
    useGetReceivableInvoicePrices(Number(id!))
  const { data: client, isLoading: clientLoading } = useGetReceivableClient(
    Number(id!),
  )
  const { data: projectTeam, isLoading: projectTeamLoading } =
    useGetReceivableTeam(Number(id!))
  const { data: versionHistory } = useGetReceivableHistory(Number(id!))
  const { data: prices, isSuccess } = useGetPriceList({
    clientId: client?.client.clientId,
  })

  const [tax, setTax] = useState<number | null>(invoiceInfo?.tax! ?? null)
  const [taxable, setTaxable] = useState(invoiceInfo?.isTaxable || false)

  const patchInvoiceInfoMutation = useMutation(
    (data: { id: number; form: InvoiceReceivablePatchParamsType }) =>
      patchInvoiceInfo(data.id, data.form),
    {
      onSuccess: () => {
        setInvoiceInfoEdit(false)
        invoiceInfoRefetch()
        closeModal('EditSaveModal')
      },
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
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
  const handleRestoreVersion = () => {
    openModal({
      type: 'RestoreVersionModal',
      children: (
        <CustomModal
          title='Are you sure you want to restore this version?'
          onClose={() => closeModal('RestoreVersionModal')}
          onClick={() => {
            closeModal('RestoreVersionModal')
            closeModal('InvoiceVersionHistoryModal')
            // TODO API 연결
          }}
          vary='error'
          rightButtonText='Discard'
        />
      ),
    })
    // TODO API 연결
  }

  const onClickVersionHistoryRow = (history: InvoiceVersionHistoryType) => {
    openModal({
      type: 'InvoiceVersionHistoryModal',
      children: (
        <InvoiceVersionHistoryModal
          history={history}
          onClose={() => closeModal('InvoiceVersionHistoryModal')}
          onClick={handleRestoreVersion}
          user={user!}
          prices={prices!}
          pricesSuccess={isSuccess}
        />
      ),
    })
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
          <Box>{FullDateTimezoneHelper(row.downloadedAt, user?.timezone!)}</Box>
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
    dispatch(setInvoiceLang(lang))
    openModal({
      type: 'PreviewModal',
      children: (
        <InvoicePreview
          onClose={() => closeModal('PreviewModal')}
          data={invoice.invoiceTotalData!}
          lang={lang}
        />
      ),
    })
  }

  const onClickDownloadInvoice = () => {
    openModal({
      type: 'DownloadOrderModal',
      children: (
        <SelectTemplateLanguageModal
          onClose={() => closeModal('DownloadOrderModal')}
          onClick={onClickPreview}
          page={'invoice'}
        />
      ),
    })
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
    if (langItem) {
      setLanguagePairs(
        langItem?.languagePairs?.map(item => ({
          id: String(item.id),
          source: item.source,
          target: item.target,
          price: !item?.price
            ? null
            : getPriceOptions(item.source, item.target).filter(
                price => price.id === item?.price?.id!,
              )[0],
        }))!,
      )
      const result = langItem?.items?.map(item => {
        return {
          id: item.id,
          name: item.name,
          source: item.source,
          target: item.target,
          priceId: item.priceId,
          detail: !item?.detail?.length ? [] : item.detail,
          contactPersonId: item.contactPersonId,
          description: item.description,
          analysis: item.analysis ?? [],
          totalPrice: item?.totalPrice ?? 0,
          dueAt: item?.dueAt,
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
  }, [langItem, projectTeam])

  useEffect(() => {
    if (
      !invoiceInfoIsLoading &&
      !projectTeamLoading &&
      !clientLoading &&
      !langItemLoading &&
      langItem &&
      prices
    ) {
      const pm = projectTeam!.find(value => value.position === 'projectManager')
      const priceInfo = prices?.find(
        value => value.id === langItem.items[0].priceId,
      )

      const res: InvoiceDownloadData = {
        invoiceId: Number(id!),
        adminCompanyName: 'GloZ Inc.',
        companyAddress: '3325 Wilshire Blvd Ste 626 Los Angeles CA 90010',
        corporationId: invoiceInfo!.corporationId,
        orderCorporationId: invoiceInfo!.orderCorporationId,
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
        subtotal: formatCurrency(
          formatByRoundingProcedure(
            langItem.items.reduce((acc, cur) => {
              return acc + cur.totalPrice
            }, 0),
            priceInfo?.decimalPlace!,
            priceInfo?.roundingProcedure!,
            priceInfo?.currency!,
          ),
          priceInfo?.currency!,
        ),
        taxPercent: invoiceInfo!.tax,
        tax: invoiceInfo!.isTaxable
          ? formatCurrency(
              formatByRoundingProcedure(
                langItem.items.reduce((acc, cur) => {
                  return acc + cur.totalPrice
                }, 0) *
                  (getInvoiceInfo().tax! / 100),
                priceInfo?.decimalPlace!,
                priceInfo?.roundingProcedure!,
                priceInfo?.currency!,
              ),
              priceInfo?.currency!,
            )
          : null,
        total: invoiceInfo!.isTaxable
          ? formatCurrency(
              formatByRoundingProcedure(
                langItem.items.reduce((acc, cur) => {
                  return acc + cur.totalPrice
                }, 0) *
                  (getInvoiceInfo().tax! / 100) +
                  items.reduce((acc, cur) => {
                    return acc + cur.totalPrice
                  }, 0),
                priceInfo?.decimalPlace!,
                priceInfo?.roundingProcedure!,
                priceInfo?.currency!,
              ),
              priceInfo?.currency!,
            )
          : formatCurrency(
              formatByRoundingProcedure(
                items.reduce((acc, cur) => {
                  return acc + cur.totalPrice
                }, 0),
                priceInfo?.decimalPlace!,
                priceInfo?.roundingProcedure!,
                priceInfo?.currency!,
              ),
              priceInfo?.currency!,
            ),
      }
      dispatch(setInvoice(res))
    }
  }, [
    dispatch,
    invoiceInfoIsLoading,
    projectTeamLoading,
    clientLoading,
    langItemLoading,
    langItem,
    prices,
  ])

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
            {invoiceInfoEdit ? null : (
              <IconButton
                sx={{ padding: '0 !important', height: '24px' }}
                onClick={() => router.push('/orders/order-list')}
              >
                <Icon icon='mdi:chevron-left' width={24} height={24} />
              </IconButton>
            )}

            <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <img src='/images/icons/order-icons/book.svg' alt='' />
              <Typography variant='h5'>{invoiceInfo?.corporationId}</Typography>
            </Box>
          </Box>
          <Box>
            <Button
              variant='outlined'
              sx={{ display: 'flex', gap: '8px' }}
              onClick={onClickDownloadInvoice}
            >
              <Icon icon='material-symbols:request-quote' />
              Download invoice
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
                value='invoiceInfo'
                label='Invoice info'
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
            <TabPanel value='invoiceInfo' sx={{ pt: '24px' }}>
              {invoiceInfo && !invoiceInfoIsLoading ? (
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
                    getClientValue('contacts.timezone') ?? user?.timezone!
                  }
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
              />
            </TabPanel>
            <TabPanel value='history' sx={{ pt: '24px' }}>
              <InvoiceVersionHistory
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
          </TabContext>
        </Box>
      </Box>
    </Grid>
  )
}
export default ReceivableInvoiceDetail

ReceivableInvoiceDetail.acl = {
  subject: 'invoice-recievable',
  action: 'read',
}
const CustomTap = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`
