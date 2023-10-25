import { Icon } from '@iconify/react'
import { Box, Button, Card, Divider, Typography } from '@mui/material'
import useModal from '@src/hooks/useModal'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'
import ItemPriceUnitForm from '@src/pages/components/forms/item-price-unit-form'
import { defaultOption } from '@src/pages/orders/add-new'
import { useGetClientPriceList } from '@src/queries/company/standard-price'
import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'
import { ItemType, JobType } from '@src/types/common/item.type'
import {
  PriceUnitListType,
  StandardPriceListType,
} from '@src/types/common/standard-price'
import { Dispatch, SetStateAction, useState, useEffect } from 'react'
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
} from 'react-hook-form'
import Row from './row'
import languageHelper from '@src/shared/helpers/language.helper'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { boolean } from 'yup'
import { JobPricesDetailType } from '@src/types/jobs/jobs.type'
import ProjectInfo from '@src/pages/orders/order-list/detail/components/project-info'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'

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
  setEditPrices?: Dispatch<SetStateAction<boolean>>
  type: string
  jobPriceHistory?: JobPricesDetailType
}
const ViewPrices = ({
  row,
  priceUnitsList,
  itemControl,
  getItem,
  setItem,
  itemTrigger,
  itemErrors,
  itemReset,
  isItemValid,
  appendItems,
  fields,
  setEditPrices,
  type,
  jobPriceHistory,
}: Props) => {
  const auth = useRecoilValueLoadable(authState)

  const { data: prices, isSuccess } = useGetClientPriceList({
    clientId: 7,
  })

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

  const [showPriceHistory, setShowPriceHistory] = useState<boolean>(false)
  useEffect(() => {
    if (jobPriceHistory && jobPriceHistory.detail?.length) setShowPriceHistory(true)
  }, [])

  console.log("row",row)
  // prices tab 하단의 price history에 들어가는 row
  const PriceHistory = ({item}: {item:ItemType[]}) => {
    return (
      <Card sx={{ padding: '24px', backgroundColor: 'rgba(76, 78, 100, 0.5)' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 현재 Price를 부를때는 jobInfo의 pro 정보를 호출함 */}
          {/* Price history에서 부를때는 history 데이터 내에 pro 정보 호출함 */}
          {/* Request history의 Price에서는 안씀 */}
          {!row ? (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant='subtitle1'
                  fontWeight={600}
                  fontSize={14}
                  width={150}
                >
                  Pro
                </Typography>
                <Typography variant='subtitle2' fontWeight={400} fontSize={14}>
                  {'pro name'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant='subtitle1'
                  fontWeight={600}
                  fontSize={14}
                  width={150}
                >
                  Date&Time
                </Typography>
                <Typography variant='subtitle2' fontWeight={400} fontSize={14}>
                  {/* TODO: pro가 assign된 시간, 타임존 정보 필요함 */}
                  {/* {FullDateTimezoneHelper(row.historyAt, auth.getValue().user?.timezone,)} */}
                </Typography>
              </Box>
            </Box>
          ) : null}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                fontSize={14}
                width={150}
              >
                Language pair
              </Typography>
              <Typography variant='subtitle2' fontWeight={400} fontSize={14}>
                {languageHelper(row.sourceLanguage)}&nbsp;&rarr;&nbsp;
                {languageHelper(row.targetLanguage)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                fontSize={14}
                width={150}
              >
                Price
              </Typography>
              <Typography variant='subtitle2' fontWeight={400} fontSize={14}>
                {fields[0].initialPrice?.name}
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Row
            getItem={getItem}
            getPriceOptions={getPriceOptions}
            itemControl={itemControl}
            showMinimum={showMinimum}
            setItem={setItem}
            itemTrigger={itemTrigger}
            setShowMinimum={setShowMinimum}
            openModal={openModal}
            closeModal={closeModal}
            priceUnitsList={priceUnitsList}
            type='detail'
            setDarkMode={true}
          />
        </Box>
      </Card>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {type === 'history' ? null : ![60800, 601000].includes(row.status) ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Typography variant='subtitle2'>
            {row.pro
              ? '*Changes will also be applied to the invoice'
              : '*Changes will only be applied to new requests'
            }
          </Typography>
          <Button
            variant='outlined'
            // disabled={!!row.assignedPro}
            onClick={() => setEditPrices && setEditPrices(true)}
          >
            <Icon icon='mdi:pencil-outline' fontSize={24} />
            &nbsp;
            {row.pro
              ? 'Edit'
              : 'Edit before request'
            }
          </Button>
        </Box>
      ) : null}

      <Card sx={{ padding: '24px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {row.pro ? (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant='subtitle1'
                  fontWeight={600}
                  fontSize={14}
                  width={150}
                >
                  Pro
                </Typography>
                <Typography variant='subtitle2' fontWeight={400} fontSize={14}>
                  {getLegalName({
                    firstName: row.pro?.firstName!,
                    middleName: row.pro?.middleName,
                    lastName: row.pro?.lastName!,
                  })}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant='subtitle1'
                  fontWeight={600}
                  fontSize={14}
                  width={150}
                >
                  Date&Time
                </Typography>
                <Typography variant='subtitle2' fontWeight={400} fontSize={14}>
                  {/* TODO: pro가 assign된 시간, 타임존 정보 필요함 */}
                  {FullDateTimezoneHelper(row.historyAt, auth.getValue().user?.timezone,)}
                </Typography>
              </Box>
            </Box>
          ) : null}

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                fontSize={14}
                width={150}
              >
                Language pair
              </Typography>
              <Typography variant='subtitle2' fontWeight={400} fontSize={14}>
                {languageHelper(row.sourceLanguage)}&nbsp;&rarr;&nbsp;
                {languageHelper(row.targetLanguage)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                fontSize={14}
                width={150}
              >
                Price
              </Typography>
              <Typography variant='subtitle2' fontWeight={400} fontSize={14}>
                {fields[0].initialPrice?.name}
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Row
            getItem={getItem}
            getPriceOptions={getPriceOptions}
            itemControl={itemControl}
            showMinimum={showMinimum}
            setItem={setItem}
            itemTrigger={itemTrigger}
            setShowMinimum={setShowMinimum}
            openModal={openModal}
            closeModal={closeModal}
            priceUnitsList={priceUnitsList}
            type='detail'
          />
        </Box>
      </Card>

      {jobPriceHistory?.detail?.length && !showPriceHistory ? 
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '24px', 
          }}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: 42,
              cursor: 'pointer',
            }} 
            onClick={() => setShowPriceHistory(true)}
          >
            <Icon icon='fa6-solid:chevron-down' fontSize={15} color='#666CFF' />
            <Typography variant='subtitle2' fontWeight='medium' fontSize={15} color='#666CFF'>
              &nbsp;&nbsp;&nbsp;
              {'Show price history'}
            </Typography>
          </Box>
        </Box>
        : null
      }
      {jobPriceHistory?.detail?.length && showPriceHistory ?
        <Box
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '24px', 
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: 42,
              cursor: 'pointer',
            }} 
            onClick={() => setShowPriceHistory(false)}
          >
            <Icon icon='fa6-solid:chevron-up' fontSize={15} color='#666CFF' />
            <Typography variant='subtitle2' fontWeight='medium' fontSize={15} color='#666CFF'>
              &nbsp;&nbsp;&nbsp;
              {'Hide price history'}
            </Typography>
          </Box>
          <PriceHistory 
            item={fields}
          />
        </Box>
        : null
      }
    </Box>
  )
}

export default ViewPrices
