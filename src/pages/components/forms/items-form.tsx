// ** react
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'

// ** style component
import {
  Autocomplete,
  Box,
  Button,
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
  UseFieldArrayRemove,
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger,
  useFieldArray,
} from 'react-hook-form'

// ** types
import { ItemType } from '@src/types/common/item.type'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from '@src/views/forms/form-elements/pickers/PickersCustomInput'

// ** Date picker wrapper
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'

// ** types & validation
import { MemberType } from '@src/types/schema/project-team.schema'
import { languageType } from '@src/pages/orders/add-new'
import {
  PriceUnitListType,
  StandardPriceListType,
} from '@src/types/common/standard-price'

// ** helpers
import languageHelper from '@src/shared/helpers/language.helper'

// ** hooks
import useModal from '@src/hooks/useModal'
import { useDropzone } from 'react-dropzone'

// ** components
import DeleteConfirmModal from '@src/pages/client/components/modals/delete-confirm-modal'
import ItemPriceUnitForm from './item-price-unit-form'
import TmAnalysisForm from './tm-analysis-form'

import { AuthContext } from '@src/context/AuthContext'

import InfoConfirmModal from '@src/pages/client/components/modals/info-confirm-modal'

import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'

type Props = {
  control: Control<{ items: ItemType[] }, any>
  getValues: UseFormGetValues<{ items: ItemType[] }>
  setValue: UseFormSetValue<{ items: ItemType[] }>
  errors: FieldErrors<{ items: ItemType[] }>
  fields: FieldArrayWithId<{ items: ItemType[] }, 'items', 'id'>[]
  remove: UseFieldArrayRemove
  isValid: boolean
  teamMembers: Array<{ type: MemberType; id: number | null; name?: string }>
  languagePairs: languageType[]
  setLanguagePairs: Dispatch<SetStateAction<languageType[]>>
  getPriceOptions: (
    source: string,
    target: string,
  ) => Array<StandardPriceListType & { groupName: string }>
  priceUnitsList: Array<PriceUnitListType>
}

