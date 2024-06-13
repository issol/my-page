import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// ** hooks
import useModal from '@src/hooks/useModal'
import { useConfirmLeave } from '@src/hooks/useConfirmLeave'

// ** mui
import {
  Box,
  Button,
  Card,
  Checkbox,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import PageHeader from '@src/@core/components/page-header'

import { Controller, Resolver, useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Icon Imports
import Icon from '@src/@core/components/icon'

// ** third parties
import { toast } from 'react-hot-toast'

// ** validation values & types
import {
  projectTeamSchema,
  ProjectTeamType,
} from '@src/types/schema/project-team.schema'
import { QuotesProjectInfoAddNewType } from '@src/types/common/quotes.type'
import {
  quotesProjectInfoDefaultValue,
  quotesProjectInfoSchema,
} from '@src/types/schema/quotes-project-info.schema'
import { ItemType, PostItemType } from '@src/types/common/item.type'
import { quoteItemSchema } from '@src/types/schema/item.schema'
import { ProjectTeamFormType } from '@src/types/common/orders-and-quotes.type'
import { StandardPriceListType } from '@src/types/common/standard-price'
import { ClientFormType, clientSchema } from '@src/types/schema/client.schema'

// ** components
import Stepper from 'src/pages/[companyName]/components/stepper'
import ProjectTeamFormContainer from '../components/form-container/project-team-container'
import ClientQuotesFormContainer from 'src/pages/[companyName]/components/form-container/clients/client-container'
import DeleteConfirmModal from 'src/pages/[companyName]/client/components/modals/delete-confirm-modal'
import SimpleAlertModal from 'src/pages/[companyName]/client/components/modals/simple-alert-modal'
import ItemForm from 'src/pages/[companyName]/components/forms/items-form'
import AddLanguagePairForm from 'src/pages/[companyName]/components/forms/add-language-pair-form'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import ProjectInfoForm from 'src/pages/[companyName]/components/forms/quotes-project-info-form'

import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'

// ** helpers
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import languageHelper from '@src/shared/helpers/language.helper'
import {
  changeTimeZoneOffset,
  convertTimeToTimezone,
  findEarliestDate,
} from '@src/shared/helpers/date.helper'

// ** contexts
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'

// ** apis
import { useGetClientPriceList } from '@src/queries/company/standard-price'
import { useGetAllClientPriceList } from '@src/queries/price-units.query'
import {
  createItemsForQuotes,
  createLangPairForQuotes,
  createQuotesInfo,
} from '@src/apis/quote/quotes.api'
import { useGetClientRequestDetail } from '@src/queries/requests/client-request.query'
import {
  formatByRoundingProcedure,
  formatCurrency,
} from '@src/shared/helpers/price.helper'
import SimpleMultilineAlertModal from 'src/pages/[companyName]/components/modals/custom-modals/simple-multiline-alert-modal'
import { timezoneSelector } from '@src/states/permission'
import { formatISO } from 'date-fns'

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
  groupName: '',
  category: '',
  serviceType: [],
  currency: null,
  catBasis: '',
  decimalPlace: 0,
  roundingProcedure: '',
  languagePairs: [],
  priceUnit: [],
  catInterface: { phrase: [], memoQ: [] },
}

export default function AddNewQuote() {
  const router = useRouter()
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)

  const requestId = router.query?.requestId
  const { data: requestData } = useGetClientRequestDetail(Number(requestId))
  const [requestProjectDueDate, setRequestProjectDueDate] =
    useState<Date | null>(null)
  const [isWarn, setIsWarn] = useState(true)

  const { openModal, closeModal } = useModal()

  const [priceInfo, setPriceInfo] = useState<StandardPriceListType | null>(null)

  // ** stepper
  const [activeStep, setActiveStep] = useState<number>(0)

  const [taxFocus, setTaxFocus] = useState(false)

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const steps = [
    {
      title: 'Project team',
    },
    {
      title: 'Client',
    },
    {
      title: 'Project info',
    },
    {
      title: ' Languages & Items',
    },
  ]

  // ** step1

  const {
    control: teamControl,
    getValues: getTeamValues,
    setValue: setTeamValues,
    reset: resetTeam,
    watch: teamWatch,
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
    resolver: yupResolver(projectTeamSchema) as Resolver<ProjectTeamType>,
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
    resolver: yupResolver(clientSchema) as Resolver<ClientFormType>,
  })

  // ** step3
  const {
    control: projectInfoControl,
    getValues: getProjectInfoValues,
    setValue: setProjectInfo,
    trigger: triggerProjectInfo,
    watch: projectInfoWatch,
    reset: projectInfoReset,
    formState: { errors: projectInfoErrors, isValid: isProjectInfoValid },
  } = useForm<QuotesProjectInfoAddNewType>({
    mode: 'onChange',
    defaultValues: {
      ...quotesProjectInfoDefaultValue,
      quoteDate: {
        // timezone: getClientValue().contacts?.timezone!,
        // JSON.parse(getUserDataFromBrowser()!).timezone,
      },
      status: 20000,
    },
    resolver: yupResolver(
      quotesProjectInfoSchema,
    ) as unknown as Resolver<QuotesProjectInfoAddNewType>,
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
    watch: itemWatch,
    trigger: itemTrigger,
    reset: itemReset,

    formState: {
      errors: itemErrors,
      isValid: isItemValid,
      dirtyFields: itemDirtyFields,
    },
  } = useForm<{ items: ItemType[]; languagePairs: languageType[] }>({
    mode: 'onChange',
    defaultValues: { items: [], languagePairs: [] },
    resolver: yupResolver(quoteItemSchema) as unknown as Resolver<{
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
    fields: languagePairs,
    append: appendLanguagePairs,
    remove: removeLanguagePairs,
    update: updateLanguagePairs,
  } = useFieldArray({
    control: itemControl,
    name: 'languagePairs',
  })

  const onNextStep = () => {
    setActiveStep(activeStep + 1)
    if (activeStep === 2 && requestData && requestId) {
      const teamMembers = getTeamValues()?.teams
      const projectManager = teamMembers.find(
        item => item.type === 'projectManagerId',
      )
      const project = getProjectInfoValues()

      const { items } = requestData || []

      const transformedItems =
        items.flatMap(item =>
          item.targetLanguage.map(target => ({
            id: item.id,
            source: item.sourceLanguage,
            target,
            price: defaultOption,
          })),
        ) || []

      const defaultItems = transformedItems.map(item => ({
        itemName: null,
        source: item.source,
        target: item.target,
        contactPersonId: projectManager?.id!,
        dueAt: requestProjectDueDate
          ? changeTimeZoneOffset(
              requestProjectDueDate.toISOString(),
              auth.getValue().user?.timezone!,
            )
          : null,
        priceId: -1,
        detail: [],
        totalPrice: 0,
        showItemDescription: false,
        minimumPrice: null,
        minimumPriceApplied: false,
        priceFactor: 0,
        currency: item.price.currency,
      }))

      setItem('items', defaultItems, { shouldDirty: true })
    }
  }

  useEffect(() => {
    if (!router.isReady) return
    if (requestId) {
      initializeFormWithRequest()
    }
  }, [requestId])

  useEffect(() => {
    if (languagePairs.length > 0 && prices) {
      const priceInfo =
        prices?.find(value => value.id === languagePairs[0]?.price?.id) ?? null
      setPriceInfo(priceInfo)
    }
  }, [prices, languagePairs])

  function initializeFormWithRequest() {
    if (requestId && requestData) {
      const { client } = requestData || undefined
      clientReset({
        clientId: client.clientId,
        contactPersonId: requestData.contactPerson.id,
        addressType: 'shipping',
        contacts: {
          timezone: client?.timezone,
          phone: client?.phone ?? '',
          mobile: client?.mobile ?? '',
          fax: client?.fax ?? '',
          email: client?.email ?? '',
          addresses:
            client?.addresses?.filter(
              item => item.addressType !== 'additional',
            ) || [],
        },
      })

      const { items } = requestData || []
      const desiredDueDates = items?.map(i => i.desiredDueDate)
      const isCategoryNotSame = items.some(
        i => i.category !== items[0]?.category,
      )
      setRequestProjectDueDate(
        new Date(
          convertTimeToTimezone(
            findEarliestDate(desiredDueDates),
            items[0].desiredDueTimezone,
            timezone.getValue(),
            true,
          )!,
        ),
      )
      projectInfoReset({
        projectDueDate: {
          date: new Date(
            convertTimeToTimezone(
              findEarliestDate(desiredDueDates),
              items[0].desiredDueTimezone,
              timezone.getValue(),
              true,
            )!,
          ),
        },
        category: isCategoryNotSame ? '' : items[0].category,
        serviceType: isCategoryNotSame ? [] : items.flatMap(i => i.serviceType),
        projectDescription: requestData?.notes ?? '',
        showDescription: requestData?.showDescription ?? false,
        status: 20000,
      })
      const transformedItems =
        items.flatMap(item =>
          item.targetLanguage.map(target => ({
            id: item.id,
            source: item.sourceLanguage,
            target,
            price: defaultOption,
          })),
        ) || []
      const uniqueTransformedItems = Array.from(
        new Set(
          transformedItems.map(item =>
            JSON.stringify({ source: item.source, target: item.target }),
          ),
        ),
      ).map(item => JSON.parse(item))

      const result = uniqueTransformedItems.map(uniqueItem => {
        const originalItem = transformedItems.find(
          item =>
            item.source === uniqueItem.source &&
            item.target === uniqueItem.target,
        )

        return {
          ...uniqueItem,
          id: originalItem?.id,
          price: originalItem?.price,
        }
      })

      setItem('languagePairs', result, { shouldDirty: true })
    }
  }

  function onDeleteLanguagePair(row: languageType) {
    const isDeletable = !getItem()?.items?.length
      ? true
      : !getItem().items.some(
          item => item.source === row.source && item.target === row.target,
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

      const copyOriginal = [...getItem('languagePairs')]
      copyOriginal.splice(idx, 1)
      // setLanguagePairs([...copyOriginal])
      setItem('languagePairs', [...copyOriginal])
      itemTrigger('languagePairs')
    }
  }

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

  function isAddItemDisabled(): boolean {
    if (getItem('languagePairs').length === 0) return true
    return getItem('languagePairs')?.some(item => !item?.price)
  }

  function addNewItem() {
    const teamMembers = getTeamValues()?.teams
    const projectManager = teamMembers.find(
      item => item.type === 'projectManagerId',
    )
    const project = getProjectInfoValues()
    appendItems({
      itemName: null,
      source: '',
      target: '',
      contactPersonId: projectManager?.id!,
      dueAt: requestProjectDueDate
        ? changeTimeZoneOffset(
            project.projectDueDate.date.toISOString(),
            auth.getValue().user?.timezone!,
          )
        : null,
      priceId: null,
      detail: [],
      totalPrice: 0,
      showItemDescription: false,
      minimumPrice: null,
      minimumPriceApplied: false,
      priceFactor: 0,
      currency: null,
    })
  }

  const onClickSaveQuote = () => {
    openModal({
      type: 'SaveQuoteModal',
      children: (
        <SimpleMultilineAlertModal
          vary='successful'
          closeButtonText='Cancel'
          confirmButtonText='Save'
          onClose={() => closeModal('SaveQuoteModal')}
          onConfirm={onSubmit}
          title={getProjectInfoValues().projectName}
          message={`Are you sure you want to create this\nquote?`}
          textAlign='center'
        />
      ),
    })
  }

  function onSubmit() {
    setIsWarn(false)
    const teams = transformTeamData(getTeamValues())
    const clients: any = {
      ...getClientValue(),
      contactPersonId:
        getClientValue().contactPersonId === NOT_APPLICABLE
          ? null
          : getClientValue().contactPersonId,
    }
    const rawProjectInfo = getProjectInfoValues()
    // const subtotal = getItem().items.reduce(
    //   (acc, item) => acc + item.totalPrice,
    //   0,
    // )

    const projectInfo = {
      ...rawProjectInfo,
      tax: !rawProjectInfo.isTaxable ? null : rawProjectInfo.tax,
      // quoteDate: {
      //   ...rawProjectInfo.quoteDate,
      //   date: rawProjectInfo.quoteDate.date.toISOString(),
      // },
      quoteDate: {
        date: changeTimeZoneOffset(
          formatISO(rawProjectInfo.quoteDate.date),
          rawProjectInfo.quoteDate.timezone,
        ),
        timezone: rawProjectInfo.quoteDate.timezone
          ? {
              label: rawProjectInfo.quoteDate.timezone.label,
              code: rawProjectInfo.quoteDate.timezone.code,
            }
          : '',
      },
      projectDueDate: {
        date: rawProjectInfo.projectDueDate.date
          ? changeTimeZoneOffset(
              formatISO(rawProjectInfo.projectDueDate.date),
              rawProjectInfo.projectDueDate.timezone,
            )
          : null,
        timezone: rawProjectInfo.projectDueDate.timezone
          ? {
              label: rawProjectInfo.projectDueDate.timezone.label,
              code: rawProjectInfo.projectDueDate.timezone.code,
            }
          : '',
      },
      quoteDeadline: {
        date: rawProjectInfo.quoteDeadline.date
          ? changeTimeZoneOffset(
              formatISO(rawProjectInfo.quoteDeadline.date),
              rawProjectInfo.quoteDeadline.timezone,
            )
          : null,
        timezone: rawProjectInfo.quoteDeadline.timezone
          ? {
              label: rawProjectInfo.quoteDeadline.timezone.label,
              code: rawProjectInfo.quoteDeadline.timezone.code,
            }
          : '',
      },
      quoteExpiryDate: {
        ...rawProjectInfo.quoteExpiryDate,
        date: rawProjectInfo.quoteExpiryDate.date
          ? changeTimeZoneOffset(
              formatISO(rawProjectInfo.quoteExpiryDate.date),
              rawProjectInfo.quoteExpiryDate.timezone,
            )
          : null,
        timezone: rawProjectInfo.quoteExpiryDate.timezone
          ? {
              label: rawProjectInfo.quoteExpiryDate.timezone.label,
              code: rawProjectInfo.quoteExpiryDate.timezone.code,
            }
          : '',
      },
      estimatedDeliveryDate: {
        ...rawProjectInfo.estimatedDeliveryDate,
        date: rawProjectInfo.estimatedDeliveryDate.date
          ? changeTimeZoneOffset(
              formatISO(rawProjectInfo.estimatedDeliveryDate.date),
              rawProjectInfo.estimatedDeliveryDate.timezone,
            )
          : null,
        timezone: rawProjectInfo.estimatedDeliveryDate.timezone
          ? {
              label: rawProjectInfo.estimatedDeliveryDate.timezone.label,
              code: rawProjectInfo.estimatedDeliveryDate.timezone.code,
            }
          : '',
      },
      subtotal: subPrice,
    }

    const items: Array<PostItemType> = getItem().items.map((item, idx) => {
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
        // contactPersonId: item.contactPerson?.id!,
        contactPersonId: item.contactPersonId!,
        description: item.description || '',
        analysis: item.analysis?.map(anal => anal?.data?.id!) || [],
        showItemDescription: item.showItemDescription ? '1' : '0',
        minimumPriceApplied: item.minimumPriceApplied ? '1' : '0',
        // name: item.itemName,
        sourceLanguage: item.source,
        targetLanguage: item.target,
        sortingOrder: idx + 1,
      }
    })

    const langs = getItem('languagePairs').map(item => {
      if (item?.price?.id) {
        return {
          source: item.source,
          target: item.target,
          priceId: item.price.id,
        }
      }
      return {
        source: item.source,
        target: item.target,
      }
    })
    const stepOneData = {
      ...teams,
      ...clients,
      ...projectInfo,
      // quoteDate: {
      //   date: new Date(projectInfo.quoteDate.date),
      //   timezone: projectInfo.quoteDate.timezone,
      // },
      requestId: requestId ?? null,
    }
    createQuotesInfo(stepOneData)
      .then(res => {
        if (res.id) {
          Promise.all([
            createLangPairForQuotes(res.id, langs),
            createItemsForQuotes(res.id, items),
          ])
            .then(() => {
              router.push(`/quotes/detail/${res.id}`)
              closeModal('SaveQuoteModal')
            })
            .catch(e => onRequestError())
        }
      })
      .catch(e => onRequestError())
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
          result?.members?.push(Number(item.id!))
        }
      }
    })
    if (!result.members || !result?.members?.length) delete result.members

    return result
  }

  const { ConfirmLeaveModal } = useConfirmLeave({
    // shouldWarn안에 isDirty나 isSubmitting으로 조건 줄 수 있음
    shouldWarn: isWarn,
    toUrl: '/quotes/quote-list',
  })

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

  const getSubTotal = () => {
    const items = getItem('items')
    const currencies = items.flatMap(
      item =>
        item.detail
          ? item.detail
              .filter(detailItem => detailItem.currency !== null) // Exclude items where currency is null

              .map(detailItem => detailItem.currency)
          : [], // Return an empty array if detail is undefined
    )

    if (currencies.length === 0) return '-'
    else {
      const decimalPlace = priceInfo
        ? priceInfo.decimalPlace
        : currencies[0] === 'USD' || currencies[0] === 'SGD'
          ? 2
          : currencies[0] === 'KRW'
            ? 1000
            : currencies[0] === 'JPY'
              ? 100
              : 2

      return subPrice === 0
        ? '-'
        : formatCurrency(
            formatByRoundingProcedure(
              subPrice,
              decimalPlace,
              priceInfo ? priceInfo?.roundingProcedure! : 0,
              priceInfo ? priceInfo.currency : currencies[0],
            ),
            priceInfo ? priceInfo.currency : currencies[0],
          )
    }
  }

  useEffect(() => {
    const subscription = itemWatch((value, { name, type }) => {
      sumTotalPrice()
    })
    return () => subscription.unsubscribe()
  }, [itemWatch])

  return (
    <Grid container spacing={6}>
      <ConfirmLeaveModal />
      <PageHeader
        title={
          <Box display='flex' alignItems='center' gap='8px'>
            <IconButton onClick={() => router.back()}>
              <Icon icon='material-symbols:arrow-back-ios-new-rounded' />
            </IconButton>
            <Typography variant='h5'>Create new quote</Typography>
          </Box>
        }
      />
      <Grid item xs={12}>
        <Stepper
          style={{ maxWidth: '80%', margin: '0 auto' }}
          activeStep={activeStep}
          steps={steps}
        />
      </Grid>
      <Grid item xs={12}>
        {activeStep === 0 ? (
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
                setTax={(n: number | null) => setProjectInfo('tax', n)}
                type={requestId ? 'request' : 'quotes'}
                formType='create'
                getValue={getClientValue}
                fromQuote={false}
                reset={clientReset}
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
                <ProjectInfoForm
                  control={projectInfoControl}
                  setValue={setProjectInfo}
                  watch={projectInfoWatch}
                  errors={projectInfoErrors}
                  clientTimezone={getClientValue('contacts.timezone')}
                  getClientValue={getClientValue}
                  getValues={getProjectInfoValues}
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
                    disabled={!isProjectInfoValid || !projectInfoErrors}
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
                  type='create'
                  // languagePairs={getItem('languagePairs')}
                  getItem={getItem}
                  setLanguagePairs={(languagePair: languageType[]) =>
                    setItem('languagePairs', languagePair, {
                      shouldDirty: true,
                    })
                  }
                  append={appendLanguagePairs}
                  update={updateLanguagePairs}
                  languagePairs={languagePairs}
                  getPriceOptions={getPriceOptions}
                  onDeleteLanguagePair={onDeleteLanguagePair}
                  control={itemControl}
                  itemTrigger={itemTrigger}
                  from='quote'
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
                  teamMembers={getTeamValues()?.teams}
                  languagePairs={getItem('languagePairs')}
                  getPriceOptions={getPriceOptions}
                  priceUnitsList={priceUnitsList || []}
                  itemTrigger={itemTrigger}
                  type='create'
                  sumTotalPrice={sumTotalPrice}
                  from='quote'
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  startIcon={<Icon icon='material-symbols:add' />}
                  disabled={isAddItemDisabled()}
                  onClick={addNewItem}
                >
                  <Typography
                    color={isAddItemDisabled() ? 'secondary' : 'primary'}
                    sx={{ textDecoration: 'underline' }}
                  >
                    Add new item
                  </Typography>
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '20px',
                      borderBottom: '2px solid #666CFF',
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
                      Subtotal
                    </Typography>
                    <Typography
                      fontWeight={600}
                      variant='subtitle1'
                      sx={{
                        padding: '16px 16px 16px 20px',
                        flex: 1,
                        display: 'flex',
                        justifyContent: subPrice === 0 ? 'center' : 'flex-end',
                      }}
                    >
                      {/* {subPrice === 0
                        ? '-'
                        : formatCurrency(
                            formatByRoundingProcedure(
                              // getItem().items.reduce((acc, cur) => {
                              //   return acc + cur.totalPrice
                              // }, 0),
                              subPrice,
                              priceInfo?.decimalPlace!,
                              priceInfo?.roundingProcedure!,
                              priceInfo?.currency ?? 'USD',
                            ),
                            priceInfo?.currency ?? 'USD',
                          )} */}
                      {getSubTotal()}
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
                  <Controller
                    name='isTaxable'
                    control={projectInfoControl}
                    render={({ field: { value, onChange } }) => (
                      <Checkbox
                        checked={value}
                        onChange={e => {
                          if (!e.target.checked) setProjectInfo('tax', null)
                          onChange(e.target.checked)

                          triggerProjectInfo('isTaxable')
                        }}
                      />
                    )}
                  />

                  <Typography>Tax</Typography>
                </Box>

                <Box display='flex' alignItems='center' gap='4px'>
                  <Controller
                    name={'tax'}
                    control={projectInfoControl}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        size='small'
                        autoComplete='off'
                        type='number'
                        onFocus={e =>
                          e.target.addEventListener(
                            'wheel',
                            function (e) {
                              e.preventDefault()
                            },
                            { passive: false },
                          )
                        }
                        onClickCapture={() => setTaxFocus(true)}
                        onBlur={() => setTaxFocus(false)}
                        value={
                          !getProjectInfoValues().isTaxable ||
                          value === null ||
                          value === undefined
                            ? '-'
                            : value
                        }
                        placeholder={taxFocus ? '' : '-'}
                        error={
                          getProjectInfoValues().isTaxable && value === null
                        }
                        // value={tax ?? null}
                        disabled={!getProjectInfoValues().isTaxable}
                        sx={{ maxWidth: '120px', padding: 0 }}
                        inputProps={{ inputMode: 'decimal' }}
                        onChange={e => {
                          if (e.target.value.length > 10) return
                          else if (e.target.value === '') onChange(null)
                          else onChange(Number(e.target.value))
                        }}
                      />
                    )}
                  />
                  %
                </Box>
              </Grid>
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
                  disabled={
                    !isItemValid ||
                    (projectInfoWatch('isTaxable') === true &&
                      projectInfoWatch('tax') === null)
                  }
                  onClick={onClickSaveQuote}
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

AddNewQuote.acl = {
  subject: 'quote',
  action: 'create',
}