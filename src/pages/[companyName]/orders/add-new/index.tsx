import { useEffect, useState } from 'react'
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
import { styled } from '@mui/system'

// ** react hook form
import { Controller, Resolver, useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Icon Imports
import Icon from '@src/@core/components/icon'

// ** third parties
import { toast } from 'react-hot-toast'

// ** validation values & types
import {
  MemberType,
  projectTeamSchema,
  ProjectTeamType,
} from '@src/types/schema/project-team.schema'
import { ClientFormType, clientSchema } from '@src/types/schema/client.schema'
import { StandardPriceListType } from '@src/types/common/standard-price'
import { itemSchema } from '@src/types/schema/item.schema'
import { ItemType, PostItemType } from '@src/types/common/item.type'
import { OrderProjectInfoFormType } from '@src/types/common/orders.type'
import {
  orderProjectInfoDefaultValue,
  orderProjectInfoSchema,
} from '@src/types/schema/orders-project-info.schema'
import { ProjectTeamFormType } from '@src/types/common/orders-and-quotes.type'

// ** components
import Stepper from 'src/pages/[companyName]/components/stepper'
import ProjectTeamFormContainer from 'src/pages/[companyName]/quotes/components/form-container/project-team-container'
import ClientQuotesFormContainer from 'src/pages/[companyName]/components/form-container/clients/client-container'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import ProjectInfoForm from 'src/pages/[companyName]/components/forms/orders-project-info-form'
import AddLanguagePairForm from 'src/pages/[companyName]/components/forms/add-language-pair-form'
import ItemForm from 'src/pages/[companyName]/components/forms/items-form'
import SimpleAlertModal from 'src/pages/[companyName]/client/components/modals/simple-alert-modal'

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
  createItemsForOrder,
  createLangPairForOrder,
  createOrderInfo,
} from '@src/apis/order/order.api'
import CopyOrdersList from '../order-list/components/copy-order-list'
import {
  getClient as getQuoteClient,
  getLangItems as getQuoteLangItems,
  getProjectInfo as getQuoteProjectInfo,
  getProjectTeam as getQuoteProjectTeam,
} from '@src/apis/quote/quotes.api'

import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'

import { useConfirmLeave } from '@src/hooks/useConfirmLeave'
import { useGetClientRequestDetail } from '@src/queries/requests/client-request.query'
import {
  changeTimeZoneOffset,
  convertTimeToTimezone,
  findEarliestDate,
  formattedNow,
} from '@src/shared/helpers/date.helper'
import {
  formatByRoundingProcedure,
  formatCurrency,
} from '@src/shared/helpers/price.helper'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { RoundingProcedureList } from '@src/shared/const/rounding-procedure/rounding-procedure'
import {
  getClient,
  getLangItems,
  getProjectInfo,
  getProjectTeam,
} from '@src/apis/order/order-detail.api'
import { getClientDetail } from '@src/apis/client.api'
import OverlaySpinner from '@src/@core/components/spinner/overlay-spinner'
import { timezoneSelector } from '@src/states/permission'
import { formatISO } from 'date-fns'
import { getClientRequestDetail } from '@src/apis/requests/client-request.api'
import CustomModalV2 from '@src/@core/components/common-modal/custom-modal-v2'

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
export const proDefaultOption: StandardPriceListType & {
  groupName?: string
} = {
  id: NOT_APPLICABLE,
  isStandard: false,
  priceName: 'Not applicable',
  // groupName: 'Not applicable',
  category: '',
  serviceType: [],
  currency: 'KRW',
  catBasis: '',
  decimalPlace: 0,
  roundingProcedure: 'Round (Round down to 0.5 - round up from 0.5)',
  languagePairs: [],
  priceUnit: [],
}