export type onCopyAnalysisParamType = {
  detailId: 'Total' | string
  prices: number
}
export default function ItemForm({
  control,
  getValues,
  setValue,
  errors,
  fields,
  remove,
  isValid,
  teamMembers,
  languagePairs,
  setLanguagePairs,
  getPriceOptions,
  priceUnitsList,
}: Props) {
  const { openModal, closeModal } = useModal()

  const defaultValue = { value: '', label: '' }
  const setValueOptions = { shouldDirty: true, shouldValidate: true }
  const [showMinimum, setShowMinimum] = useState({
    checked: false,
    show: false,
  })

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
    const copyLangPair = [...languagePairs]
    setValue(`items.${idx}.source`, v?.source ?? '', setValueOptions)
    setValue(`items.${idx}.target`, v?.target ?? '', setValueOptions)
    if (v?.price) {
      setValue(`items.${idx}.priceId`, v?.price?.id, setValueOptions)
    }

    setIsDeletable()
    function setIsDeletable() {
      if (v?.id) {
        const idx = languagePairs.map(item => item.id).indexOf(v.id)
        if (idx !== -1) {
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
            const index = findLangPairIndex(value.source, value.target)
            const copyLangPair = [...languagePairs]
            remove(idx)
            if (index !== -1) copyLangPair[index].isDeletable = true
          }}
        />
      ),
    })
  }

  function findLangPairIndex(source: string, target: string) {
    for (let i = 0; i < languagePairs.length; i++) {
      if (
        languagePairs[i].source === source &&
        languagePairs[i].target === target
      ) {
        return i
      }
    }
    return -1
  }

  const Row = ({ idx }: { idx: number }) => {
    const [cardOpen, setCardOpen] = useState(true)
    const itemData = getValues(`items.${idx}`)

    /* price unit */
    const itemName: `items.${number}.detail` = `items.${idx}.detail`
    const priceData =
      languagePairs.find(item => itemData?.priceId === item?.price?.id)
        ?.price ?? null
    const sourceLanguage = getValues(`items.${idx}.source`)
    const targetLanguage = getValues(`items.${idx}.target`)
    const languagePairData = priceData?.languagePairs?.find(
      i => i.source === sourceLanguage && i.target === targetLanguage,
    )
    const minimumPrice = languagePairData?.minimumPrice
    const priceFactor = languagePairData?.priceFactor

    const {
      fields: details,
      append,
      update,
      remove,
    } = useFieldArray({
      control,
      name: itemName,
    })

    function onDeletePriceUnit(idx: number, title: string) {
      openModal({
        type: 'delete-unit',
        children: (
          <DeleteConfirmModal
            message='Are you sure you want to delete this price unit?'
            title={title}
            onClose={() => closeModal('delete-unit')}
            onDelete={() => remove(idx)}
          />
        ),
      })
    }

    function getTotalPrice() {
      let total = 0
      const data = getValues(itemName)
      if (data?.length) {
        const price = data.reduce((res, item) => (res = +item.prices), 0)
        if (minimumPrice && showMinimum.show && price < minimumPrice) {
          data.forEach(item => {
            total += item.unit === 'Percent' ? Number(item.prices) : 0
          })
          total += minimumPrice
        } else {
          total = price
        }
      }

      setValue(`items.${idx}.totalPrice`, total, {
        shouldDirty: true,
        shouldValidate: true,
      })
    }

    function getEachPrice(index: number) {
      const data = getValues(itemName)
      if (!data?.length) return
      let prices = 0
      const detail = data?.[index]
      if (detail && detail.unit === 'Percent') {
        const percentQuantity = data[index].quantity
        if (minimumPrice && showMinimum.show) {
          prices = (percentQuantity / 100) * minimumPrice
        } else {
          const generalPrices = data.filter(item => item.unit !== 'Percent')
          generalPrices.forEach(item => {
            prices += item.unitPrice
          })
          prices *= percentQuantity / 100
        }
      } else {
        prices = detail.unitPrice * detail.quantity
      }
      setValue(`items.${idx}.detail.${index}.prices`, prices, {
        shouldDirty: true,
        shouldValidate: true,
      })
    }

    function onItemBoxLeave() {
      const isMinimumPriceConfirmed =
        !!minimumPrice &&
        minimumPrice > getValues(`items.${idx}.totalPrice`) &&
        showMinimum.checked

      const isNotMinimum =
        !minimumPrice || minimumPrice <= getValues(`items.${idx}.totalPrice`)

      if (!isMinimumPriceConfirmed && !isNotMinimum) {
        setShowMinimum({ ...showMinimum, show: true })
        openModal({
          type: 'info-minimum',
          children: (
            <InfoConfirmModal
              onClose={() => {
                closeModal('info-minimum')
                setShowMinimum({ show: true, checked: true })
              }}
              message='The minimum price has been applied to the item(s).'
            />
          ),
        })
      }
      getTotalPrice()
    }

    /* tm analysis */
    function onCopyAnalysis(data: onCopyAnalysisParamType[]) {
      const availableData = data.filter(
        item => item.detailId !== 'Total' && item.detailId !== undefined,
      )
      const total = data.find(item => item.detailId === 'Total')?.prices
      if (!availableData.length) return
      availableData.forEach(data => {
        const idx = details.map(item => item.id).indexOf(data.detailId)
        if (idx !== -1) {
          update(idx, { ...details[idx], prices: data.prices })
        }
      })
      if (total) {
        setValue(`items.${idx}.totalPrice`, total, {
          shouldDirty: true,
          shouldValidate: true,
        })
      }
    }

    return (
      <Box
        style={{
          border: '1px solid #F5F5F7',
          borderRadius: '8px',
          marginBottom: '14px',
        }}
      >
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
                <Typography fontWeight={500}>
                  {idx + 1 <= 10 ? `0${idx + 1}.` : `${idx + 1}.`}
                </Typography>
              </Box>
              <IconButton onClick={() => onItemRemove(idx)}>
                <Icon icon='mdi:trash-outline' />
              </IconButton>
            </Box>
          </Grid>
          {cardOpen ? (
            <>
              <Grid item xs={12}>
                <Controller
                  name={`items.${idx}.name`}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
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
                          onChangeLanguagePair(v, idx)
                        }}
                        value={
                          !value
                            ? null
                            : languagePairs.find(
                                item =>
                                  item.source === value &&
                                  item.target ===
                                    getValues(`items.${idx}.target`),
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
                        onChange={(e, v) => {
                          onChange(v?.id)
                          const value = getValues().items[idx]
                          if (v) {
                            const index = findLangPairIndex(
                              value?.source!,
                              value?.target!,
                            )
                            if (index !== -1) {
                              const copyLangPair = [...languagePairs]
                              copyLangPair[index].price = v
                              setLanguagePairs(copyLangPair)
                            }
                          }
                        }}
                        value={
                          value === null
                            ? null
                            : options.find(item => item.id === value)
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
              {/* price unit start */}
              <ItemPriceUnitForm
                control={control}
                index={idx}
                minimumPrice={minimumPrice}
                details={details}
                priceData={priceData}
                getValues={getValues}
                append={append}
                update={update}
                getTotalPrice={getTotalPrice}
                getEachPrice={getEachPrice}
                onDeletePriceUnit={onDeletePriceUnit}
                onItemBoxLeave={onItemBoxLeave}
                isValid={
                  !!itemData.source &&
                  !!itemData.target &&
                  (!!itemData.priceId || itemData.priceId === NOT_APPLICABLE)
                }
                isNotApplicable={itemData.priceId === NOT_APPLICABLE}
                priceUnitsList={priceUnitsList}
                showMinimum={showMinimum}
                setShowMinimum={setShowMinimum}
              />
              {/* price unit end */}
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
              <Grid item xs={12}>
                <TmAnalysisForm
                  control={control}
                  index={idx}
                  details={details}
                  priceData={priceData}
                  priceFactor={priceFactor}
                  onCopyAnalysis={onCopyAnalysis}
                />
              </Grid>
              {/* TM analysis */}
            </>
          ) : null}
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
        Items ({fields.length ?? 0})
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
