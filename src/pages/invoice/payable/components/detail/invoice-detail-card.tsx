import { Fragment, useContext, useEffect } from 'react'

// ** style components
import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import styled from 'styled-components'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'

// ** contexts
import { AbilityContext } from '@src/layouts/components/acl/Can'

// ** components
import InvoiceDetailInfoForm from '@src/pages/components/forms/invoice-detail-info-form'

// ** types & schemas
import {
  InvoicePayableDetailType,
  PayableFormType,
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
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** components
import DiscardModal from '@src/@core/components/common-modal/discard-modal'
import ConfirmSaveAllChanges from '@src/pages/components/modals/confirm-save-modals/confirm-save-all-chages'

// ** hooks
import useModal from '@src/hooks/useModal'
import { UseMutationResult, useMutation, useQueryClient } from 'react-query'
import { useConfirmLeave } from '@src/hooks/useConfirmLeave'

// ** helpers
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'

// ** values
import { InvoicePayableStatus } from '@src/shared/const/status/statuses'
import { getCurrentRole } from '@src/shared/auth/storage'
import {
  InvoiceProChip,
  invoicePayableStatusChip,
} from '@src/@core/components/chips/chips'

type Props = {
  isUpdatable: boolean
  updatePayable?: UseMutationResult<any, unknown, PayableFormType, unknown>
  data: InvoicePayableDetailType | undefined
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

  const ability = useContext(AbilityContext)

  const currentRole = getCurrentRole()

  const isAccountManager = ability?.can('read', 'account_manage')

  const {
    control,
    getValues,
    reset,
    formState: { errors, isValid },
  } = useForm<PayableFormType>({
    mode: 'onChange',
    defaultValues: invoiceDetailInfoDefaultValue,
    resolver: yupResolver(getInvoiceDetailInfoSchema(isAccountManager)),
  })

  useEffect(() => {
    if (data) {
      reset({
        taxInfo: data.taxInfo ?? '',
        taxRate: data.taxRate,
        invoiceStatus: data.invoiceStatus as InvoicePayableStatusType,
        payDueAt: data.payDueAt ?? '',
        payDueTimezone: data.payDueTimezone,
        paidAt: data.paidAt ?? '',
        paidDateTimezone: data.paidDateTimezone,
        description: data.description,
      })
    }
  }, [data])

  function onInvoiceSave() {
    openModal({
      type: 'save',
      children: (
        <ConfirmSaveAllChanges
          onClose={() => closeModal('save')}
          onSave={() => {
            if (!updatePayable) return
            updatePayable.mutate(getValues())
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

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <ConfirmLeaveModal />
        {editInfo ? null : (
          <Grid item xs={12} display='flex' justifyContent='space-between'>
            <Typography variant='h6'>Invoice details</Typography>
            {(isUpdatable || isAccountManager) &&
            data?.invoiceStatus !== 40300 ? ( //Paid
              <IconButton onClick={() => setEditInfo(!editInfo)}>
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
                    ? FullDateTimezoneHelper(
                        data.invoicedAt,
                        data.invoicedAtTimezone,
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
                currentRole && currentRole.name === 'LPM' ? (
                  <Box sx={{ width: '50%' }}>
                    {invoicePayableStatusChip(
                      data?.invoiceStatus as InvoicePayableStatusType,
                      statusList
                    )}
                  </Box>
                ) : currentRole && currentRole.name === 'PRO' ? (
                  <Box sx={{ width: '50%' }}>
                    {invoicePayableStatusChip(
                      data?.invoiceStatus as InvoiceProStatusType,
                      statusList
                    )}
                  </Box>
                
                ) : null}
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
                    <CustomTypo variant='body2'>
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
                  {data?.taxRate ? `- ${Number(data.taxRate)}%` : '-'}
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
                          ? FullDateTimezoneHelper(
                              data?.payDueAt,
                              data?.payDueTimezone?.code,
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
                  {FullDateTimezoneHelper(
                    data?.paidAt,
                    data?.paidDateTimezone?.code,
                  )}
                </CustomTypo>
              </LabelContainer>
            </Grid>
            {currentRole && currentRole.name === 'PRO' ? null : (
              <>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <CustomTypo fontWeight={600}>
                      Invoice description
                    </CustomTypo>
                    <CustomTypo variant='body2'>
                      {data?.description ?? '-'}
                    </CustomTypo>
                  </Box>
                </Grid>
              </>
            )}
          </Fragment>
        )}
      </Grid>
    </DatePickerWrapper>
  )
}

const LabelContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 2fr;
`
const CustomTypo = styled(Typography)`
  font-size: 14px;
`
