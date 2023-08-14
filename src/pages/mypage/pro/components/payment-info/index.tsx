import { Fragment, useEffect, useState } from 'react'
import { Box, Button, Card, Grid, Typography } from '@mui/material'
import { UserDataType } from '@src/context/types'
import { DetailUserType } from '@src/types/common/detail-user.type'

import {
  BillingMethodUnionType,
  KoreaDomesticTransferSoloType,
  KoreaDomesticTransferType,
  PayPalType,
  ProPaymentType,
  TransferWiseFormType,
} from '@src/types/payment-info/pro/billing-method.type'
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
import FileInfo from '@src/@core/components/file-info'
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import { FileItemType } from '@src/@core/components/swiper/file-swiper-s3'
import TaxInfoDetail from './tax-info-details'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'
import { useMutation, useQueryClient } from 'react-query'
import {
  PositionType,
  ProPaymentFormType,
  deleteProPaymentFile,
  getProPaymentFile,
  getTaxCodeList,
  updateProBillingAddress,
  updateProBillingMethod,
  updateProTaxInfo,
  uploadProPaymentFile,
} from '@src/apis/payment-info.api'
import { toast } from 'react-hot-toast'
import {
  useGetTaxCodeList,
  useGetUserPaymentInfo,
} from '@src/queries/payment-info.query'
import { isEmpty } from 'lodash'

type Props = {
  userInfo: DetailUserType
  user: UserDataType
}

