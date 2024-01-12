import { Box, Button, Grid, IconButton, Typography } from '@mui/material'
import EditSaveModal from '@src/@core/components/common-modal/edit-save-modal'
import Icon from '@src/@core/components/icon'
import {
  patchItemsForOrder,
  patchLangPairForOrder,
} from '@src/apis/order/order.api'
import useModal from '@src/hooks/useModal'
import DeleteConfirmModal from '@src/pages/client/components/modals/delete-confirm-modal'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'
import AddLanguagePairForm from '@src/pages/components/forms/add-language-pair-form'
import ItemForm from '@src/pages/components/forms/items-form'
import { defaultOption, languageType } from '@src/pages/orders/add-new'
import { useGetClientPriceList } from '@src/queries/company/standard-price'
import { getCurrentRole } from '@src/shared/auth/storage'

import languageHelper from '@src/shared/helpers/language.helper'
import { ItemType, PostItemType } from '@src/types/common/item.type'

import { PriceUnitListType } from '@src/types/common/standard-price'
import {
  LanguageAndItemType,
  OrderFeatureType,
  ProjectInfoType,
} from '@src/types/orders/order-detail'

import { ProjectTeamType } from '@src/types/schema/project-team.schema'

import { Dispatch, SetStateAction, useState, useEffect } from 'react'
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
} from 'react-hook-form'
import { UseMutationResult } from 'react-query'
import { updateOrderType } from '../[id]'
import {
  formatByRoundingProcedure,
  formatCurrency,
} from '@src/shared/helpers/price.helper'

