import { yupResolver } from '@hookform/resolvers/yup'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
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
import {
  ItemType,
  JobItemType,
  JobType,
  PostItemType,
} from '@src/types/common/item.type'
import {
  PriceUnitListType,
  StandardPriceListType,
} from '@src/types/common/standard-price'
import { itemSchema } from '@src/types/schema/item.schema'
import { addJobInfoFormSchema } from '@src/types/schema/job-detail'
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import {
  Control,
  Controller,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
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
import { saveJobPrices } from '@src/apis/jobs/job-detail.api'
import { JobPricesDetailType } from '@src/types/jobs/jobs.type'
import SimpleMultilineAlertModal from '@src/pages/components/modals/custom-modals/simple-multiline-alert-modal'
import { formatCurrency } from '@src/shared/helpers/price.helper'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { set } from 'lodash'
import { FormErrors } from '@src/shared/const/formErrors'
import { Icon } from '@iconify/react'

type Props = {
  row: JobType
  priceUnitsList: Array<PriceUnitListType>
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
  itemReset: UseFormReset<{ items: ItemType[]; languagePairs: languageType[] }>
  isItemValid: boolean
  appendItems: UseFieldArrayAppend<
    {
      items: ItemType[]
      languagePairs: languageType[]
    },
    'items'
  >
  fields: FieldArrayWithId<
    {
      items: ItemType[]
      languagePairs: languageType[]
    },
    'items',
    'id'
  >[]
  jobPrices: JobPricesDetailType

  item?: JobItemType
  prices?: StandardPriceListType[]
  orderItems: ItemType[]
  setPriceId: Dispatch<SetStateAction<number | null>>
  setIsNotApplicable: Dispatch<SetStateAction<boolean>>
  errorRefs?: MutableRefObject<(HTMLInputElement | null)[]>
  details: FieldArrayWithId<
    {
      items: ItemType[]
      languagePairs: languageType[]
    },
    `items.${number}.detail`,
    'id'
  >[]
  append: UseFieldArrayAppend<
    {
      items: ItemType[]
      languagePairs: languageType[]
    },
    `items.${number}.detail`
  >
  remove: UseFieldArrayRemove
  update: UseFieldArrayUpdate<
    {
      items: ItemType[]
      languagePairs: languageType[]
    },
    `items.${number}.detail`
  >
}

const EditPrices = ({
  priceUnitsList,
  itemControl,
  getItem,
  setItem,
  itemTrigger,
  itemReset,
  itemErrors,
  isItemValid,
  appendItems,
  fields,
  row,
  jobPrices,

  item,
  prices,
  orderItems,
  setPriceId,
  setIsNotApplicable,
  errorRefs,
  append,
  details,
  remove,
  update,
}: Props) => {
  const queryClient = useQueryClient()
  console.log(getItem(), 'get Item')
  const itemData = getItem(`items.${0}`)

  // const [success, setSuccess] = useState(false)

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

  const [languagePair, setLanguagePair] = useState<{
    sourceLanguage: string | null
    targetLanguage: string | null
  }>({
    sourceLanguage: '',
    targetLanguage: '',
  })

  const [overridePriceUnit, setOverridePriceUnit] = useState(false)

  const findMatchedLanguagePairInItems = (
    v: StandardPriceListType & {
      groupName?: string | undefined
    },
  ) => {
    return v.languagePairs.find((pair, idx) => {
      if (
        pair?.source === languagePair?.sourceLanguage &&
        pair?.target === languagePair?.targetLanguage
      ) {
        return pair
      }
    })
  }

  const getPriceOptions = (source: string, target: string) => {
    // if (!isSuccess) return [proDefaultOption]
    if (!prices) return [proDefaultOption]

    // const filteredPriceUnit = prices.priceUnit.filter(value => value !== null)
    const filteredList = prices
      .map(item => ({
        ...item,
        priceUnit: item.priceUnit.filter(value => value !== null),
      }))
      .filter(item => {
        const matchingPairs = item.languagePairs.filter(
          pair => pair.source === source && pair.target === target,
        )
        return matchingPairs.length > 0
      })
      .map(item => ({
        groupName: item.isStandard ? 'Standard pro price' : 'Matching price',

        ...item,
      }))

    return [proDefaultOption].concat(filteredList)
  }

  const options =
    // jobPrices.source && jobPrices.target
    //   ? getPriceOptions(jobPrices.source, jobPrices.target)
    //   : [proDefaultOption]
    languagePair.sourceLanguage && languagePair.targetLanguage
      ? getPriceOptions(
          languagePair.sourceLanguage,
          languagePair.targetLanguage,
        )
      : [proDefaultOption]

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setSuccess(false)
  //   }, 3000)
  //   return () => {
  //     clearTimeout(timer)
  //     // 3. 그리고 실행됐던 setTimeout 함수를 없애는 clearTimeout 함수를 이용한다.
  //   }
  // }, [success])

  useEffect(() => {
    if (jobPrices && item && prices) {
      const sourceLanguage = jobPrices.sourceLanguage ?? item.sourceLanguage
      const targetLanguage = jobPrices.targetLanguage ?? item.targetLanguage

      setLanguagePair({
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage,
      })

      setItem(`items.${0}.source`, sourceLanguage)
      setItem(`items.${0}.target`, targetLanguage)

      const res = getPriceOptions(sourceLanguage, targetLanguage).find(
        value => value.id === jobPrices.initialPrice?.priceId,
      )

      // setPrice(res!)
      if (res) {
        setPrice(res)
      }
      itemTrigger()
    }
  }, [jobPrices, item, prices])

  const openMinimumPriceModal = (value: any) => {
    const minimumPrice = formatCurrency(
      value?.languagePairs[0]?.minimumPrice,
      value?.currency,
    )
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
      ),
    })
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          // gap: '20px',
          // padding: '20px',
          height: '100%',

          // height: 'calc(100% - 100px)',
        }}
      >
        <Typography fontSize={20} fontWeight={500} sx={{ padding: '20px' }}>
          {row.corporationId}
        </Typography>
        <Divider sx={{ my: '5px !important' }} />
        <Box
          sx={{
            // height: '100%',

            padding: '20px 20px 0 20px',
            height: 'calc(100% - 185px)',
            display: 'flex',
            flexDirection: 'column',
            // gap: '20px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: '20px',
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Autocomplete
                fullWidth
                isOptionEqualToValue={(option, newValue) => {
                  return option.value === newValue.value
                }}
                value={
                  // jobPrices.source && jobPrices.target
                  //   ? {
                  //       value: `${languageHelper(
                  //         jobPrices.source,
                  //       )} -> ${languageHelper(jobPrices.target)}`,
                  //       label: `${languageHelper(
                  //         jobPrices.source,
                  //       )} -> ${languageHelper(jobPrices.target)}`,
                  //     }
                  //   : { value: '', label: '' }
                  {
                    value: `${languageHelper(
                      languagePair.sourceLanguage,
                    )} → ${languageHelper(languagePair.targetLanguage)}`,
                    label: `${languageHelper(
                      languagePair.sourceLanguage,
                    )} → ${languageHelper(languagePair.targetLanguage)}`,
                  }
                }
                options={[]}
                id='languagePair'
                getOptionLabel={option => option.label}
                disabled
                renderInput={params => (
                  <TextField
                    {...params}
                    autoComplete='off'
                    label='Language pair*'
                  />
                )}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Controller
                name='items.0.priceId'
                control={itemControl}
                render={({
                  field: { value, onChange },
                  formState: { isSubmitted },
                }) => (
                  <Autocomplete
                    fullWidth
                    value={options.find(option => option.id === value) ?? null}
                    options={options}
                    groupBy={option => option?.groupName ?? ''}
                    onChange={(e, v) => {
                      if (v) {
                        onChange(v.id)
                        setPrice(v)
                        const matchedLanguagePair =
                          findMatchedLanguagePairInItems(v)
                        if (
                          matchedLanguagePair &&
                          matchedLanguagePair.minimumPrice
                        )
                          openMinimumPriceModal(v)
                        setOverridePriceUnit(true)
                        setPriceId(v.id)
                        setIsNotApplicable(
                          v.id === NOT_APPLICABLE ? true : false,
                        )
                        itemTrigger()
                      } else {
                        onChange(null)
                        setPrice(null)
                      }
                    }}
                    id='autocomplete-controlled'
                    getOptionLabel={option => option.priceName}
                    renderInput={params => (
                      <TextField
                        {...params}
                        autoComplete='off'
                        placeholder='Price*'
                        error={
                          isSubmitted && Boolean(itemErrors.items?.[0]?.priceId)
                        }
                        helperText={
                          isSubmitted &&
                          Boolean(itemErrors.items?.[0]?.priceId) &&
                          FormErrors.required
                        }
                        inputRef={ref => {
                          if (errorRefs) errorRefs.current[0] = ref
                        }}
                      />
                    )}
                  />
                )}
              />
            </Box>
          </Box>

          <Box
            sx={{
              width: '100%',
              overflowY: 'scroll',
              mt: '20px',
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
              itemTrigger={itemTrigger}
              selectedPrice={price}
              useUnitPriceOverrideInPrice={overridePriceUnit}
              findMatchedLanguagePairInItems={findMatchedLanguagePairInItems}
              type='job-edit'
              orderItems={orderItems}
              currentOrderItemId={item?.id}
              errorRefs={errorRefs}
              details={details}
              append={append}
              remove={remove}
              update={update}
            />
            {/* </Box> */}
          </Box>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='flex'
            height={60}
          >
            <Button
              onClick={() => {
                append({
                  // id: id + index,
                  priceUnitId: -1,
                  quantity: null,
                  unitPrice: null,
                  prices: 0,
                  unit: '',
                  // currency: priceData?.currency ?? 'USD',
                  currency: getItem(`items.${0}.detail.${0}.currency`) ?? null,
                })
                // setId(id + 1)
              }}
              variant='outlined'
              disabled={
                !!itemData.source &&
                !!itemData.target &&
                (!!itemData.priceId || itemData.priceId === NOT_APPLICABLE)
              }
              sx={{ p: 0.7, minWidth: 26 }}
            >
              <Icon icon='material-symbols:add' fontSize={24} />
            </Button>
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
