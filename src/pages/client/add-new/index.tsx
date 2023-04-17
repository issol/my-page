import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useModal from '@src/hooks/useModal'

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

// ** react hook form
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** validation values
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
  AddNewPriceType,
  LanguagePairListType,
  PriceUnitListType,
  SetPriceUnitPair,
  StandardPriceListType,
} from '@src/types/common/standard-price'
import { AddPriceType } from '@src/types/company/standard-client-prices'
import { AddNewLanguagePair } from '@src/types/common/standard-price'

// ** fetch
import { useGetPriceUnitList } from '@src/queries/price-units.query'
import { GridCellParams, MuiEvent } from '@mui/x-data-grid'
import AddNewLanguagePairModal from '@src/pages/components/client-prices-modal/dialog/add-new-language-pair-modal'
import SetPriceUnitModal from '@src/pages/components/client-prices-modal/dialog/set-price-unit-modal'

export default function AddNewClient() {
  const router = useRouter()
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

  // ** TODO : steps는 role별로 다르게 주기
  const steps = [
    {
      title: 'Company info',
    },
    {
      title: 'AddressesForm',
    },
    {
      title: 'Contact person',
    },
    {
      title: 'Prices',
    },
  ]

  // ** stepper
  const [activeStep, setActiveStep] = useState<number>(3)

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
  console.log(priceList)
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
    setSelectedPrice(priceData)
    setSelectedModalType('Edit')
    openModal({
      type: 'EditPriceModal',
      children: (
        <AddSavePriceModal
          open={true}
          onClose={() => closeModal('EditPriceModal')}
          type={'Edit'}
          onSubmit={onSavePriceClick}
          selectedPriceData={selectedPrice!}
          onClickAction={onSubmitPrice}
          setPriceList={setPriceList}
        />
      ),
    })
  }

  const onDeletePrice = (priceData: StandardPriceListType) => {
    openModal({
      type: 'DeletePriceModal',
      children: (
        <PriceActionModal
          onClose={() => closeModal(`DeletePriceModal`)}
          priceName={priceData.priceName}
          type={'Delete'}
          onClickAction={onSubmitPrice}
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
          // clientId: client관련 ID를 보내주기
          //
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
        // const obj: AddNewPriceType = {
        //   isStandard: false,
        //   priceName: data?.priceName!,
        //   category: data?.category.value!,
        //   serviceType: data?.serviceType.map(value => value.value)!,
        //   currency: data?.currency.value!,
        //   catBasis: data?.catBasis.value!,
        //   decimalPlace: data?.decimalPlace!,
        //   roundingProcedure: data?.roundingProcedure.value!,
        //   memoForPrice: data?.memoForPrice!,
        // }
        // ** TODO : mutation
        // addNewPriceMutation.mutate(obj)
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