type Props = {
  // languagePairs: Array<languageType>
  setLanguagePairs: (languagePair: languageType[]) => void
  clientId: number
  itemControl: Control<
    {
      items: ItemType[]
      languagePairs: languageType[]
    },
    any
  >
  getItem: UseFormGetValues<{
    items: ItemType[]
    languagePairs: languageType[]
  }>
  setItem: UseFormSetValue<{
    items: ItemType[]
    languagePairs: languageType[]
  }>
  itemTrigger: UseFormTrigger<{
    items: ItemType[]
    languagePairs: languageType[]
  }>
  itemErrors: FieldErrors<{
    items: ItemType[]
    languagePairs: languageType[]
  }>

  priceUnitsList: PriceUnitListType[]
  items: FieldArrayWithId<
    {
      items: ItemType[]
      languagePairs: languageType[]
    },
    'items',
    'id'
  >[]
  removeItems: UseFieldArrayRemove
  getTeamValues: UseFormGetValues<ProjectTeamType>

  appendItems: UseFieldArrayAppend<
    {
      items: ItemType[]
      languagePairs: languageType[]
    },
    'items'
  >
  orderId: number
  setLangItemsEdit?: Dispatch<SetStateAction<boolean>>
  langItemsEdit: boolean
  project?: ProjectInfoType

  onClickSplitOrder?: () => void
  onClickCancelSplitOrder?: () => void
  onClickSplitOrderConfirm?: () => void
  selectedIds?: { id: number; selected: boolean }[]
  setSelectedIds?: Dispatch<
    SetStateAction<
      {
        id: number
        selected: boolean
      }[]
    >
  >
  splitReady?: boolean

  updateStatus?: (status: number) => void

  canUseFeature?: (v: OrderFeatureType) => boolean
  isIncludeProjectTeam: boolean
  type: 'detail' | 'history'
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

const LanguageAndItem = ({
  clientId,
  languagePairs,
  setLanguagePairs,
  itemControl,
  getItem,
  setItem,
  itemTrigger,
  itemErrors,

  priceUnitsList,
  items,
  removeItems,
  getTeamValues,

  appendItems,
  orderId,
  setLangItemsEdit,
  langItemsEdit,
  project,

  onClickSplitOrder,
  selectedIds,
  setSelectedIds,
  splitReady,

  updateStatus,

  canUseFeature,
  isIncludeProjectTeam,
  type,
  appendLanguagePairs,
  updateLanguagePairs,
}: Props) => {
  console.log(getItem())

  const { openModal, closeModal } = useModal()

  const { data: prices, isSuccess } = useGetClientPriceList({
    clientId: clientId,
  })
  const isUpdatable = canUseFeature && canUseFeature('tab-Languages&Items')
  const currentRole = getCurrentRole()

  const [subtotal, setSubTotal] = useState(0)
  function sumTotalPrice() {
    const subtotal = langItemsEdit ? getItem()?.items! : items
    if (subtotal) {
      const total = subtotal.reduce((accumulator, item) => {
        return accumulator + item.totalPrice
      }, 0)
      setSubTotal(total)
    }
  }
  useEffect(() => {
    sumTotalPrice()
  }, [items])

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

  function isAddItemDisabled(): boolean {
    console.log(languagePairs)

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
    })
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

  return (
    <>
      {!langItemsEdit &&
      currentRole &&
      currentRole.name !== 'CLIENT' &&
      isIncludeProjectTeam &&
      type !== 'history' &&
      !splitReady ? (
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
            disabled={
              items.length <= 0 ||
              (canUseFeature &&
                !canUseFeature('button-Languages&Items-SplitOrder'))
            }
            onClick={onClickSplitOrder}
          >
            <Icon icon='ic:baseline-splitscreen' />
            Split order
          </Button>
          {isUpdatable ? (
            <IconButton
              onClick={() => {
                if (
                  canUseFeature &&
                  canUseFeature('button-Edit-Set-Status-To-UnderRevision')
                )
                  updateStatus && updateStatus(10500)
                setLangItemsEdit && setLangItemsEdit(!langItemsEdit)
              }}
            >
              <Icon icon='mdi:pencil-outline' />
            </IconButton>
          ) : null}
        </Box>
      ) : null}
      {currentRole && currentRole.name === 'CLIENT' ? null : (
        <Grid item xs={12}>
          <AddLanguagePairForm
            getItem={getItem}
            setLanguagePairs={(languagePair: languageType[]) =>
              setItem('languagePairs', languagePair)
            }
            getPriceOptions={getPriceOptions}
            type={langItemsEdit ? 'edit' : 'detail'}
            onDeleteLanguagePair={onDeleteLanguagePair}
            items={items}
            control={itemControl}
            append={appendLanguagePairs}
            update={updateLanguagePairs}
            languagePairs={languagePairs}
            itemTrigger={itemTrigger}
            from='order'
          />
        </Grid>
      )}

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
          type={langItemsEdit ? 'edit' : 'detail'}
          itemTrigger={itemTrigger}
          orderId={orderId}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          splitReady={splitReady}
          sumTotalPrice={sumTotalPrice}
          from='order'
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
      {/* subtotal */}
      {splitReady ? null : (
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: '20px',
                borderBottom: '2px solid #666CFF',
                justifyContent: 'center',
                width: '30%',
              }}
            >
              <Typography
                fontWeight={600}
                variant='subtitle1'
                sx={{
                  padding: '16px 16px 16px 20px',
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                Subtotal
              </Typography>
              <Typography
                fontWeight={600}
                variant='subtitle1'
                sx={{
                  padding: '16px 16px 16px 20px',
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                {getItem().items.length && getItem().items[0].initialPrice
                  ? formatCurrency(
                      formatByRoundingProcedure(
                        langItemsEdit ? subtotal : Number(project?.subtotal),
                        getItem().items[0].initialPrice?.numberPlace!,
                        getItem().items[0].initialPrice?.rounding!,
                        getItem().items[0].initialPrice?.currency!,
                      ),
                      getItem().items[0].initialPrice?.currency!,
                    )
                  : '-'}
              </Typography>
            </Box>
          </Box>
        </Grid>
      )}
    </>
  )
}

export default LanguageAndItem
