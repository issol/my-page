// ** react
import { Dispatch, SetStateAction, useEffect, useState, useRef } from 'react'

// ** style component
import {
  Autocomplete,
  Box,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  Radio,
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

import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

// ** types
import {
  ItemDetailType,
  ItemType,
  PostItemType,
} from '@src/types/common/item.type'

// ** Third Party Imports

// ** Custom Component Imports

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
import languageHelper from '@src/shared/helpers/language.helper'

// ** hooks
import useModal from '@src/hooks/useModal'

// ** components
import DeleteConfirmModal from '@src/pages/client/components/modals/delete-confirm-modal'
import ItemPriceUnitForm from './item-price-unit-form'
import TmAnalysisForm from './tm-analysis-form'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'

// ** values
import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'
import { DateTimePickerDefaultOptions } from 'src/shared/const/datePicker'

// ** helpers
import { FullDateHelper } from '@src/shared/helpers/date.helper'
import Link from 'next/link'
import { InvoiceReceivableDetailType } from '@src/types/invoice/receivable.type'
import { getCurrentRole } from '@src/shared/auth/storage'
import { ProjectInfoType } from '@src/types/orders/order-detail'
import { UseMutationResult } from 'react-query'
import { CheckBox, TroubleshootRounded } from '@mui/icons-material'
import {
  formatByRoundingProcedure,
  formatCurrency,
} from '@src/shared/helpers/price.helper'
import SimpleMultilineAlertModal from '@src/pages/components/modals/custom-modals/simple-multiline-alert-modal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { RoundingProcedureObj } from '@src/shared/const/rounding-procedure/rounding-procedure'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import Row from './item-row'

type Props = {
  control: Control<{ items: ItemType[] }, any>
  getValues: UseFormGetValues<{ items: ItemType[] }>
  setValue: UseFormSetValue<{ items: ItemType[] }>
  errors: FieldErrors<{ items: ItemType[] }>
  fields: FieldArrayWithId<{ items: ItemType[] }, 'items', 'id'>[]
  remove: UseFieldArrayRemove
  isValid: boolean
  teamMembers?: Array<{ type: MemberType; id: number | null; name?: string }>
  languagePairs: languageType[]
  getPriceOptions: (
    source: string,
    target: string,
    idx?: number,
  ) => Array<StandardPriceListType & { groupName?: string }>
  priceUnitsList: Array<PriceUnitListType>
  type: 'edit' | 'detail' | 'invoiceDetail' | 'create'
  orderId?: number
  itemTrigger: UseFormTrigger<{
    items: ItemType[]
  }>
  updateItems?: UseMutationResult<
    any,
    unknown,
    {
      id: number
      items: PostItemType[]
    },
    unknown
  >
  project?: ProjectInfoType

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
  sumTotalPrice: () => void
}

export type DetailNewDataType = {
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
  isValid,
  teamMembers,
  languagePairs,
  getPriceOptions,
  priceUnitsList,
  type,
  orderId,
  itemTrigger,
  updateItems,
  project,
  onClickCancelSplitOrder,
  onClickSplitOrderConfirm,
  selectedIds,
  setSelectedIds,
  splitReady,
  sumTotalPrice,
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

  function onItemRemove(idx: number) {
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

  const openMinimumPriceModal = (value: {
    minimumPrice: number
    currency: CurrencyType
  }) => {
    const minimumPrice = formatCurrency(value.minimumPrice, value.currency)
    openModal({
      type: 'info-minimum',
      children: (
        <CustomModal
          onClose={() => closeModal('info-minimum')}
          vary='info'
          title={
            <>
              The selected price includes a minimum price setting. <br />
              <br /> Minimum price : {minimumPrice} <br />
              <br />
              If the amount of the added price unit is lower than the minimum
              price, the minimum price will be automatically applied to the
              total price.
            </>
          }
          soloButton={true}
          rightButtonText='Okay'
          onClick={() => closeModal('info-minimum')}
        />
        // <SimpleMultilineAlertModal
        //   onClose={() => {
        //     closeModal('info-minimum')
        //   }}
        //   message={`The selected Price includes a Minimum price setting.\n\nMinimum price: ${minimumPrice}\n\nIf the amount of the added Price unit is lower than the Minimum price, the Minimum price will be automatically applied to the Total price.`}
        //   vary='info'
        // />
      ),
    })
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
            href={`/orders/job-list/details/?orderId=${orderId}`}
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
          openMinimumPriceModal={openMinimumPriceModal}
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
        />
      ))}
    </DatePickerWrapper>
  )
}
