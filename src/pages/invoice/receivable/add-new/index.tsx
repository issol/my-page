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
import { StandardClientPriceListType } from '@src/types/common/standard-price'
import { itemSchema } from '@src/types/schema/item.schema'
import { ItemType } from '@src/types/common/item.type'
import {
  OrderProjectInfoFormType,
  OrderStatusType,
} from '@src/types/common/orders.type'
import {
  orderProjectInfoDefaultValue,
  orderProjectInfoSchema,
} from '@src/types/schema/orders-project-info.schema'
import { ProjectTeamFormType } from '@src/types/common/orders-and-quotes.type'
import { MemberType } from '@src/types/schema/project-team.schema'

// ** components
import PageLeaveModal from '@src/pages/client/components/modals/page-leave-modal'
import Stepper from '@src/pages/components/stepper'
import ProjectTeamFormContainer from '@src/pages/quotes/components/form-container/project-team-container'
import ClientQuotesFormContainer from '@src/pages/components/form-container/clients/client-container'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import ProjectInfoForm from '@src/pages/components/forms/orders-project-info-form'
import AddLanguagePairForm from '@src/pages/components/forms/add-language-pair-form'
import ItemForm from '@src/pages/components/forms/items-form'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'
import DeleteConfirmModal from '@src/pages/client/components/modals/delete-confirm-modal'

// ** context
import { AuthContext } from '@src/context/AuthContext'

// ** helpers
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import languageHelper from '@src/shared/helpers/language.helper'

// ** apis
import { useGetClientPriceList } from '@src/queries/company/standard-price'
import { useGetAllClientPriceList } from '@src/queries/price-units.query'
import {
  createItemsForOrder,
  createLangPairForOrder,
  createOrderInfo,
} from '@src/apis/order.api'

import {
  getClient,
  getLangItems,
  getProjectInfo,
  getProjectTeam,
} from '@src/apis/order-detail.api'

import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'
import { getClientPriceList } from '@src/apis/company-price.api'
import InvoiceProjectInfoForm from '@src/pages/components/forms/invoice-receivable-info-form'
import {
  InvoiceProjectInfoFormType,
  InvoiceReceivableStatusType,
} from '@src/types/invoice/common.type'
import {
  invoiceProjectInfoDefaultValue,
  invoiceProjectInfoSchema,
} from '@src/types/schema/invoice-project-info.schema'
import { useGetInvoiceStatus } from '@src/queries/invoice/common.query'
import {
  formatByRoundingProcedure,
  formatCurrency,
} from '@src/shared/helpers/price.helper'
import FallbackSpinner from '@src/@core/components/spinner'
import { useMutation, useQueryClient } from 'react-query'
import {
  CreateInvoiceReceivableRes,
  InvoiceReceivablePatchParamsType,
} from '@src/types/invoice/receivable.type'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { createInvoice } from '@src/apis/invoice/receivable.api'

export type languageType = {
  id: number | string
  source: string
  target: string
  price: StandardClientPriceListType | null
}

