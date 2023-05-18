import { yupResolver } from '@hookform/resolvers/yup'
import { Autocomplete, Box, Button, Card, Grid, TextField } from '@mui/material'
import { PriceUnitType } from '@src/apis/price-units.api'
import useModal from '@src/hooks/useModal'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'
import ItemPriceUnitForm from '@src/pages/components/forms/item-price-unit-form'
import ItemForm from '@src/pages/components/forms/items-form'
import { defaultOption, languageType } from '@src/pages/orders/add-new'
import { useGetPriceList } from '@src/queries/company/standard-price'
import { useGetAllPriceList } from '@src/queries/price-units.query'
import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'
import { ItemType } from '@src/types/common/item.type'
import {
  PriceUnitListType,
  StandardPriceListType,
} from '@src/types/common/standard-price'
import { itemSchema } from '@src/types/schema/item.schema'
import { addJobInfoFormSchema } from '@src/types/schema/job-detail'
import { useEffect, useState } from 'react'
import {
  Control,
  FieldErrors,
  UseFieldArrayAppend,
  UseFormGetValues,
  UseFormReset,
  UseFormSetValue,
  UseFormTrigger,
  useFieldArray,
  useForm,
} from 'react-hook-form'

type Props = {
  priceUnitsList: Array<PriceUnitListType>
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
  itemReset: UseFormReset<{ items: ItemType[] }>
  isItemValid: boolean
  appendItems: UseFieldArrayAppend<
    {
      items: ItemType[]
    },
    'items'
  >
}

