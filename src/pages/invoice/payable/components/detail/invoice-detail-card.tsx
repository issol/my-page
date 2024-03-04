import { Fragment, useContext, useEffect } from 'react'

// ** style components
import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'
import { styled } from '@mui/system'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'

// ** contexts
import { AbilityContext } from '@src/layouts/components/acl/Can'

// ** components
import InvoiceDetailInfoForm from '@src/pages/components/forms/invoice-detail-info-form'

// ** types & schemas
import {
  InvoicePayableDetailType,
  PayableFormType,
  PayableHistoryType,
} from '@src/types/invoice/payable.type'
import {
  getInvoiceDetailInfoSchema,
  invoiceDetailInfoDefaultValue,
} from '@src/types/schema/invoice-detail-info.schema'
import {
  InvoicePayableStatusType,
  InvoiceProStatusType,
} from '@src/types/invoice/common.type'

// ** react hook form
import { Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** components
import DiscardModal from '@src/@core/components/common-modal/discard-modal'
import ConfirmSaveAllChanges from '@src/pages/components/modals/confirm-save-modals/confirm-save-all-chages'

// ** hooks
import useModal from '@src/hooks/useModal'
import { UseMutationResult } from 'react-query'
import { useConfirmLeave } from '@src/hooks/useConfirmLeave'

// ** helpers
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'

// ** values
import { getCurrentRole } from '@src/shared/auth/storage'
import { invoicePayableStatusChip } from '@src/@core/components/chips/chips'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { timezoneSelector } from '@src/states/permission'
import { useRouter } from 'next/router'

type Props = {
  isUpdatable: boolean
  updatePayable?: UseMutationResult<any, unknown, PayableFormType, unknown>
  data: InvoicePayableDetailType | PayableHistoryType | undefined
  editInfo: boolean
  setEditInfo: (n: boolean) => void
  statusList: Array<{
    label: string
    value: number
  }>
}

export default function InvoiceDetailCard({
  isUpdatable,
  updatePayable,
  data,
  editInfo,
  setEditInfo,
  statusList,
}: Props) {
  const { openModal, closeModal } = useModal()
  const router = useRouter()
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)
  const ability = useContext(AbilityContext)

  const currentRole = getCurrentRole()

  const isAccountManager = ability?.can('read', 'account_manage')

  const {
    control,
    getValues,
    reset,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<PayableFormType>({
    mode: 'onChange',
    defaultValues: invoiceDetailInfoDefaultValue,
    resolver: yupResolver(
      getInvoiceDetailInfoSchema(isAccountManager),
    ) as unknown as Resolver<PayableFormType>,
  })

  useEffect(() => {
    if (data) {
      reset({
        taxInfo: data.taxInfo,
        taxRate: data.taxRate,
        invoiceStatus: data.invoiceStatus as InvoicePayableStatusType,
        payDueAt: data.payDueAt,
        payDueTimezone: data.payDueTimezone,
        paidAt: data.paidAt,
        paidDateTimezone: data.paidDateTimezone,
        description: data.description,
      })
    }
  }, [data])

  const changedDataChecker = () => {
    const saveData = getValues()
    const changedData = []
    if (data) {
      for (const key in saveData) {
        if (saveData[key as keyof PayableFormType] !== data[key as keyof PayableFormType]) {
          changedData.push(key)
        }
      }
    }

    return {
      isChanged: Boolean(changedData.length > 0),
      changedData,
    }
  }

  function onInvoiceSave() {
    openModal({
      type: 'save',
      children: (
        <ConfirmSaveAllChanges
          onClose={() => closeModal('save')}
          onSave={() => {
            if (!updatePayable) return
            updatePayable.mutate(getValues())
            // Save 할때 status를 under revision으로 변경해 준다
            // 만약 계정이 Accounting팀 계정이고 
            // payDueAt, payDueTimezone, paidAt, paidDateTimezone중 하나라도 변경되었을 경우엔 status를 변경하지 않는다
            const isDataChanged = changedDataChecker()
            if (isDataChanged.isChanged) {
              if (isAccountManager) {
                if (
                  !isDataChanged.changedData.includes('payDueAt') &&
                  !isDataChanged.changedData.includes('payDueTimezone') &&
                  !isDataChanged.changedData.includes('paidAt') &&
                  !isDataChanged.changedData.includes('paidDateTimezone')
                ) {
                  onInvoiceStatusChange(40100)
                }
              } else {
                onInvoiceStatusChange(40100)
              }
            }
            setEditInfo(false)
            closeModal('save')
          }}
        />
      ),
    })
  }

  function onInvoiceStatusChange(invoiceStatus: InvoicePayableStatusType) {
    if (!updatePayable) return
    updatePayable.mutate({ invoiceStatus })
  }

  const { ConfirmLeaveModal } = useConfirmLeave({
    shouldWarn: editInfo,
    toUrl: '/invoice/payable/',
  })

  const onClickInvoiceDetailEdit = () => {
    setEditInfo(true)
  }

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <ConfirmLeaveModal />
        {editInfo ? null : (
          <Grid item xs={12} display='flex' justifyContent='space-between'>
            <Typography variant='h6'>Invoice details</Typography>
            {(isUpdatable && data?.invoiceStatus !== 40300) ||
              isAccountManager ? ( //Paid
              <IconButton onClick={onClickInvoiceDetailEdit}>
                <Icon icon='mdi:pencil-outline' />
              </IconButton>
            ) : null}
          </Grid>
        )}

        {editInfo ? (
          <Fragment>
            <InvoiceDetailInfoForm
              data={data}
              control={control}
              errors={errors}
              isAccountManager={isAccountManager}
              statusList={statusList!}
              setValue={setValue}
              getValues={getValues}
              trigger={trigger}
            />
            <Grid
              item
              xs={12}
              display='flex'
              gap='16px'
              justifyContent='center'
            >
              <Button
                variant='outlined'
                onClick={() => {
                  openModal({
                    type: 'discard',
                    children: (
                      <DiscardModal
                        onClose={() => closeModal('discard')}
                        onClick={() => {
                          setEditInfo(false)
                          if (data) {
                            reset({
                              taxInfo: data.taxInfo,
                              taxRate: data.taxRate,
                              invoiceStatus:
                                data.invoiceStatus as InvoicePayableStatusType,
                              payDueAt: data.payDueAt,
                              payDueTimezone: data.payDueTimezone,
                              paidAt: data.paidAt,
                              paidDateTimezone: data.paidDateTimezone,
                              description: data.description,
                            })
                          }

                          closeModal('discard')
                        }}
                      />
                    ),
                  })
                }}
              >
                Cancel
              </Button>
              <Button
                variant='contained'
                onClick={onInvoiceSave}
                disabled={!isValid}
              >
                Save
              </Button>
            </Grid>
          </Fragment>
        ) : (
          <Fragment>
            <Grid item xs={6}>
              <LabelContainer>
                <CustomTypo fontWeight={600}>Invoice date</CustomTypo>
                <CustomTypo variant='body2'>
                  {data?.invoicedAt
                    ? convertTimeToTimezone(
                        data.invoicedAt,
                        auth.getValue().user?.timezone,
                        timezone.getValue(),
                      )
                    : '-'}
                </CustomTypo>
              </LabelContainer>
            </Grid>
            <Grid item xs={6}>
              <LabelContainer>
                <CustomTypo fontWeight={600}>Status</CustomTypo>
                {
                  // isUpdatable ? (
                  //   <Autocomplete
                  //     autoHighlight
                  //     fullWidth
                  //     value={
                  //       InvoicePayableStatus.find(
                  //         item => item.value === data?.invoiceStatus,
                  //       ) ?? null
                  //     }
                  //     onChange={(e, v) => {
                  //       if (v?.value) {
                  //         onInvoiceStatusChange(
                  //           v.value as InvoicePayableStatusType,
                  //         )
                  //       }
                  //     }}
                  //     options={InvoicePayableStatus}
                  //     getOptionLabel={option => option.label}
                  //     renderInput={params => (
                  //       <TextField {...params} label='Status' />
                  //     )}
                  //   />
                  // ) :
                  currentRole &&
                  (currentRole.name === 'LPM' ||
                    currentRole.name === 'ACCOUNT_MANAGER') ? (
                    <Box sx={{ width: '50%' }}>
                      {invoicePayableStatusChip(
                        data?.invoiceStatus as InvoicePayableStatusType,
                        statusList,
                      )}
                    </Box>
                  ) : currentRole && currentRole.name === 'PRO' ? (
                    <Box sx={{ width: '50%' }}>
                      {invoicePayableStatusChip(
                        data?.invoiceStatus as InvoiceProStatusType,
                        statusList,
                      )}
                    </Box>
                  ) : null
                }
              </LabelContainer>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {currentRole && currentRole.name === 'PRO' ? null : (
              <>
                <Grid item xs={6}>
                  <LabelContainer>
                    <CustomTypo fontWeight={600}>Pro</CustomTypo>
                    <CustomTypo
                      variant='body2'
                      sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                      onClick={() => {
                        if (!data?.pro?.id) return
                        router.push(`/pro/detail/${data?.pro?.id}`)
                      }}
                    >
                      {data?.pro?.name ?? '-'}
                    </CustomTypo>
                  </LabelContainer>
                </Grid>
                <Grid item xs={6}></Grid>
              </>
            )}

            <Grid item xs={6}>
              <LabelContainer>
                <CustomTypo fontWeight={600}>Tax info</CustomTypo>
                <CustomTypo variant='body2'>{data?.taxInfo ?? '-'}</CustomTypo>
              </LabelContainer>
            </Grid>
            <Grid item xs={6}>
              <LabelContainer>
                <CustomTypo fontWeight={600}>Tax rate</CustomTypo>
                <CustomTypo variant='body2'>
                  {data?.taxRate ? `${Number(data.taxRate)}%` : '-'}
                </CustomTypo>
              </LabelContainer>
            </Grid>

            {currentRole && currentRole.name === 'PRO' ? null : (
              <>
                <Grid item xs={12}>
                  <Divider />
                  <Grid item xs={6}>
                    <LabelContainer>
                      <CustomTypo fontWeight={600}>Payment due</CustomTypo>
                      <CustomTypo variant='body2'>
                        {data?.payDueAt
                          ? convertTimeToTimezone(
                              data?.payDueAt,
                              auth.getValue().user?.timezone,
                              timezone.getValue(),
                            )
                          : '-'}
                      </CustomTypo>
                    </LabelContainer>
                  </Grid>
                </Grid>
              </>
            )}

            <Grid item xs={6}>
              <LabelContainer>
                <CustomTypo fontWeight={600}>Payment date</CustomTypo>
                <CustomTypo variant='body2'>
                  {convertTimeToTimezone(
                    data?.paidAt,
                    auth.getValue().user?.timezone,
                    timezone.getValue(),
                  )}
                </CustomTypo>
              </LabelContainer>
            </Grid>
          </Fragment>
        )}
      </Grid>
    </DatePickerWrapper>
  )
}

const LabelContainer = styled('div')`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 2fr;
`
const CustomTypo = styled(Typography)`
  font-size: 14px;
`
