import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Box, Button, Grid, styled, Tab, Typography } from '@mui/material'
import Icon from '@src/@core/components/icon'

import TabContext from '@mui/lab/TabContext'
import { MouseEvent, SyntheticEvent, useEffect, useState } from 'react'

import ProjectTeam from '../project-team'
import { ProjectTeamListType } from '@src/types/orders/order-detail'
import { v4 as uuidv4 } from 'uuid'
import { getProjectTeamColumns } from '@src/shared/const/columns/order-detail'
import {
  InvoiceDownloadData,
  InvoiceLanguageItemType,
  InvoiceReceivableDetailType,
  InvoiceVersionHistoryType,
} from '@src/types/invoice/receivable.type'
import InvoiceInfo from '../invoice-info'
import InvoiceLanguageAndItem from '../language-item'
import { defaultOption, languageType } from '../../../add-new'
import { useGetAllClientPriceList } from '@src/queries/price-units.query'
import { ItemType } from '@src/types/common/item.type'
import { Resolver, useFieldArray, useForm } from 'react-hook-form'
import { itemSchema } from '@src/types/schema/item.schema'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  MemberType,
  projectTeamSchema,
  ProjectTeamType,
} from '@src/types/schema/project-team.schema'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { UserDataType } from '@src/context/types'
import { StandardPriceListType } from '@src/types/common/standard-price'
import InvoiceClient from '../client'

import { checkEditable } from '@src/apis/invoice/receivable.api'
import { getCurrentRole } from '@src/shared/auth/storage'
import ClientInvoice from '../client-invoice'
import { PriceRoundingResponseEnum } from '@src/shared/const/rounding-procedure/rounding-procedure.enum'
import {
  formatByRoundingProcedure,
  formatCurrency,
} from '@src/shared/helpers/price.helper'
import { InvoiceProjectInfoFormType } from '@src/types/invoice/common.type'
import { RoundingProcedureList } from '@src/shared/const/rounding-procedure/rounding-procedure'

import { ClientFormType, clientSchema } from '@src/types/schema/client.schema'
import {
  invoiceProjectInfoDefaultValue,
  invoiceProjectInfoSchema,
} from '@src/types/schema/invoice-project-info.schema'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { timezoneSelector } from '@src/states/permission'

type Props = {
  invoiceInfo: InvoiceReceivableDetailType
  history: InvoiceVersionHistoryType
  prices: StandardPriceListType[]
  pricesSuccess: boolean
  user: UserDataType
  onClose: any
  onClick: (historyId: number) => void
  statusList: {
    value: number
    label: string
  }[]
  isUpdatable: boolean
  isDeletable: boolean
}

