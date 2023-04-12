import { yupResolver } from '@hookform/resolvers/yup'
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import Dialog from '@mui/material/Dialog'

import DialogContent from '@mui/material/DialogContent'
import Icon from 'src/@core/components/icon'

import useModal from '@src/hooks/useModal'
import { JobList } from '@src/shared/const/job/jobs'
import { getGloLanguage } from '@src/shared/transformer/language.transformer'
import { AddNewLanguagePair } from '@src/types/common/standard-price'
import { languagePairSchema } from '@src/types/schema/price-unit.schema'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import LanguagePairActionModal from '../modal/language-pair-action-modal'

const defaultValues: AddNewLanguagePair = {
  pair: [{ source: '', target: '', priceFactor: null, minimumPrice: null }],
}

type Props = {
  onClose: any
  currency: string
}

const SetPriceUnitModal = ({ onClose, currency }: Props) => {
  const { closeModal, openModal } = useModal()

  const languageList = getGloLanguage()

  const {
    control,
    handleSubmit,
    reset,
    watch,
    trigger,
    getValues,
    formState: { errors, dirtyFields },
  } = useForm<AddNewLanguagePair>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(languagePairSchema),
  })

  const {
    fields: pairFields,
    append,
    remove,
    update,
  } = useFieldArray({
    control,
    name: 'pair',
  })

  const onSubmit = (data: AddNewLanguagePair) => {
    console.log(data)
  }

  const removePair = (item: { id: string }) => {
    const idx = pairFields.map(item => item.id).indexOf(item.id)
    idx !== -1 && remove(idx)
  }

  const addPair = () => {
    if (pairFields.length >= 10) {
      openModal({
        type: 'MaximumPairModal',
        children: (
          <Box
            sx={{
              padding: '24px',
              textAlign: 'center',
              background: '#ffffff',
              borderRadius: '14px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <img
                src='/images/icons/project-icons/status-alert-error.png'
                width={60}
                height={60}
                alt='role select error'
              />
              <Typography variant='body2'>
                You can select up to 10 at maximum.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }} mt={4}>
              <Button
                variant='contained'
                onClick={() => closeModal('MaximumPairModal')}
              >
                Okay
              </Button>
            </Box>
          </Box>
        ),
      })
      return
    }

    append({ source: '', target: '', priceFactor: null, minimumPrice: null })
  }

  const onChangePair = (
    id: string,
    value: any,
    item: 'source' | 'target' | 'priceFactor' | 'minimumPrice',
  ) => {
    const filtered = pairFields.filter(f => f.id! === id)[0]
    const index = pairFields.findIndex(f => f.id! === id)
    let newVal = { ...filtered, [item]: value }

    update(index, newVal)
    trigger('pair')
  }

  const onClickAction = (type: string) => {
    closeModal('addNewLanguagePairModal')
    if (type === 'Discard') {
      reset({
        pair: [
          { source: '', target: '', priceFactor: null, minimumPrice: null },
        ],
      })
    } else if (type === 'Add') {
      console.log('add')
    }
  }

  return (
    <Dialog
      open={true}
      keepMounted
      fullWidth
      onClose={() => {
        // setModal(null)
        onClose()
      }}
      // TransitionComponent={Transition}
      aria-labelledby='alert-dialog-slide-title'
      aria-describedby='alert-dialog-slide-description'
      maxWidth='md'
    >
      <DialogContent
        sx={{
          padding: '50px',
          position: 'relative',
        }}
      >
        <Typography variant='h5' sx={{ mb: '30px' }}>
          Set price unit
        </Typography>
      </DialogContent>
    </Dialog>
  )
}

export default SetPriceUnitModal
