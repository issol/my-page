import { Fragment, useContext } from 'react'
import { useRouter } from 'next/router'

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
import styled from 'styled-components'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'

// ** contexts
import { AuthContext } from '@src/context/AuthContext'
import { AbilityContext } from '@src/layouts/components/acl/Can'

// ** components
import InvoiceDetailInfoForm from '@src/pages/components/forms/invoice-detail-info-form'

// ** types & schemas
import { PayableFormType } from '@src/types/invoice/payable.type'
import {
  getInvoiceDetailInfoSchema,
  invoiceDetailInfoDefaultValue,
} from '@src/types/schema/invoice-detail-info.schema'

// ** react hook form
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** permission
import { invoice_payable } from '@src/shared/const/permission-class'

// ** components
import PageLeaveModal from '@src/pages/client/components/modals/page-leave-modal'
import DiscardModal from '@src/@core/components/common-modal/discard-modal'
import ConfirmSaveAllChanges from '@src/pages/components/modals/confirm-save-modals/confirm-save-all-chages'

// ** hooks
import useModal from '@src/hooks/useModal'

type Props = {
  editInfo: boolean
  setEditInfo: (n: boolean) => void
}

/* TODO: 실 데이터로 채우기 */
export default function InvoiceDetailCard({ editInfo, setEditInfo }: Props) {
  const router = useRouter()

  const { openModal, closeModal } = useModal()

  const { user } = useContext(AuthContext)
  const ability = useContext(AbilityContext)
  const User = new invoice_payable(user?.id!)

  const isUpdatable = ability.can('update', User)
  const isAccountManager = ability.can('read', 'account_manage')

  // ** confirm page leaving
  router.beforePopState(() => {
    if (editInfo) {
      openModal({
        type: 'alert-modal',
        children: (
          <PageLeaveModal
            onClose={() => closeModal('alert-modal')}
            onClick={() => router.push('/invoice/payable/')}
          />
        ),
      })
    }
    return false
  })

  const {
    control,
    getValues,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<PayableFormType>({
    mode: 'onChange',
    defaultValues: invoiceDetailInfoDefaultValue,
    resolver: yupResolver(getInvoiceDetailInfoSchema(isAccountManager)),
  })

  function onInvoiceSave() {
    openModal({
      type: 'save',
      children: (
        <ConfirmSaveAllChanges
          onClose={() => closeModal('save')}
          onSave={() => {
            //TODO: save mutation붙이기
            setEditInfo(false)
            closeModal('save')
          }}
        />
      ),
    })
  }

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        {editInfo ? null : (
          <Grid item xs={12} display='flex' justifyContent='space-between'>
            <Typography variant='h6'>Invoice detail</Typography>
            {isUpdatable || isAccountManager ? (
              <IconButton onClick={() => setEditInfo(!editInfo)}>
                <Icon icon='mdi:pencil-outline' />
              </IconButton>
            ) : null}
          </Grid>
        )}

        {editInfo ? (
          <Fragment>
            <InvoiceDetailInfoForm
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
                <CustomTypo variant='body2'>dsdf</CustomTypo>
              </LabelContainer>
            </Grid>
            <Grid item xs={6}>
              <LabelContainer>
                <CustomTypo fontWeight={600}>Status</CustomTypo>
                <CustomTypo variant='body2'>dsdf</CustomTypo>
              </LabelContainer>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={6}>
              <LabelContainer>
                <CustomTypo fontWeight={600}>Pro</CustomTypo>
                <CustomTypo variant='body2'>dsdf</CustomTypo>
              </LabelContainer>
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={6}>
              <LabelContainer>
                <CustomTypo fontWeight={600}>Tax info</CustomTypo>
                <CustomTypo variant='body2'>dsdf</CustomTypo>
              </LabelContainer>
            </Grid>
            <Grid item xs={6}>
              <LabelContainer>
                <CustomTypo fontWeight={600}>Tax rate</CustomTypo>
                <CustomTypo variant='body2'>dsdf</CustomTypo>
              </LabelContainer>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={6}>
              <LabelContainer>
                <CustomTypo fontWeight={600}>Payment due</CustomTypo>
                <CustomTypo variant='body2'>dsdf</CustomTypo>
              </LabelContainer>
            </Grid>
            <Grid item xs={6}>
              <LabelContainer>
                <CustomTypo fontWeight={600}>Payment date</CustomTypo>
                <CustomTypo variant='body2'>dsdf</CustomTypo>
              </LabelContainer>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Box>
                <CustomTypo fontWeight={600}>Invoice description</CustomTypo>
                <CustomTypo variant='body2'>sdfdf</CustomTypo>
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
