import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// ** hooks
import useModal from '@src/hooks/useModal'

// ** mui
import {
  Box,
  Button,
  Card,
  Checkbox,
  Grid,
  IconButton,
  TableCell,
  TextField,
  Typography,
} from '@mui/material'
import PageHeader from '@src/@core/components/page-header'
import styled from 'styled-components'

// ** react hook form
import { useForm, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** third parties
import { toast } from 'react-hot-toast'

// ** validation values & types
import {
  ProjectTeamType,
  projectTeamSchema,
} from '@src/types/schema/project-team.schema'
import { ClientFormType, clientSchema } from '@src/types/schema/client.schema'
import { StandardPriceListType } from '@src/types/common/standard-price'
import { itemSchema } from '@src/types/schema/item.schema'
import { ItemType } from '@src/types/common/item.type'

import { ProjectTeamFormType } from '@src/types/common/orders-and-quotes.type'
import { MemberType } from '@src/types/schema/project-team.schema'

// ** components
import Stepper from '@src/pages/components/stepper'
import ProjectTeamFormContainer from '@src/pages/quotes/components/form-container/project-team-container'
import ClientQuotesFormContainer from '@src/pages/components/form-container/clients/client-container'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import AddLanguagePairForm from '@src/pages/components/forms/add-language-pair-form'
import ItemForm from '@src/pages/components/forms/items-form'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'
import DeleteConfirmModal from '@src/pages/client/components/modals/delete-confirm-modal'

// ** context
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'

// ** helpers
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import languageHelper from '@src/shared/helpers/language.helper'

// ** apis
import { useGetClientPriceList } from '@src/queries/company/standard-price'
import { useGetAllClientPriceList } from '@src/queries/price-units.query'

import {
  getClient,
  getLangItems,
  getProjectInfo,
  getProjectTeam,
} from '@src/apis/order/order-detail.api'

import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'
import { getClientPriceList } from '@src/apis/company/company-price.api'
import InvoiceProjectInfoForm from '@src/pages/components/forms/invoice-receivable-info-form'
import {
  InvoiceMultipleOrderType,
  InvoiceProjectInfoFormType,
} from '@src/types/invoice/common.type'
import {
  invoiceProjectInfoDefaultValue,
  invoiceProjectInfoSchema,
} from '@src/types/schema/invoice-project-info.schema'
import {
  formatByRoundingProcedure,
  formatCurrency,
  getCurrencyMark,
} from '@src/shared/helpers/price.helper'
import FallbackSpinner from '@src/@core/components/spinner'
import { useMutation, useQueryClient } from 'react-query'
import {
  CreateInvoiceReceivableRes,
  InvoiceReceivablePatchParamsType,
} from '@src/types/invoice/receivable.type'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { createInvoice } from '@src/apis/invoice/receivable.api'
import { useConfirmLeave } from '@src/hooks/useConfirmLeave'
import { useGetStatusList } from '@src/queries/common.query'
import { RoundingProcedureList } from '@src/shared/const/rounding-procedure/rounding-procedure'
import { getMultipleOrder } from '@src/apis/invoice/common.api'
import { changeTimeZoneOffset } from '@src/shared/helpers/date.helper'

export type languageType = {
  id: number | string
  source: string
  target: string
  price:
    | (StandardPriceListType & {
        groupName?: string
      })
    | null
}

export const defaultOption: StandardPriceListType & {
  groupName: string
} = {
  id: NOT_APPLICABLE,
  isStandard: false,
  priceName: 'Not applicable',
  groupName: 'Not applicable',
  category: '',
  serviceType: [],
  currency: 'USD',
  catBasis: '',
  decimalPlace: 0,
  roundingProcedure: '',
  languagePairs: [],
  priceUnit: [],
  catInterface: { memSource: [], memoQ: [] },
}

export default function AddNewInvoice() {
  const router = useRouter()

  const auth = useRecoilValueLoadable(authState)
  const { data: statusList, isLoading } = useGetStatusList('InvoiceReceivable')
  const [isReady, setIsReady] = useState(false)
  const [isWarn, setIsWarn] = useState(true)
  const queryClient = useQueryClient()

  const [orders, setOrders] = useState<InvoiceMultipleOrderType | null>(null)

  useEffect(() => {
    if (!router.isReady) return

    const orderId = router.query.orderId
      ? typeof router.query.orderId === 'object'
        ? router.query.orderId.map(item => Number(item))
        : typeof router.query.orderId === 'string'
        ? Number(router.query.orderId)
        : 0
      : []
    const verifiedOrderIds =
      typeof orderId === 'number'
        ? !isNaN(orderId)
        : orderId.every(item => !isNaN(item))

    if (verifiedOrderIds) {
      onCopyOrder(typeof orderId === 'number' ? [orderId] : orderId)
    }
    // if (!isNaN(orderId)) {
    //   onCopyOrder(orderId)
    // }
  }, [router.query])

  const { openModal, closeModal } = useModal()

  const [subPrice, setSubPrice] = useState(0)
  function sumTotalPrice() {
    const subPrice = getItem()?.items!
    if (subPrice) {
      const total = subPrice.reduce((accumulator, item) => {
        return accumulator + item.totalPrice
      }, 0)
      setSubPrice(total)
    }
  }
  useEffect(() => {
    sumTotalPrice()
  }, [])

  // ** stepper
  const [activeStep, setActiveStep] = useState<number>(0)

  const createInvoiceMutation = useMutation(
    (data: InvoiceReceivablePatchParamsType) => createInvoice(data),
    {
      onSuccess: (data: CreateInvoiceReceivableRes) => {
        closeModal('CreateInvoiceModal')
        router.push(`/invoice/receivable/detail/${data.data.id}`)

        queryClient.invalidateQueries('invoice/receivable/list')
      },
    },
  )

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const onNextStep = () => {
    setActiveStep(activeStep + 1)
  }

  const steps = [
    {
      title: 'Project team',
    },
    {
      title: 'Client',
    },
    {
      title: 'Invoice info',
    },
    {
      title: ' Languages & Items',
    },
  ]

  // ** confirm page leaving
  // router.beforePopState(() => {
  //   openModal({
  //     type: 'alert-modal',
  //     children: (
  //       <PageLeaveModal
  //         onClose={() => closeModal('alert-modal')}
  //         onClick={() => router.push('/invoice/receivable')}
  //       />
  //     ),
  //   })
  //   return false
  // })

  // ** step1

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

  // ** step2
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

  // ** step3
  const {
    control: projectInfoControl,
    getValues: getProjectInfoValues,
    setValue: setProjectInfo,
    watch: projectInfoWatch,
    reset: projectInfoReset,
    trigger: projectInfoTrigger,
    formState: { errors: projectInfoErrors, isValid: isProjectInfoValid },
  } = useForm<InvoiceProjectInfoFormType>({
    mode: 'onChange',
    defaultValues: invoiceProjectInfoDefaultValue,
    resolver: yupResolver(invoiceProjectInfoSchema),
  })

  // ** step4
  const { data: prices, isSuccess } = useGetClientPriceList({
    clientId: getClientValue('clientId'),
  })

  const { data: priceUnitsList } = useGetAllClientPriceList()
  const {
    control: itemControl,
    getValues: getItem,
    setValue: setItem,
    trigger: itemTrigger,
    reset: itemReset,
    formState: { errors: itemErrors, isValid: isItemValid },
  } = useForm<{ items: ItemType[]; languagePairs: languageType[] }>({
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
    fields: languagePairs,
    append: appendLanguagePairs,
    remove: removeLanguagePairs,
    update: updateLanguagePairs,
  } = useFieldArray({
    control: itemControl,
    name: 'languagePairs',
  })

  function onDeleteLanguagePair(row: languageType) {
    const isDeletable = !getItem()?.items?.length
      ? true
      : !getItem().items.some(
          item => item.source === row.source && item.source === row.target,
        )
    if (isDeletable) {
      openModal({
        type: 'delete-language',
        children: (
          <DeleteConfirmModal
            message='Are you sure you want to delete this language pair?'
            title={`${languageHelper(row.source)} → ${languageHelper(
              row.target,
            )}`}
            onDelete={deleteLanguage}
            onClose={() => closeModal('delete-language')}
          />
        ),
      })
    } else {
      openModal({
        type: 'cannot-delete-language',
        children: (
          <SimpleAlertModal
            message='This language pair cannot be deleted because it’s already being used in the item.'
            title={`${languageHelper(row.source)} → ${languageHelper(
              row.target,
            )}`}
            onClose={() => closeModal('cannot-delete-language')}
          />
        ),
      })
    }

    function deleteLanguage() {
      const idx = getItem('languagePairs')
        .map(item => item.id)
        .indexOf(row.id)
      const copyOriginal = [...languagePairs]
      copyOriginal.splice(idx, 1)
      // setLanguagePairs([...copyOriginal])
      setItem('languagePairs', [...copyOriginal])
    }
  }

  const priceInfo = prices?.find(
    value => value.id === getItem().items[0]?.priceId,
  )

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

  function onSubmit() {
    setIsWarn(false)

    const orderId = router.query.orderId
      ? typeof router.query.orderId === 'object'
        ? router.query.orderId.map(item => Number(item))
        : typeof router.query.orderId === 'string'
        ? Number(router.query.orderId)
        : 0
      : []
    const teams = transformTeamData(getTeamValues())
    const clients: any = {
      ...getClientValue(),
      contactPersonId:
        getClientValue().contactPersonId === NOT_APPLICABLE
          ? -1
          : getClientValue().contactPersonId,
    }
    const rawProjectInfo = getProjectInfoValues()
    const projectInfo = {
      ...rawProjectInfo,
    }

    const res: InvoiceReceivablePatchParamsType = {
      projectManagerId: teams.projectManagerId!,
      supervisorId: teams.supervisorId ?? null,
      members: teams.members ?? null,
      clientId: clients.clientId,
      contactPersonId: clients.contactPersonId,
      orderId: typeof orderId === 'number' ? [orderId] : orderId,
      invoicedAt: changeTimeZoneOffset(
        projectInfo.invoiceDate.toISOString(),
        projectInfo.invoiceDateTimezone,
      )!,
      invoicedTimezone: {
        ...projectInfo.invoiceDateTimezone,
        code: '',
        phone: '',
      },
      payDueAt: changeTimeZoneOffset(
        new Date(projectInfo.paymentDueDate.date).toISOString(),
        projectInfo.paymentDueDate.timezone,
      )!,
      description: projectInfo.invoiceDescription,
      projectName: projectInfo.projectName,
      revenueFrom: projectInfo.revenueFrom,
      tax: projectInfo.tax ? projectInfo.tax.toString() : '',
      isTaxable: projectInfo.isTaxable ? '1' : '0',
      addressType: clients.addressType,
      payDueTimezone: {
        ...projectInfo.paymentDueDate.timezone,
        code: '',
        phone: '',
      },
      // invoiceConfirmedAt: projectInfo.invoiceConfirmDate?.date,
      // invoiceConfirmTimezone: projectInfo.invoiceConfirmDate?.timezone,
      // taxInvoiceDueAt: projectInfo.taxInvoiceDueDate?.date,
      // taxInvoiceDueTimezone: projectInfo.taxInvoiceDueDate?.timezone,
      showDescription: projectInfo.showDescription ? '1' : '0',
      invoiceDescription: projectInfo.invoiceDescription,
      setReminder: projectInfo.setReminder ? '1' : '0',
    }
    console.log('res', res)
    openModal({
      type: 'CreateInvoiceModal',
      children: (
        <CustomModal
          onClose={() => closeModal('CreateInvoiceModal')}
          title='Are you sure you want to create this invoice?'
          subtitle={projectInfo.projectName}
          vary='successful'
          onClick={() =>
            createInvoiceMutation.mutate(removeUndefinedValues(res))
          }
          rightButtonText='Save'
        />
      ),
    })
  }

  function removeUndefinedValues(obj: any): any {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        // @ts-ignore
        acc[key] = value
      }
      return acc
    }, {})
  }

  function onRequestError() {
    toast.error('Something went wrong. Please try again.', {
      position: 'bottom-left',
    })
  }
  function transformTeamData(data: ProjectTeamType) {
    let result: ProjectTeamFormType = {
      projectManagerId: 0,
      supervisorId: undefined,
      members: [],
    }

    data.teams.forEach(item => {
      if (item.type === 'supervisorId') {
        !item.id
          ? delete result.supervisorId
          : (result.supervisorId = Number(item.id))
      } else if (item.type === 'projectManagerId') {
        result.projectManagerId = Number(item.id)!
      } else if (item.type === 'member') {
        if (!item.id) {
          result.members = []
        } else {
          result?.members?.push(item.id!)
        }
      }
    })
    if (!result.members || !result?.members?.length) delete result.members
    return result
  }

  async function onCopyOrder(id: number[] | null) {
    const priceList = await getClientPriceList({})
    closeModal('copy-order')
    if (id) {
      getMultipleOrder(id)
        .then(res => {
          console.log('getMultipleOrder', res)

          const isClientRegistered =
            res.clientInfo.contactPerson !== null &&
            res.clientInfo.contactPerson.userId !== null
          setOrders(res)
          // setProjectInfo('isTaxable', res.clientInfo.client.taxable)
          // setProjectInfo('tax', res.clientInfo.client.tax)
          clientReset({
            clientId: res.clientInfo.client.clientId,
            contactPersonId: null,
            addressType: 'billing',
          })
          projectInfoReset({
            invoiceDate: new Date(),
            showDescription: false,
            invoiceDescription: '',
            revenueFrom: res.revenueFrom,
            isTaxable: res.clientInfo.client.isTaxable,

            tax: res.clientInfo.client.tax,
            subtotal: res.orders.reduce(
              (total, obj) => total + obj.subtotal,
              0,
            ),
          })
          const items = res.orders
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
          const itemLangPairs = items?.map(item => {
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
          })

          itemReset({ items: items, languagePairs: itemLangPairs })
          itemTrigger()
        })
        .catch(e => {
          return
        })

      setIsReady(true)
    }
  }

  const { ConfirmLeaveModal } = useConfirmLeave({
    // shouldWarn안에 isDirty나 isSubmitting으로 조건 줄 수 있음
    shouldWarn: isWarn,
    toUrl: '/invoice/receivable',
  })

  return (
    <Grid container spacing={6}>
      <ConfirmLeaveModal />
      <PageHeader
        title={
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Box display='flex' alignItems='center' gap='8px'>
              <IconButton onClick={() => router.back()}>
                <Icon icon='material-symbols:arrow-back-ios-new-rounded' />
              </IconButton>
              <Typography variant='h5'>Create new invoice</Typography>
            </Box>
          </Box>
        }
      />
      <Grid item xs={12}>
        <Card>
          <Stepper
            activeStep={activeStep}
            steps={steps}
            style={{ maxWidth: '80%', margin: '0 auto' }}
          />
        </Card>
      </Grid>
      <Grid item xs={12}>
        {activeStep === 0 ? (
          <Card sx={{ padding: '24px' }}>
            <Grid container spacing={6}>
              {isReady && (
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
              )}

              <Grid item xs={12} display='flex' justifyContent='flex-end'>
                <Button
                  variant='contained'
                  disabled={!isTeamValid}
                  onClick={onNextStep}
                >
                  Next <Icon icon='material-symbols:arrow-forward-rounded' />
                </Button>
              </Grid>
            </Grid>
          </Card>
        ) : activeStep === 1 ? (
          <Card sx={{ padding: '24px' }}>
            <Grid container spacing={6}>
              <ClientQuotesFormContainer
                control={clientControl}
                setValue={setClientValue}
                watch={clientWatch}
                setTaxable={(n: boolean) => setProjectInfo('isTaxable', n)}
                setTax={(n: number | null) =>
                  setProjectInfo('tax', n?.toString()!)
                }
                type='invoice'
                formType='create'
                getValue={getClientValue}
                fromQuote={false}
                reset={clientReset}
                trigger={clientTrigger}
              />
              <Grid item xs={12} display='flex' justifyContent='space-between'>
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={handleBack}
                >
                  <Icon icon='material-symbols:arrow-back-rounded' />
                  Previous
                </Button>
                <Button
                  variant='contained'
                  disabled={!isClientValid}
                  onClick={onNextStep}
                >
                  Next <Icon icon='material-symbols:arrow-forward-rounded' />
                </Button>
              </Grid>
            </Grid>
          </Card>
        ) : activeStep === 2 ? (
          <Card sx={{ padding: '24px' }}>
            <DatePickerWrapper>
              <Grid container spacing={6}>
                <InvoiceProjectInfoForm
                  control={projectInfoControl}
                  setValue={setProjectInfo}
                  getValue={getProjectInfoValues}
                  watch={projectInfoWatch}
                  errors={projectInfoErrors}
                  trigger={projectInfoTrigger}
                  clientTimezone={getClientValue('contacts.timezone')}
                  type='create'
                />
                <Grid
                  item
                  xs={12}
                  display='flex'
                  justifyContent='space-between'
                >
                  <Button
                    variant='outlined'
                    color='secondary'
                    onClick={handleBack}
                  >
                    <Icon icon='material-symbols:arrow-back-rounded' />
                    Previous
                  </Button>
                  <Button
                    variant='contained'
                    disabled={!isProjectInfoValid}
                    onClick={onNextStep}
                  >
                    Next <Icon icon='material-symbols:arrow-forward-rounded' />
                  </Button>
                </Grid>
              </Grid>
            </DatePickerWrapper>
          </Card>
        ) : (
          <Card sx={{ padding: '24px' }}>
            <Grid container>
              {/* <Grid item xs={12}>
                <AddLanguagePairForm
                  type='detail'
                  languagePairs={languagePairs}
                  setLanguagePairs={setLanguagePairs}
                  getPriceOptions={getPriceOptions}
                  onDeleteLanguagePair={onDeleteLanguagePair}
                  items={items}
                />
              </Grid> */}
              <Grid item xs={12} mb={6}>
                <ItemForm
                  control={itemControl}
                  getValues={getItem}
                  setValue={setItem}
                  errors={itemErrors}
                  fields={items}
                  remove={removeItems}
                  teamMembers={getTeamValues()?.teams}
                  languagePairs={getItem('languagePairs')}
                  getPriceOptions={getPriceOptions}
                  priceUnitsList={priceUnitsList || []}
                  type='invoiceCreate'
                  itemTrigger={itemTrigger}
                  sumTotalPrice={sumTotalPrice}
                  orders={orders?.orders}
                  from='invoice'
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '20px',
                      borderBottom: '2px solid #666CFF',
                      justifyContent: 'center',
                      width: '25%',
                    }}
                  >
                    <Typography
                      fontWeight={600}
                      variant='subtitle1'
                      sx={{
                        padding: '16px 16px 16px 20px',
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      Subtotal
                    </Typography>
                    <Typography
                      fontWeight={600}
                      variant='subtitle1'
                      sx={{
                        padding: '16px 16px 16px 20px',
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      {/* {formatCurrency(
                        formatByRoundingProcedure(
                          Number(getProjectInfoValues().subtotal),
                          priceInfo?.decimalPlace!,
                          priceInfo?.roundingProcedure!,
                          priceInfo?.currency!,
                        ),
                        priceInfo?.currency!,
                      )} */}
                      {getCurrencyMark(
                        getItem().items[0].initialPrice?.currency,
                      )}
                      &nbsp;
                      {Number(getProjectInfoValues().subtotal).toLocaleString(
                        'ko-KR',
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

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
                  <Typography
                    variant='subtitle1'
                    fontSize={20}
                    fontWeight={500}
                  >
                    Tax
                  </Typography>
                </Box>

                <Box display='flex' alignItems='center' gap='4px'>
                  <Box>
                    {!getProjectInfoValues().isTaxable
                      ? '-'
                      : Number(getProjectInfoValues().tax).toLocaleString(
                          'ko-KR',
                        )}
                  </Box>
                  %
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '20px',
                      borderBottom: '1.5px solid #666CFF',
                      justifyContent: 'space-between',
                      width: '25%',
                    }}
                  >
                    <Typography
                      fontWeight={600}
                      variant='subtitle1'
                      sx={{
                        padding: '16px 16px 16px 20px',
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      Tax
                    </Typography>
                    <Typography
                      fontWeight={600}
                      variant='subtitle1'
                      sx={{
                        padding: '16px 16px 16px 20px',
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      {/* {getProjectInfoValues().isTaxable
                        ? formatCurrency(
                            formatByRoundingProcedure(
                              Number(getProjectInfoValues().subtotal) *
                                (Number(getProjectInfoValues().tax!) / 100),
                              priceInfo?.decimalPlace!,
                              priceInfo?.roundingProcedure!,
                              priceInfo?.currency!,
                            ),
                            priceInfo?.currency!,
                          )
                        : '-'} */}
                      {getProjectInfoValues().isTaxable
                        ? `${getCurrencyMark(
                            getItem().items[0].initialPrice?.currency,
                          )} ${(
                            Number(getProjectInfoValues().subtotal) *
                            (Number(getProjectInfoValues().tax!) / 100)
                          ).toLocaleString('ko-KR')}`
                        : '-'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '20px',
                      borderBottom: '1.5px solid #666CFF',
                      justifyContent: 'space-between',
                      width: '25%',
                    }}
                  >
                    <Typography
                      fontWeight={600}
                      variant='subtitle1'
                      color={'#666CFF'}
                      sx={{
                        padding: '16px 16px 16px 20px',
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      Total
                    </Typography>
                    <Typography
                      fontWeight={600}
                      variant='subtitle1'
                      color={'#666CFF'}
                      sx={{
                        padding: '16px 16px 16px 20px',
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      {getProjectInfoValues().isTaxable
                        ? `${getCurrencyMark(
                            getItem().items[0].initialPrice?.currency,
                          )} ${(
                            Number(getProjectInfoValues().subtotal) +
                            Number(getProjectInfoValues().subtotal) *
                              (Number(getProjectInfoValues().tax!) / 100)
                          ).toLocaleString('ko-KR')}`
                        : `${getCurrencyMark(
                            getItem().items[0].initialPrice?.currency,
                          )} ${Number(
                            getProjectInfoValues().subtotal,
                          ).toLocaleString('ko-KR')}`}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                display='flex'
                justifyContent='space-between'
                sx={{ marginTop: '24px' }}
              >
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={handleBack}
                >
                  <Icon icon='material-symbols:arrow-back-rounded' />
                  Previous
                </Button>
                <Button
                  variant='contained'
                  disabled={
                    !isItemValid &&
                    getProjectInfoValues('isTaxable') &&
                    getProjectInfoValues('tax') === null
                  }
                  onClick={onSubmit}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Card>
        )}
      </Grid>
    </Grid>
  )
}

AddNewInvoice.acl = {
  subject: 'invoice_receivable',
  action: 'create',
}

export const HeaderCell = styled(TableCell)`
  background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.88),
      rgba(255, 255, 255, 0.88)
    ),
    #666cff;
  height: 20px;
  position: relative;
  text-transform: none;
  &::before {
    content: '';
    position: absolute;
    top: 20px;
    right: 0px;
    width: 2px;
    height: 30%;
    background: rgba(76, 78, 100, 0.12);
  }
`
