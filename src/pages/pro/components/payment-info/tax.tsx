import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardHeader,
  FormControl,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import {
  TaxResidentInfoType,
  updateProTaxInfo,
} from '@src/apis/payment-info.api'
import useModal from '@src/hooks/useModal'
import { TextRatePair } from '@src/shared/const/tax/tax-info'
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { toast } from 'react-hot-toast'
import { useQueryClient } from 'react-query'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  proId: number
  info: {
    taxInfo: TaxResidentInfoType | null
    taxRate: number | null
  }
  edit: boolean
  setEdit: Dispatch<SetStateAction<boolean>>
  isUpdatable: boolean
}

const Tax = ({ proId, info, edit, setEdit, isUpdatable }: Props) => {
  const queryClient = useQueryClient()
  const invalidatePaymentInfo = () =>
    queryClient.invalidateQueries({ queryKey: 'get-payment-info' })

  const [taxInfo, setTaxInfo] = useState<string>(info?.taxInfo ?? '')
  const [taxRate, setTaxRate] = useState<number | null>(info?.taxRate)

  const [isTaxRateDisabled, setIsTaxRateDisabled] = useState<boolean>(false)

  const { openModal, closeModal } = useModal()

  const handleChangeTaxRate = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value !== '') {
      const newTaxRate = Number(event.target.value)
      setTaxRate(newTaxRate)
    } else {
      setTaxRate(null)
    }
  }

  const handleSaveTax = () => {
    updateProTaxInfo(proId, taxInfo!, taxRate!)
      .then(() => invalidatePaymentInfo())
      .catch(() => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      }),
      closeModal('TaxSaveModal')
    setEdit(false)
  }

  const onClickSave = () => {
    openModal({
      type: 'TaxSaveModal',
      children: (
        <CustomModal
          title='Are you sure you want to save all changes?'
          onClick={handleSaveTax}
          onClose={() => closeModal('TaxSaveModal')}
          rightButtonText='Save'
          vary='successful'
        />
      ),
    })
  }

  useEffect(() => {
    if (info.taxInfo) {
      switch (info.taxInfo) {
        case 'Japan resident':
        case 'US resident':
        case 'Singapore resident':
          setTaxRate(null)
          setIsTaxRateDisabled(true)
          break
        case 'Korea resident':
          setTaxRate(-3.3)
          setIsTaxRateDisabled(false)
          break
        case 'Korea resident (Sole proprietorship)':
          setTaxRate(10)
          setIsTaxRateDisabled(false)
          break
      }
    }
  }, [info])

  return (
    <Card style={{ marginTop: '24px', padding: '24px' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant='h6'>Tax</Typography>
        {edit ? null : (
          <IconButton
            onClick={() => setEdit!(true)}
            // disabled={invoiceInfo.invoiceStatus === 'Paid'}
            disabled={!isUpdatable}
          >
            <Icon icon='mdi:pencil-outline' />
          </IconButton>
        )}
      </Box>
      {edit ? (
        <Box>
          <Box sx={{ display: 'flex', mt: '20px', gap: '20px' }}>
            <Box
              sx={{
                display: 'flex',
                flex: 1,
                alignItems: 'center',
              }}
            >
              <FormControl fullWidth>
                <Autocomplete
                  fullWidth
                  onChange={(_, item) => {
                    if (item) {
                      setTaxInfo(item?.label)
                      setTaxRate(item?.value)
                    }
                  }}
                  value={TextRatePair.find(i => i.label === taxInfo)}
                  options={TextRatePair}
                  getOptionLabel={option => option.label}
                  renderInput={params => (
                    <TextField {...params} label='Tax info*' />
                  )}
                />
              </FormControl>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flex: 1,
                alignItems: 'center',
              }}
            >
              <TextField
                fullWidth
                value={taxRate ?? ''}
                label='Tax rate*'
                type='number'
                InputProps={{
                  endAdornment: isTaxRateDisabled ? '' : '%',
                  // inputProps: { min: 0 },
                }}
                onChange={handleChangeTaxRate}
                id='controlled-text-field'
                disabled={isTaxRateDisabled}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '16px',
              gap: '16px',
            }}
          >
            <Button
              variant='outlined'
              onClick={() => {
                setTaxInfo(info.taxInfo ?? '')
                setTaxRate(info.taxRate)
                setEdit(false)
              }}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              onClick={onClickSave}
              disabled={!(taxInfo && taxRate)}
            >
              Save
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', mt: '20px' }}>
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 'bold', width: 134 }}>
              Tax info
            </Typography>
            <Typography variant='body2'>{info?.taxInfo ?? '-'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 'bold', width: 134 }}>
              Tax rate
            </Typography>
            <Typography variant='body2'>{info?.taxRate ?? '-'} %</Typography>
          </Box>
        </Box>
      )}
    </Card>
  )
}

export default Tax
