import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

// ** hooks
import useModal from '@src/hooks/useModal'

// ** redux
import { useAppSelector } from '@src/hooks/useRedux'

// ** mui
import { Box, Card, Grid, IconButton, Typography } from '@mui/material'
import PageHeader from '@src/@core/components/page-header'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** components
import PageLeaveModal from '../components/modals/page-leave-modal'
import AddClientStepper from '../components/stepper/add-client-stepper'
import CompanyInfoForm from '../components/forms/company-info'
import AddressesForm from '../components/forms/addresses'
import ContactPersonForm from '../components/forms/contact-persons'
import ClientPrices from '../components/forms/client-prices'
import PriceActionModal from '@src/pages/components/standard-prices-modal/modal/price-action-modal'
import AddSavePriceModal from '@src/pages/components/client-prices-modal/dialog/add-save-price-modal'
import NoPriceUnitModal from '@src/pages/components/standard-prices-modal/modal/no-price-unit-modal'
import ConfirmCreateClientModal from '../components/modals/confirm-create-client-modal'
import AddNewLanguagePairModal from '@src/pages/components/client-prices-modal/dialog/add-new-language-pair-modal'
import SetPriceUnitModal from '@src/pages/components/client-prices-modal/dialog/set-price-unit-modal'

// ** react hook form
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** validation values & types
import {
  CompanyInfoFormType,
  companyInfoDefaultValue,
  companyInfoSchema,
} from '@src/types/schema/company-info.schema'
import {
  ClientAddressFormType,
  clientAddressDefaultValue,
  clientAddressSchema,
} from '@src/types/schema/client-address.schema'
import {
  ClientContactPersonType,
  clientContactPersonSchema,
  contactPersonDefaultValue,
} from '@src/types/schema/client-contact-person.schema'
import {
  AddNewLanguagePairParams,
  AddNewPriceType,
  LanguagePairListType,
  PriceUnitListType,
  SetPriceUnitPair,
  StandardPriceListType,
} from '@src/types/common/standard-price'
import { AddPriceType } from '@src/types/company/standard-client-prices'
import { AddNewLanguagePair } from '@src/types/common/standard-price'
import { CreateClientBodyType, CreateClientResType } from '@src/apis/client.api'
import { GridCellParams } from '@mui/x-data-grid'

// ** fetch
import { useMutation } from 'react-query'
import { useGetPriceUnitList } from '@src/queries/price-units.query'
import { createClient } from '@src/apis/client.api'
import {
  createLanguagePair,
  createPrice,
  setPriceUnitPair,
} from '@src/apis/company-price.api'

// ** third parties
import { toast } from 'react-hot-toast'

type PriceListCopyRowType = Omit<
  StandardPriceListType,
  'languagePairs' | 'priceUnit' | 'id'
