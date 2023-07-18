import { Fragment, useState } from 'react'
import { Box, Button, Card, Grid, Typography } from '@mui/material'
import { UserDataType } from '@src/context/types'
import { DetailUserType } from '@src/types/common/detail-user.type'

import styled from 'styled-components'
import { ProPaymentType } from '@src/types/payment-info/pro/billing-method.type'
import BillingMethod from './billing-method'
import BillingAddress from '@src/pages/client/components/payment-info/billing-address'
import { useForm } from 'react-hook-form'
import { ClientAddressType } from '@src/types/schema/client-address.schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { clientBillingAddressSchema } from '@src/types/schema/client-billing-address.schema'
import ClientBillingAddressesForm from '@src/pages/client/components/forms/client-billing-address'
import DiscardModal from '@src/@core/components/common-modal/discard-modal'
import SaveModal from '@src/pages/company/components/price/price-units/modal/save-modal'
import useModal from '@src/hooks/useModal'

type Props = {
  userInfo: DetailUserType
  user: UserDataType
}

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

  function onSaveBillingAddress() {
    const data = getValues()
    openModal({
      type: 'save',
      children: (
        <SaveModal
          open={true}
          onSave={() => {
            closeModal('save')
            //TODO: mutation붙이기
            setEditBillingAddress(false)
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
          }}
        />
      ),
    })
  }

  return (
    <Grid container spacing={6}>
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
                    billingMethod={billingMethod}
                    setBillingMethod={setBillingMethod}
                    setEdit={setEditMethod}
                    onBillingMethodSave={onBillingMethodSave}
                  />
                </Grid>
              </Fragment>
            ) : (
              <Grid item xs={12}>
                Detail
              </Grid>
            )}
          </Grid>
        </Card>
        <Card sx={{ padding: '24px', mt: 6 }}>
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
                    onClick={onSaveBillingAddress}
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
