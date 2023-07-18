import { Fragment, useState } from 'react'
import { Box, Button, Card, Grid, Typography } from '@mui/material'
import { UserDataType } from '@src/context/types'
import { DetailUserType } from '@src/types/common/detail-user.type'

import styled from 'styled-components'
import { ProPaymentType } from '@src/types/payment-info/pro/billing-method.type'
import BillingMethod from './billing-method-forms'
import BillingAddress from '@src/pages/client/components/payment-info/billing-address'
import { useForm } from 'react-hook-form'
import { ClientAddressType } from '@src/types/schema/client-address.schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { clientBillingAddressSchema } from '@src/types/schema/client-billing-address.schema'
import ClientBillingAddressesForm from '@src/pages/client/components/forms/client-billing-address'
import DiscardModal from '@src/@core/components/common-modal/discard-modal'
import SaveModal from '@src/pages/company/components/price/price-units/modal/save-modal'
import useModal from '@src/hooks/useModal'
import TaxInfoForm from './tax-info-forms'
import { TaxInfoType } from '@src/types/payment-info/pro/tax-info.type'
import {
  taxInfoDefaultValue,
  taxInfoSchema,
} from '@src/types/schema/payment-method/pro/tax-info.schema'
import { Icon } from '@iconify/react'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import BillingMethodDetail from './billing-method-details'

type Props = {
  userInfo: DetailUserType
  user: UserDataType
}

