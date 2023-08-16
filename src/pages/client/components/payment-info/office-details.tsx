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
  Typography,
} from '@mui/material'

// ** components
import PaymentMethod from './payment-method'
import PaymentMethodForm from './payment-method-form'

// ** types
import {
  ClientPaymentFormType,
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

type Props = {
  clientId: number
}

export default function OfficeDetails({ clientId }: Props) {
  /* const { data: officeList } = useGetClientOffice(clientId) */ //TODO: 데이터가 채워지면 주석 해제하고 이 값 사용하기
  const { data: paymentInfo, isLoading } = useGetClientPaymentInfo(clientId)

  const officeList: OfficeType[] = ['Japan', 'Korea', 'Singapore', 'US'] //TODO: 임시데이터.
  const earliestData = paymentInfo
    ? [...paymentInfo]
        .filter(item => item?.updatedAt)
        .sort((a, b) => {
          if (a.updatedAt && b.updatedAt) {
            return (
              new Date(b.updatedAt)?.getTime() -
              new Date(a.updatedAt)?.getTime()
            )
          }
          return -1
        })
    : []

  const [office, setOffice] = useState<OfficeType>(
    paymentInfo?.length && paymentInfo?.length <= 1
      ? paymentInfo[0].office
      : earliestData.length
      ? earliestData[0].office
      : 'Korea',
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

  function onSave(
    paymentMethod: PaymentType,
    office: OfficeType,
    paymentData: PaymentMethodUnionType,
    taxData: OfficeTaxType,
  ) {
    const existData = paymentInfo?.find(info => info.office === office)
    const data = {
      clientId,
      office,
      paymentMethod,
      paymentData,
      taxData,
    }

    updatePaymentInfo.mutate(
      !existData ? data : { ...data, paymentId: existData.id },
    )
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
                <InputLabel id='select office'>Office</InputLabel>
                <Select
                  labelId='select office'
                  value={office}
                  onChange={e => setOffice(e.target.value as OfficeType)}
                  autoWidth
                  label='Age'
                >
                  {officeList.map(i => (
                    <MenuItem value={i} key={i}>
                      {i}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <IconButton onClick={() => setEditForm(true)}>
              <Icon icon='mdi:pencil-outline' />
            </IconButton>
          </Box>
        }
      />
      <CardContent>
        <PaymentMethod office={office} paymentInfo={paymentInfo} />
      </CardContent>
      <Dialog open={editForm} maxWidth='md'>
        <DialogContent sx={{ padding: '50px' }}>
          <PaymentMethodForm
            office={office}
            open={editForm}
            onSave={onSave}
            paymentInfo={paymentInfo}
            onClose={() => setEditForm(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  )
}
