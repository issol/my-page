import { Fragment, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

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
import { AuthContext } from '@src/context/AuthContext'
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
import { InvoicePayableStatusType } from '@src/types/invoice/common.type'

// ** react hook form
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** components
import PageLeaveModal from '@src/pages/client/components/modals/page-leave-modal'
import DiscardModal from '@src/@core/components/common-modal/discard-modal'
import ConfirmSaveAllChanges from '@src/pages/components/modals/confirm-save-modals/confirm-save-all-chages'

// ** hooks
import useModal from '@src/hooks/useModal'
import { useMutation, useQueryClient } from 'react-query'
import { useConfirmLeave } from '@src/hooks/useConfirmLeave'

// ** helpers
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'

// ** values
import { InvoicePayableStatus } from '@src/shared/const/status/statuses'

// ** apis
import { updateInvoicePayable } from '@src/apis/invoice/payable.api'

// ** third parties
import { toast } from 'react-hot-toast'

type Props = {
  payableId: number
  isUpdatable: boolean
  data: InvoicePayableDetailType | undefined
  editInfo: boolean
  setEditInfo: (n: boolean) => void
}

/* TODO:
version history
*/
export default function InvoiceDetailCard({
  payableId,
  isUpdatable,
  data,
  editInfo,
  setEditInfo,
}: Props) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { openModal, closeModal } = useModal()

  const { user } = useContext(AuthContext)
  const ability = useContext(AbilityContext)

  const isAccountManager = ability.can('read', 'account_manage')

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
        invoiceStatus: data.invoiceStatus,
        payDueAt: data.payDueAt ?? '',
        payDueTimezone: data.payDueTimezone,
        paidAt: data.paidAt ?? '',
        paidDateTimezone: data.paidDateTimezone,
        description: data.description,
      })
    }
  }, [data])

  const updateMutation = useMutation(
    (form: PayableFormType) => updateInvoicePayable(payableId, form),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: 'invoice/payable/detail' })
      },
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )

  function onInvoiceSave() {
    openModal({
      type: 'save',
      children: (
        <ConfirmSaveAllChanges
          onClose={() => closeModal('save')}
          onSave={() => {
            updateMutation.mutate(getValues())
            setEditInfo(false)
            closeModal('save')
          }}
        />
      ),
    })
  }

  function onInvoiceStatusChange(invoiceStatus: InvoicePayableStatusType) {
    updateMutation.mutate({ invoiceStatus })
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
            <Typography variant='h6'>Invoice detail</Typography>
            {(isUpdatable || isAccountManager) &&
            data?.invoiceStatus !== 'Paid' ? (
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
                  {data?.invoicedAt ?? '-'}
                </CustomTypo>
              </LabelContainer>
            </Grid>
            <Grid item xs={6}>
              <LabelContainer>
                <CustomTypo fontWeight={600}>Status</CustomTypo>
                {isUpdatable ? (
                  <Autocomplete
                    autoHighlight
                    fullWidth
                    value={
                      InvoicePayableStatus.find(
                        item => item.value === data?.invoiceStatus,
                      ) ?? null
                    }
                    onChange={(e, v) => {
                      if (v?.value) {
                        onInvoiceStatusChange(
                          v.value as InvoicePayableStatusType,
                        )
                      }
                    }}
                    options={InvoicePayableStatus}
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField {...params} label='Status' />
                    )}
                  />
                ) : (
                  <CustomTypo variant='body2'>{data?.invoiceStatus}</CustomTypo>
                )}
              </LabelContainer>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={6}>
              <LabelContainer>
                <CustomTypo fontWeight={600}>Pro</CustomTypo>
                <CustomTypo variant='body2'>
                  {data?.pro?.name ?? '-'}
                </CustomTypo>
              </LabelContainer>
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={6}>
              <LabelContainer>
                <CustomTypo fontWeight={600}>Tax info</CustomTypo>
                <CustomTypo variant='body2'>{data?.taxInfo ?? '-'}</CustomTypo>
              </LabelContainer>
            </Grid>
            <Grid item xs={6}>
              <LabelContainer>
                <CustomTypo fontWeight={600}>Tax rate</CustomTypo>
                <CustomTypo variant='body2'>{data?.taxRate ?? '-'}</CustomTypo>
              </LabelContainer>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={6}>
              <LabelContainer>
                <CustomTypo fontWeight={600}>Payment due</CustomTypo>
                <CustomTypo variant='body2'>
                  {FullDateTimezoneHelper(
                    data?.payDueAt,
                    data?.payDueTimezone?.code,
                  )}
                </CustomTypo>
              </LabelContainer>
            </Grid>
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
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Box>
                <CustomTypo fontWeight={600}>Invoice description</CustomTypo>
                <CustomTypo variant='body2'>
                  {data?.description ?? '-'}
                </CustomTypo>
              </Box>
            </Grid>
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