export const defaultOption: StandardClientPriceListType & {
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
  const { user } = useContext(AuthContext)
  const { data: statusList, isLoading } = useGetInvoiceStatus()
  const [isReady, setIsReady] = useState(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!router.isReady) return
    const orderId = Number(router.query.orderId)
    if (!isNaN(orderId)) {
      onCopyOrder(orderId)
    }
  }, [router.query])

  const { openModal, closeModal } = useModal()

  // ** stepper
  const [activeStep, setActiveStep] = useState<number>(0)

  const [languagePairs, setLanguagePairs] = useState<Array<languageType>>([])

  const createInvoiceMutation = useMutation(
    (data: InvoiceReceivablePatchParamsType) => createInvoice(data),
    {
      onSuccess: (data: CreateInvoiceReceivableRes) => {
        console.log(data)

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
  router.beforePopState(() => {
    openModal({
      type: 'alert-modal',
      children: (
        <PageLeaveModal
          onClose={() => closeModal('alert-modal')}
          onClick={() => router.push('/invoice/receivable')}
        />
      ),
    })
    return false
  })

  // ** step1
  const [tax, setTax] = useState<null | number>(null)
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

  // ** step2
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

  // ** step3
  const {
    control: projectInfoControl,
    getValues: getProjectInfoValues,
    setValue: setProjectInfo,
    watch: projectInfoWatch,
    reset: projectInfoReset,
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
            title={`${languageHelper(row.source)} -> ${languageHelper(
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
            title={`${languageHelper(row.source)} -> ${languageHelper(
              row.target,
            )}`}
            onClose={() => closeModal('cannot-delete-language')}
          />
        ),
      })
    }

    function deleteLanguage() {
      const idx = languagePairs.map(item => item.id).indexOf(row.id)
      const copyOriginal = [...languagePairs]
      copyOriginal.splice(idx, 1)
      setLanguagePairs([...copyOriginal])
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
    const teams = transformTeamData(getTeamValues())
    const clients: any = {
      ...getClientValue(),
      contactPersonId:
        getClientValue().contactPersonId === NOT_APPLICABLE
          ? null
          : getClientValue().contactPersonId,
    }
    const rawProjectInfo = getProjectInfoValues()
    const projectInfo = {
      ...rawProjectInfo,
      tax: !rawProjectInfo.isTaxable ? null : tax,
    }

    const res: InvoiceReceivablePatchParamsType = {
      projectManagerId: teams.projectManagerId,
      supervisorId: teams.supervisorId!,
      members: teams.member,
      contactPersonId: clients.contactPersonId,
      orderId: Number(router.query.orderId),
      invoiceStatus: projectInfo.status,
      invoicedAt: projectInfo.invoiceDate,
      payDueAt: projectInfo.paymentDueDate.date,
      description: projectInfo.invoiceDescription,
      payDueTimezone: projectInfo.paymentDueDate.timezone,
      invoiceConfirmedAt: projectInfo.invoiceConfirmDate?.date,
      invoiceConfirmTimezone: projectInfo.invoiceConfirmDate?.timezone,
      taxInvoiceDueAt: projectInfo.taxInvoiceDueDate?.date,
      taxInvoiceDueTimezone: projectInfo.taxInvoiceDueDate?.timezone,
      invoiceDescription: projectInfo.invoiceDescription,
    }

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
      member: [],
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
          result.member = []
        } else {
          result?.member?.push(item.id!)
        }
      }
    })
    if (!result.member || !result?.member?.length) delete result.member
    return result
  }

  async function onCopyOrder(id: number | null) {
    const priceList = await getClientPriceList({})
    closeModal('copy-order')
    if (id) {
      getProjectTeam(id)
        .then(res => {
          const teams: Array<{
            type: MemberType
            id: number | null
            name: string
          }> = res.map(item => ({
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
        })
        .catch(e => {
          return
        })

      getClient(id)
        .then(res => {
          const addressType = res.clientAddress.find(
            address => address.isSelected,
          )?.addressType
          clientReset({
            clientId: res.client.clientId,
            contactPersonId: res?.contactPerson?.id ?? null,
            addressType:
              addressType === 'additional' ? 'shipping' : addressType,
          })
        })
        .catch(e => {
          return
        })
      getProjectInfo(id)
        .then(res => {
          console.log(res)

          projectInfoReset({
            status: 'In preparation' as InvoiceReceivableStatusType,
            invoiceDate: Date(),
            workName: res?.workName ?? '',
            projectName: res?.projectName ?? '',
            invoiceDescription: '',
            category: res?.category ?? '',
            serviceType: res?.serviceType ?? [],
            expertise: res?.expertise ?? [],
            revenueFrom: res?.revenueFrom ?? null,
            paymentDueDate: {
              date: '',
              timezone: {
                label: '',
                phone: '',
                code: '',
              },
            },
            isTaxable: res.isTaxable ?? true,
          })
          setTax(res?.tax ?? null)
        })
        .catch(e => {
          return
        })
      getLangItems(id).then(res => {
        if (res) {
          setLanguagePairs(
            res?.languagePairs?.map(item => {
              return {
                id: String(item.id),
                source: item.source,
                target: item.target,
                price: !item?.price
                  ? null
                  : priceList.find(price => price.id === item?.price?.id) ||
                    null,
              }
            }),
          )
          const result = res?.items?.map(item => {
            return {
              id: item.id,
              name: item.name,
              source: item.source,
              target: item.target,
              priceId: item.priceId,
              detail: !item?.detail?.length ? [] : item.detail,
              analysis: item.analysis ?? [],
              totalPrice: item?.totalPrice ?? 0,
              dueAt: item.dueAt,
              contactPersonId: item.contactPersonId,
            }
          })
          itemReset({ items: result })
          itemTrigger()
        }
      })
      setIsReady(true)
    }
  }

  return (
    <Grid container spacing={6}>
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
                setTax={setTax}
                setTaxable={(n: boolean) => setProjectInfo('isTaxable', n)}
                type='invoice'
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
                  watch={projectInfoWatch}
                  errors={projectInfoErrors}
                  clientTimezone={getClientValue('contacts.timezone')}
                  statusList={statusList!}
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
              <Grid item xs={12}>
                <AddLanguagePairForm
                  type='detail'
                  languagePairs={languagePairs}
                  setLanguagePairs={setLanguagePairs}
                  getPriceOptions={getPriceOptions}
                  onDeleteLanguagePair={onDeleteLanguagePair}
                />
              </Grid>
              <Grid item xs={12} mt={6} mb={6}>
                <ItemForm
                  control={itemControl}
                  getValues={getItem}
                  setValue={setItem}
                  errors={itemErrors}
                  fields={items}
                  remove={removeItems}
                  isValid={isItemValid}
                  teamMembers={getTeamValues()?.teams}
                  languagePairs={languagePairs}
                  getPriceOptions={getPriceOptions}
                  priceUnitsList={priceUnitsList || []}
                  type='invoiceDetail'
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
                      {formatCurrency(
                        formatByRoundingProcedure(
                          items.reduce((acc, cur) => {
                            return acc + cur.totalPrice
                          }, 0),
                          priceInfo?.decimalPlace!,
                          priceInfo?.roundingProcedure!,
                          priceInfo?.currency!,
                        ),
                        priceInfo?.currency!,
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
                  <Box>{!getProjectInfoValues().isTaxable ? '-' : tax}</Box>%
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
                      Tax
                    </Typography>
                    <Typography
                      fontWeight={600}
                      variant='subtitle1'
                      sx={{ padding: '16px 16px 16px 20px', flex: 1 }}
                    >
                      {getProjectInfoValues().isTaxable
                        ? formatCurrency(
                            formatByRoundingProcedure(
                              items.reduce((acc, cur) => {
                                return acc + cur.totalPrice
                              }, 0) *
                                (getProjectInfoValues().tax! / 100),
                              priceInfo?.decimalPlace!,
                              priceInfo?.roundingProcedure!,
                              priceInfo?.currency!,
                            ),
                            priceInfo?.currency!,
                          )
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
                      width: '250px',
                    }}
                  >
                    <Typography
                      fontWeight={600}
                      variant='subtitle1'
                      color={'#666CFF'}
                      sx={{
                        padding: '16px 16px 16px 20px',
                        flex: 1,

                        textAlign: 'right',
                      }}
                    >
                      Total
                    </Typography>
                    <Typography
                      fontWeight={600}
                      variant='subtitle1'
                      color={'#666CFF'}
                      sx={{ padding: '16px 16px 16px 20px', flex: 1 }}
                    >
                      {getProjectInfoValues().isTaxable
                        ? formatCurrency(
                            formatByRoundingProcedure(
                              items.reduce((acc, cur) => {
                                return acc + cur.totalPrice
                              }, 0) *
                                (getProjectInfoValues().tax! / 100) +
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
                          )}
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
                    !isItemValid && getProjectInfoValues('isTaxable') && !tax
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
