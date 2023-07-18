import { Fragment, useState } from 'react'
import { Box, Button, Card, Grid, Typography } from '@mui/material'
import { UserDataType } from '@src/context/types'
import { DetailUserType } from '@src/types/common/detail-user.type'

import styled from 'styled-components'
import { ProPaymentType } from '@src/types/payment-info/pro/billing-method.type'
import BillingMethod from './billing-method'

type Props = {
  userInfo: DetailUserType
  user: UserDataType
}

export default function ProPaymentInfo({ userInfo, user }: Props) {
  const [editMethod, setEditMethod] = useState(false)
  const [editBillingAddress, setEditBillingAddress] = useState(false)
  const [editTaxInfo, setEditTaxInfo] = useState(false)

  //TODO: 유저가 등록한 정보가 있는 경우 그걸로 초기화해주기
  const [billingMethod, setBillingMethod] = useState<ProPaymentType | null>(
    null,
  )

  //TODO: 최종 submit 시 보낼 데이터
  const [billingMethodData, setBillingMethodData] = useState<any>()

  function onBillingMethodSave(data: any) {
    setBillingMethodData(data)
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
              <Button
                variant='contained'
                onClick={() => setEditMethod(!editMethod)}
              >
                Update
              </Button>
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
              'detail'
            )}
          </Grid>
        </Card>
      </Grid>
    </Grid>
  )
}
