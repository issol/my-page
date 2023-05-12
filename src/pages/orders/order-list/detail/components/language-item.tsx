import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import EditSaveModal from '@src/@core/components/common-modal/edit-save-modal'
import Icon from '@src/@core/components/icon'
import { patchItemsForOrder, patchLangPairForOrder } from '@src/apis/order.api'
import useModal from '@src/hooks/useModal'
import AddLanguagePairForm from '@src/pages/components/forms/add-language-pair-form'
import ItemForm from '@src/pages/components/forms/items-form'
import { defaultOption, languageType } from '@src/pages/orders/add-new'
import { useGetPriceList } from '@src/queries/company/standard-price'
import { useGetLangItem } from '@src/queries/order/order.query'
import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'
import { ItemType, PostItemType } from '@src/types/common/item.type'
import { LanguagePairsType } from '@src/types/common/orders-and-quotes.type'
import {
  PriceUnitListType,
  StandardPriceListType,
} from '@src/types/common/standard-price'
import { LanguageAndItemType } from '@src/types/orders/order-detail'
import { itemSchema } from '@src/types/schema/item.schema'
import { ProjectTeamType } from '@src/types/schema/project-team.schema'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger,
  useForm,
} from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'

type Props = {
  langItem: LanguageAndItemType
  languagePairs: Array<languageType>
  setLanguagePairs: Dispatch<SetStateAction<Array<languageType>>>
  clientId: number
  itemControl: Control<
    {
      items: ItemType[]
    },
    any
  >
  getItem: UseFormGetValues<{
    items: ItemType[]
  }>
  setItem: UseFormSetValue<{
    items: ItemType[]
  }>
  itemTrigger: UseFormTrigger<{
    items: ItemType[]
  }>
  itemErrors: FieldErrors<{
    items: ItemType[]
  }>
  isItemValid: boolean
  priceUnitsList: PriceUnitListType[]
  items: FieldArrayWithId<
    {
      items: ItemType[]
    },
    'items',
    'id'
  >[]
  removeItems: UseFieldArrayRemove
  getTeamValues: UseFormGetValues<ProjectTeamType>
  projectTax: number
  appendItems: UseFieldArrayAppend<
    {
      items: ItemType[]
    },
    'items'
  >
  orderId: number
  setLangItemsEdit: Dispatch<SetStateAction<boolean>>
  langItemsEdit: boolean
}

const LanguageAndItem = ({
  langItem,
  clientId,
  languagePairs,
  setLanguagePairs,
  itemControl,
  getItem,
  setItem,
  itemTrigger,
  itemErrors,
  isItemValid,
  priceUnitsList,
  items,
  removeItems,
  getTeamValues,
  projectTax,
  appendItems,
  orderId,
  setLangItemsEdit,
  langItemsEdit,
}: Props) => {
  const { openModal, closeModal } = useModal()
  const queryClient = useQueryClient()
  const { data: prices, isSuccess } = useGetPriceList({
    clientId: clientId,
  })

  const [tax, setTax] = useState(projectTax)

  const patchLanguagePairs = useMutation(
    (data: { id: number; langPair: LanguagePairsType[] }) =>
      patchLangPairForOrder(data.id, data.langPair),
  )

  const patchItems = useMutation(
    (data: { id: number; items: PostItemType[] }) =>
      patchItemsForOrder(data.id, data.items),
  )

  const handleBack = () => {
    setLangItemsEdit(false)
  }

  const onSubmit = () => {
    const items: PostItemType[] = getItem().items.map(item => ({
      ...item,
      analysis: item.analysis?.map(anal => anal?.data?.id!) || [],
    }))
    const langs: LanguagePairsType[] = languagePairs.map(item => {
      if (item?.price?.id) {
        return {
          source: item.source,
          target: item.target,
          priceId: item.price.id,
        }
      }
      return {
        source: item.source,
        target: item.target,
      }
    })

    patchLanguagePairs.mutate(
      { id: orderId, langPair: langs },
      {
        onSuccess: () => {
          patchItems.mutate(
            { id: orderId, items: items },
            {
              onSuccess: () => {
                setLangItemsEdit(false)
                queryClient.invalidateQueries(`LangItem-${orderId}`)
                closeModal('LanguageAndItemEditModal')
              },
            },
          )
        },
      },
    )
  }

  const onClickSave = () => {
    openModal({
      type: 'LanguageAndItemEditModal',
      children: (
        <EditSaveModal
          onClose={() => closeModal('LanguageAndItemEditModal')}
          onClick={onSubmit}
        />
      ),
    })
  }

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
    const teamMembers = getTeamValues()?.teams
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
          <IconButton onClick={() => setLangItemsEdit(!langItemsEdit)}>
            <Icon icon='mdi:pencil-outline' />
          </IconButton>
        </Box>
        <Grid item xs={12}>
          <AddLanguagePairForm
            languagePairs={languagePairs}
            setLanguagePairs={setLanguagePairs}
            getPriceOptions={getPriceOptions}
            type={langItemsEdit ? 'edit' : 'detail'}
          />
        </Grid>
        <Grid item xs={12} mt={6} mb={6}>
          <ItemForm
            control={itemControl}
            getValues={getItem}
            setValue={setItem}
            errors={itemErrors}
            fields={items}
            remove={removeItems}
            isValid={isItemValid}
            teamMembers={getTeamValues()?.teams}
            languagePairs={languagePairs}
            setLanguagePairs={setLanguagePairs}
            getPriceOptions={getPriceOptions}
            priceUnitsList={priceUnitsList || []}
            type={langItemsEdit ? 'edit' : 'detail'}
          />
        </Grid>
        {langItemsEdit ? (
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
        ) : null}

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
            {langItemsEdit ? (
              <>
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
              </>
            ) : (
              <Box>{tax} %</Box>
            )}
          </Box>
        </Grid>
        {langItemsEdit ? (
          <Grid item xs={12}>
            <Box
              sx={{ display: 'flex', gap: '16px', justifyContent: 'center' }}
            >
              <Button variant='outlined' color='secondary' onClick={handleBack}>
                Cancel
              </Button>
              <Button
                variant='contained'
                disabled={!isItemValid}
                onClick={onClickSave}
              >
                Save
              </Button>
            </Box>
          </Grid>
        ) : null}
      </Grid>
    </Card>
  )
}

export default LanguageAndItem
