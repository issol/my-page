import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { getLinguistTeamProColumns } from '@src/shared/const/columns/linguist-team'
import { LinguistTeamFormType } from '@src/types/pro/linguist-team'
import {
  Control,
  Controller,
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger,
} from 'react-hook-form'

type Props = {
  onClickSelectProsHelperIcon: () => void
  setValue: UseFormSetValue<LinguistTeamFormType>
  fields: FieldArrayWithId<LinguistTeamFormType, 'pros', 'id'>[]
  append: UseFieldArrayAppend<LinguistTeamFormType, 'pros'>
  control: Control<LinguistTeamFormType, any>
  trigger: UseFormTrigger<LinguistTeamFormType>
  getValues: UseFormGetValues<LinguistTeamFormType>
  onClickAddPros: () => void
}

const SelectPro = ({
  onClickSelectProsHelperIcon,
  fields,
  append,
  setValue,
  control,
  trigger,
  getValues,
  onClickAddPros,
}: Props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          padding: '32px 20px 20px 20px',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Typography fontSize={20} fontWeight={500}>
            Select Pros (0)
          </Typography>
          <IconButton sx={{ padding: 0 }} onClick={onClickSelectProsHelperIcon}>
            <Icon icon='mdi:info-circle-outline' />
          </IconButton>
        </Box>
        <Box>
          <Controller
            name='isPriority'
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    value={field.value}
                    onChange={(e, v) => {
                      field.onChange(v)
                      trigger('isPriority')
                    }}
                  />
                }
                label='Priority mode'
                sx={{
                  '& .MuiTypography-body1': {
                    fontSize: 14,
                  },
                }}
              />
            )}
          />
        </Box>
      </Box>
      <Box sx={{ height: '100%' }}>
        <DataGrid
          sx={{ height: '56px !important' }}
          autoHeight
          rows={[]}
          components={{
            NoRowsOverlay: () => <></>,
            NoResultsOverlay: () => <></>,
          }}
          columns={getLinguistTeamProColumns(getValues('isPriority'))}
          hideFooter
        />
        {fields.length > 0 ? (
          <Box> </Box>
        ) : (
          <Box sx={{ background: '#F7F8FF', height: '100%' }}>
            <Box
              sx={{
                width: '100%',

                display: 'flex',
                paddingTop: '32px',
                justifyContent: 'center',
              }}
            >
              <Button
                sx={{
                  color: '#8D8E9A',
                  '&:hover': {
                    background: 'inherit',
                  },
                }}
                onClick={onClickAddPros}
              >
                + Add Pros
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default SelectPro
