import { Box, Button, Card, Grid, Typography } from '@mui/material'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import CustomRadioBasic from '@src/@core/components/custom-radio/basic'
import { createClientPaymentInfo } from '@src/apis/payment/client-payment.api'
import useModal from '@src/hooks/useModal'
import {
  ClientPaymentFormType,
  OfficeType,
} from '@src/types/payment-info/client/index.type'
import { ChangeEvent, useState } from 'react'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from 'react-query'

const data = [
  {
    title: 'Korea',
    value: 'Korea',
    isSelected: false,
  },
  {
    title: 'US',
    value: 'US',
    isSelected: false,
  },
  {
    title: 'Singapore',
    value: 'Singapore',
    isSelected: false,
  },
  {
    title: 'Japan',
    value: 'Japan',
    isSelected: false,
  },
]

type Props = {
  isUpdatable: boolean
  clientId: number
}

const SelectOffice = ({ isUpdatable, clientId }: Props) => {
  const queryClient = useQueryClient()

  const [selected, setSelected] = useState<OfficeType | null>(null)
  const { openModal, closeModal } = useModal()

  const updatePaymentInfo = useMutation(
    (form: ClientPaymentFormType) => createClientPaymentInfo(form),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: 'get/client/payment' })
        closeModal('SelectOfficeModal')
      },
      onError: () => onError(),
    },
  )

  const handleChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
    if (typeof prop === 'string') {
      setSelected(prop as OfficeType)
    } else {
      setSelected((prop.target as HTMLInputElement).value as OfficeType)
    }
  }

  const onClickSelectOffice = () => {
    openModal({
      type: 'SelectOfficeModal',
      children: (
        <CustomModal
          onClose={() => closeModal('SelectOfficeModal')}
          onClick={() =>
            updatePaymentInfo.mutate({
              clientId: clientId,
              office: selected!,
            })
          }
          title={
            <Box>
              Are you sure you want to select the
              <Typography variant='body2' fontWeight={600} component={'span'}>
                &nbsp;{selected}&nbsp;
              </Typography>
              office?
            </Box>
          }
          rightButtonText='Select'
          vary='successful'
        />
      ),
    })
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
    <Card sx={{ padding: '24px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Box>
          <Typography variant='h6' sx={{ fontWeight: 500, mb: 2 }}>
            Payment info
          </Typography>
          {isUpdatable ? (
            <Typography variant='body2' color='#666CFF'>
              Select the office responsible for this client.
            </Typography>
          ) : (
            '-'
          )}
        </Box>
        {isUpdatable && (
          <>
            <Grid container spacing={4}>
              {data.map((item, index) => (
                <CustomRadioBasic
                  key={index}
                  data={data[index]}
                  selected={selected}
                  name='custom-radios-basic'
                  handleChange={handleChange}
                  gridProps={{ sm: 3, xs: 12 }}
                />
              ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant='contained'
                color='primary'
                disabled={selected === null}
                onClick={onClickSelectOffice}
              >
                Select
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Card>
  )
}

export default SelectOffice
