import { Fragment, useEffect, useState } from 'react'

// ** style component
import {
  Autocomplete,
  Box,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import styled from 'styled-components'
import { Icon } from '@iconify/react'

// ** react hook form
import {
  Control,
  Controller,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'

// ** types
import { ItemType } from '@src/types/common/item.type'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from '@src/views/forms/form-elements/pickers/PickersCustomInput'

// ** Date picker wrapper
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import { MemberType } from '@src/types/schema/project-team.schema'

type Props = {
  control: Control<{ items: ItemType[] }, any>
  getValues: UseFormGetValues<{ items: ItemType[] }>
  setValue: UseFormSetValue<{ items: ItemType[] }>
  watch: UseFormWatch<{ items: ItemType[] }>
  errors: FieldErrors<{ items: ItemType[] }>
  fields: FieldArrayWithId<{ items: ItemType[] }, 'items', 'id'>[]
  append: UseFieldArrayAppend<{ items: ItemType[] }, 'items'>
  remove: UseFieldArrayRemove
  update: UseFieldArrayUpdate<{ items: ItemType[] }, 'items'>
  isValid: boolean
  teamMembers: Array<{ type: MemberType; id: number | null; name?: string }>
}
export default function ItemForm({
  control,
  getValues,
  setValue,
  watch,
  errors,
  fields,
  append,
  remove,
  update,
  isValid,
  teamMembers,
}: Props) {
  const defaultValue = { value: '', label: '' }

  const [contactPersonList, setContactPersonList] = useState<
    { value: string; label: string }[]
  >([])

  useEffect(() => {
    if (teamMembers.length) {
      const list = teamMembers
        .filter(item => item.id !== null)
        .map(item => ({
          value: item?.id?.toString()!,
          label: item.name || '',
        }))
      setContactPersonList(list)
    }
  }, [teamMembers])

  const Row = ({ idx }: { idx: number }) => {
    const [cardOpen, setCardOpen] = useState(true)
    return (
      <Box style={{ border: '1px solid #F5F5F7', borderRadius: '8px' }}>
        <Grid container spacing={6} padding='14px'>
          <Grid item xs={12}>
            <Box
              display='flex'
              alignItems='center'
              justifyContent='space-between'
            >
              <Box display='flex' alignItems='center' gap='8px'>
                <IconButton onClick={() => setCardOpen(!cardOpen)}>
                  <Icon
                    icon={`${
                      cardOpen
                        ? 'material-symbols:keyboard-arrow-up'
                        : 'material-symbols:keyboard-arrow-down'
                    }`}
                  />
                </IconButton>
                <Typography fontWeight={500}>01.</Typography>
              </Box>
              <IconButton onClick={() => remove(idx)}>
                <Icon icon='mdi:trash-outline' />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Controller
              name={`items.${idx}.name`}
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  autoFocus
                  label='Item name*'
                  variant='outlined'
                  value={value ?? ''}
                  onChange={onChange}
                  inputProps={{ maxLength: 200 }}
                  error={Boolean(errors?.items?.[idx]?.name)}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name={`items.${idx}.dueAt`}
              control={control}
              render={({ field: { value, onChange } }) => (
                <FullWidthDatePicker
                  showTimeSelect
                  timeFormat='HH:mm'
                  timeIntervals={15}
                  selected={!value ? null : new Date(value)}
                  dateFormat='MM/dd/yyyy h:mm aa'
                  onChange={onChange}
                  customInput={<CustomInput label='Item due date*' />}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name={`items.${idx}.contactPersonId`}
              control={control}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  autoHighlight
                  fullWidth
                  options={contactPersonList}
                  onChange={(e, v) => {
                    onChange(v?.value ?? '')
                  }}
                  value={
                    !value
                      ? defaultValue
                      : contactPersonList.find(
                          item => item.value === value.toString(),
                        )
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      error={Boolean(errors?.items?.[idx]?.contactPersonId)}
                      label='Contact person for job*'
                      placeholder='Contact person for job*'
                    />
                  )}
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>
    )
  }

  return (
    <DatePickerWrapper>
      <Grid
        item
        xs={12}
        display='flex'
        padding='24px'
        alignItems='center'
        justifyContent='space-between'
        sx={{ background: '#F5F5F7', marginBottom: '24px' }}
      >
        Items (1)
      </Grid>
      {fields.map((item, idx) => (
        <Row key={item.id} idx={idx} />
      ))}
    </DatePickerWrapper>
  )
}

const FullWidthDatePicker = styled(DatePicker)`
  width: 100%;
`
