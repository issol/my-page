import { Box, Button, Grid, IconButton, Typography } from '@mui/material'
import EditSaveModal from '@src/@core/components/common-modal/edit-save-modal'
import Icon from '@src/@core/components/icon'
import { patchItemsForOrder, patchLangPairForOrder } from '@src/apis/order.api'
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
  project?: ProjectInfoType
  updateItems?: UseMutationResult<
    any,
    unknown,
    {
      id: number
      items: PostItemType[]
    },
    unknown
  >
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
  updateProject?: UseMutationResult<void, unknown, updateOrderType, unknown>
  updateStatus?: (status: number) => void
  canUseSplit?: boolean
  canUseFeature: (v: OrderFeatureType) => boolean
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
  project,
  updateItems,
  onClickSplitOrder,
  onClickCancelSplitOrder,
  onClickSplitOrderConfirm,
  selectedIds,
  setSelectedIds,
  splitReady,
  updateProject,
  updateStatus,
  canUseSplit,
  canUseFeature,
}: Props) => {
  const { openModal, closeModal } = useModal()

  const { data: prices, isSuccess } = useGetClientPriceList({
    clientId: clientId,
  })
  const isUpdatable = canUseFeature('tab-Languages&Items')
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
            title={`${languageHelper(row.source)} -> ${languageHelper(
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
            title={`${languageHelper(row.source)} -> ${languageHelper(
              row.target,
            )}`}
            onClose={() => closeModal('cannot-delete-language')}
          />
        ),
      })
    }

    function deleteLanguage() {
      const idx = languagePairs.map(item => item.id).indexOf(row.id)
      const copyOriginal = [...languagePairs]
      copyOriginal.splice(idx, 1)
      setLanguagePairs([...copyOriginal])
    }
  }

  return (
    <>
      {!langItemsEdit && currentRole && currentRole.name !== 'CLIENT' ? (
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
              !canUseFeature('button-Languages&Items-SplitOrder')
            }
            onClick={onClickSplitOrder}
          >
            <Icon icon='ic:baseline-splitscreen' />
            Split order
          </Button>
          {isUpdatable ? (
            <IconButton
              onClick={() => {
                if (canUseFeature('button-Edit-Set-Status-To-UnderRevision'))
                  updateStatus && updateStatus(10500)
                setLangItemsEdit(!langItemsEdit)
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
            languagePairs={languagePairs}
            setLanguagePairs={setLanguagePairs}
            getPriceOptions={getPriceOptions}
            type={langItemsEdit ? 'edit' : 'detail'}
            onDeleteLanguagePair={onDeleteLanguagePair}
            items={items}
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
          isValid={isItemValid}
          teamMembers={getTeamValues()?.teams}
          languagePairs={languagePairs}
          getPriceOptions={getPriceOptions}
          priceUnitsList={priceUnitsList || []}
          type={langItemsEdit ? 'edit' : 'detail'}
          itemTrigger={itemTrigger}
          project={project}
          updateItems={updateItems}
          orderId={orderId}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          splitReady={splitReady}
          onClickCancelSplitOrder={onClickCancelSplitOrder}
          onClickSplitOrderConfirm={onClickSplitOrderConfirm}
          sumTotalPrice={sumTotalPrice}
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
              {items.length && items[0].initialPrice !== null
                ? formatCurrency(
                    formatByRoundingProcedure(
                      langItemsEdit ? subtotal : Number(project?.subtotal),
                      items[0].initialPrice?.numberPlace!,
                      items[0].initialPrice?.rounding!,
                      items[0].initialPrice?.currency!,
                    ),
                    items[0].initialPrice?.currency!,
                  )
                : 0}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </>
  )
}

export default LanguageAndItem
