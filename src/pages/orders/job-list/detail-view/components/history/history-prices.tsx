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
import PriceHistoryRow from '../prices/price-history-row'
import languageHelper from '@src/shared/helpers/language.helper'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { boolean } from 'yup'
import { JobPricesDetailType, jobPriceHistoryType } from '@src/types/jobs/jobs.type'
import ProjectInfo from '@src/pages/orders/order-list/detail/components/project-info'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { statusType } from '@src/types/common/status.type'

type Props = {
  jobInfo: JobType
  jobPrices: jobPriceHistoryType
}
const ViewHistoryPrices = ({
  jobInfo,
  jobPrices,
}: Props) => {
  const auth = useRecoilValueLoadable(authState)
  console.log("ViewHistoryPrices",jobInfo,jobPrices)

  const [ languagePair, setLanguagePair ] = useState<{
    sourceLanguage: string
    targetLanguage: string
  }>({
    sourceLanguage: '',
    targetLanguage: '',
  })
  useEffect(() => {
    if (jobPrices.sourceLanguage && jobPrices.targetLanguage) {
      setLanguagePair({
        sourceLanguage: jobPrices.sourceLanguage,
        targetLanguage: jobPrices.targetLanguage
      })
    } else {
      setLanguagePair({
        sourceLanguage: jobInfo.sourceLanguage,
        targetLanguage: jobInfo.targetLanguage
      })
    }
  }, [jobInfo, jobPrices])

  return (
    <Card sx={{ padding: '24px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* 현재 Price를 부를때는 jobInfo의 pro 정보를 호출함 */}
        {/* Price history에서 부를때는 history 데이터 내에 pro 정보 호출함 */}
        {/* Request history의 Price에서는 안씀 */}
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
                firstName: jobPrices.pro?.firstName!,
                middleName: jobPrices.pro?.middleName,
                lastName: jobPrices.pro?.lastName!,
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
              {FullDateTimezoneHelper(jobPrices.historyAt, auth.getValue().user?.timezone,)}
            </Typography>
          </Box>
        </Box>
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
              {languageHelper(languagePair.sourceLanguage)}&nbsp;&rarr;&nbsp;
              {languageHelper(languagePair.targetLanguage)}
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
              {jobPrices.initialPrice?.name}
            </Typography>
          </Box>
        </Box>
        <Divider />
        {/* item unit 데이터 맞추기 */}
        <PriceHistoryRow
          priceHistoryDetail={jobPrices.detail!}
          showMinimum={jobPrices.minimumPriceApplied}
          minimumPrice={Number(jobPrices.minimumPrice!)}
          initialPrice={jobPrices.initialPrice!}
          totalPrice={jobPrices.totalPrice}
          setDarkMode={Boolean(false)}
        />
      </Box>
    </Card>
  )

}

export default ViewHistoryPrices
