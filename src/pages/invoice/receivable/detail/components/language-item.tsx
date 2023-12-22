import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Button,
  Card,
  Checkbox,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
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
import { useGetLangItem } from '@src/queries/order/order.query'
import { getCurrentRole } from '@src/shared/auth/storage'
import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'
import languageHelper from '@src/shared/helpers/language.helper'
import {
  formatByRoundingProcedure,
  formatCurrency,
  getCurrencyMark,
} from '@src/shared/helpers/price.helper'
import invoice from '@src/store/invoice'
import { ItemType, PostItemType } from '@src/types/common/item.type'
import {
  LanguagePairsPostType,
  LanguagePairsType,
} from '@src/types/common/orders-and-quotes.type'
import {
  PriceUnitListType,
  StandardPriceListType,
} from '@src/types/common/standard-price'
import { InvoiceProjectInfoFormType } from '@src/types/invoice/common.type'
import {
  InvoiceLanguageItemType,
  InvoiceReceivableDetailType,
} from '@src/types/invoice/receivable.type'
import { LanguageAndItemType } from '@src/types/orders/order-detail'
import { itemSchema } from '@src/types/schema/item.schema'
import { ProjectTeamType } from '@src/types/schema/project-team.schema'
import { useRouter } from 'next/router'
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react'
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
  languagePairs: Array<languageType>
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

  itemErrors: FieldErrors<{
    items: ItemType[]
    languagePairs: languageType[]
  }>
  isItemValid: boolean
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
  itemTrigger: UseFormTrigger<{
    items: ItemType[]
    languagePairs: languageType[]
  }>
  invoiceInfo: InvoiceReceivableDetailType
  invoiceLanguageItem: InvoiceLanguageItemType
  getInvoiceInfo: UseFormGetValues<InvoiceProjectInfoFormType>
  onClickAddOrder?: () => void
  type?: 'invoiceHistory' | 'invoiceDetail'
  isUpdatable: boolean
}