export default function ProPaymentInfo({ userInfo, user }: Props) {
  const { openModal, closeModal } = useModal()

  const queryClient = useQueryClient()
  const invalidatePaymentInfo = () =>
    queryClient.invalidateQueries({ queryKey: 'get-payment-info' })

  const [isRegister, setIsRegister] = useState(true)

  const [changeBillingMethod, setChangeBillingMethod] = useState(false)

  const [editMethod, setEditMethod] = useState(false)
  const [editBillingAddress, setEditBillingAddress] = useState(false)
  const [editTaxInfo, setEditTaxInfo] = useState(false)

  // ** ex: 'wise', 'us_ach' ...등의 method type
  const [billingMethod, setBillingMethod] = useState<ProPaymentType | null>(
    null,
  )

  const [billingMethodData, setBillingMethodData] =
    useState<ProPaymentFormType | null>(null)

  const { data: paymentInfo } = useGetUserPaymentInfo(user.userId!, true)
  const { data: taxCodes } = useGetTaxCodeList()

  function onError() {
    toast.error('Something went wrong. Please try again.', {
      position: 'bottom-left',
    })
  }

  function onBillingMethodSave(data: ProPaymentFormType) {
    // ** !isRegister인 경우 수정, 아닌 경우 create
    if (!isRegister) {
      updatePaymentMethod(data)
    }
    setBillingMethodData(data)
  }

  async function updatePaymentMethod(data: ProPaymentFormType) {
    for (const key in data.correspondentBankInfo) {
      //@ts-ignore
      if (!data.correspondentBankInfo[key]) {
        //@ts-ignore
        delete data.correspondentBankInfo[key]
      }
    }
    if (isEmpty(data.correspondentBankInfo)) {
      data.correspondentBankInfo = null
    }

    let finalData: BillingMethodUnionType | null = null
    switch (billingMethod) {
      case 'wise':
      case 'us_ach':
      case 'internationalWire':
        finalData = data.billingMethod as TransferWiseFormType
        await uploadProPaymentFile('copyOfId', finalData?.copyOfId!)
        delete finalData.copyOfId

      case 'koreaDomesticTransfer':
        //@ts-ignore
        const isSolo = !data.billingMethod?.copyOfBankStatement
        finalData = data.billingMethod as KoreaDomesticTransferType
        await uploadProPaymentFile('copyOfRrCard', finalData?.copyOfRrCard!)
        delete finalData.copyOfRrCard
        if (!isSolo) {
          await uploadProPaymentFile(
            'copyOfBankStatement',
            finalData.copyOfBankStatement!,
          )
          delete finalData.copyOfBankStatement
        }

      case 'paypal':
        finalData = data.billingMethod as PayPalType
        await uploadProPaymentFile('copyOfId', finalData?.copyOfId!)
        delete finalData.copyOfId
    }
    await updateProBillingMethod({
      ...data,
      billingMethod: finalData!,
    })
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

  async function resetBillingMethodData() {
    const decryptPaymentInfo = paymentInfo?.decryptPaymentInfo
    if (decryptPaymentInfo?.billingMethod?.type) {
      let billingMethod: BillingMethodUnionType = {
        ...decryptPaymentInfo?.billingMethod,
      }
      switch (decryptPaymentInfo?.billingMethod?.type) {
        case 'wise':
        case 'us_ach':
        case 'internationalWire':
        case 'paypal':
          const copyOfId = paymentInfo?.files?.find(
            i => i.positionType === 'copyOfId',
          )
          if (copyOfId) {
            billingMethod = billingMethod as TransferWiseFormType
            const file = await transferBlobToFile(copyOfId.id!, 'copyOfId')
            if (file) billingMethod.copyOfId = file
          }

        case 'koreaDomesticTransfer':
          const copyOfRrCard = paymentInfo?.files?.find(
            i => i.positionType === 'copyOfRrCard',
          )
          //@ts-ignore
          const isSolo = !billingMethod?.copyOfBankStatement
          billingMethod = billingMethod as KoreaDomesticTransferType
          if (copyOfRrCard) {
            const file = await transferBlobToFile(
              copyOfRrCard.id!,
              'copyOfRrCard',
            )
            if (file) billingMethod.copyOfRrCard = file
          }
          if (!isSolo) {
            const copyOfBankStatement = paymentInfo?.files?.find(
              i => i.positionType === 'copyOfBankStatement',
            )
            if (copyOfBankStatement) {
              const file = await transferBlobToFile(
                copyOfBankStatement.id!,
                'copyOfBankStatement',
              )
              if (file) billingMethod.copyOfBankStatement = file
            }
          }

          setBillingMethod(decryptPaymentInfo?.billingMethod?.type)
          setBillingMethodData({
            billingMethod: billingMethod,
            bankInfo: decryptPaymentInfo?.bankInfo,
            correspondentBankInfo: decryptPaymentInfo?.correspondentBankInfo,
          })
      }
    }
  }

  async function transferBlobToFile(
    id: number,
    fileName: string,
  ): Promise<File | null> {
    const res = await getProPaymentFile(id)
    if (res) {
      const fileData: File = new File([res], fileName, {
        type: res.type,
        lastModified: new Date().getTime(),
      })
      return fileData
    }
    return null
  }

  // ** form reset by paymentInfo data
  useEffect(() => {
    if (paymentInfo) {
      const { decryptPaymentInfo } = paymentInfo || undefined
      resetBillingMethodData()

      reset({ ...paymentInfo.billingAddress })

      const taxInfo = taxCodes?.find(i => i.statusCode === paymentInfo.taxCode)
      const taxInfoFile = paymentInfo?.files?.find(
        i => i.positionType === 'businessLicense',
      )
      if (taxInfo) {
        if (taxInfoFile) {
          transferBlobToFile(taxInfoFile.id!, 'businessLicense').then(res => {
            if (res) {
              resetTaxInfo({
                tax: Number(taxInfo.rate),
                taxInfo: taxInfo.info,
                businessLicense: res,
              })
            }
          })
        }
        resetTaxInfo({
          tax: Number(taxInfo.rate),
          taxInfo: taxInfo.info,
        })
      }
      if (decryptPaymentInfo?.billingMethod?.type) {
        setIsRegister(false)
      }
    }
  }, [paymentInfo])

  function onSaveEachForm(type: 'billingAddress' | 'tax') {
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
              switch (type) {
                case 'billingAddress':
                  updateProBillingAddress(getValues())
                    .then(() => invalidatePaymentInfo())
                    .catch(() => onError())
                  return
                case 'tax':
                  if (taxCodes) {
                    const taxInfo = getTaxInfo()
                    const statusCode = taxCodes.find(
                      i => i.info === taxInfo.taxInfo,
                    )?.statusCode!
                    updateProTaxInfo(user.userId!, statusCode)
                      .then(() => {
                        if (taxInfo.businessLicense) {
                          uploadProPaymentFile(
                            'businessLicense',
                            taxInfo.businessLicense,
                          ).then(() => invalidatePaymentInfo())
                        } else {
                          invalidatePaymentInfo()
                        }
                      })
                      .catch(() => onError())
                  }
                  return
              }
            }
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
            setBillingMethod(null)
          }}
        />
      ),
    })
  }

  function registerAllInfo() {
    const billingAddress = getValues()
    const taxInfo = getTaxInfo()

    if (billingMethodData && taxCodes) {
      const statusCode = taxCodes.find(i => i.info === taxInfo.taxInfo)
        ?.statusCode!
      const promises = [
        updatePaymentMethod(billingMethodData),
        updateProBillingAddress(billingAddress),
        updateProTaxInfo(user.userId!, statusCode),
      ]
      if (taxInfo.businessLicense) {
        promises.push(
          uploadProPaymentFile('businessLicense', taxInfo.businessLicense),
        )
      }
      Promise.all(promises)
        .then(() => invalidatePaymentInfo())
        .catch(onError)
    }
  }

  function onRegister() {
    openModal({
      type: 'register',
      children: (
        <CustomModal
          title='Are you sure you want to register your payment information?
    You cannot modify Tax info. of Tax information after the registration.'
          vary='successful'
          onClick={() => {
            registerAllInfo()
            closeModal('register')
          }}
          onClose={() => closeModal('register')}
          rightButtonText='Register'
        />
      ),
    })
  }

  function downloadFile(file: FileItemType) {
    if (!file?.id) return
    getProPaymentFile(file.id).then(res => {
      const url = window.URL.createObjectURL(res)
      const a = document.createElement('a')
      a.href = url
      a.download = file.fileName
      document.body.appendChild(a)
      a.click()
      setTimeout((_: any) => {
        window.URL.revokeObjectURL(url)
      }, 60000)
      a.remove()
    })
  }

  function downloadAllFile(files: FileItemType[] | null) {
    if (!files) return
    files.forEach(file => downloadFile(file))
  }

  async function uploadAdditionalFiles(files: File[]) {
    files.forEach(file => {
      uploadProPaymentFile('additional', file)
    })
  }

  //TODO: 테스트하기
  function onDeleteFile(file: FileItemType) {
    if (file.id) {
      deleteProPaymentFile(file.id!)
        .then(() => invalidatePaymentInfo())
        .catch(() => onError())
    }
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

  function checkBillingMethodChange(newMethod: ProPaymentType) {
    const taxInfo = taxCodes?.find(i => i.statusCode === paymentInfo?.taxCode)
    const billingMethodType =
      paymentInfo?.decryptPaymentInfo?.billingMethod.type

    const isNewMethodKorea = newMethod.includes('koreaDomesticTransfer')
    const isCurrMethodKorea = billingMethodType?.includes(
      'koreaDomesticTransfer',
    )
    const isNotChangeable =
      !taxInfo?.info?.includes('Korea') &&
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

  return (
    <Grid container spacing={6}>
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
                  info={billingMethodData?.billingMethod}
                  bankInfo={billingMethodData?.bankInfo}
                  corrBankInfo={billingMethodData?.correspondentBankInfo}
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
                  disabled={!billingMethodData}
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
                <BillingAddress billingAddress={paymentInfo?.billingAddress} />
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
                  disabled={!billingMethodData}
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
                    disabled={!isTaxInfoValid}
                    onClick={() => onSaveEachForm('tax')}
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
      {!isRegister ? (
        <Grid item xs={4}>
          <Card sx={{ padding: '24px' }}>
            <FileInfo
              title='Additional files'
              fileList={
                paymentInfo?.files.filter(
                  i => i.positionType === 'additional',
                ) || []
              }
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
              onFileDrop={uploadAdditionalFiles}
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
