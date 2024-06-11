import { useState } from 'react'

// ** style components
import { Icon } from '@iconify/react'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material'

// ** components
import PaymentMethod from './payment-method'
import PaymentMethodForm from './payment-method-form'

// ** types
import {
  ClientPaymentFormType,
  ClientPaymentInfoDetail,
  OfficeTaxType,
  OfficeType,
  PaymentMethodUnionType,
  PaymentType,
} from '@src/types/payment-info/client/index.type'

// ** apis
import {
  useGetClientOffice,
  useGetClientPaymentInfo,
} from '@src/queries/payment/client-payment.query'
import { createClientPaymentInfo } from '@src/apis/payment/client-payment.api'

// ** hooks
import { useMutation, useQueryClient } from 'react-query'

// ** third parties
import { toast } from 'react-hot-toast'
import useModal from '@src/hooks/useModal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'

type Props = {
  paymentInfo: ClientPaymentInfoDetail | null
  clientId: number
  isEnrolledClient: boolean
  isUpdatable: boolean
}

export default function OfficeDetails({
  paymentInfo,
  clientId,
  isEnrolledClient,
  isUpdatable,
}: Props) {
  /* const { data: officeList } = useGetClientOffice(clientId) */ //TODO: 데이터가 채워지면 주석 해제하고 이 값 사용하기

  const { openModal, closeModal } = useModal()

  const officeList: OfficeType[] = ['Japan', 'Korea', 'Singapore', 'US'] //TODO: 임시데이터.

  const [office, setOffice] = useState<OfficeType | null>(
    paymentInfo?.office ?? null,
  )

  const queryClient = useQueryClient()
  const [editForm, setEditForm] = useState(false)

  const updatePaymentInfo = useMutation(
    (form: ClientPaymentFormType) => createClientPaymentInfo(form),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: 'get/client/payment' })
      },
      onError: () => onError(),
    },
  )

  const onClickChangeOffice = (
    event: SelectChangeEvent<'Japan' | 'Korea' | 'Singapore' | 'US'>,
  ) => {
    openModal({
      type: 'ChangeConfirmModal',
      children: (
        <CustomModal
          title={
            <>
              Are you sure you want to change to the{' '}
              <Typography fontWeight={600} component={'span'} variant='body2'>
                {event.target.value}
              </Typography>{' '}
              office? It will be notified to the client and the original
              information will not be saved.
            </>
          }
          onClose={() => closeModal('ChangeConfirmModal')}
          rightButtonText='Change'
          vary='error'
          onClick={() => {
            updatePaymentInfo.mutate({
              clientId: clientId,
              office: event.target.value as OfficeType,
            })
            setOffice(event.target.value as OfficeType)
            closeModal('ChangeConfirmModal')
          }}
        />
      ),
    })
  }

  function onSave(
    paymentMethod: PaymentType,
    office: OfficeType,
    paymentData: PaymentMethodUnionType,
    taxData: OfficeTaxType,
  ) {
    // const existData = paymentInfo?.find(info => info.office === office)
    const data = {
      clientId,
      office,
      paymentMethod,
      paymentData,
      taxData,
    }

    updatePaymentInfo.mutate(data)
    setEditForm(false)
  }

  function onError() {
    toast.error(
      'Something went wrong while uploading files. Please try again.',
      {
        position: 'bottom-left',
      },
    )
  }

  return (
    <Card>
      <CardHeader
        title={
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Box display='flex' alignItems='center' gap='16px'>
              <Typography variant='h6'>Office details</Typography>
              <FormControl sx={{ m: 1, minWidth: 80 }}>
                <Select
                  labelId='select office'
                  value={office ?? ''}
                  size='small'
                  onChange={onClickChangeOffice}
                >
                  {officeList.map(i => (
                    <MenuItem value={i} key={i}>
                      {i}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {isEnrolledClient ? (
              isUpdatable ? (
                <IconButton onClick={() => setEditForm(true)}>
                  <Icon icon='mdi:pencil-outline' />
                </IconButton>
              ) : null
            ) : (
              <IconButton onClick={() => setEditForm(true)}>
                <Icon icon='mdi:pencil-outline' />
              </IconButton>
            )}
          </Box>
        }
      />
      <CardContent>
        <PaymentMethod office={office!} paymentInfo={paymentInfo!} />
      </CardContent>
      <Dialog open={editForm} maxWidth='md'>
        <DialogContent sx={{ padding: '50px' }}>
          <PaymentMethodForm
            office={office!}
            open={editForm}
            onSave={onSave}
            paymentInfo={paymentInfo!}
            onClose={() => setEditForm(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  )
}
