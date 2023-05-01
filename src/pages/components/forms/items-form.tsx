import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react'

// ** style component
import {
  Autocomplete,
  Box,
  Divider,
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
import { languageType } from '@src/pages/orders/add-new'
import { StandardPriceListType } from '@src/types/common/standard-price'
import languageHelper from '@src/shared/helpers/language.helper'
import useModal from '@src/hooks/useModal'
import DeleteConfirmModal from '@src/pages/client/components/modals/delete-confirm-modal'

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

  languagePairs: languageType[]
  setLanguagePairs: Dispatch<SetStateAction<languageType[]>>
  getPriceOptions: (
    source: string,
    target: string,
  ) => Array<StandardPriceListType & { groupName: string }>
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
  languagePairs,
  setLanguagePairs,
  getPriceOptions,
}: Props) {
  const { openModal, closeModal } = useModal()
  const defaultValue = { value: '', label: '' }
  const setValueOptions = { shouldDirty: true, shouldValidate: true }

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

  function onChangeLanguagePair(v: languageType | null, idx: number) {
    setValue(`items.${idx}.target`, v?.target ?? '', setValueOptions)
    if (v?.price) {
      setValue(`items.${idx}.priceId`, v?.price?.id, setValueOptions)
    }
    setIsDeletable()
    function setIsDeletable() {
      if (v?.id) {
        const idx = languagePairs.map(item => item.id).indexOf(v.id)
        if (idx !== -1) {
          const copyLangPair = [...languagePairs]
          copyLangPair[idx].isDeletable = false
          setLanguagePairs([...copyLangPair])
        }
      }
    }
  }

  function onItemRemove(idx: number) {
    const value = getValues(`items.${idx}`)
    openModal({
      type: 'delete-item',
      children: (
        <DeleteConfirmModal
          message='Are you sure you want to delete this item?'
          onClose={() => closeModal('delete-item')}
          onDelete={() => {
            const index = findIndex()
            const copyLangPair = [...languagePairs]
            copyLangPair[index].isDeletable = true
            remove(idx)
          }}
        />
      ),
    })

    function findIndex() {
      for (let i = 0; i < languagePairs.length; i++) {
        if (
          languagePairs[i].source === value.source &&
          languagePairs[i].target === value.target
        ) {
          return i
        }
      }
      return -1
    }
  }

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
              <IconButton onClick={() => onItemRemove(idx)}>
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
          <Grid item xs={6}>
            <Controller
              name={`items.${idx}.source`}
              control={control}
              render={({ field: { value, onChange } }) => {
                return (
                  <Autocomplete
                    autoHighlight
                    fullWidth
                    options={languagePairs.sort((a, b) =>
                      a.source.localeCompare(b.source),
                    )}
                    getOptionLabel={option =>
                      `${languageHelper(option.source)} -> ${languageHelper(
                        option.target,
                      )}`
                    }
                    onChange={(e, v) => {
                      onChange(v?.source ?? '')
                      onChangeLanguagePair(v, idx)
                    }}
                    value={
                      !value
                        ? null
                        : languagePairs.find(
                            item =>
                              item.source === value &&
                              item.target === getValues(`items.${idx}.target`),
                          )
                    }
                    renderInput={params => (
                      <TextField
                        {...params}
                        error={Boolean(errors?.items?.[idx]?.source)}
                        label='Language pair*'
                        placeholder='Language pair*'
                      />
                    )}
                  />
                )
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name={`items.${idx}.priceId`}
              control={control}
              render={({ field: { value, onChange } }) => {
                const options = getPriceOptions(
                  getValues(`items.${idx}.source`),
                  getValues(`items.${idx}.target`),
                )
                const matchingPrice = options.find(
                  item => item.groupName === 'Matching price',
                )
                if (matchingPrice) {
                  onChange(matchingPrice.id)
                }
                return (
                  <Autocomplete
                    autoHighlight
                    fullWidth
                    options={options}
                    groupBy={option => option?.groupName}
                    getOptionLabel={option => option.priceName}
                    onChange={(e, v) => onChange(v?.id)}
                    value={
                      !value ? null : options.find(item => item.id === value)
                    }
                    renderInput={params => (
                      <TextField
                        {...params}
                        error={Boolean(errors?.items?.[idx]?.priceId)}
                        label='Price*'
                        placeholder='Price*'
                      />
                    )}
                  />
                )
              }}
            />
          </Grid>
          {/* price unit */}
          {/* price unit */}

          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h6' mb='24px'>
              Item description
            </Typography>
            <Controller
              name={`items.${idx}.description`}
              control={control}
              render={({ field: { value, onChange } }) => {
                return (
                  <>
                    <TextField
                      rows={4}
                      multiline
                      fullWidth
                      label='Write down an item description.'
                      value={value ?? ''}
                      onChange={onChange}
                      inputProps={{ maxLength: 500 }}
                    />
                    <Typography variant='body2' mt='12px' textAlign='right'>
                      {value?.length ?? 0}/500
                    </Typography>
                  </>
                )
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          {/* TM analysis */}
          {/* TM analysis */}
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