const InvoiceVersionHistoryModal = ({
  invoiceInfo,
  history,
  onClose,
  onClick,
  user,
  prices,
  pricesSuccess,
  statusList,
  isUpdatable,
  isDeletable,
}: Props) => {
  // console.log(history)

  const [languagePairs, setLanguagePairs] = useState<Array<languageType>>([])

  const [invoiceLanguageItem, setInvoiceLanguageItem] =
    useState<InvoiceLanguageItemType | null>(null)

  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)

  // 여기서 timezoneList는 서버에서 처음 데이터를 불러왔을대 setValue를 해주기 위한 용도로만 사용함
  const [timezoneList, setTimezoneList] = useState<
    {
      id: number
      code: string
      label: string
      pinned: boolean
    }[]
  >([])

  useEffect(() => {
    if (timezoneList.length !== 0) return
    const zoneList = timezone.getValue()
    const filteredTimezone = zoneList.map((list, idx) => {
      return {
        id: idx,
        code: list.timezoneCode,
        label: list.timezone,
        pinned: false,
      }
    })
    setTimezoneList(filteredTimezone)
  }, [timezone])

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const currentRole = getCurrentRole()

  const [value, setValue] = useState<string>(
    currentRole && currentRole.name === 'CLIENT' ? 'invoice' : 'invoiceInfo',
  )

  const teamOrder = ['supervisor', 'projectManager', 'member']
  const fieldOrder = ['supervisorId', 'projectManagerId', 'member']

  const { data: priceUnitsList } = useGetAllClientPriceList()

  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(0)

  const [isUserInTeamMember, setIsUserInTeamMember] = useState<boolean>(false)

  const [downloadData, setDownloadData] = useState<InvoiceDownloadData | null>(
    null,
  )

  const [downloadLanguage, setDownloadLanguage] = useState<'EN' | 'KO'>('EN')

  const [priceInfo, setPriceInfo] = useState<StandardPriceListType | null>(null)

  const [teams, setTeams] = useState<ProjectTeamListType[]>([])

  const {
    control: invoiceInfoControl,
    getValues: getInvoiceInfo,
    setValue: setInvoiceInfo,
    watch: invoiceInfoWatch,
    reset: invoiceInfoReset,
    trigger: invoiceInfoTrigger,
    formState: { errors: invoiceInfoErrors, isValid: isInvoiceInfoValid },
  } = useForm<InvoiceProjectInfoFormType>({
    mode: 'onChange',
    defaultValues: invoiceProjectInfoDefaultValue,
    resolver: yupResolver(
      invoiceProjectInfoSchema,
    ) as unknown as Resolver<InvoiceProjectInfoFormType>,
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
    resolver: yupResolver(clientSchema) as Resolver<ClientFormType>,
  })

  const {
    control: itemControl,
    getValues: getItem,
    setValue: setItem,
    trigger: itemTrigger,
    reset: itemReset,
    formState: { errors: itemErrors, isValid: isItemValid },
  } = useForm<{ items: ItemType[]; languagePairs: languageType[] }>({
    mode: 'onBlur',
    defaultValues: { items: [], languagePairs: [] },
    resolver: yupResolver(itemSchema) as unknown as Resolver<{
      items: ItemType[]
      languagePairs: languageType[]
    }>,
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
          id: user.userId!,
          name: getLegalName({
            firstName: user.firstName!,
            middleName: user.middleName,
            lastName: user.lastName!,
          }),
        },
        { type: 'member', id: null },
      ],
    },
    resolver: yupResolver(projectTeamSchema) as Resolver<ProjectTeamType>,
  })

  function getPriceOptions(source: string, target: string) {
    if (!pricesSuccess) return [defaultOption]
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

  // useEffect(() => {
  //   if (history.client) {
  //     clientReset({
  //       clientId: history.client.client.clientId,
  //       contactPersonId: history.client.contactPerson?.id,
  //       addressType: history.client.clientAddress.find(
  //         value => value.isSelected,
  //       )?.addressType!,
  //     })
  //   }
  // }, [history.client, clientReset])

  useEffect(() => {
    const defaultTimezone = {
      id: undefined,
      code: '',
      label: '',
      pinned: false,
    }

    if (history) {
      checkEditable(history.projectInfo.id).then(res => {
        setIsUserInTeamMember(res)
      })
    }
    if (history.items && history.projectInfo) {
      const clientTimezone =
        getClientValue('contacts.timezone') ?? auth.getValue().user?.timezone!

      setInvoiceLanguageItem({
        ...history.items,
        // orders: history.items.orders.map(item => ({
        //   ...item,
        // })),
      })

      const items = history.items.orders
        .map(item =>
          item.items.map((value, idx) => ({
            ...value,
            orderId: item.id,
            projectName: item.projectName,
            id: item.id,
            itemName: value.itemName,
            source: value.sourceLanguage,
            target: value.targetLanguage,
            priceId: value.priceId,
            detail: !value?.detail?.length ? [] : value.detail,
            analysis: value.analysis ?? [],
            totalPrice: value?.totalPrice ?? 0,
            dueAt: value?.dueAt ?? '',
            contactPerson: value?.contactPerson ?? null,
            contactPersonId: value.contactPerson?.userId ?? undefined,
            // initialPrice는 order 생성시점에 선택한 price의 값을 담고 있음
            // name, currency, decimalPlace, rounding 등 price와 관련된 계산이 필요할때는 initialPrice 내 값을 쓴다
            initialPrice: value.initialPrice ?? null,
            description: value.description,
            showItemDescription: value.showItemDescription,
            minimumPrice: value.minimumPrice,
            minimumPriceApplied: value.minimumPriceApplied,
            indexing: idx,
          })),
        )
        .flat()
        .map((value, idx) => ({ ...value, idx: idx }))

      console.log(items)

      itemReset({ items: items })

      setLanguagePairs(
        items?.map(item => {
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
              catInterface: { phrase: [], memoQ: [] },
            },
          }
        }),
      )

      const res: InvoiceProjectInfoFormType = {
        ...history.projectInfo,
        invoiceDescription: history.projectInfo.description,
        invoiceDateTimezone: history.projectInfo.invoicedTimezone
          ? timezoneList.find(
              zone => zone.code === history.projectInfo.invoicedTimezone.code,
            )!
          : defaultTimezone,
        invoiceDate: new Date(history.projectInfo.invoicedAt),
        taxInvoiceIssued: history.projectInfo.taxInvoiceIssued,
        showDescription: history.projectInfo.showDescription,
        paymentDueDate: {
          date: history.projectInfo.payDueAt,
          timezone: clientTimezone
            ? timezoneList.find(zone => zone.code === clientTimezone.code)!
            : defaultTimezone,
        },
        invoiceConfirmDate: {
          date: history.projectInfo.invoiceConfirmedAt ?? null,
          timezone: clientTimezone
            ? timezoneList.find(zone => zone.code === clientTimezone.code)!
            : defaultTimezone,
        },
        taxInvoiceDueDate: {
          date: history.projectInfo.taxInvoiceDueAt ?? null,
          timezone: clientTimezone
            ? timezoneList.find(zone => zone.code === clientTimezone.code)!
            : defaultTimezone,
        },
        paymentDate: {
          date: history.projectInfo.paidAt,
          timezone: clientTimezone
            ? timezoneList.find(zone => zone.code === clientTimezone.code)!
            : defaultTimezone,
        },
        taxInvoiceIssuanceDate: {
          date: history.projectInfo.taxInvoiceIssuedAt ?? '',
          timezone: clientTimezone
            ? timezoneList.find(zone => zone.code === clientTimezone.code)!
            : defaultTimezone,
        },
        salesRecognitionDate: {
          date: history.projectInfo.salesCheckedAt ?? '',
          timezone: clientTimezone
            ? timezoneList.find(zone => zone.code === clientTimezone.code)!
            : defaultTimezone,
        },

        salesCategory: history.projectInfo.salesCategory,
        notes: history.projectInfo.notes,

        setReminder: history.projectInfo.setReminder,
        tax: history.projectInfo.tax,
        isTaxable: history.projectInfo.isTaxable ?? true,
        // subtotal: invoiceInfo.subtotal,
        subtotal: history.items.orders.reduce(
          (total, obj) => total + obj.subtotal,
          0,
        ),
      }
      invoiceInfoReset(res)
    }
    if (history.members) {
      let viewTeams: ProjectTeamListType[] = [...history.members].map(
        value => ({
          ...value,
          id: uuidv4(),
        }),
      )

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
      }> = history.members.map(item => ({
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
  }, [history])

  useEffect(() => {
    const defaultTimezone = {
      id: undefined,
      code: '',
      label: '',
      pinned: false,
    }
    if (history) {
      const { projectInfo, clientInfo, members, items } = history

      const pm = members!.find(value => value.position === 'projectManager')

      const historyItems: ItemType[] = items.orders
        .map(item =>
          item.items.map((value, idx) => ({
            ...value,
            orderId: item.id,
            projectName: item.projectName,
            id: item.id,
            itemName: value.itemName,
            source: value.sourceLanguage,
            target: value.targetLanguage,
            priceId: value.priceId,
            detail: !value?.detail?.length ? [] : value.detail,
            analysis: value.analysis ?? [],
            totalPrice: value?.totalPrice ?? 0,
            dueAt: value?.dueAt ?? '',
            contactPerson: value?.contactPerson ?? null,
            contactPersonId: value.contactPerson?.userId ?? undefined,
            // initialPrice는 order 생성시점에 선택한 price의 값을 담고 있음
            // name, currency, decimalPlace, rounding 등 price와 관련된 계산이 필요할때는 initialPrice 내 값을 쓴다
            initialPrice: value.initialPrice ?? null,
            description: value.description,
            showItemDescription: value.showItemDescription,
            minimumPrice: value.minimumPrice,
            minimumPriceApplied: value.minimumPriceApplied,
            indexing: idx,
          })),
        )
        .flat()
        .map((value, idx) => ({ ...value, idx: idx }))

      // const subtotal = langItem.items.reduce((acc, cur) => {
      //   return acc + cur.totalPrice
      // }, 0)
      const invoiceTax =
        projectInfo!.tax && projectInfo!.tax !== ''
          ? Number(projectInfo!.tax)
          : 0
      const subtotal = items.orders.reduce(
        (total, obj) => total + obj.subtotal,
        0,
      )
      const tax = subtotal * (invoiceTax / 100)

      const res: InvoiceDownloadData = {
        invoiceId: Number(projectInfo.id!),
        adminCompanyName: invoiceInfo?.adminCompanyName!,
        corporationId: invoiceInfo?.corporationId!,
        companyAddress: '',
        orderCorporationId: projectInfo!.linkedOrders.map(
          value => value.corporationId,
        ),
        orders: items.orders,
        // orderCorporationId: invoiceInfo?.orderCorporationId ?? '',
        invoicedAt: projectInfo!.invoicedAt,
        paymentDueAt: {
          date: projectInfo!.payDueAt,
          timezone: projectInfo!.payDueTimezone
            ? timezoneList.find(
                zone => zone.code === projectInfo!.payDueTimezone.code,
              )!
            : defaultTimezone,
        },
        pm: {
          firstName: pm?.firstName!,
          lastName: pm?.lastName!,
          email: pm?.email!,
          middleName: pm?.middleName!,
        },
        companyName: clientInfo!.client.name,
        projectName: projectInfo!.projectName,
        client: clientInfo!,
        contactPerson: clientInfo!.contactPerson,
        clientAddress: clientInfo!.clientAddress,
        langItem: historyItems,
        currency: projectInfo!.currency,
        // langItem: {id : langItem.invoiceId, languagePairs : langItem.orders } !,
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
        taxPercent: invoiceTax,
        tax:
          projectInfo!.isTaxable && priceInfo
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
          projectInfo!.isTaxable && priceInfo
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
  }, [history])

  useEffect(() => {
    if (languagePairs && prices) {
      const priceInfo =
        prices?.find(value => value.id === languagePairs[0]?.price?.id) ?? null

      setPriceInfo(priceInfo)
    }
  }, [prices, languagePairs])

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
        overflow: 'scroll',
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
          <img src='/images/icons/invoice/invoice-icon.svg' alt='' />
          <Typography variant='h5'>{`[Ver. ${history.version}] ${history.projectInfo.corporationId}`}</Typography>
        </Box>
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
                <Icon icon='material-symbols:receipt-long' fontSize={'18px'} />
              }
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            <CustomTap
              value='items'
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
          </TabList>
          <TabPanel value='invoice' sx={{ pt: '24px' }}>
            {downloadData ? (
              <ClientInvoice
                downloadData={downloadData}
                downloadLanguage={downloadLanguage}
                setDownloadLanguage={setDownloadLanguage}
                type='history'
                user={user!}
                orders={history.items.orders}
                timezoneList={timezone.getValue()}
              />
            ) : null}
          </TabPanel>
          <TabPanel
            value='invoiceInfo'
            sx={{ height: '100%', minHeight: '552px' }}
          >
            <InvoiceInfo
              type='history'
              invoiceInfo={history.projectInfo}
              edit={false}
              statusList={statusList}
              isUpdatable={isUpdatable}
              isDeletable={isDeletable}
              isAccountInfoUpdatable={false}
            />
          </TabPanel>

          <TabPanel value='items' sx={{ height: '100%', minHeight: '552px' }}>
            <Grid xs={12} container>
              <InvoiceLanguageAndItem
                languagePairs={languagePairs!}
                setLanguagePairs={setLanguagePairs}
                clientId={history?.clientInfo.client.clientId}
                itemControl={itemControl}
                getItem={getItem}
                setItem={setItem}
                itemErrors={itemErrors}
                isItemValid={isItemValid}
                priceUnitsList={priceUnitsList || []}
                items={items}
                removeItems={removeItems}
                getTeamValues={getTeamValues}
                invoiceInfo={history.projectInfo}
                itemTrigger={itemTrigger}
                invoiceLanguageItem={invoiceLanguageItem!}
                getInvoiceInfo={getInvoiceInfo}
                type='invoiceHistory'
                isUpdatable={false}
              />
            </Grid>
          </TabPanel>
          <TabPanel value='client' sx={{ height: '100%', minHeight: '552px' }}>
            <InvoiceClient
              type='history'
              client={history.clientInfo}
              edit={false}
              setTax={() => null}
              setTaxable={() => null}
              isUpdatable={isUpdatable}
            />
          </TabPanel>
          <TabPanel value='team' sx={{ height: '100%', minHeight: '552px' }}>
            <ProjectTeam
              type='history'
              list={teams}
              listCount={history.members.length}
              columns={getProjectTeamColumns()}
              page={page}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
              edit={false}
              setEdit={() => console.log('no')}
              orderId={history.id}
              isUpdatable={isUpdatable}
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
          {isUpdatable &&
            isUserInTeamMember &&
            history.isRestorable &&
            ![30000, 30100, 30200, 30900, 301200].includes(
              invoiceInfo.invoiceStatus,
            ) && (
              <Button
                variant='contained'
                sx={{ width: '226px' }}
                onClick={() => onClick(history.id)}
              >
                Restore this version
              </Button>
            )}
        </Box>
      </Box>
    </Box>
  )
}

export default InvoiceVersionHistoryModal

const CustomTap = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`
