// ** react
import { Dispatch, SetStateAction, useEffect } from 'react'

import { Box, Grid, Typography } from '@mui/material'

import { Icon } from '@iconify/react'

import { v4 as uuidv4 } from 'uuid'

// ** react hook form
import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayRemove,
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger,
} from 'react-hook-form'

// ** types
import { ItemType, PostItemType } from '@src/types/common/item.type'

// ** Date picker wrapper
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'

// ** types & validation
import { MemberType } from '@src/types/schema/project-team.schema'
import { languageType } from '@src/pages/quotes/add-new'
import {
  CurrencyType,
  PriceUnitListType,
  StandardPriceListType,
} from '@src/types/common/standard-price'

// ** helpers

// ** hooks
import useModal from '@src/hooks/useModal'

// ** components
import DeleteConfirmModal from '@src/pages/client/components/modals/delete-confirm-modal'

// ** helpers

import Link from 'next/link'

import { getCurrentRole } from '@src/shared/auth/storage'

import {
  formatCurrency,
  getCurrencyMark,
} from '@src/shared/helpers/price.helper'
import SimpleMultilineAlertModal from '@src/pages/components/modals/custom-modals/simple-multiline-alert-modal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'

import { LanguagePairTypeInItem } from '@src/types/orders/order-detail'
import { getItemJob } from '@src/apis/order-detail.api'
import Row from './item-row'

type Props = {
  control: Control<{ items: ItemType[]; languagePairs: languageType[] }, any>
  getValues: UseFormGetValues<{
    items: ItemType[]
    languagePairs: languageType[]
  }>
  setValue: UseFormSetValue<{
    items: ItemType[]
    languagePairs: languageType[]
  }>
  errors: FieldErrors<{ items: ItemType[]; languagePairs: languageType[] }>
  fields: FieldArrayWithId<
    { items: ItemType[]; languagePairs: languageType[] },
    'items',
    'id'
  >[]
  remove: UseFieldArrayRemove
  teamMembers?: Array<{ type: MemberType; id: number | null; name?: string }>
  languagePairs: languageType[]
  getPriceOptions: (
    source: string,
    target: string,
    idx?: number,
  ) => Array<StandardPriceListType & { groupName?: string }>
  priceUnitsList: Array<PriceUnitListType>
  type:
    | 'edit'
    | 'detail'
    | 'invoiceDetail'
    | 'create'
    | 'invoiceCreate'
    | 'invoiceHistory'

  orderId?: number
  itemTrigger: UseFormTrigger<{
    items: ItemType[]
    languagePairs: languageType[]
  }>
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
  sumTotalPrice: () => void
  orders?: {
    id: number
    projectName: string
    corporationId: string
    items: ItemType[]
    languagePairs: LanguagePairTypeInItem[]
    subtotal: number
  }[]
  from: 'order' | 'quote' | 'invoice'
}

