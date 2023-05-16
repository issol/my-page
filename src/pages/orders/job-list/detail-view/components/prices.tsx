import { yupResolver } from '@hookform/resolvers/yup'
import { Autocomplete, Box, Card, Grid, TextField } from '@mui/material'
import { defaultOption } from '@src/pages/orders/add-new'
import { useGetPriceList } from '@src/queries/company/standard-price'
import { ItemType } from '@src/types/common/item.type'
import { StandardPriceListType } from '@src/types/common/standard-price'
import { itemSchema } from '@src/types/schema/item.schema'
import { addJobInfoFormSchema } from '@src/types/schema/job-detail'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

const Prices = () => {
  const { data: prices, isSuccess } = useGetPriceList({
    clientId: 7,
  })

  const [price, setPrice] = useState<
    | (StandardPriceListType & {
        groupName: string
      })
    | null
  >(null)

  const {
    control: itemControl,
    getValues: getItem,
    setValue: setItem,
    trigger: itemTrigger,
    reset: itemReset,
    formState: { errors: itemErrors, isValid: isItemValid },
  } = useForm<{ items: ItemType[] }>({
    mode: 'onBlur',
    defaultValues: { items: [] },
    resolver: yupResolver(itemSchema),
  })

  const {
    fields: items,
    append: appendItems,
    remove: removeItems,
    update: updateItems,
  } = useFieldArray({
    control: itemControl,
    name: 'items',
  })

  function getPriceOptions(source: string, target: string) {
    if (!isSuccess) return [defaultOption]
    const filteredList = prices
      .filter(item => {
        const matchingPairs = item.languagePairs.filter(
          pair => pair.source === source && pair.target === target,
        )
        return matchingPairs.length > 0
      })
      .map(item => ({
        groupName: item.isStandard ? 'Standard client price' : 'Matching price',
        ...item,
      }))
    return [defaultOption].concat(filteredList)
  }

  const options = getPriceOptions('en', 'ko')

  return (
    <Grid container xs={12} spacing={6} mb='20px'>
      <Grid item xs={6}>
        <Autocomplete
          fullWidth
          isOptionEqualToValue={(option, newValue) => {
            return option.value === newValue.value
          }}
          value={
            { value: 'English -> Korean', label: 'English -> Korean' } || {
              value: '',
              label: '',
            }
          }
          options={[
            {
              value: `English -> Korean`,
              label: 'English -> Korean',
            },
          ]}
          id='languagePair'
          getOptionLabel={option => option.label}
          disabled
          renderInput={params => (
            <TextField {...params} label='Language pair*' />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Autocomplete
          fullWidth
          value={price}
          options={options}
          groupBy={option => option?.groupName}
          onChange={(e, v) => {
            if (v) {
              setPrice(v)
            } else {
              setPrice(null)
            }
          }}
          id='autocomplete-controlled'
          getOptionLabel={option => option.priceName}
          renderInput={params => <TextField {...params} placeholder='Price*' />}
        />
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            border: ' 1px solid rgba(76, 78, 100, 0.22)',
            borderRadius: '10px',
            height: '482px',
            maxHeight: '482px',
          }}
        ></Box>
      </Grid>
    </Grid>
  )
}

export default Prices
