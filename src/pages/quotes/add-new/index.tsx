import { useContext, useEffect, useState } from 'react'
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
import { QuotesProjectInfoFormType } from '@src/types/common/quotes.type'
import {
  quotesProjectInfoDefaultValue,
  quotesProjectInfoSchema,
} from '@src/types/schema/quotes-project-info.schema'
import { ItemType } from '@src/types/common/item.type'
import { itemSchema } from '@src/types/schema/item.schema'
import { ProjectTeamFormType } from '@src/types/common/orders-and-quotes.type'
import { StandardPriceListType } from '@src/types/common/standard-price'
import { ClientFormType, clientSchema } from '@src/types/schema/client.schema'

// ** components
import Stepper from '@src/pages/components/stepper'
import ProjectTeamFormContainer from '../components/form-container/project-team-container'
import ClientQuotesFormContainer from '@src/pages/components/form-container/clients/client-container'
import DeleteConfirmModal from '@src/pages/client/components/modals/delete-confirm-modal'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'
import ItemForm from '@src/pages/components/forms/items-form'
import AddLanguagePairForm from '@src/pages/components/forms/add-language-pair-form'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import ProjectInfoForm from '@src/pages/components/forms/quotes-project-info-form'

import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'

// ** helpers
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import languageHelper from '@src/shared/helpers/language.helper'
import { findEarliestDate } from '@src/shared/helpers/date.helper'

// ** contexts
import { AuthContext } from '@src/context/AuthContext'

// ** apis
import { useGetClientPriceList } from '@src/queries/company/standard-price'
import { useGetAllClientPriceList } from '@src/queries/price-units.query'
import {
  createItemsForQuotes,
  createLangPairForQuotes,
  createQuotesInfo,
} from '@src/apis/quotes.api'
import { useGetClientRequestDetail } from '@src/queries/requests/client-request.query'

export type languageType = {
  id: number | string
  source: string
  target: string
  price: StandardPriceListType | null
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

export default function AddNewQuotes() {
  const router = useRouter()
  const { user } = useContext(AuthContext)

  const requestId = router.query?.requestId
  const { data: requestData } = useGetClientRequestDetail(Number(requestId))

  const { openModal, closeModal } = useModal()

  // ** stepper
  const [activeStep, setActiveStep] = useState<number>(0)

  const [languagePairs, setLanguagePairs] = useState<Array<languageType>>([])

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
      title: 'Project info',
    },
    {
      title: ' Languages & Items',
    },
  ]

  // ** step1
  const [tax, setTax] = useState<null | number>(null)
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
  } = useForm<QuotesProjectInfoFormType>({
    mode: 'onChange',
    defaultValues: quotesProjectInfoDefaultValue,
    resolver: yupResolver(quotesProjectInfoSchema),
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

  useEffect(() => {
    if (!router.isReady) return
    if (requestId) {
      initializeFormWithRequest()
    }
  }, [requestId])

  //TODO: 잘 되는지 테스트 필요
  function initializeFormWithRequest() {
    if (requestId && requestData) {
      const { client } = requestData || undefined
      clientReset({
        clientId: client.clientId,
        contactPersonId: requestData.contactPerson.id,
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
      projectInfoReset({
        projectDueDate: {
          date: findEarliestDate(desiredDueDates),
        },
        category: isCategoryNotSame ? '' : items[0].category,
        serviceType: isCategoryNotSame ? [] : items.flatMap(i => i.serviceType),
        projectDescription: requestData?.notes ?? '',
      })
      const itemLangPairs =
        items?.map(i => ({
          id: i.id,
          source: i.sourceLanguage,
          target: i.targetLanguage,
          price: null,
        })) || []
      setLanguagePairs(itemLangPairs)
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
    if (!languagePairs.length) return true
    return languagePairs.some(item => !item?.price)
  }

  function addNewItem() {
    const teamMembers = getTeamValues()?.teams
    const projectManager = teamMembers.find(
      item => item.type === 'projectManagerId',
    )
    appendItems({
      name: '',
      source: '',
      target: '',
      contactPersonId: projectManager?.id!,
      priceId: null,
      detail: [],
      totalPrice: 0,
    })
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
      tax: !rawProjectInfo.taxable ? null : tax,
    }
    const items = getItem().items.map(item => ({
      ...item,
      analysis: item.analysis?.map(anal => anal?.data?.id!) || [],
    }))
    const langs = languagePairs.map(item => {
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
    const stepOneData = { ...teams, ...clients, ...projectInfo }
    createQuotesInfo(stepOneData)
      .then(res => {
        if (res.id) {
          Promise.all([
            createLangPairForQuotes(res.id, langs),
            createItemsForQuotes(res.id, items),
          ])
            .then(() => {
              router.push(`/quotes/detail/${res.id}`)
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

  const { ConfirmLeaveModal } = useConfirmLeave({
    // shouldWarn안에 isDirty나 isSubmitting으로 조건 줄 수 있음
    shouldWarn: true,
    toUrl: '/quotes',
  })

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
                setTax={setTax}
                setTaxable={(n: boolean) => setProjectInfo('taxable', n)}
                type={requestId ? 'request' : 'quotes'}
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
                  type='create'
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
                  type='create'
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
                  <Checkbox
                    checked={getProjectInfoValues().taxable}
                    onChange={e => {
                      if (!e.target.checked) setTax(null)
                      setProjectInfo('taxable', e.target.checked, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }}
                  />
                  <Typography>Tax</Typography>
                </Box>
                <Box display='flex' alignItems='center' gap='4px'>
                  <TextField
                    size='small'
                    type='number'
                    value={!getProjectInfoValues().taxable ? '-' : tax}
                    disabled={!getProjectInfoValues().taxable}
                    sx={{ maxWidth: '120px', padding: 0 }}
                    inputProps={{ inputMode: 'decimal' }}
                    onChange={e => {
                      if (e.target.value.length > 10) return
                      setTax(Number(e.target.value))
                    }}
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
                    !isItemValid && getProjectInfoValues('taxable') && !tax
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

AddNewQuotes.acl = {
  subject: 'quote',
  action: 'create',
}
