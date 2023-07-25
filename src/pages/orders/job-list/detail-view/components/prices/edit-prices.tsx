import { yupResolver } from '@hookform/resolvers/yup'
import { Autocomplete, Box, Button, Card, Grid, TextField } from '@mui/material'
import useModal from '@src/hooks/useModal'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'
import ItemPriceUnitForm from '@src/pages/components/forms/item-price-unit-form'
import ItemForm from '@src/pages/components/forms/items-form'
import {
  defaultOption,
  languageType,
  proDefaultOption,
} from '@src/pages/orders/add-new'
import {
  useGetClientPriceList,
  useGetProPriceList,
} from '@src/queries/company/standard-price'
import { useGetAllClientPriceList } from '@src/queries/price-units.query'
import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'
import { ItemType, JobType, PostItemType } from '@src/types/common/item.type'
import {
  PriceUnitListType,
  StandardPriceListType,
} from '@src/types/common/standard-price'
import { itemSchema } from '@src/types/schema/item.schema'
import { addJobInfoFormSchema } from '@src/types/schema/job-detail'
import { useEffect, useState } from 'react'
import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFormGetValues,
  UseFormReset,
  UseFormSetValue,
  UseFormTrigger,
  useFieldArray,
  useForm,
} from 'react-hook-form'
import Row from './row'
import languageHelper from '@src/shared/helpers/language.helper'
import { SaveJobPricesParamsType } from '@src/types/orders/job-detail'
import { useMutation, useQueryClient } from 'react-query'
import { saveJobPrices } from '@src/apis/job-detail.api'
import { JobPricesDetailType } from '@src/types/jobs/jobs.type'

type Props = {
  row: JobType
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
  fields: FieldArrayWithId<
    {
      items: ItemType[]
    },
    'items',
    'id'
  >[]
  jobPrices: JobPricesDetailType
}

const EditPrices = ({
  priceUnitsList,
  itemControl,
  getItem,
  setItem,
  itemTrigger,
  itemErrors,
  isItemValid,
  appendItems,
  fields,
  row,
  jobPrices,
}: Props) => {
  const { data: prices, isSuccess } = useGetProPriceList({})
  const queryClient = useQueryClient()

  // console.log(getItem('items'), 'item')

  const [success, setSuccess] = useState(false)

  const { openModal, closeModal } = useModal()

  const [showMinimum, setShowMinimum] = useState({
    checked: false,
    show: false,
  })

  const [price, setPrice] = useState<
    | (StandardPriceListType & {
        groupName?: string
      })
    | null
  >(null)

  const getPriceOptions = (source: string, target: string) => {
    if (!isSuccess) return [proDefaultOption]
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
    return [proDefaultOption].concat(filteredList)
  }

  const options =
    row.sourceLanguage && row.targetLanguage
      ? getPriceOptions(row.sourceLanguage, row.targetLanguage)
      : [proDefaultOption]

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false)
    }, 3000)
    return () => {
      clearTimeout(timer)
      // 3. 그리고 실행됐던 setTimeout 함수를 없애는 clearTimeout 함수를 이용한다.
    }
  }, [success])

  useEffect(() => {
    if (jobPrices) {
      // console.log(jobPrices)

      const res = getPriceOptions(jobPrices.source, jobPrices.target).find(
        value => value.id === jobPrices.priceId,
      )
      setPrice(res!)
    }
  }, [jobPrices])

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
                row.sourceLanguage && row.targetLanguage
                  ? {
                      value: `${languageHelper(
                        row.sourceLanguage,
                      )} -> ${languageHelper(row.targetLanguage)}`,
                      label: `${languageHelper(
                        row.sourceLanguage,
                      )} -> ${languageHelper(row.targetLanguage)}`,
                    }
                  : { value: '', label: '' }
              }
              options={[]}
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
              value={price ?? null}
              options={options}
              groupBy={option => option?.groupName ?? ''}
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
            <Row
              getItem={getItem}
              getPriceOptions={getPriceOptions}
              itemControl={itemControl}
              showMinimum={showMinimum}
              setItem={setItem}
              setShowMinimum={setShowMinimum}
              openModal={openModal}
              closeModal={closeModal}
              priceUnitsList={priceUnitsList}
              type='edit'
            />
          </Box>
        </Box>
      </Box>
      {/* <Box
        mt='20px'
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%',
        }}
      >
        <Button variant='contained' onClick={onSubmit} disabled={!isItemValid}>
          Save draft
        </Button>
      </Box> */}
    </>
  )
}

export default EditPrices
