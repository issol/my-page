import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  TextField,
  Typography,
} from '@mui/material'
import CustomModalV2 from '@src/@core/components/common-modal/custom-modal-v2'
import { updateProSecondaryLanguages } from '@src/apis/pro/pro-details.api'
import useModal from '@src/hooks/useModal'
import { getGloLanguage } from '@src/shared/transformer/language.transformer'
import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'

type Props = {
  secondaryLanguages: {
    value: string
    label: string
  }[]
  onClose: any
  userId: number
}

const EditSecondaryLanguagesModal = ({
  secondaryLanguages,
  onClose,
  userId,
}: Props) => {
  const { openModal, closeModal } = useModal()
  const languageList = getGloLanguage()
  const queryClient = useQueryClient()

  const [selectedLanguages, setSelectedLanguages] =
    useState<Array<{ value: string; label: string }>>(secondaryLanguages)

  const updateSecondaryLanguages = useMutation(
    (languages: string[]) => updateProSecondaryLanguages(userId, languages),
    {
      onSuccess: () => {
        onClose()
        queryClient.invalidateQueries(['proSecondaryLanguages'])
      },
    },
  )

  return (
    <Box
      sx={{
        maxWidth: '420px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
      }}
    >
      <Box
        sx={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <Typography fontSize={20} fontWeight={500}>
          Secondary languages
        </Typography>
        <Box>
          <Autocomplete
            multiple
            fullWidth
            options={languageList}
            value={selectedLanguages}
            onChange={(e, v) => {
              if (v && v.length > 10) {
                openModal({
                  type: 'MaximumError',
                  children: (
                    <CustomModalV2
                      title='Maximum number exceeded'
                      subtitle='You can select up to 10 languages.'
                      soloButton
                      rightButtonText='Okay'
                      onClick={() => {
                        closeModal('MaximumError')
                        let result = v
                        result.pop()

                        setSelectedLanguages(result)
                      }}
                      onClose={() => {
                        closeModal('MaximumError')
                      }}
                      vary='error'
                    />
                  ),
                })
              } else {
                setSelectedLanguages(v)
              }
            }}
            getOptionLabel={option => option.label}
            isOptionEqualToValue={(option, newValue) => {
              return option.value === newValue.value
            }}
            disableCloseOnSelect
            limitTags={1}
            renderInput={params => <TextField {...params} autoComplete='off' />}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox checked={selected} sx={{ mr: 2 }} />
                {option.label}
              </li>
            )}
          />
        </Box>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <Button variant='outlined' onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              updateSecondaryLanguages.mutate(
                selectedLanguages.map(lang => lang.value),
              )
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default EditSecondaryLanguagesModal
