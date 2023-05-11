import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Card, Grid, IconButton } from '@mui/material'
import Icon from '@src/@core/components/icon'
import AddLanguagePairForm from '@src/pages/components/forms/add-language-pair-form'
import { defaultOption, languageType } from '@src/pages/orders/add-new'
import { useGetPriceList } from '@src/queries/company/standard-price'
import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'
import { ItemType } from '@src/types/common/item.type'
import { StandardPriceListType } from '@src/types/common/standard-price'
import { itemSchema } from '@src/types/schema/item.schema'
import { Dispatch, SetStateAction, useState } from 'react'
import { useForm } from 'react-hook-form'

type Props = {
  languagePairs: Array<languageType>
  setLanguagePairs: Dispatch<SetStateAction<languageType[]>>
  items: ItemType[]
  getPriceOptions: (
    source: string,
    target: string,
  ) => (StandardPriceListType & {
    groupName: string
  })[]
}

const LanguageAndItem = ({
  languagePairs,
  setLanguagePairs,
  items,
  getPriceOptions,
}: Props) => {
  console.log(languagePairs)

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

  return (
    <Card sx={{ padding: '24px' }}>
      <Grid xs={12} container>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Button
            variant='outlined'
            sx={{ display: 'flex', gap: '8px', mb: '24px' }}
          >
            <Icon icon='ic:baseline-splitscreen' />
            Split Order
          </Button>
          <IconButton>
            <Icon icon='mdi:pencil-outline' />
          </IconButton>
        </Box>
        <Grid item xs={12}>
          <AddLanguagePairForm
            languagePairs={languagePairs}
            setLanguagePairs={setLanguagePairs}
            getPriceOptions={getPriceOptions}
            type='detail'
          />
        </Grid>
      </Grid>
    </Card>
  )
}

export default LanguageAndItem
