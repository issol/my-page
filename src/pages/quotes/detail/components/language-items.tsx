import { Dispatch, SetStateAction, useState, useEffect, useMemo } from 'react'

// ** style components
import {
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import styled from 'styled-components'
import { Icon } from '@iconify/react'

// ** components
import AddLanguagePairForm from '@src/pages/components/forms/add-language-pair-form'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'
import DeleteConfirmModal from '@src/pages/client/components/modals/delete-confirm-modal'
import ItemForm from '@src/pages/components/forms/items-form'

// ** types
import { defaultOption, languageType } from '@src/pages/orders/add-new'
import { ItemType } from '@src/types/common/item.type'
import { PriceUnitListType } from '@src/types/common/standard-price'
import { ProjectTeamType } from '@src/types/schema/project-team.schema'

// ** apis
import { useGetClientPriceList } from '@src/queries/company/standard-price'

// ** helpers
import languageHelper from '@src/shared/helpers/language.helper'

// ** hooks
import useModal from '@src/hooks/useModal'

// ** react hook form
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
import { UserRoleType } from '@src/context/types'
import {
  formatByRoundingProcedure,
  formatCurrency,
} from '@src/shared/helpers/price.helper'
import { ProjectInfoType } from '@src/types/common/quotes.type'

type Props = {
  // languagePairs: Array<languageType>
  setLanguagePairs: (languagePair: languageType[]) => void
  clientId: number | null
  priceUnitsList: PriceUnitListType[]
  itemControl: Control<
    {
      items: ItemType[]
      languagePairs: languageType[]
    },
    any
  >
  items: FieldArrayWithId<
    {
      items: ItemType[]
      languagePairs: languageType[]
    },
    'items',
    'id'
  >[]
  getItem: UseFormGetValues<{
    items: ItemType[]
    languagePairs: languageType[]
  }>
  setItem: UseFormSetValue<{
    items: ItemType[]
    languagePairs: languageType[]
  }>

  itemErrors: FieldErrors<{
    items: ItemType[]
    languagePairs: languageType[]
  }>
  isItemValid: boolean
  itemTrigger: UseFormTrigger<{
    items: ItemType[]
    languagePairs: languageType[]
  }>
  removeItems: UseFieldArrayRemove
  getTeamValues: UseFormGetValues<ProjectTeamType>
  appendItems: UseFieldArrayAppend<
    {
      items: ItemType[]
      languagePairs: languageType[]
    },
    'items'
  >
  tax: number | null
  setTax: (n: number | null) => void
  taxable: boolean
  setTaxable: (n: boolean) => void
  isEditMode: boolean
  setIsEditMode: (n: boolean) => void
  isUpdatable: boolean
  role: UserRoleType
  project?: ProjectInfoType
  appendLanguagePairs: UseFieldArrayAppend<
    {
      items: ItemType[]
      languagePairs: languageType[]
    },
    'languagePairs'
  >
  updateLanguagePairs: UseFieldArrayUpdate<
    {
      items: ItemType[]
      languagePairs: languageType[]
    },
    'languagePairs'
  >
  languagePairs: FieldArrayWithId<
    {
      items: ItemType[]
      languagePairs: languageType[]
    },
    'languagePairs',
    'id'
  >[]
}

export default function QuotesLanguageItemsDetail({
  languagePairs,
  setLanguagePairs,
  clientId,
  priceUnitsList,
  items,
  getItem,
  removeItems,
  setItem,
  itemErrors,
  isItemValid,
  itemControl,
  getTeamValues,
  appendItems,
  isEditMode,
  tax,
  setTax,
  taxable,
  setTaxable,
  setIsEditMode,
  isUpdatable,
  role,
  itemTrigger,
  project,
  appendLanguagePairs,
  updateLanguagePairs,
}: Props) {
  const { openModal, closeModal } = useModal()
  const { data: prices, isSuccess } = useGetClientPriceList({
    clientId: clientId,
  })
  // TODO: Item 처음 등록 후 Languages&Items 로딩시 items[0].priceId가 null인 경우가 있음
  const priceInfo = prices?.find(value => value.id === items[0]?.priceId)
  const [subtotal, setSubTotal] = useState(0)
  function sumTotalPrice() {
    // const subtotal = getItem()?.items!
    // const subtotal = items
    const subtotal = isEditMode ? getItem()?.items! : items
    if (subtotal) {
      const total = subtotal.reduce((accumulator, item) => {
        return accumulator + item.totalPrice
      }, 0)
      setSubTotal(total)
    }
  }
  useEffect(() => {
    sumTotalPrice()
  }, [items, setItem])

  function getPriceOptions(source: string, target: string, index?: number) {
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

    // Not Applicable Price 추가
    const finalList = [defaultOption].concat(filteredList)

    // // 기존 선택한 Price 값이 있다면 해당 값을 Current price 그룹으로 추가
    // if(index !== undefined && index >= 0 && items[index]?.initialPrice) {
    //   finalList.unshift({
    //     groupName: 'Current price',
    //     id: items[index].initialPrice?.priceId!,
    //     isStandard: items[index].initialPrice?.isStandard!,
    //     priceName: items[index].initialPrice?.name!,
    //     category: items[index].initialPrice?.category!,
    //     serviceType: items[index].initialPrice?.serviceType!,
    //     currency: items[index].initialPrice?.currency!,
    //     catBasis: items[index].initialPrice?.calculationBasis!,
    //     decimalPlace: items[index].initialPrice?.numberPlace!,
    //     roundingProcedure: String(items[index].initialPrice?.rounding),
    //     memoForPrice: items[index].initialPrice?.memo!,
    //     languagePairs: [],
    //     priceUnit: [],
    //   })
    // }

    return finalList
  }

  function onDeleteLanguagePair(row: languageType) {
    const isDeletable = !getItem()?.items?.length
      ? true
      : !getItem().items.some(
          item => item.source === row.source && item.target === row.target,
        )
    if (isDeletable) {
      openModal({
        type: 'delete-language',
        children: (
          <DeleteConfirmModal
            message='Are you sure you want to delete this language pair?'
            title={`${languageHelper(row.source)} → ${languageHelper(
              row.target,
            )}`}
            onDelete={deleteLanguage}
            onClose={() => closeModal('delete-language')}
          />
        ),
      })
    } else {
      openModal({
        type: 'cannot-delete-language',
        children: (
          <SimpleAlertModal
            message='This language pair cannot be deleted because it’s already being used in the item.'
            title={`${languageHelper(row.source)} → ${languageHelper(
              row.target,
            )}`}
            onClose={() => closeModal('cannot-delete-language')}
          />
        ),
      })
    }

    function deleteLanguage() {
      const idx = getItem('languagePairs')
        .map(item => item.id)
        .indexOf(row.id)

      const copyOriginal = [...getItem('languagePairs')]
      copyOriginal.splice(idx, 1)
      // setLanguagePairs([...copyOriginal])
      setItem('languagePairs', [...copyOriginal])
      itemTrigger('languagePairs')
    }
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
      itemName: '',
      source: '',
      target: '',
      contactPersonId: projectManager?.id!,
      priceId: null,
      detail: [],
      totalPrice: 0,
      showItemDescription: false,
      minimumPrice: null,
      minimumPriceApplied: false,
      priceFactor: 0,
      currency: null,
    })
  }
  // console.log(isEditMode)

  return (
    <Grid container>
      <Grid item xs={12} display='flex' justifyContent='flex-end'>
        {isUpdatable && !isEditMode ? (
          <IconButton onClick={() => setIsEditMode(!isEditMode)}>
            <Icon icon='mdi:pencil-outline' />
          </IconButton>
        ) : null}
      </Grid>
      {/* languages */}
      {role.name === 'CLIENT' ? null : (
        <Grid item xs={12} mt={6}>
          <AddLanguagePairForm
            getItem={getItem}
            setLanguagePairs={(languagePair: languageType[]) =>
              setItem('languagePairs', languagePair)
            }
            getPriceOptions={getPriceOptions}
            type={isEditMode ? 'edit' : 'detail'}
            onDeleteLanguagePair={onDeleteLanguagePair}
            items={items}
            control={itemControl}
            languagePairs={languagePairs}
            append={appendLanguagePairs}
            update={updateLanguagePairs}
            itemTrigger={itemTrigger}
            from='quote'
          />
        </Grid>
      )}

      {/* items */}
      <Grid item xs={12} mt={6} mb={6}>
        <ItemForm
          control={itemControl}
          getValues={getItem}
          setValue={setItem}
          errors={itemErrors}
          fields={items}
          remove={removeItems}
          teamMembers={getTeamValues()?.teams}
          languagePairs={getItem('languagePairs')}
          getPriceOptions={getPriceOptions}
          priceUnitsList={priceUnitsList || []}
          type={isEditMode ? 'edit' : 'detail'}
          itemTrigger={itemTrigger}
          sumTotalPrice={sumTotalPrice}
          from='quote'
        />
      </Grid>

      {isEditMode ? (
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
      {/* subtotal */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box
            sx={{
              display: 'flex',
              gap: '20px',
              borderBottom: '2px solid #666CFF',
              justifyContent: 'center',
              width: '257px',
            }}
          >
            <Typography
              fontWeight={600}
              variant='subtitle1'
              sx={{
                padding: '16px 16px 16px 20px',
                flex: 1,
                textAlign: 'right',
              }}
            >
              Subtotal
            </Typography>
            <Typography
              fontWeight={600}
              variant='subtitle1'
              sx={{ padding: '16px 16px 16px 20px', flex: 1 }}
            >
              {getItem().items.length && getItem().items[0].initialPrice
                ? formatCurrency(
                    formatByRoundingProcedure(
                      isEditMode ? subtotal : Number(project?.subtotal),
                      getItem().items[0].initialPrice?.numberPlace!,
                      getItem().items[0].initialPrice?.rounding!,
                      getItem().items[0].initialPrice?.currency!,
                    ),
                    getItem().items[0].initialPrice?.currency!,
                  )
                : 0}
            </Typography>
          </Box>
        </Box>
      </Grid>
      {/* tax */}
      {role.name === 'CLIENT' ? null : (
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
          <Box display='flex' alignItems='center' gap='4px'>
            <Checkbox
              disabled={!isEditMode}
              checked={taxable}
              onChange={e => {
                if (!e.target.checked) {
                  setTax(null)
                }
                setTaxable(e.target.checked)
              }}
            />
            <Typography>Tax</Typography>
          </Box>
          <Box display='flex' alignItems='center' gap='4px'>
            {isEditMode ? (
              <>
                <TextField
                  size='small'
                  type='number'
                  value={!tax ? '-' : tax}
                  disabled={!taxable}
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
              <Box>{tax ? `${tax} %` : null} </Box>
            )}
          </Box>
        </Grid>
      )}
    </Grid>
  )
}