const Prices = ({
  priceUnitsList,
  itemControl,
  getItem,
  setItem,
  itemTrigger,
  itemErrors,
  isItemValid,
  appendItems,
}: Props) => {
  const { data: prices, isSuccess } = useGetPriceList({
    clientId: 7,
  })

  const [success, setSuccess] = useState(false)
  const [languagePairs, setLanguagePairs] = useState<Array<languageType>>([])

  const { openModal, closeModal } = useModal()

  const [showMinimum, setShowMinimum] = useState({
    checked: false,
    show: false,
  })

  const [price, setPrice] = useState<
    | (StandardPriceListType & {
        groupName: string
      })
    | null
  >(null)

  const itemData = getItem(`items.${0}`)
  console.log('itemData : ', getItem())

  /* price unit */
  const itemName: `items.${number}.detail` = `items.${0}.detail`
  const priceData =
    getPriceOptions(itemData.source, itemData.target).find(
      price => price.id === itemData.priceId,
    ) || null
  const sourceLanguage = getItem(`items.${0}.source`)
  const targetLanguage = getItem(`items.${0}.target`)
  const languagePairData = priceData?.languagePairs?.find(
    i => i.source === sourceLanguage && i.target === targetLanguage,
  )
  const minimumPrice = languagePairData?.minimumPrice
  const priceFactor = languagePairData?.priceFactor

  const {
    fields: details,
    append,
    update,
    remove,
  } = useFieldArray({
    control: itemControl,
    name: itemName,
  })

  function onDeletePriceUnit(idx: number) {
    remove(idx)
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

  const options = getPriceOptions('en', 'ko')

  function getTotalPrice() {
    let total = 0
    const data = getItem(itemName)
    if (data?.length) {
      const price = data.reduce((res, item) => (res = +item.prices), 0)
      if (minimumPrice && showMinimum.show && price < minimumPrice) {
        data.forEach(item => {
          total += item.unit === 'Percent' ? Number(item.prices) : 0
        })
        total += minimumPrice
      } else {
        total = price
      }
    }

    setItem(`items.${0}.totalPrice`, total, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  function getEachPrice(index: number) {
    const data = getItem(itemName)
    if (!data?.length) return
    let prices = 0
    const detail = data?.[index]
    if (detail && detail.unit === 'Percent') {
      const percentQuantity = data[index].quantity
      if (minimumPrice && showMinimum.show) {
        prices = (percentQuantity / 100) * minimumPrice
      } else {
        const generalPrices = data.filter(item => item.unit !== 'Percent')
        generalPrices.forEach(item => {
          prices += item.unitPrice
        })
        prices *= percentQuantity / 100
      }
    } else {
      prices = detail.unitPrice * detail.quantity
    }
    setItem(`items.${0}.detail.${index}.prices`, prices, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  console.log(!!itemData.source && !!itemData.target)

  function onItemBoxLeave() {
    const isMinimumPriceConfirmed =
      !!minimumPrice &&
      minimumPrice > getItem(`items.${0}.totalPrice`) &&
      showMinimum.checked

    const isNotMinimum =
      !minimumPrice || minimumPrice <= getItem(`items.${0}.totalPrice`)

    if (!isMinimumPriceConfirmed && !isNotMinimum) {
      setShowMinimum({ ...showMinimum, show: true })
      openModal({
        type: 'info-minimum',
        children: (
          <SimpleAlertModal
            onClose={() => {
              closeModal('info-minimum')
              setShowMinimum({ show: true, checked: true })
            }}
            message='The minimum price has been applied to the item(s).'
          />
        ),
      })
    }
    getTotalPrice()
  }

  const onSubmit = () => {
    const data = getItem()
    setSuccess(true)
    // toast('Job info added successfully')
    console.log(data)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false)
    }, 3000)
    return () => {
      clearTimeout(timer)
      // 3. 그리고 실행됐던 setTimeout 함수를 없애는 clearTimeout 함수를 이용한다.
    }
  }, [success])

  return (
    <>
      {success && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            left: 40,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',

            background: ' #FFFFFF',

            boxShadow: '0px 4px 8px -4px rgba(76, 78, 100, 0.42)',
            borderRadius: '8px',
            padding: '12px 10px',
          }}
        >
          <img src='/images/icons/order-icons/success.svg' alt='' />
          Saved successfully
        </Box>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Box sx={{ display: 'flex', gap: '20px' }}>
          <Box sx={{ flex: 1 }}>
            <Autocomplete
              fullWidth
              isOptionEqualToValue={(option, newValue) => {
                return option.value === newValue.value
              }}
              value={
                { value: 'English -> Korean', label: 'English -> Korean' } || {
                  value: '',
                  label: '',
                }
              }
              options={[
                {
                  value: `English -> Korean`,
                  label: 'English -> Korean',
                },
              ]}
              id='languagePair'
              getOptionLabel={option => option.label}
              disabled
              renderInput={params => (
                <TextField {...params} label='Language pair*' />
              )}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Autocomplete
              fullWidth
              value={price}
              options={options}
              groupBy={option => option?.groupName}
              onChange={(e, v) => {
                if (v) {
                  setPrice(v)
                  setItem(`items.${0}.priceId`, v.id)
                } else {
                  setPrice(null)
                }
              }}
              id='autocomplete-controlled'
              getOptionLabel={option => option.priceName}
              renderInput={params => (
                <TextField {...params} placeholder='Price*' />
              )}
            />
          </Box>
        </Box>

        <Box sx={{ width: '100%' }}>
          <Box
            sx={{
              border: ' 1px solid rgba(76, 78, 100, 0.22)',
              borderRadius: '10px',
              height: '482px',
              maxHeight: '482px',
            }}
          >
            <ItemPriceUnitForm
              control={itemControl}
              index={0}
              minimumPrice={minimumPrice}
              details={details}
              priceData={priceData}
              getValues={getItem}
              append={append}
              update={update}
              getTotalPrice={getTotalPrice}
              getEachPrice={getEachPrice}
              onDeletePriceUnit={onDeletePriceUnit}
              onItemBoxLeave={onItemBoxLeave}
              isValid={
                !!itemData.source &&
                !!itemData.target &&
                (!!itemData.priceId || itemData.priceId === NOT_APPLICABLE)
              }
              isNotApplicable={itemData.priceId === NOT_APPLICABLE}
              priceUnitsList={priceUnitsList}
              showMinimum={showMinimum}
              setShowMinimum={setShowMinimum}
              type={'edit'}
            />
          </Box>
        </Box>
      </Box>
      <Box
        mt='20px'
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%',
        }}
      >
        <Button
          variant='contained'
          onClick={onSubmit}
          disabled={!isItemValid || price === null}
        >
          Save draft
        </Button>
      </Box>
    </>
  )
}

export default Prices