> & {
  id?: number
  languagePairs?: Array<LanguagePairListType>
  priceUnit?: Array<PriceUnitListType>
}
export default function AddNewClient() {
  const router = useRouter()

  const { role, isLoading } = useAppSelector(state => state.userAccess)

  const { openModal, closeModal } = useModal()

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

  const [steps, setSteps] = useState<{ title: string }[]>([
    {
      title: 'Company info',
    },
    {
      title: 'AddressesForm',
    },
    {
      title: 'Contact person',
    },
  ])

  useEffect(() => {
    if (role.length) {
      const isGeneral =
        role.filter(item => item.name === 'LPM')[0]?.type === 'General'
      !isGeneral &&
        setSteps(
          steps.concat({
            title: 'Prices',
          }),
        )
    }
  }, [role])

  // ** stepper
  const [activeStep, setActiveStep] = useState<number>(0)

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const onNextStep = () => {
    setActiveStep(activeStep + 1)
  }

  // ** step1
  const {
    control: companyInfoControl,
    getValues: getCompanyInfoValues,
    setValue: setCompanyInfoValues,
    handleSubmit: submitCompanyInfo,
    watch: companyInfoWatch,
    formState: { errors: companyInfoErrors, isValid: isCompanyInfoValid },
  } = useForm<CompanyInfoFormType>({
    mode: 'onChange',
    defaultValues: companyInfoDefaultValue,
    resolver: yupResolver(companyInfoSchema),
  })

  // ** step2
  const {
    control: addressControl,
    getValues: getAddressValues,
    setValue: setAddressValues,
    handleSubmit: submitAddress,
    watch: watchAddress,
    formState: { errors: addressErrors, isValid: isAddressValid },
  } = useForm<ClientAddressFormType>({
    defaultValues: clientAddressDefaultValue,
    mode: 'onChange',
    resolver: yupResolver(clientAddressSchema),
  })

  const {
    fields: addresses,
    append: appendAddress,
    remove: removeAddress,
    update: updateAddress,
  } = useFieldArray({
    control: addressControl,
    name: 'clientAddresses',
  })

  // ** step3
  const {
    control: contactPersonControl,
    getValues: getContactPersonValues,
    setValue: setContactPersonValues,
    handleSubmit: submitContactPerson,
    watch: watchContactPerson,
    formState: { errors: contactPersonErrors, isValid: isContactPersonValid },
  } = useForm<ClientContactPersonType>({
    defaultValues: contactPersonDefaultValue,
    mode: 'onChange',
    resolver: yupResolver(clientContactPersonSchema),
  })

  const {
    fields: contactPersons,
    append: appendContactPersons,
    remove: removeContactPersons,
    update: updateContactPersons,
  } = useFieldArray({
    control: contactPersonControl,
    name: 'contactPersons',
  })

  // ** step 4
  const [selectedModalType, setSelectedModalType] = useState('')

  const [priceList, setPriceList] = useState<StandardPriceListType[] | []>([])
  const [selectedPrice, setSelectedPrice] =
    useState<StandardPriceListType | null>(null)
  const [selectedLanguagePair, setSelectedLanguagePair] =
    useState<LanguagePairListType | null>(null)

  const { data: priceUnit, refetch } = useGetPriceUnitList({
    skip: 0,
    take: 1000,
  })

  useEffect(() => {
    if (!selectedPrice?.id) return
    const idx = priceList.map(item => item.id).indexOf(selectedPrice.id)
    if (idx !== -1) {
      const data = [...priceList]
      data[idx] = selectedPrice
      setPriceList(data)
    }
  }, [selectedPrice])

  const onAddPrice = () => {
    setSelectedModalType('Add')
    if (priceUnit) {
      openModal({
        type: 'AddPriceModal',
        children: (
          <AddSavePriceModal
            open={true}
            onClose={() => closeModal('AddPriceModal')}
            type={'Add'}
            onSubmit={onSavePriceClick}
            onClickAction={onSubmitPrice}
            setPriceList={setPriceList}
          />
        ),
      })
    } else {
      openModal({
        type: 'NoPriceUnitModal',
        children: (
          <NoPriceUnitModal
            open={true}
            onClose={() => closeModal('NoPriceUnitModal')}
          />
        ),
      })
    }
  }

  const onEditPrice = (priceData: StandardPriceListType) => {
    setSelectedModalType('Edit')
    openModal({
      type: 'EditPriceModal',
      children: (
        <AddSavePriceModal
          open={true}
          onClose={() => closeModal('EditPriceModal')}
          type={'Edit'}
          onSubmit={onSavePriceClick}
          selectedPriceData={priceData}
          onClickAction={onSubmitPrice}
          setPriceList={setPriceList}
        />
      ),
    })
  }

  function deletePrice(data: StandardPriceListType) {
    setPriceList(priceList.filter(item => item.id !== data.id))
  }

  const onDeletePrice = (priceData: StandardPriceListType) => {
    openModal({
      type: 'DeletePriceModal',
      children: (
        <PriceActionModal
          onClose={() => closeModal(`DeletePriceModal`)}
          priceName={priceData.priceName}
          type={'Delete'}
          onClickAction={() => deletePrice(priceData)}
        />
      ),
    })
  }

  const onSubmitPrice = (type: string, data?: AddPriceType) => {
    if (type === 'Add' || type === 'Discard') {
      if (type === 'Add') {
        const formData = {
          ...data,
          id: Math.random(),
          isStandard: false,
          serviceType: data?.serviceType.map(value => value.value),
          catBasis: data?.catBasis.value,
          category: data?.category.value,
          currency: data?.currency.value,
          roundingProcedure: data?.roundingProcedure.value,
          languagePair: [],
          priceUnit: [],
        }
        //@ts-ignore
        setPriceList(priceList.concat(formData))
      }
      closeModal(`${selectedModalType}PriceModal`)
    }
  }

  const onSavePriceClick = (data: AddPriceType, modalType: string) => {
    openModal({
      type: `${modalType}Price${
        modalType === 'Edit' ? 'Cancel' : 'Discard'
      }Modal`,
      children: (
        <PriceActionModal
          onClose={() =>
            closeModal(
              `${modalType}Price${
                modalType === 'Edit' ? 'Cancel' : 'Discard'
              }Modal`,
            )
          }
          priceData={data!}
          type={modalType === 'Add' ? 'Add' : 'Save'}
          onClickAction={onSubmitPrice}
        />
      ),
    })
  }

  function onPriceUnitSubmit(
    data: Array<
      Omit<PriceUnitListType, 'priceId'> & {
        priceId: string
        id: number
      }
    >,
  ) {
    //@ts-ignore
    setSelectedPrice({
      ...selectedPrice,
      priceUnit: selectedPrice?.priceUnit.concat(data)!,
    })
  }

  const onSetPriceUnitClick = () => {
    openModal({
      type: 'setPriceUnitModal',
      children: (
        <SetPriceUnitModal
          onSubmit={onPriceUnitSubmit}
          onClose={() => closeModal('setPriceUnitModal')}
          currency={selectedPrice?.currency!}
          priceUnit={priceUnit?.data!}
          price={selectedPrice!}
          priceUnitPair={selectedPrice?.priceUnit!}
        />
      ),
    })
  }

  const onLanguageListClick = (params: GridCellParams) => {
    if (selectedPrice?.priceUnit.length) {
      setSelectedLanguagePair(params.row)
    }
  }

  const onAddLanguagePair = () => {
    openModal({
      type: 'addNewLanguagePairModal',
      children: (
        <AddNewLanguagePairModal
          onClose={() => closeModal('addNewLanguagePairModal')}
          currency={selectedPrice?.currency!}
          onSubmit={onLanguagePairsSubmit}
        />
      ),
    })
  }

  function onEditLanguagePair(data: LanguagePairListType) {
    if (selectedPrice) {
      const idx = selectedPrice.languagePairs
        .map(item => item.id)
        .indexOf(data.id)
      if (idx !== -1) {
        const newLanguagePair = [...selectedPrice.languagePairs]
        newLanguagePair[idx] = data
        setSelectedPrice({ ...selectedPrice, languagePairs: newLanguagePair })
      }
    }
  }

  function onDeleteLanguagePair(id: any) {
    if (selectedPrice) {
      const newLanguagePair = selectedPrice.languagePairs.filter(
        item => item.id !== id,
      )
      setSelectedPrice({ ...selectedPrice, languagePairs: newLanguagePair })
    }
  }

  function onLanguagePairsSubmit(data: AddNewLanguagePair) {
    const langData = data.pair.map(item => ({
      ...item,
      currency: selectedPrice?.currency,
    }))
    setSelectedPrice({
      ...selectedPrice,
      //@ts-ignore
      languagePair: selectedPrice?.languagePairs.concat(langData),
    })
  }

  // ** DESC : step 1-3 mutation
  const createClientMutation = useMutation(
    (data: CreateClientBodyType) => createClient(data),
    {
      onSuccess: res => {
        onCreateClientSuccess(res)
      },
      onError: error => {
        if (steps.length < 4) {
          onMutationError()
        } else {
          throw new Error()
        }
      },
    },
  )

  const clientId = useRef<number | null>(null)

  function onCreateClientSuccess(data: CreateClientResType) {
    clientId.current = data.clientId
    const isGeneral = steps.length < 4

    if (isGeneral || !priceList.length) {
      router.push(`/client/${data.clientId}`)
    } else if (priceList.length) {
      const promiseArr: any = []
      priceList.forEach(row => {
        const copy: PriceListCopyRowType = { ...row }
        delete copy.id
        delete copy.languagePairs
        delete copy.priceUnit
        const form: AddNewPriceType = {
          ...copy,
          clientId: data.clientId,
          roundingProcedure: Number(copy.roundingProcedure),
        }
        promiseArr.push(
          createPrice(form)
            .then(res => onCreatePriceSuccess(res.id, row))
            .catch(e => onMutationError()),
        )
      })
      Promise.all(promiseArr).then(() =>
        router
          .push(`/client/${clientId.current}`)
          .catch(() => onMutationError()),
      )
    }
  }

  // ** step 1-3 등록
  function onClientDataSubmit() {
    const data: CreateClientBodyType = {
      ...getCompanyInfoValues(),
      ...getAddressValues(),
      ...getContactPersonValues()!,
    }
    openModal({
      type: 'create-client',
      children: (
        <ConfirmCreateClientModal
          clientName={getCompanyInfoValues().name}
          onAdd={() => createClientMutation.mutate(data)}
          onClose={() => closeModal('create-client')}
        />
      ),
    })
  }

  function onCreatePriceSuccess(priceId: number, data: StandardPriceListType) {
    if (!data.languagePairs.length && !data.priceUnit.length) {
      return
    } else {
      const priceUnitData: SetPriceUnitPair[] | [] = !data?.priceUnit?.length
        ? []
        : data.priceUnit.map(item => ({
            priceId,
            priceUnitId: item.priceUnitId,
            price: item.price.toString(),
            weighting: item.weighting ? item.weighting.toString() : null,
            quantity: item.quantity ? item.quantity.toString() : null,
          }))
      priceUnitData.length && setPriceUnitPair(priceUnitData)

      const priceLangData: AddNewLanguagePairParams[] | [] = !data
        ?.languagePairs?.length
        ? []
        : data.languagePairs.map(item => ({
            source: item.source,
            target: item.target,
            priceFactor: item.priceFactor,
            minimumPrice: item.minimumPrice ?? null,
            currency: item.currency,
          }))

      priceLangData.length && createLanguagePair(priceLangData)
    }
  }

  function onMutationError() {
    toast.error('Something went wrong. Please try again.', {
      position: 'bottom-left',
    })
  }

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={
          <Box display='flex' alignItems='center' gap='8px'>
            <IconButton onClick={() => router.back()}>
              <Icon icon='material-symbols:arrow-back-ios-new-rounded' />
            </IconButton>
            <Typography variant='h5'>Add new client</Typography>
          </Box>
        }
      />
      <Grid item xs={12}>
        <AddClientStepper activeStep={activeStep} steps={steps} />
      </Grid>
      <Grid item xs={12}>
        {activeStep === 0 ? (
          <Card sx={{ padding: '24px' }}>
            <CompanyInfoForm
              control={companyInfoControl}
              getValues={getCompanyInfoValues}
              setValue={setCompanyInfoValues}
              handleSubmit={submitCompanyInfo}
              errors={companyInfoErrors}
              isValid={isCompanyInfoValid}
              watch={companyInfoWatch}
              onNextStep={onNextStep}
            />
          </Card>
        ) : activeStep === 1 ? (
          <Card sx={{ padding: '24px' }}>
            <AddressesForm
              control={addressControl}
              fields={addresses}
              append={appendAddress}
              remove={removeAddress}
              update={updateAddress}
              getValues={getAddressValues}
              errors={addressErrors}
              isValid={isAddressValid}
              watch={watchAddress}
              handleBack={handleBack}
              onNextStep={onNextStep}
            />
          </Card>
        ) : activeStep === 2 ? (
          <Card sx={{ padding: '24px' }}>
            <ContactPersonForm
              getCompanyInfo={getCompanyInfoValues}
              control={contactPersonControl}
              fields={contactPersons}
              append={appendContactPersons}
              remove={removeContactPersons}
              update={updateContactPersons}
              getValues={getContactPersonValues}
              errors={contactPersonErrors}
              isValid={isContactPersonValid}
              watch={watchContactPerson}
              handleSubmit={submitContactPerson}
              onNextStep={onNextStep}
              handleBack={handleBack}
            />
          </Card>
        ) : (
          <Card sx={{ padding: '24px' }}>
            <ClientPrices
              priceList={priceList}
              onAddPrice={onAddPrice}
              onDeletePrice={onDeletePrice}
              onEditPrice={onEditPrice}
              selectedPrice={selectedPrice}
              setSelectedPrice={setSelectedPrice}
              onSetPriceUnitClick={onSetPriceUnitClick}
              selectedLanguagePair={selectedLanguagePair}
              onLanguageListClick={onLanguageListClick}
              onAddLanguagePair={onAddLanguagePair}
              onEditLanguagePair={onEditLanguagePair}
              onDeleteLanguagePair={onDeleteLanguagePair}
              handleBack={handleBack}
              onSubmit={onClientDataSubmit}
            />
          </Card>
        )}
      </Grid>
    </Grid>
  )
}

AddNewClient.acl = {
  subject: 'client',
  action: 'create',
}