import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

// ** hooks
import useModal from '@src/hooks/useModal'

// ** redux

// ** mui
import { Box, Card, Grid, IconButton, Typography } from '@mui/material'
import PageHeader from '@src/@core/components/page-header'

// ** Icon Imports
import Icon from '@src/@core/components/icon'

// ** components
import Stepper from 'src/pages/[companyName]/components/stepper'
import CompanyInfoForm from '../components/forms/company-info-container'
import AddressesForm from '../components/forms/addresses-container'
import ContactPersonForm from '../components/forms/contact-persons'
import ClientPrices from '../components/forms/client-prices'
import PriceActionModal from 'src/pages/[companyName]/components/standard-prices-modal/modal/price-action-modal'

import AddSavePriceModal from 'src/pages/[companyName]/components/standard-prices-modal/dialog/add-save-price-modal'
import NoPriceUnitModal from 'src/pages/[companyName]/components/standard-prices-modal/modal/no-price-unit-modal'
import AddNewLanguagePairModal from 'src/pages/[companyName]/components/client-prices-modal/dialog/add-new-language-pair-modal'
import SetPriceUnitModal from 'src/pages/[companyName]/components/client-prices-modal/dialog/set-price-unit-modal'

// ** react hook form
import { Resolver, useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** validation values & types
import {
  companyInfoDefaultValue,
  CompanyInfoFormType,
  companyInfoSchema,
} from '@src/types/schema/company-info.schema'
import {
  clientAddressDefaultValue,
  ClientAddressFormType,
  clientAddressSchema,
} from '@src/types/schema/client-address.schema'
import {
  clientContactPersonSchema,
  ClientContactPersonType,
  contactPersonDefaultValue,
} from '@src/types/schema/client-contact-person.schema'
import {
  AddNewLanguagePair,
  AddNewPriceType,
  LanguagePairListType,
  LanguagePairParams,
  PriceUnitListType,
  SetPriceUnitPair,
  StandardPriceListType,
} from '@src/types/common/standard-price'
import { AddPriceType } from '@src/types/company/standard-client-prices'
import { createClient, CreateClientBodyType } from '@src/apis/client.api'
import { GridCellParams } from '@mui/x-data-grid'
import { CreateClientResType } from '@src/types/client/client'

// ** fetch
import { useMutation } from 'react-query'
import { useGetPriceUnitList } from '@src/queries/price-units.query'
import {
  createCatInterface,
  createLanguagePair,
  createPrice,
  setPriceUnitPair,
} from '@src/apis/company/company-price.api'

// ** third parties
import { toast } from 'react-hot-toast'
import { useConfirmLeave } from '@src/hooks/useConfirmLeave'
import { useRecoilValueLoadable } from 'recoil'
import { roleSelector } from '@src/states/permission'
import CustomModal from '@src/@core/components/common-modal/custom-modal'

type PriceListCopyRowType = Omit<
  StandardPriceListType,
  'languagePairs' | 'priceUnit' | 'id'
> & {
  id?: number
  languagePairs?: Array<LanguagePairListType>
  priceUnit?: Array<PriceUnitListType>
}

const AddNewClient = () => {
  const router = useRouter()

  const role = useRecoilValueLoadable(roleSelector)
  const [isGeneral, setIsGeneral] = useState(true)

  const { openModal, closeModal } = useModal()
  const [isWarn, setIsWarn] = useState(true)
  const [checked, setChecked] = useState(false)

  // ** confirm page leaving

  const generalSteps = [
    {
      title: 'Company info',
    },
    {
      title: 'Addresses',
    },
    {
      title: 'Contact person',
    },
  ]

  const masterSteps = generalSteps.concat({
    title: 'Prices',
  })

  useEffect(() => {
    if (role.state === 'hasValue' && role.getValue().length) {
      const isGeneral =
        role.getValue().filter(item => item.name === 'LPM')[0]?.type ===
        'General'
      setIsGeneral(isGeneral)
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
    formState: {
      errors: companyInfoErrors,
      isValid: isCompanyInfoValid,
      isDirty,
    },
  } = useForm<CompanyInfoFormType>({
    mode: 'onChange',
    defaultValues: companyInfoDefaultValue,
    resolver: yupResolver(companyInfoSchema) as Resolver<CompanyInfoFormType>,
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
    resolver: yupResolver(
      clientAddressSchema,
    ) as Resolver<ClientAddressFormType>,
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
    resolver: yupResolver(
      clientContactPersonSchema,
    ) as Resolver<ClientContactPersonType>,
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

  useEffect(() => {
    if (!priceList.length) {
      setSelectedPrice(null)
    }
  }, [priceList])

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
            page={'client'}
            used={'client'}
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
          page={'client'}
          used={'client'}
        />
      ),
    })
  }

  const deletePrice = (data: StandardPriceListType) => {
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

  const onSubmitPrice = (
    type: string,
    data?: AddPriceType,
    selectedData?: StandardPriceListType,
  ) => {
    if (type === 'Add' || type === 'Discard') {
      if (type === 'Add' && data) {
        const formData: StandardPriceListType = {
          ...data,
          id: Math.random(),
          isStandard: false,
          serviceType: data?.serviceType.map(value => value.value),
          catBasis: data?.catBasis!.value,
          category: data?.category.value,
          currency: data?.currency.value,
          roundingProcedure: data?.roundingProcedure.value.toString()!,
          languagePairs: selectedData?.languagePairs || [],
          priceUnit: selectedData?.priceUnit || [],
          catInterface: { phrase: [], memoQ: [] },
        }

        setPriceList([...priceList, formData])
      }
      closeModal(`${selectedModalType}PriceModal`)
    }
  }

  const onSavePriceClick = (
    selectedData: StandardPriceListType,
    data: AddPriceType,
    modalType: string,
  ) => {
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
          selectedPriceData={selectedData!}
          type={modalType === 'Add' ? 'Add' : 'Save'}
          onClickAction={onSubmitPrice}
        />
      ),
    })
  }

  const onPriceUnitSubmit = (data: SetPriceUnitPair[]) => {
    //@ts-ignore
    setSelectedPrice({
      ...selectedPrice,
      //@ts-ignore
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

  const onEditLanguagePair = (data: LanguagePairListType) => {
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

  const onDeleteLanguagePair = (id: any) => {
    if (selectedPrice) {
      const newLanguagePair = selectedPrice.languagePairs.filter(
        item => item.id !== id,
      )
      setSelectedPrice({ ...selectedPrice, languagePairs: newLanguagePair })
    }
  }

  const onLanguagePairsSubmit = (data: AddNewLanguagePair) => {
    const langData = data.pair.map(item => ({
      ...item,
      currency: selectedPrice?.currency,
    }))
    setSelectedPrice({
      ...selectedPrice,
      //@ts-ignore
      languagePairs: selectedPrice?.languagePairs.concat(langData),
    })
  }

  // ** step 1-3 mutation
  const createClientMutation = useMutation(
    (data: CreateClientBodyType) => createClient(data),
    {
      onSuccess: res => {
        onCreateClientSuccess(res)
      },
      onError: error => {
        if (isGeneral) {
          onMutationError()
        } else {
          throw new Error()
        }
      },
    },
  )

  const clientId = useRef<number | null>(null)

  const onCreateClientSuccess = (data: CreateClientResType) => {
    clientId.current = data.clientId

    if (isGeneral || !priceList.length) {
      router.push(`/client/detail/${data.clientId}`)
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
          createPrice(form, 'client')
            .then(res => onCreatePriceSuccess(res.id, row))
            .catch(e => onMutationError()),
        )
      })
      Promise.all(promiseArr).then(() =>
        router
          .push(`/client/detail/${clientId.current}`)
          .catch(() => onMutationError()),
      )
    }
  }

  const onClientDataSubmit = () => {
    const address = getAddressValues()?.clientAddresses?.map(item => {
      delete item.id
      return item
    })

    const data: CreateClientBodyType = {
      ...getCompanyInfoValues(),
      clientAddresses: address,
      ...getContactPersonValues()!,
    }
    openModal({
      type: 'create-client',
      children: (
        <CustomModal
          title={'Are you sure you want to add this client?'}
          subtitle={getCompanyInfoValues().name}
          onClose={() => closeModal('create-client')}
          leftButtonText='Cancel'
          rightButtonText='Add'
          vary='successful'
          onClick={() => {
            setIsWarn(false)
            createClientMutation.mutate(data)
            closeModal('create-client')
          }}
        />
      ),
    })
  }

  const onCreatePriceSuccess = (
    priceId: number,
    data: StandardPriceListType,
  ) => {
    if (!data.languagePairs.length && !data.priceUnit.length) {
      return
    } else {
      const priceUnitData: SetPriceUnitPair[] | [] = !data?.priceUnit?.length
        ? []
        : data.priceUnit.map(item => ({
            priceUnitId: item.priceUnitId,
            price: item.price.toString(),
            weighting: item.weighting ? item.weighting.toString() : null,
            quantity: item.quantity ? item.quantity.toString() : null,
          }))
      priceUnitData.length && setPriceUnitPair(priceUnitData, priceId)

      const priceLangData: LanguagePairParams[] | [] = !data?.languagePairs
        ?.length
        ? []
        : data.languagePairs.map(item => ({
            priceId: priceId,
            source: item.source,
            target: item.target,
            priceFactor: item.priceFactor.toString(),
            minimumPrice: item.minimumPrice.toString() ?? null,
            currency: item.currency,
          }))

      priceLangData.length && createLanguagePair(priceLangData, 'client')

      const catInterfaceData = data.catInterface
      createCatInterface(priceId, catInterfaceData!)
    }
  }

  const onMutationError = () => {
    toast.error('Something went wrong. Please try again.', {
      position: 'bottom-left',
    })
  }

  const { ConfirmLeaveModal } = useConfirmLeave({
    // shouldWarn안에 isDirty나 isSubmitting으로 조건 줄 수 있음
    shouldWarn: isWarn,
    toUrl: '/client',
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
            <Typography variant='h5'>Add new client</Typography>
          </Box>
        }
      />
      <Grid item xs={12}>
        <Card>
          <Stepper
            style={{ maxWidth: '80%', margin: '0 auto' }}
            activeStep={activeStep}
            steps={isGeneral ? generalSteps : masterSteps}
          />
        </Card>
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
              checked={checked}
              setChecked={setChecked}
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
              isGeneral={isGeneral}
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
              onClientDataSubmit={onClientDataSubmit}
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

export default AddNewClient