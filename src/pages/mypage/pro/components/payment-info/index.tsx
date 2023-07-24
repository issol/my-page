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
import FileInfoFromS3 from '@src/@core/components/file-info-s3'
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import { FileItemType } from '@src/@core/components/swiper/file-swiper'
import TaxInfoDetail from './tax-info-details'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'

type Props = {
  userInfo: DetailUserType
  user: UserDataType
}

/* TODO:
1. 데이터를 받아왔을 때 billing method의 type이 없을 경우 register버튼 노출 => isRegister값으로 구분하기
2. 데이터를 받아왔을 때 저장된게 있는 경우 모든 form reset해주기
    1. Save버튼 클릭 시 바로 fetch되게 하기
    2. cancel시 기존 데이터로 reset해주기
3. 각 detail에 보낼 값들은 isRegister이 true면 저장된 데이터를, 아닌 경우면 form데이터를 getValues해서 넣어주기
*/
export default function ProPaymentInfo({ userInfo, user }: Props) {
  const { openModal, closeModal } = useModal()

  // ** TODO: 데이터 받았을 때 billing method의 type이 없을 경우 false 아니면 true로 세팅하기
  const [isRegister, setIsRegister] = useState(false)

  const [changeBillingMethod, setChangeBillingMethod] = useState(false)

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
    if (!isRegister) {
      //TODO: update mutation붙이기
    }
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

  function onSaveEachForm(type: 'billingAddress' | 'taxInfo') {
    openModal({
      type: 'save',
      children: (
        <SaveModal
          open={true}
          onSave={() => {
            closeModal('save')
            setEditBillingAddress(false)
            setEditTaxInfo(false)
            if (!isRegister) {
              //TODO: type에 따른 update mutation붙이기
            }
          }}
          onClose={() => closeModal('save')}
        />
      ),
    })
  }
  console.log(
    'isRegister && changeBillingMethod',
    isRegister,
    changeBillingMethod,
  )
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
            setBillingMethod(null)
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

  function downloadAllFile() {
    //TODO: 함수 완성하기
  }

  function uploadFiles(files: File[]) {
    //TODO: 함수 완성하기
  }

  function onDeleteFile(file: FileItemType) {
    //TODO: 함수 완성하기
  }

  function onChangeBillingMethod() {
    openModal({
      type: 'changeBillingMethod',
      children: (
        <CustomModal
          onClose={() => closeModal('changeBillingMethod')}
          onClick={() => {
            setChangeBillingMethod(true)
            closeModal('changeBillingMethod')
          }}
          title='Are you sure you want to change the billing method?
Some information will reset..'
          vary='error'
          rightButtonText='Understood'
        />
      ),
    })
  }
  console.log('billing', billingMethodData)
  function checkBillingMethodChange(newMethod: ProPaymentType) {
    const taxInfo = getTaxInfo() //TODO: 이 값은 서버에서 받은 사용자 값으로 교체해야 함
    const billingMethodInfo = billingMethodData //TODO: 이 값도 서버에서 받은 사용자 값으로 교체하기

    const isNewMethodKorea = newMethod.includes('koreaDomesticTransfer')
    const isCurrMethodKorea = billingMethodInfo?.type?.includes(
      'koreaDomesticTransfer',
    )
    const isNotChangeable =
      !taxInfo.taxInfo?.includes('Korea') &&
      isNewMethodKorea &&
      !isCurrMethodKorea

    if (isNotChangeable) {
      openModal({
        type: 'cannotChange',
        children: (
          <SimpleAlertModal
            message='Payment method cannot be changed due to conflicting tax info.Please contact the accounting team to update the tax info.'
            onClose={() => closeModal('cannotChange')}
          />
        ),
      })
    } else if (isCurrMethodKorea && !isNewMethodKorea) {
      openModal({
        type: 'changeBillingMethod',
        children: (
          <CustomModal
            onClose={() => closeModal('changeBillingMethod')}
            onClick={() => {
              setBillingMethod(newMethod)
              closeModal('changeBillingMethod')
            }}
            title='Tax information - W8 form is mandatory for this billing method change. Failure to submit will cause payment delays.'
            vary='error'
            rightButtonText='Understood'
          />
        ),
      })
    } else {
      setBillingMethod(newMethod)
    }
  }
  console.log('billing', billingMethod)
  return (
    <Grid container spacing={6}>
      {/* TODO: 이 버튼은 billing method의 type이 없는 경우에만 노출하기 */}
      {editMethod || editBillingAddress || editTaxInfo || !isRegister ? null : (
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
              <Box display='flex' alignItems='center' gap='20px'>
                <Typography variant='h6'>Billing Method </Typography>
                {editMethod && !isRegister ? (
                  <Button
                    variant='outlined'
                    size='small'
                    onClick={onChangeBillingMethod}
                  >
                    Change billing method
                  </Button>
                ) : null}
              </Box>
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
                    isRegister={isRegister}
                    changeBillingMethod={changeBillingMethod}
                    setChangeBillingMethod={setChangeBillingMethod}
                    checkBillingMethodChange={checkBillingMethodChange}
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
                    onClick={() => onSaveEachForm('billingAddress')}
                  >
                    Save
                  </Button>
                </Grid>
              </Fragment>
            ) : (
              <Grid item xs={12}>
                {/* TODO: 실 데이터로 교체하기 */}
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
      <Grid item xs={isRegister ? 12 : 8}>
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
                  isRegister={isRegister}
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
                    onClick={() => onSaveEachForm('taxInfo')}
                  >
                    Save
                  </Button>
                </Grid>
              </Fragment>
            ) : (
              <Grid item xs={12}>
                <TaxInfoDetail
                  billingMethod={billingMethod}
                  info={getTaxInfo()}
                />
              </Grid>
            )}
          </Grid>
        </Card>
      </Grid>

      {/* Additional files TODO: payment info파일은 다운로드 방식이 다르므로
      백엔드와 논의 후 FileInfo컴포넌트 새로 만들기. file data 스키마 정의, 다운로드 방식 정하기 */}
      {!isRegister ? (
        <Grid item xs={4}>
          <Card sx={{ padding: '24px' }}>
            <FileInfoFromS3
              title='Additional files'
              fileList={[]}
              accept={{
                'image/*': ['.png', '.jpg', '.jpeg'],
                'text/csv': ['.cvs'],
                'application/pdf': ['.pdf'],
                'text/plain': ['.txt'],
                'application/vnd.ms-powerpoint': ['.ppt'],
                'application/msword': ['.doc'],
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                  ['.docx'],
              }}
              fileType={''}
              onDownloadAll={downloadAllFile}
              onFileDrop={uploadFiles}
              onDeleteFile={onDeleteFile}
              isUpdatable={true}
              isDeletable={true}
            />
          </Card>
        </Grid>
      ) : null}
    </Grid>
  )
}
