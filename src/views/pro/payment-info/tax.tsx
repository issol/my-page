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
  SyntheticEvent,
  useEffect,
  useMemo,
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
      setTaxRate(0)
    }
  }

  const handleSaveTax = () => {
    updateProTaxInfo(proId, taxInfo!, taxRate ?? 0)
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

  const onChangeTaxInfo = (
    event: SyntheticEvent,
    item: {
      label: TaxResidentInfoType
      value: number | null
    },
  ) => {
    setTaxInfo(item?.label)
    setTaxRate(item?.value)

    if (item?.label === 'Korea resident') {
      setTaxRate(-3.3)
      setIsTaxRateDisabled(false)
      return
    }

    if (item?.label === 'Korea resident (Sole proprietorship)') {
      setTaxRate(10)
      setIsTaxRateDisabled(false)
      return
    }

    setTaxRate(0)
    setIsTaxRateDisabled(true)
  }

  const activeSaveButton = useMemo(() => {
    if (
      taxInfo === 'Korea resident' ||
      taxInfo === 'Korea resident (Sole proprietorship)'
    ) {
      return !(taxInfo && taxRate)
    }

    return !taxInfo
  }, [taxInfo, taxRate])

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
            sx={{ display: isUpdatable ? 'flex' : 'none' }}
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
                  inputValue={taxInfo}
                  onChange={(event, item) => {
                    if (item) {
                      onChangeTaxInfo(event, item)
                    }
                  }}
                  options={TextRatePair}
                  getOptionLabel={option => option.label}
                  renderInput={params => (
                    <TextField {...params} autoComplete='off' label='Tax info*' />
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
                autoComplete='off'
                value={taxRate ?? ''}
                label='Tax rate*'
                type='number'
                InputProps={{
                  endAdornment: isTaxRateDisabled ? '' : '%',
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
              disabled={activeSaveButton}
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
            <Typography variant='body2'>
              {parseInt(String(info?.taxRate || 0)).toFixed(2) ?? '-'} %
            </Typography>
          </Box>
        </Box>
      )}
    </Card>
  )
}

export default Tax
