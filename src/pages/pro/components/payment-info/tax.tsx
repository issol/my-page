import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  CardHeader,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { TaxInfoType } from '@src/apis/payment-info.api'
import useModal from '@src/hooks/useModal'
import { TaxInfo } from '@src/shared/const/tax/tax-info'
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  info: {
    taxInfo: TaxInfoType
    taxRate: number
  }
  edit: boolean
  setEdit: Dispatch<SetStateAction<boolean>>
}

const Tax = ({ info, edit, setEdit }: Props) => {
  const [taxInfo, setTaxInfo] = useState<string>(info?.taxInfo ?? null)
  const [taxRate, setTaxRate] = useState<number | null>(info?.taxRate ?? null)

  const [isTaxRateDisabled, setIsTaxRateDisabled] = useState<boolean>(false)

  const { openModal, closeModal } = useModal()

  const handleTaxInfoChange = (e: SelectChangeEvent) => {
    const newTaxInfo = e.target.value as string
    switch (newTaxInfo) {
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
    setTaxInfo(e.target.value as string)
  }

  const handleChangeTaxRate = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value !== '') {
      const newTaxRate = Number(event.target.value)
      // console.log(newTaxRate)

      setTaxRate(newTaxRate)
    } else {
      setTaxRate(null)
    }
  }

  const handleSaveTax = () => {
    // TODO API 연결
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
                <InputLabel id='controlled-select-label'>Tax info*</InputLabel>
                <Select
                  value={taxInfo}
                  label='Tax info*'
                  fullWidth
                  id='controlled-select'
                  onChange={handleTaxInfoChange}
                  labelId='controlled-select-label'
                >
                  {TaxInfo.map(value => {
                    return (
                      <MenuItem value={value.value} key={uuidv4()}>
                        {value.label}
                      </MenuItem>
                    )
                  })}
                </Select>
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
                setTaxInfo(info.taxInfo)
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
