import { useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

// ** hooks
import useModal from '@src/hooks/useModal'

// ** mui
import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import PageHeader from '@src/@core/components/page-header'

import { useForm, Controller, useFieldArray } from 'react-hook-form'
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

// ** components
import PageLeaveModal from '@src/pages/client/components/modals/page-leave-modal'
import Stepper from '@src/pages/components/stepper'
import ProjectTeamFormContainer from '../components/form-container/project-team-container'
import { ClientFormType, clientSchema } from '@src/types/schema/client.schema'
import ClientQuotesFormContainer from '@src/pages/components/form-container/clients/client-container'
import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { AuthContext } from '@src/context/AuthContext'
import { StandardPriceListType } from '@src/types/common/standard-price'

import { getPriceList } from '@src/apis/company-price.api'
import { QuotesProjectInfoFormType } from '@src/types/common/quotes.type'
import {
  quotesProjectInfoDefaultValue,
  quotesProjectInfoSchema,
} from '@src/types/schema/quotes-project-info.schema'
import { useGetPriceList } from '@src/queries/company/standard-price'
import { useGetAllPriceList } from '@src/queries/price-units.query'
import { ItemType } from '@src/types/common/item.type'
import { itemSchema } from '@src/types/schema/item.schema'
import DeleteConfirmModal from '@src/pages/client/components/modals/delete-confirm-modal'
import languageHelper from '@src/shared/helpers/language.helper'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'
import { ProjectTeamFormType } from '@src/types/common/orders-and-quotes.type'
import ItemForm from '@src/pages/components/forms/items-form'
import AddLanguagePairForm from '@src/pages/components/forms/add-language-pair-form'

export type languageType = {
  id: number | string
  source: string
  target: string
  price: StandardPriceListType | null
}

export const defaultOption: StandardPriceListType & { groupName: string } = {
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

  // ** confirm page leaving
  router.beforePopState(() => {
    openModal({
      type: 'alert-modal',
      children: (
        <PageLeaveModal
          onClose={() => closeModal('alert-modal')}
          onClick={() => router.push('/client')}
        />
      ),
    })
    return false
  })

  // ** step1
  const [tax, setTax] = useState(0)
  const {
    control: teamControl,
    getValues: getTeamValues,
    setValue: setTeamValues,
    handleSubmit: submitTeam,
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
  const { data: prices, isSuccess } = useGetPriceList({
    clientId: getClientValue('clientId'),
  })
  const { data: priceUnitsList } = useGetAllPriceList()
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
    const projectInfo = { ...getProjectInfoValues(), tax }
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
    // createOrderInfo(stepOneData)
    //   .then(res => {
    //     if (res.id) {
    //       Promise.all([
    //         createLangPairForOrder(res.id, langs),
    //         createItemsForOrder(res.id, items),
    //       ])
    //         .then(() => {
    //           router.push(`/orders/order-list/detail/${res.id}`)
    //         })
    //         .catch(e => onRequestError())
    //     }
    //   })
    //   .catch(e => onRequestError())
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
        if (!result.member) {
          result.member = []
        }
        result.member.push(item.id!)
      }
    })
    if (!result.member || !result?.member?.length) delete result.member

    return result
  }

  return (
    <Grid container spacing={6}>
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
            <ProjectTeamFormContainer
              control={teamControl}
              field={members}
              append={appendMember}
              remove={removeMember}
              update={updateMember}
              getValues={getTeamValues}
              setValue={setTeamValues}
              errors={teamErrors}
              isValid={isTeamValid}
              watch={teamWatch}
              onNextStep={onNextStep}
              type='create'
            />
          </Card>
        ) : activeStep === 1 ? (
          <Card sx={{ padding: '24px' }}>
            <ClientQuotesFormContainer
              control={clientControl}
              setValue={setClientValue}
              isValid={isClientValid}
              watch={clientWatch}
              handleBack={handleBack}
              onNextStep={onNextStep}
              type='create'
            />
          </Card>
        ) : activeStep === 2 ? (
          <Card sx={{ padding: '24px' }}>Project Info</Card>
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
                <Typography>Tax</Typography>
                <Box display='flex' alignItems='center' gap='4px'>
                  <TextField
                    size='small'
                    type='number'
                    value={tax}
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
                  disabled={!isItemValid}
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
  subject: 'quotes',
  action: 'create',
}
