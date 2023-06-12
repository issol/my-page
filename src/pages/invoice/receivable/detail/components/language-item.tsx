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
import { patchItemsForOrder, patchLangPairForOrder } from '@src/apis/order.api'
import useModal from '@src/hooks/useModal'
import DeleteConfirmModal from '@src/pages/client/components/modals/delete-confirm-modal'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'
import AddLanguagePairForm from '@src/pages/components/forms/add-language-pair-form'
import ItemForm from '@src/pages/components/forms/items-form'
import { defaultOption, languageType } from '@src/pages/orders/add-new'
import { useGetPriceList } from '@src/queries/company/standard-price'
import { useGetLangItem } from '@src/queries/order/order.query'
import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'
import languageHelper from '@src/shared/helpers/language.helper'
import {
  formatByRoundingProcedure,
  formatCurrency,
} from '@src/shared/helpers/price.helper'
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
  getInvoiceInfo: UseFormGetValues<InvoiceProjectInfoFormType>
}

const InvoiceLanguageAndItem = ({
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
  getInvoiceInfo,
}: Props) => {
  const { openModal, closeModal } = useModal()
  const queryClient = useQueryClient()
  const { data: prices, isSuccess } = useGetPriceList({
    clientId: clientId,
  })

  const priceInfo = prices?.find(
    value => value.id === langItem.items[0].priceId,
  )
  console.log(priceInfo)

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
    const langs: LanguagePairsPostType[] = languagePairs.map(item => {
      if (item?.price?.id) {
        return {
          langPairId: Number(item.id),
          source: item.source,
          target: item.target,
          priceId: item.price.id,
        }
      }
      return {
        langPairId: Number(item.id),
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      ></Box>
      <Grid item xs={12}>
        <AddLanguagePairForm
          languagePairs={languagePairs}
          setLanguagePairs={setLanguagePairs}
          getPriceOptions={getPriceOptions}
          type={'detail'}
          onDeleteLanguagePair={onDeleteLanguagePair}
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
          getPriceOptions={getPriceOptions}
          priceUnitsList={priceUnitsList || []}
          type={'invoiceDetail'}
        />
      </Grid>
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
              sx={{ padding: '16px 16px 16px 20px' }}
            >
              Subtotal
            </Typography>
            <Typography
              fontWeight={600}
              variant='subtitle1'
              sx={{ padding: '16px 16px 16px 20px' }}
            >
              {formatCurrency(
                formatByRoundingProcedure(
                  items.reduce((acc, cur) => {
                    return acc + cur.totalPrice
                  }, 0),
                  priceInfo?.decimalPlace!,
                  priceInfo?.roundingProcedure!,
                  priceInfo?.currency!,
                ),
                priceInfo?.currency!,
              )}
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
          <Box>{!getInvoiceInfo().taxable ? '-' : getInvoiceInfo().tax}</Box>%
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
              width: '257px',
            }}
          >
            <Typography
              fontWeight={600}
              variant='subtitle1'
              sx={{ padding: '16px 16px 16px 20px' }}
            >
              Tax
            </Typography>
            <Typography
              fontWeight={600}
              variant='subtitle1'
              sx={{ padding: '16px 16px 16px 20px' }}
            >
              {getInvoiceInfo().taxable
                ? formatCurrency(
                    formatByRoundingProcedure(
                      items.reduce((acc, cur) => {
                        return acc + cur.totalPrice
                      }, 0) *
                        (getInvoiceInfo().tax! / 100),
                      priceInfo?.decimalPlace!,
                      priceInfo?.roundingProcedure!,
                      priceInfo?.currency!,
                    ),
                    priceInfo?.currency!,
                  )
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
              width: '250px',
            }}
          >
            <Typography
              fontWeight={600}
              variant='subtitle1'
              color={'#666CFF'}
              sx={{ padding: '16px 16px 16px 20px' }}
            >
              Total
            </Typography>
            <Typography
              fontWeight={600}
              variant='subtitle1'
              color={'#666CFF'}
              sx={{ padding: '16px 16px 16px 20px' }}
            >
              {getInvoiceInfo().taxable
                ? formatCurrency(
                    formatByRoundingProcedure(
                      items.reduce((acc, cur) => {
                        return acc + cur.totalPrice
                      }, 0) *
                        (getInvoiceInfo().tax! / 100) +
                        items.reduce((acc, cur) => {
                          return acc + cur.totalPrice
                        }, 0),
                      priceInfo?.decimalPlace!,
                      priceInfo?.roundingProcedure!,
                      priceInfo?.currency!,
                    ),
                    priceInfo?.currency!,
                  )
                : formatCurrency(
                    formatByRoundingProcedure(
                      items.reduce((acc, cur) => {
                        return acc + cur.totalPrice
                      }, 0),
                      priceInfo?.decimalPlace!,
                      priceInfo?.roundingProcedure!,
                      priceInfo?.currency!,
                    ),
                    priceInfo?.currency!,
                  )}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </>
  )
}

export default InvoiceLanguageAndItem