const InvoiceLanguageAndItem = ({
  clientId,
  languagePairs,
  setLanguagePairs,
  itemControl,
  getItem,
  setItem,

  itemErrors,
  isItemValid,
  priceUnitsList,
  items,
  removeItems,
  getTeamValues,
  itemTrigger,

  invoiceInfo,
  invoiceLanguageItem,
  getInvoiceInfo,
  onClickAddOrder,
  type = 'invoiceDetail',
  isUpdatable,
}: Props) => {
  console.log(invoiceLanguageItem)

  const { openModal, closeModal } = useModal()

  const { data: prices, isSuccess } = useGetClientPriceList({
    clientId: clientId,
  })

  const priceInfo = prices?.find(value => value.id === items[0]?.priceId)

  const currentRole = getCurrentRole()
  const [subPrice, setSubPrice] = useState(0)

  function sumTotalPrice() {
    const subPrice = getItem()?.items!
    if (subPrice) {
      const total = subPrice.reduce((accumulator, item) => {
        return accumulator + item.totalPrice
      }, 0)

      setSubPrice(total)
    }
  }
  useEffect(() => {
    sumTotalPrice()
  }, [])

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

  console.log(getInvoiceInfo())

  console.log(
    Number(getInvoiceInfo('subtotal')) +
      Number(getInvoiceInfo('subtotal')) *
        (Number(getInvoiceInfo('tax')) / 100),
  )

  console.log(
    Number(getInvoiceInfo('subtotal')) * (Number(getInvoiceInfo('tax')) / 100),
  )
  function decimalPlus(a: number, b: number, n = 1) {
    const unit = Math.pow(10, n)

    return (a * unit + b * unit) / unit
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {type === 'invoiceHistory' ||
        currentRole?.name === 'CLIENT' ||
        !isUpdatable ? null : (
          <Button
            variant='outlined'
            sx={{ display: 'flex', gap: '8px', mb: '24px' }}
            onClick={onClickAddOrder && onClickAddOrder}
          >
            <Icon icon='mdi:playlist-add' />
            Add order
          </Button>
        )}
      </Box>
      {/* {currentRole && currentRole.name === 'CLIENT' ? null : (
        <Grid item xs={12}>
          <AddLanguagePairForm
            languagePairs={languagePairs}
            setLanguagePairs={setLanguagePairs}
            getPriceOptions={getPriceOptions}
            type={'detail'}
            onDeleteLanguagePair={onDeleteLanguagePair}
            items={items}
          />
        </Grid>
      )} */}

      <Grid item xs={12} mb={6}>
        <ItemForm
          control={itemControl}
          getValues={getItem}
          setValue={setItem}
          errors={itemErrors}
          fields={items}
          remove={removeItems}
          teamMembers={getTeamValues()?.teams}
          languagePairs={languagePairs}
          getPriceOptions={getPriceOptions}
          priceUnitsList={priceUnitsList || []}
          type={type}
          orderId={invoiceInfo?.orderId}
          itemTrigger={itemTrigger}
          sumTotalPrice={sumTotalPrice}
          orders={invoiceLanguageItem?.orders}
          from='invoice'
        />
      </Grid>
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
              // justifyContent: 'center',
              width: '25%',

              // width: '357px',
            }}
          >
            <Typography
              fontWeight={600}
              variant='subtitle1'
              sx={{
                padding: '16px 16px 16px 20px',
                display: 'flex',
                flex: 1,
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
              {getCurrencyMark(invoiceInfo.currency)}
              &nbsp;
              {Number(getInvoiceInfo('subtotal'))}
            </Typography>
          </Box>
        </Box>
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
        <Box display='flex' alignItems='center' gap='4px'>
          <Typography variant='subtitle1' fontSize={20} fontWeight={500}>
            Tax
          </Typography>
        </Box>

        <Box display='flex' alignItems='center' gap='4px'>
          <Box>{!invoiceInfo.isTaxable ? '-' : invoiceInfo.tax}</Box>%
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box
            sx={{
              display: 'flex',
              gap: '20px',
              borderBottom: '1.5px solid #666CFF',
              justifyContent: 'center',
              // width: '257px',
              width: '25%',
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
              Tax
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
              {/* {invoiceInfo.isTaxable
                ? formatCurrency(
                    formatByRoundingProcedure(
                      Number(getInvoiceInfo('subtotal')) *
                        (Number(invoiceInfo.tax!) / 100),
                      priceInfo?.decimalPlace!,
                      priceInfo?.roundingProcedure!,
                      priceInfo?.currency ?? 'USD',
                    ),
                    priceInfo?.currency ?? 'USD',
                  )
                : '-'} */}
              {invoiceInfo.isTaxable
                ? `${getCurrencyMark(invoiceInfo?.currency)} ${
                    Number(getInvoiceInfo('subtotal')) *
                    (Number(invoiceInfo.tax!) / 100)
                  }`
                : '-'}
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box
            sx={{
              display: 'flex',
              gap: '20px',
              borderBottom: '1.5px solid #666CFF',
              justifyContent: 'center',
              // width: '250px',
              width: '25%',
            }}
          >
            <Typography
              fontWeight={600}
              variant='subtitle1'
              color={'#666CFF'}
              sx={{
                padding: '16px 16px 16px 20px',
                flex: 1,
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              Total
            </Typography>
            <Typography
              fontWeight={600}
              variant='subtitle1'
              color={'#666CFF'}
              sx={{
                padding: '16px 16px 16px 20px',
                flex: 1,
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              {invoiceInfo.isTaxable
                ? `${getCurrencyMark(invoiceInfo?.currency)} ${decimalPlus(
                    Number(getInvoiceInfo('subtotal')),
                    Number(getInvoiceInfo('subtotal')) *
                      (Number(getInvoiceInfo('tax')) / 100),
                  )}`
                : `${getCurrencyMark(invoiceInfo?.currency)} ${Number(
                    getInvoiceInfo('subtotal'),
                  )}`}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </>
  )
}

export default InvoiceLanguageAndItem