/* TODO:
1. 데이터를 받아왔을 때 paymentMethod가 없을 경우 register버튼 노출
2. 데이터를 받아왔을 때 저장된게 있는 경우 모든 form reset해주기
    1. Save버튼 클릭 시 바로 fetch되게 하기
    2. cancel시 기존 데이터로 reset해주기

*/
export default function ProPaymentInfo({ userInfo, user }: Props) {
  const { openModal, closeModal } = useModal()

  const [editMethod, setEditMethod] = useState(false)
  const [editBillingAddress, setEditBillingAddress] = useState(false)
  const [editTaxInfo, setEditTaxInfo] = useState(false)

  //TODO: 유저가 등록한 정보가 있는 경우 그걸로 초기화해주기
  const [billingMethod, setBillingMethod] = useState<ProPaymentType | null>(
    null,
  )

  //TODO: 최종 submit 시 보낼 데이터
  const [billingMethodData, setBillingMethodData] = useState<any>(null)

  function onBillingMethodSave(data: any) {
    setBillingMethodData(data)
  }

  const {
    control,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<ClientAddressType>({
    defaultValues: {
      addressType: 'billing',
      baseAddress: '',
      detailAddress: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
    mode: 'onChange',
    resolver: yupResolver(clientBillingAddressSchema),
  })

  const {
    control: taxInfoControl,
    getValues: getTaxInfo,
    setValue: setTaxInfo,
    reset: resetTaxInfo,
    formState: { errors: taxInfoErrors, isValid: isTaxInfoValid },
  } = useForm<TaxInfoType>({
    defaultValues: taxInfoDefaultValue,
    mode: 'onChange',
    resolver: yupResolver(taxInfoSchema(billingMethod)),
  })

  function onSaveEachForm() {
    openModal({
      type: 'save',
      children: (
        <SaveModal
          open={true}
          onSave={() => {
            closeModal('save')
            setEditBillingAddress(false)
            setEditTaxInfo(false)
          }}
          onClose={() => closeModal('save')}
        />
      ),
    })
  }

  function onCancel() {
    openModal({
      type: 'discard',
      children: (
        <DiscardModal
          title='Are you sure you want to discard all changes?'
          onClose={() => closeModal('discard')}
          onClick={() => {
            closeModal('discard')
            setEditBillingAddress(false)
            setEditTaxInfo(false)
          }}
        />
      ),
    })
  }

  function onRegister() {
    const billingMethod = billingMethodData
    const billingAddress = getValues()
    const taxInfo = getTaxInfo()
    openModal({
      type: 'register',
      children: (
        <CustomModal
          title='Are you sure you want to register your payment information?

    You cannot modify Tax info. of Tax information after the registration.'
          vary='successful'
          //TODO: mutation붙이기
          onClick={() => console.log('')}
          onClose={() => closeModal('register')}
          rightButtonText='Register'
        />
      ),
    })
  }

  return (
    <Grid container spacing={6}>
      {/* TODO: 이 버튼은 paymentMethod가 없는 경우에만 노출하기 */}
      {editMethod || editBillingAddress || editTaxInfo ? null : (
        <Grid item xs={12} display='flex' justifyContent='end'>
          <Button
            variant='contained'
            disabled={!billingMethodData || !isValid || !isTaxInfoValid}
            startIcon={<Icon icon='material-symbols:check' />}
            onClick={onRegister}
          >
            Register
          </Button>
        </Grid>
      )}

      <Grid item xs={12}>
        <Card sx={{ padding: '24px' }}>
          <Grid container spacing={6}>
            <Grid
              item
              xs={12}
              display='flex'
              alignItems='center'
              justifyContent='space-between'
            >
              <Typography variant='h6'>Billing Method </Typography>
              {editMethod ? null : (
                <Button
                  variant='contained'
                  onClick={() => setEditMethod(!editMethod)}
                >
                  Update
                </Button>
              )}
            </Grid>
            {editMethod ? (
              <Fragment>
                <Grid item xs={12}>
                  <BillingMethod
                    billingMethodData={billingMethodData}
                    billingMethod={billingMethod}
                    setBillingMethod={setBillingMethod}
                    setEdit={setEditMethod}
                    onBillingMethodSave={onBillingMethodSave}
                  />
                </Grid>
              </Fragment>
            ) : (
              <Grid item xs={12}>
                <BillingMethodDetail
                  billingMethod={billingMethod}
                  info={billingMethodData}
                  bankInfo={billingMethodData?.bankInfo}
                  corrBankInfo={billingMethodData?.corrBankInfo}
                />
              </Grid>
            )}
          </Grid>
        </Card>
      </Grid>

      {/* Billing address */}
      <Grid item xs={12}>
        <Card sx={{ padding: '24px' }}>
          <Grid container spacing={6}>
            <Grid
              item
              xs={12}
              display='flex'
              alignItems='center'
              justifyContent='space-between'
            >
              <Typography variant='h6'>Billing address</Typography>
              {editBillingAddress ? null : (
                <Button
                  variant='contained'
                  //TODO: 아래 코드 주석 해제하기
                  //   disabled={!billingMethodData}
                  onClick={() => setEditBillingAddress(!editBillingAddress)}
                >
                  Update
                </Button>
              )}
            </Grid>
            {editBillingAddress ? (
              <Fragment>
                <ClientBillingAddressesForm control={control} errors={errors} />
                <Grid
                  item
                  xs={12}
                  display='flex'
                  justifyContent='center'
                  gap='16px'
                >
                  <Button variant='outlined' onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button
                    variant='contained'
                    disabled={!isValid}
                    onClick={onSaveEachForm}
                  >
                    Save
                  </Button>
                </Grid>
              </Fragment>
            ) : (
              <Grid item xs={12}>
                <BillingAddress
                  billingAddress={{
                    addressType: 'billing',
                    baseAddress: '알라깔라',
                    detailAddress: '똑깔라비',
                    city: 'Seoul',
                    country: 'Korea',
                    zipCode: '12313',
                  }}
                />
              </Grid>
            )}
          </Grid>
        </Card>
      </Grid>

      {/* Tax information */}
      <Grid item xs={12}>
        <Card sx={{ padding: '24px' }}>
          <Grid container spacing={6}>
            <Grid
              item
              xs={12}
              display='flex'
              alignItems='center'
              justifyContent='space-between'
            >
              <Typography variant='h6'>Tax Information</Typography>
              {editTaxInfo ? null : (
                <Button
                  variant='contained'
                  //TODO: 아래 코드 주석 해제하기
                  //   disabled={!billingMethodData}
                  onClick={() => setEditTaxInfo(!editTaxInfo)}
                >
                  Update
                </Button>
              )}
            </Grid>
            {editTaxInfo ? (
              <Fragment>
                <TaxInfoForm
                  billingMethod={billingMethod}
                  control={taxInfoControl}
                  getValues={getTaxInfo}
                  setValue={setTaxInfo}
                  errors={taxInfoErrors}
                />
                <Grid
                  item
                  xs={12}
                  display='flex'
                  justifyContent='center'
                  gap='16px'
                >
                  <Button variant='outlined' onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button
                    variant='contained'
                    disabled={!isValid}
                    onClick={onSaveEachForm}
                  >
                    Save
                  </Button>
                </Grid>
              </Fragment>
            ) : (
              <Grid item xs={12}>
                <BillingAddress
                  billingAddress={{
                    addressType: 'billing',
                    baseAddress: '알라깔라',
                    detailAddress: '똑깔라비',
                    city: 'Seoul',
                    country: 'Korea',
                    zipCode: '12313',
                  }}
                />
              </Grid>
            )}
          </Grid>
        </Card>
      </Grid>
    </Grid>
  )
}
