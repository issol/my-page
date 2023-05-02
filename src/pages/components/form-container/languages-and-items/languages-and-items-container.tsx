import {
  Box,
  Button,
  CardContent,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import AddLanguagePairForm from '../../forms/add-language-pair-form'
import { Dispatch, SetStateAction } from 'react'
import { languageType } from '@src/pages/orders/add-new'
import { useGetPriceList } from '@src/queries/company/standard-price'
import { Icon } from '@iconify/react'
import ItemForm from '../../forms/items-form'
import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from 'react-hook-form'
import { ItemType } from '@src/types/common/item.type'
import { MemberType } from '@src/types/schema/project-team.schema'
import { getPriceList } from '@src/apis/company-price.api'
import { StandardPriceListType } from '@src/types/common/standard-price'

type Props = {
  tax: number
  setTax: (n: number) => void
  languagePairs: languageType[]
  setLanguagePairs: Dispatch<SetStateAction<languageType[]>>
  clientId: number | null
  itemControl: Control<{ items: ItemType[] }, any>
  getItem: UseFormGetValues<{ items: ItemType[] }>
  setItem: UseFormSetValue<{ items: ItemType[] }>
  itemWatch: UseFormWatch<{ items: ItemType[] }>
  itemErrors: FieldErrors<{ items: ItemType[] }>
  items: FieldArrayWithId<{ items: ItemType[] }, 'items', 'id'>[]
  appendItems: UseFieldArrayAppend<{ items: ItemType[] }, 'items'>
  removeItems: UseFieldArrayRemove
  updateItems: UseFieldArrayUpdate<{ items: ItemType[] }, 'items'>
  isItemValid: boolean
  teamMembers: Array<{ type: MemberType; id: number | null; name?: string }>
  handleBack: () => void
  trigger: UseFormTrigger<{ items: ItemType[] }>
}

export const NOT_APPLICABLE_PRICE = -0
export const defaultOption: StandardPriceListType & { groupName: string } = {
  id: NOT_APPLICABLE_PRICE,
  isStandard: false,
  priceName: 'Not applicable',
  groupName: 'Not applicable',
  category: '',
  serviceType: [],
  currency: 'USD',
  catBasis: '',
  decimalPlace: 0,
  roundingProcedure: '',
  languagePairs: [],
  priceUnit: [],
  catInterface: { memSource: [], memoQ: [] },
}

export default function LanguagesAndItemsContainer({
  tax,
  setTax,
  languagePairs,
  setLanguagePairs,
  clientId,
  itemControl,
  getItem,
  setItem,
  itemWatch,
  itemErrors,
  items,
  appendItems,
  removeItems,
  updateItems,
  isItemValid,
  teamMembers,
  handleBack,
  trigger,
}: Props) {
  const { data: prices, isSuccess } = useGetPriceList({ clientId: clientId! })

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

  function isAddItemDisabled(): boolean {
    if (!languagePairs.length) return true
    return languagePairs.some(item => !item?.price)
  }

  function addNewItem() {
    const projectManager = teamMembers.find(
      item => item.type === 'projectManagerId',
    )
    appendItems({
      name: '',
      source: '',
      target: '',
      contactPersonId: projectManager?.id!,
      priceId: null,
      detail: [],
      totalPrice: 0,
    })
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <AddLanguagePairForm
          languagePairs={languagePairs}
          setLanguagePairs={setLanguagePairs}
          getPriceOptions={getPriceOptions}
        />
      </Grid>
      <Grid item xs={12} mt={6} mb={6}>
        <ItemForm
          control={itemControl}
          getValues={getItem}
          setValue={setItem}
          watch={itemWatch}
          errors={itemErrors}
          fields={items}
          append={appendItems}
          remove={removeItems}
          update={updateItems}
          isValid={isItemValid}
          teamMembers={teamMembers}
          languagePairs={languagePairs}
          setLanguagePairs={setLanguagePairs}
          getPriceOptions={getPriceOptions}
          trigger={trigger}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          startIcon={<Icon icon='material-symbols:add' />}
          disabled={isAddItemDisabled()}
          onClick={addNewItem}
        >
          <Typography
            color={isAddItemDisabled() ? 'secondary' : 'primary'}
            sx={{ textDecoration: 'underline' }}
          >
            Add new item
          </Typography>
        </Button>
      </Grid>
      <Grid
        item
        xs={12}
        display='flex'
        padding='24px'
        alignItems='center'
        justifyContent='space-between'
        mt={6}
        mb={6}
        sx={{ background: '#F5F5F7', marginBottom: '24px' }}
      >
        <Typography>Tax</Typography>
        <Box display='flex' alignItems='center' gap='4px'>
          <TextField
            size='small'
            type='number'
            value={tax}
            sx={{ maxWidth: '120px', padding: 0 }}
            inputProps={{ inputMode: 'decimal' }}
            onChange={e => {
              if (e.target.value.length > 10) return
              setTax(Number(e.target.value))
            }}
          />
          %
        </Box>
      </Grid>
      <Grid item xs={12} display='flex' justifyContent='space-between'>
        <Button variant='outlined' color='secondary' onClick={handleBack}>
          <Icon icon='material-symbols:arrow-back-rounded' />
          Previous
        </Button>
        <Button
          variant='contained'
          disabled={!isItemValid} /* onClick={onNextStep} */
        >
          Save
        </Button>
      </Grid>
    </Grid>
  )
}
