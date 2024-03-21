import { Box, Card, Divider, Typography } from '@mui/material'
import { JobType } from '@src/types/common/item.type'
import { useEffect, useState } from 'react'
import PriceHistoryRow from '../prices/price-history-row'
import languageHelper from '@src/shared/helpers/language.helper'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { jobPriceHistoryType } from '@src/types/jobs/jobs.type'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { timezoneSelector } from '@src/states/permission'

type Props = {
  jobInfo: JobType
  jobPrices: jobPriceHistoryType
}
const ViewHistoryPrices = ({ jobInfo, jobPrices }: Props) => {
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)

  const [languagePair, setLanguagePair] = useState<{
    sourceLanguage: string
    targetLanguage: string
  }>({
    sourceLanguage: '',
    targetLanguage: '',
  })
  useEffect(() => {
    if (jobPrices?.sourceLanguage && jobPrices?.targetLanguage) {
      setLanguagePair({
        sourceLanguage: jobPrices.sourceLanguage,
        targetLanguage: jobPrices.targetLanguage,
      })
    } else {
      setLanguagePair({
        sourceLanguage: jobInfo.sourceLanguage,
        targetLanguage: jobInfo.targetLanguage,
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
                firstName: jobPrices?.pro?.firstName!,
                middleName: jobPrices?.pro?.middleName,
                lastName: jobPrices?.pro?.lastName!,
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
              {convertTimeToTimezone(
                jobPrices?.historyAt,
                auth.getValue().user?.timezone,
                timezone.getValue(),
              )}
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
              {jobPrices?.initialPrice?.name}
            </Typography>
          </Box>
        </Box>
        <Divider />
        {/* item unit 데이터 맞추기 */}
        <PriceHistoryRow
          priceHistoryDetail={jobPrices?.detail!}
          showMinimum={jobPrices?.minimumPriceApplied}
          minimumPrice={Number(jobPrices?.minimumPrice!)}
          initialPrice={jobPrices?.initialPrice!}
          totalPrice={jobPrices?.totalPrice}
          setDarkMode={Boolean(false)}
        />
      </Box>
    </Card>
  )
}

export default ViewHistoryPrices