export type DetailNewDataType = {
  priceUnitId: number
  priceUnitPairId: number
  priceUnitTitle: string
  priceUnitQuantity: number
  priceUnitUnit: string
  perWords: number
  priceUnitPrice: number
}
export type onCopyAnalysisParamType = {
  newData: DetailNewDataType | null
  prices: number
}[]
export default function ItemForm({
  control,
  getValues,
  setValue,
  errors,
  fields,
  remove,
  teamMembers,
  languagePairs,
  getPriceOptions,
  priceUnitsList,
  type,
  orderId,
  itemTrigger,
  selectedIds,
  setSelectedIds,
  splitReady,
  sumTotalPrice,
  orders,
  from,
}: Props) {
  const { openModal, closeModal } = useModal()
  const currentRole = getCurrentRole()

  const setValueOptions = { shouldDirty: true, shouldValidate: true }

  const getPricebyPairs = (idx: number) => {
    const options = getPriceOptions(
      getValues(`items.${idx}.source`)!,
      getValues(`items.${idx}.target`)!,
    )
    return options
  }
  // Language pair에 price가 변경된 경우 field(item)의 initialPrice.currency와 모든 item의 price의 currency를 비교하여
  // currency가 다른 경우 해당 item의 price를 null 처리한다.
  // 모달은 등록한 Language pair가 1개인 경우에만 발생시킨다.
  // (등록한 Language pair가 여러개인 경우 AddLanguagePairForm 폼에서 처리된다.)
  useEffect(() => {
    const targetCurrency = fields[0]?.initialPrice?.currency ?? null
    let items = getValues('items')
    let isUpdate = false
    if (items.length && targetCurrency) {
      items.map((item, idx) => {
        const matchPriceList = getPricebyPairs(idx)
        const itemPriceId = item.priceId
        const itemPrice = matchPriceList.filter(
          pair => itemPriceId === pair.id!,
        )
        if (
          itemPrice[0]?.currency &&
          targetCurrency !== itemPrice[0]?.currency
        ) {
          setValue(`items.${idx}.priceId`, null, setValueOptions)
          isUpdate = true
        }
      })
      if (languagePairs.length === 1 && isUpdate) {
        selectCurrencyViolation(1)
      }
    }
  }, [languagePairs, fields])

  // item의 Price currency와 field(item)의 initialPrice.currency를 비교한다.
  // 값이 다르면 item의 price를 null 처리한다.
  const checkPriceCurrency = (price: StandardPriceListType, index: number) => {
    const targetCurrency = fields[0]?.initialPrice?.currency ?? null
    if (targetCurrency) {
      if (price?.currency !== targetCurrency) {
        setValue(`items.${index}.priceId`, null, setValueOptions)
        selectCurrencyViolation(1)
        return false
      }
    }
    return true
  }

  const selectNotApplicableModal = () => {
    openModal({
      type: 'info-not-applicable-unavailable',
      children: (
        <SimpleMultilineAlertModal
          onClose={() => closeModal('info-not-applicable-unavailable')}
          message={`The "Not Applicable" option is currently unavailable.\n\nPlease select a price or\ncreate a new price if there is no suitable price according to the conditions.`}
          vary='info'
        />
      ),
    })
  }

  const selectCurrencyViolation = (type: number) => {
    const message1 = `Please check the currency of the selected price. You can't use different currencies in a quote.`
    const message2 =
      'Please select the price for the first language pair first.'
    openModal({
      type: 'error-currency-violation',
      children: (
        <SimpleMultilineAlertModal
          onClose={() => closeModal('error-currency-violation')}
          message={type === 1 ? message1 : message2}
          vary={type === 1 ? 'error' : 'info'}
        />
      ),
    })
  }

  function onItemRemove(idx: number, itemId: number) {
    getItemJob(itemId).then(res => {
      if (res) {
        // 삭제 불가능 케이스
        openModal({
          type: 'deleteNotAllowedModal',
          children: (
            <CustomModal
              title='This item cannot be deleted because jobs have already been created from it.'
              soloButton={true}
              rightButtonText='Okay'
              onClose={() => closeModal('deleteNotAllowedModal')}
              onClick={() => closeModal('deleteNotAllowedModal')}
              vary='error'
            />
          ),
        })
      } else if (!res) {
        // 삭제 가능 케이스
        openModal({
          type: 'delete-item',
          children: (
            <DeleteConfirmModal
              message='Are you sure you want to delete this item?'
              onClose={() => closeModal('delete-item')}
              onDelete={() => handleItemRemove(idx)}
            />
          ),
        })
      } else {
        // 예외 케이스는 삭제 되도록 우선 설정함
        openModal({
          type: 'delete-item',
          children: (
            <DeleteConfirmModal
              message='Are you sure you want to delete this item?'
              onClose={() => closeModal('delete-item')}
              onDelete={() => handleItemRemove(idx)}
            />
          ),
        })
      }
    })
  }

  function handleItemRemove(idx: number) {
    remove(idx)
    sumTotalPrice()
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

  return (
    <DatePickerWrapper>
      <Grid
        item
        xs={12}
        display='flex'
        padding='20px'
        alignItems='center'
        justifyContent='space-between'
        sx={{ background: '#F5F5F7', marginBottom: '24px' }}
      >
        <Typography variant='h6'>Items ({fields.length ?? 0})</Typography>
        {(type === 'invoiceDetail' || type === 'detail') &&
        currentRole &&
        currentRole.name !== 'CLIENT' &&
        orderId &&
        fields.length &&
        !splitReady ? (
          <Link
            href={
              type === 'invoiceDetail'
                ? `/orders/job-list`
                : `/orders/job-list/details/?orderId=${orderId}`
            }
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              color: '#666CFF',
            }}
          >
            Jobs
            <Icon icon='ic:outline-arrow-forward' color='#666CFF' />
          </Link>
        ) : null}
      </Grid>
      {(type === 'invoiceDetail' ||
        type === 'invoiceCreate' ||
        type === 'invoiceHistory') &&
      orders &&
      orders.length ? (
        orders.map(value => {
          return (
            <Box key={uuidv4()}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '24px 20px',
                }}
              >
                <Box sx={{ display: 'flex', gap: '3px' }}>
                  {type === 'invoiceCreate' ? (
                    <Typography
                      variant='body1'
                      color='#666CFF'
                      fontWeight={600}
                      // sx={{ textDecoration: 'underline' }}
                    >
                      [{value.corporationId}]
                    </Typography>
                  ) : (
                    <Link
                      href={`/orders/order-list/detail/${value.id}`}
                      style={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        color: '#666CFF',
                        fontWeight: 600,
                      }}
                    >
                      [{value.corporationId}]
                    </Link>
                  )}

                  <Typography variant='body1' color='#666CFF' fontWeight={600}>
                    {value.projectName}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant='body1' color='#666CFF' fontWeight={600}>
                    {getCurrencyMark(value.items[0]?.initialPrice?.currency)}{' '}
                    {value.subtotal?.toLocaleString('ko-KR')}
                  </Typography>
                </Box>
              </Box>

              {fields
                .filter(item => item.orderId === value.id)
                .map(data => {
                  return (
                    <Row
                      key={uuidv4()}
                      idx={data.idx!}
                      control={control}
                      setValue={setValue}
                      getValues={getValues}
                      getPriceOptions={getPriceOptions}
                      fields={fields}
                      itemTrigger={itemTrigger}
                      sumTotalPrice={sumTotalPrice}
                      // openMinimumPriceModal={openMinimumPriceModal}
                      splitReady={splitReady!}
                      type={type}
                      onItemRemove={onItemRemove}
                      teamMembers={teamMembers}
                      selectedIds={selectedIds}
                      setSelectedIds={setSelectedIds}
                      errors={errors}
                      languagePairs={languagePairs}
                      selectNotApplicableModal={selectNotApplicableModal}
                      priceUnitsList={priceUnitsList}
                      checkPriceCurrency={checkPriceCurrency}
                      findLangPairIndex={findLangPairIndex}
                      indexing={data.indexing}
                      from={from}
                    />
                  )
                })}
            </Box>
          )
        })
      ) : (
        <>
          {fields.map((item, idx) => (
            <Row
              key={item.id}
              idx={idx}
              control={control}
              setValue={setValue}
              getValues={getValues}
              getPriceOptions={getPriceOptions}
              fields={fields}
              itemTrigger={itemTrigger}
              sumTotalPrice={sumTotalPrice}
              // openMinimumPriceModal={openMinimumPriceModal}
              splitReady={splitReady!}
              type={type}
              onItemRemove={onItemRemove}
              teamMembers={teamMembers}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              errors={errors}
              languagePairs={languagePairs}
              selectNotApplicableModal={selectNotApplicableModal}
              priceUnitsList={priceUnitsList}
              checkPriceCurrency={checkPriceCurrency}
              findLangPairIndex={findLangPairIndex}
              from={from}
            />
          ))}
        </>
      )}
    </DatePickerWrapper>
  )
}