export default function AddNewOrder() {
  const router = useRouter()
  const requestId = router.query?.requestId
  const quoteId = router.query?.quoteId

  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)

  const { data: requestData } = useGetClientRequestDetail(Number(requestId))
  const [isWarn, setIsWarn] = useState(true)
  const [isFatching, setIsFatching] = useState(false)
  const [requestProjectDueDate, setRequestProjectDueDate] =
    useState<Date | null>(null)
  const [priceInfo, setPriceInfo] = useState<StandardPriceListType | null>(null)
  const [taxFocus, setTaxFocus] = useState(false)

  const [isCopiedOrder, setIsCopiedOrder] = useState(false)

  useEffect(() => {
    if (!router.isReady) return
    if (quoteId) {
      onCopyQuote(Number(quoteId))
    }
    if (requestId) {
      initializeFormWithRequest(Number(requestId))
    }
  }, [router.query])

  const { openModal, closeModal } = useModal()

  const [subPrice, setSubPrice] = useState(0)

  // ** stepper
  const [activeStep, setActiveStep] = useState<number>(0)

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

  // ** step3
  const {
    control: projectInfoControl,
    getValues: getProjectInfoValues,
    setValue: setProjectInfo,
    trigger: triggerProjectInfo,
    watch: projectInfoWatch,
    reset: projectInfoReset,
    formState: { errors: projectInfoErrors, isValid: isProjectInfoValid },
  } = useForm<OrderProjectInfoFormType>({
    mode: 'onChange',
    defaultValues: { ...orderProjectInfoDefaultValue, status: 10000 },
    resolver: yupResolver(
      orderProjectInfoSchema,
    ) as unknown as Resolver<OrderProjectInfoFormType>,
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
    watch: itemWatch,
    formState: { errors: itemErrors, isValid: isItemValid },
  } = useForm<{ items: ItemType[]; languagePairs: languageType[] }>({
    mode: 'onChange',
    defaultValues: { items: [], languagePairs: [] },
    resolver: yupResolver(itemSchema) as unknown as Resolver<{
      items: ItemType[]
      languagePairs: languageType[]
    }>,
  })

  console.log(getItem())
  console.log(itemErrors)

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
        currency: null,
      }))

      setItem('items', defaultItems, { shouldDirty: true })
    }
  }

  function sumTotalPrice() {
    const subPrice = getItem('items')

    if (subPrice) {
      const total = subPrice.reduce((accumulator, item) => {
        return accumulator + item.totalPrice
      }, 0)

      setSubPrice(total)
    }
  }

  useEffect(() => {
    const subscription = itemWatch((value, { name, type }) => {
      sumTotalPrice()
    })
    return () => subscription.unsubscribe()
  }, [itemWatch])

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
          <CustomModal
            title={
              <>
                Are you sure you want to delete this language pair? <br />
                <Typography variant='body2' fontSize={16} fontWeight={600}>
                  {languageHelper(row.source)}&nbsp;&rarr;&nbsp;
                  {languageHelper(row.target)}
                </Typography>
              </>
            }
            onClose={() => closeModal('delete-language')}
            onClick={() => {
              deleteLanguage()
              closeModal('delete-language')
            }}
            vary='error'
            rightButtonText='Delete'
          />
          // <DeleteConfirmModal
          //   message='Are you sure you want to delete this language pair?'
          //   title={`${languageHelper(row.source)} -> ${languageHelper(
          //     row.target,
          //   )}`}
          //   onDelete={deleteLanguage}
          //   onClose={() => closeModal('delete-language')}
          // />
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
    if (!getItem('languagePairs').length) return true
    return getItem('languagePairs').some(item => !item?.price)
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
      dueAt:
        project.projectDueAt && project.projectDueTimezone
          ? changeTimeZoneOffset(
              project.projectDueAt.toISOString(),
              auth.getValue().user?.timezone!,
            )!
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

  const onClickSaveOrder = () => {
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
        minimumPrice: item.minimumPriceApplied ? item.minimumPrice : null,
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

    const itemPriceIds = new Set(items.map(item => item.priceId))

    // langs 배열을 filter 메서드로 필터링하여 items 배열에 없는 priceId를 가진 객체를 제거
    const filteredLangs = langs.filter(lang =>
      itemPriceIds.has(lang.priceId ?? 0),
    )

    const removedLangs = langs.filter(lang => !filteredLangs.includes(lang))

    if (removedLangs.length > 0) {
      openModal({
        type: 'SaveOrderNotUsedPriceModal',
        children: (
          <CustomModalV2
            onClick={onSubmit}
            onClose={() => closeModal('SaveOrderNotUsedPriceModal')}
            title={'Unused language pair(s)'}
            subtitle={
              'Language pair(s) not registered to the item(s) will be deleted from the order. Would you like to continue and create the order?'
            }
            vary='error-report'
            rightButtonText='Create'
          />
        ),
      })
    } else {
      onSubmit()
      // openModal({
      //   type: 'SaveOrderModal',
      //   children: (
      //     <CustomModal
      //       onClick={onSubmit}
      //       onClose={() => closeModal('SaveOrderModal')}
      //       title={
      //         <>
      //           Are you sure you want to create this order?
      //           <Typography variant='body2' fontWeight={600} fontSize={16}>
      //             {getProjectInfoValues().projectName}
      //           </Typography>
      //         </>
      //       }
      //       vary='successful'
      //       rightButtonText='Save'
      //     />
      //   ),
      // })
    }
  }

  function onSubmit() {
    setIsWarn(false)
    try {
      setIsFatching(true)

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
        // isTaxable : taxable,
        orderedAt: changeTimeZoneOffset(
          formatISO(rawProjectInfo.orderedAt),
          rawProjectInfo.orderTimezone,
        ),
        orderTimezone: rawProjectInfo.orderTimezone
          ? {
              label: rawProjectInfo.orderTimezone.label,
              code: rawProjectInfo.orderTimezone.code,
            }
          : '',
        projectDueAt: rawProjectInfo.projectDueAt
          ? changeTimeZoneOffset(
              formatISO(rawProjectInfo.projectDueAt),
              rawProjectInfo.projectDueTimezone,
            )
          : undefined,
        projectDueTimezone: rawProjectInfo.projectDueTimezone
          ? {
              label: rawProjectInfo.projectDueTimezone.label,
              code: rawProjectInfo.projectDueTimezone.code,
            }
          : '',
        isTaxable: rawProjectInfo.isTaxable ? '1' : '0',
        tax: !rawProjectInfo.isTaxable ? null : rawProjectInfo.tax,
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
          minimumPrice: item.minimumPriceApplied ? item.minimumPrice : null,
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
        quoteId: quoteId ?? null,
        requestId: Number(requestId) ?? null,
      }

      const itemPriceIds = new Set(items.map(item => item.priceId))

      // langs 배열을 filter 메서드로 필터링하여 items 배열에 없는 priceId를 가진 객체를 제거
      const filteredLangs = langs.filter(lang =>
        itemPriceIds.has(lang.priceId ?? 0),
      )

      const removedLangs = langs.filter(lang => !filteredLangs.includes(lang))

      // const matchingPrices =
      //   prices &&
      //   prices.filter(price =>
      //     removedLangs.some(lang => lang.priceId === price.id),
      //   )

      // // 일치하는 객체들의 priceName만 추출
      // const priceNames =
      //   matchingPrices && matchingPrices.map(price => price.priceName)

      createOrderInfo(stepOneData)
        .then(res => {
          if (res.id) {
            Promise.all([
              createLangPairForOrder(res.id, filteredLangs),
              createItemsForOrder(res.id, items, isCopiedOrder ? '1' : '0'),
            ])
              .then(data => {
                closeModal('onClickSaveOrder')
                toast.success('Saved successfully.', {
                  position: 'bottom-left',
                })
                router.push(`/orders/order-list/detail/${res.id}`)
              })
              .catch(e => onRequestError())
              .finally(() => {
                setIsFatching(false)
              })
          }
        })
        .catch(e => onRequestError())
    } catch (e) {
      onRequestError()
    } finally {
      setIsFatching(false)
    }
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

  function initializeFormWithRequest(requestId: number) {
    if (requestId) {
      getClientRequestDetail(requestId).then(res => {
        const { client } = res || undefined
        clientReset({
          clientId: client.clientId,
          contactPersonId: res.contactPerson.id,
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

        const { items } = res || []

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
          orderedAt: formattedNow(new Date()),
          projectDueAt: new Date(
            convertTimeToTimezone(
              findEarliestDate(desiredDueDates),
              items[0].desiredDueTimezone,
              timezone.getValue(),
              true,
            )!,
          ),
          // projectDueAt: findEarliestDate(desiredDueDates),
          // projectDueDate: {
          //   date: findEarliestDate(desiredDueDates),
          // },
          category: isCategoryNotSame ? '' : items[0].category,
          serviceType: isCategoryNotSame
            ? []
            : items.flatMap(i => i.serviceType),
          projectDescription: requestData?.notes ?? '',
          showDescription: requestData?.showDescription ?? false,
          status: 10000,
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
        if (result.length > 0 && prices) {
          const priceInfo =
            prices?.find(value => value.id === result[0]?.price?.id) ?? null

          setPriceInfo(priceInfo)
        }
      })
    }
  }

  async function onCopyQuote(id: number | null) {
    // const priceList = await getClientPriceList({})
    closeModal('copy-order')
    if (id) {
      getQuoteProjectTeam(id)
        .then(res => {
          const teams: Array<{
            type: MemberType
            id: number | null
            name?: string
          }> = res.reduce(
            (acc, item) => {
              const type =
                item.position === 'projectManager'
                  ? 'projectManagerId'
                  : item.position === 'supervisor'
                    ? 'supervisorId'
                    : 'member'
              const id = item.userId
              const name = getLegalName({
                firstName: item?.firstName!,
                middleName: item?.middleName,
                lastName: item?.lastName!,
              })
              acc.push({ type, id, name })
              return acc
            },
            [] as Array<{
              type: MemberType
              id: number | null
              name?: string
            }>,
          )
          if (!teams.find(value => value.type === 'supervisorId')) {
            teams.unshift({ type: 'supervisorId', id: null })
          }
          if (!teams.find(value => value.type === 'member')) {
            teams.push({ type: 'member', id: null })
          }

          resetTeam({ teams })
        })
        .catch(e => {
          return
        })

      getQuoteClient(id)
        .then(res => {
          getClientDetail(res.client.clientId).then(data => {
            const addressType = res.clientAddress.find(
              address => address.isSelected,
            )?.addressType
            clientReset({
              clientId: res.client.clientId,
              contactPersonId: res?.contactPerson?.id ?? null,
              addressType:
                addressType === 'additional' ? 'shipping' : addressType,
              isEnrolledClient: res.isEnrolledClient,
              contacts: {
                timezone: data?.timezone!,
                phone: data?.phone ?? '',
                mobile: data?.mobile ?? '',
                fax: data?.fax ?? '',
                email: data?.email ?? '',
                addresses:
                  data?.clientAddresses?.filter(
                    item => item.addressType !== 'additional',
                  ) || [],
              },
            })
          })
        })
        .catch(e => {
          return
        })
      getQuoteProjectInfo(id)
        .then(res => {
          projectInfoReset({
            // status: 'In preparation' as OrderStatusType,
            // orderedAt: formattedNow(new Date()),
            orderedAt: formattedNow(new Date()),
            workName: res?.workName ?? '',
            projectName: res?.projectName ?? '',
            showDescription: res?.showDescription ?? false,
            status: 10000, //초기값(New) 설정
            projectDescription: res?.projectDescription ?? '',
            category: res?.category ?? '',
            serviceType: res?.serviceType ?? [],
            genre: res?.genre ?? [],
            revenueFrom: undefined,
            projectDueAt: res?.projectDueAt
              ? new Date(
                  convertTimeToTimezone(
                    res?.projectDueAt,
                    res?.projectDueTimezone,
                    timezone.getValue(),
                    true,
                  )!,
                )
              : undefined,
            projectDueTimezone: res?.projectDueTimezone
              ? {
                  label: res?.projectDueTimezone.label,
                  code: res?.projectDueTimezone.code,
                }
              : {
                  label: '',
                  code: '',
                },

            isTaxable: res.isTaxable,
            tax: res.tax ?? null,
          })
          // setTax(res?.tax ?? null)
        })
        .catch(e => {
          return
        })
      getQuoteLangItems(id).then(res => {
        if (res) {
          const itemLangPairs = res?.items?.map(item => {
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
                catInterface: { phrase: [], memoQ: [] },
              },
            }
          })

          const result = res?.items?.map(item => {
            return {
              id: item.id,
              itemName: item.itemName,
              source: item.source,
              target: item.target,
              priceId: item.priceId,
              detail: !item?.detail?.length ? [] : item.detail,
              analysis: item.analysis ?? [],
              totalPrice: item?.totalPrice ?? 0,
              dueAt: item?.dueAt ?? '',
              contactPersonId: item?.contactPerson?.userId ?? 0,
              contactPerson: item?.contactPerson ?? {},
              // initialPrice는 order 생성시점에 선택한 price의 값을 담고 있음
              // name, currency, decimalPlace, rounding 등 price와 관련된 계산이 필요할때는 initialPrice 내 값을 쓴다
              initialPrice: item.initialPrice ?? {},
              description: item.description,
              showItemDescription: item.showItemDescription,
              minimumPrice: item.minimumPrice,
              minimumPriceApplied: item.minimumPriceApplied,
            }
          }) as ItemType[]

          itemReset({ items: result, languagePairs: itemLangPairs })
          itemTrigger()
        }
      })
    }
  }

  async function onCopyOrder(id: number | null) {
    // const priceList = await getClientPriceList({})
    closeModal('copy-order')
    if (id) {
      setIsCopiedOrder(true)
      getProjectTeam(id)
        .then(res => {
          const teams: Array<{
            type: MemberType
            id: number | null
            name?: string
          }> = res.reduce(
            (acc, item) => {
              const type =
                item.position === 'projectManager'
                  ? 'projectManagerId'
                  : item.position === 'supervisor'
                    ? 'supervisorId'
                    : 'member'
              const id = item.userId
              const name = getLegalName({
                firstName: item?.firstName!,
                middleName: item?.middleName,
                lastName: item?.lastName!,
              })
              acc.push({ type, id, name })
              return acc
            },
            [] as Array<{
              type: MemberType
              id: number | null
              name?: string
            }>,
          )
          if (!teams.find(value => value.type === 'supervisorId')) {
            teams.unshift({ type: 'supervisorId', id: null })
          }
          if (!teams.find(value => value.type === 'member')) {
            teams.push({ type: 'member', id: null })
          }

          resetTeam({ teams })
        })
        .catch(e => {
          return
        })

      getClient(id)
        .then(res => {
          getClientDetail(res.client.clientId).then(data => {
            const addressType = res.clientAddress.find(
              address => address.isSelected,
            )?.addressType
            clientReset({
              clientId: res.client.clientId,
              contactPersonId: res?.contactPerson?.id ?? null,
              addressType:
                addressType === 'additional' ? 'shipping' : addressType,
              isEnrolledClient: res.isEnrolledClient,
              contacts: {
                timezone: data?.timezone!,
                phone: data?.phone ?? '',
                mobile: data?.mobile ?? '',
                fax: data?.fax ?? '',
                email: data?.email ?? '',
                addresses:
                  data?.clientAddresses?.filter(
                    item => item.addressType !== 'additional',
                  ) || [],
              },
            })
          })
        })
        .catch(e => {
          return
        })
      getProjectInfo(id)
        .then(res => {
          projectInfoReset({
            // status: 'In preparation' as OrderStatusType,
            orderedAt: formattedNow(new Date()),
            workName: res?.workName ?? '',
            projectName: res?.projectName ?? '',
            showDescription: res?.showDescription ?? false,
            status: 10000, //초기값(New) 설정
            projectDescription: res?.projectDescription ?? '',
            category: res?.category ?? '',
            serviceType: res?.serviceType ?? [],
            genre: res?.genre ?? [],
            revenueFrom: res.revenueFrom,
            projectDueAt: res?.projectDueAt
              ? new Date(
                  convertTimeToTimezone(
                    res?.projectDueAt,
                    res?.projectDueTimezone,
                    timezone.getValue(),
                    true,
                  )!,
                )
              : undefined,
            projectDueTimezone: res?.projectDueTimezone
              ? {
                  label: res?.projectDueTimezone.label,
                  code: res?.projectDueTimezone.code,
                }
              : {
                  label: '',
                  code: '',
                },

            isTaxable: res.isTaxable,
            tax: res.tax ?? null,
          })
          // setTax(res?.tax ?? null)
        })
        .catch(e => {
          return
        })
      getLangItems(id).then(res => {
        if (res) {
          const itemLangPairs = res?.items?.map(item => {
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
                catInterface: { phrase: [], memoQ: [] },
              },
            }
          })

          const result = res?.items?.map(item => {
            return {
              id: item.id,
              itemName: item.itemName,
              source: item.source,
              target: item.target,
              priceId: item.priceId,
              detail: !item?.detail?.length ? [] : item.detail,
              analysis: item.analysis ?? [],
              totalPrice: item?.totalPrice ?? 0,
              dueAt: item?.dueAt ?? '',
              contactPersonId: item?.contactPerson?.userId ?? 0,
              contactPerson: item?.contactPerson ?? {},
              // initialPrice는 order 생성시점에 선택한 price의 값을 담고 있음
              // name, currency, decimalPlace, rounding 등 price와 관련된 계산이 필요할때는 initialPrice 내 값을 쓴다
              initialPrice: item.initialPrice ?? {},
              description: item.description,
              showItemDescription: item.showItemDescription,
              minimumPrice: item.minimumPrice,
              minimumPriceApplied: item.minimumPriceApplied,
            }
          }) as ItemType[]

          itemReset({ items: result, languagePairs: itemLangPairs })
          itemTrigger()
        }
      })
    }
  }

  const { ConfirmLeaveModal } = useConfirmLeave({
    // shouldWarn안에 isDirty나 isSubmitting으로 조건 줄 수 있음
    shouldWarn: isWarn,
    toUrl: '/orders/order-list',
  })

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
      return subPrice === 0
        ? '-'
        : formatCurrency(
            subPrice,
            priceInfo ? priceInfo.currency : currencies[0],
          )
    }
  }

  return (
    <Grid container spacing={6}>
      {isFatching ? <OverlaySpinner /> : null}
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
              <Typography variant='h5'>Create new order</Typography>
            </Box>
            <Button
              variant='outlined'
              startIcon={<Icon icon='ic:baseline-file-download' />}
              onClick={() =>
                openModal({
                  type: 'copy-order',
                  children: (
                    <CopyOrdersList
                      onCopy={onCopyOrder}
                      onClose={() => closeModal('copy-order')}
                    />
                  ),
                })
              }
            >
              Copy order
            </Button>
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
                type={requestId ? 'request' : 'order'}
                formType={'create'}
                getValue={getClientValue}
                fromQuote={!!quoteId}
                trigger={clientTrigger}
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
                  from='order'
                  type='create'
                  getItem={getItem}
                  setLanguagePairs={(languagePair: languageType[]) =>
                    setItem('languagePairs', languagePair)
                  }
                  getPriceOptions={getPriceOptions}
                  onDeleteLanguagePair={onDeleteLanguagePair}
                  control={itemControl}
                  append={appendLanguagePairs}
                  update={updateLanguagePairs}
                  itemTrigger={itemTrigger}
                  languagePairs={languagePairs}
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
                  type='create'
                  itemTrigger={itemTrigger}
                  sumTotalPrice={sumTotalPrice}
                  from='order'
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
                      justifyContent: 'center',
                      width: 'fit-content',
                      // width: '257px',
                    }}
                  >
                    <Typography
                      fontWeight={600}
                      variant='subtitle1'
                      sx={{
                        padding: '16px 16px 16px 20px',

                        textAlign: 'right',
                      }}
                    >
                      Subtotal
                    </Typography>
                    <Typography
                      fontWeight={600}
                      variant='subtitle1'
                      sx={{ padding: '16px 16px 16px 20px' }}
                    >
                      {/* subtotal에는 rounding 처리를 하지 않는다. */}
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
                  onClick={onClickSaveOrder}
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

AddNewOrder.acl = {
  subject: 'order',
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
  &:last-child::before {
    display: none;
  }
`