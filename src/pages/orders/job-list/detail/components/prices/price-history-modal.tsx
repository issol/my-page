import { Icon } from '@iconify/react'
import { Box, Card, Divider, Grid, IconButton, Typography } from '@mui/material'
import { jobPriceHistoryType } from '@src/types/jobs/jobs.type'
import { v4 as uuidv4 } from 'uuid'
import Image from 'next/image'
import PriceHistoryRow from './price-history-row'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { timezoneSelector } from '@src/states/permission'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import languageHelper from '@src/shared/helpers/language.helper'

type Props = {
  onClose: any
  jobPriceHistory: jobPriceHistoryType[]
}

const PriceHistoryModal = ({ onClose, jobPriceHistory }: Props) => {
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)
  return (
    <Box
      sx={{
        maxWidth: '1180px',
        width: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
        position: 'relative',
      }}
    >
      <IconButton
        sx={{ position: 'absolute', top: '10px', right: '10px' }}
        onClick={onClose}
      >
        <Icon icon='mdi:close' />
      </IconButton>
      <Box sx={{ padding: '50px 60px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Image
            src='/images/icons/job-icons/job-detail.svg'
            alt=''
            width={50}
            height={50}
            priority={true}
          />
          <Typography fontSize={24} fontWeight={500}>
            Price history
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            mt: '30px',
            overflowY: 'scroll',
            height: '100%',
            maxHeight: '50vh',
            padding: '8px',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          {jobPriceHistory.length > 0
            ? jobPriceHistory.map(item => {
                return (
                  <Card
                    key={uuidv4()}
                    sx={{
                      padding: '20px 20px 0 20px',
                      overflow: 'auto',
                      height: '100%',
                      minHeight: '450px',
                    }}
                  >
                    <Grid container rowSpacing={6}>
                      <Grid item xs={7}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <Typography
                            fontSize={14}
                            fontWeight={600}
                            sx={{ width: '150px' }}
                          >
                            Pro
                          </Typography>
                          <Typography
                            fontSize={14}
                            fontWeight={400}
                            color='rgba(76, 78, 100, 0.60)'
                          >
                            {getLegalName({
                              firstName: item.pro?.firstName!,
                              middleName: item.pro?.middleName,
                              lastName: item.pro?.lastName!,
                            })}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={5}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <Typography
                            fontSize={14}
                            fontWeight={600}
                            sx={{ width: '150px' }}
                          >
                            Date&Time
                          </Typography>
                          <Typography
                            fontSize={14}
                            fontWeight={400}
                            color='rgba(76, 78, 100, 0.60)'
                          >
                            {convertTimeToTimezone(
                              item.historyAt,
                              auth.getValue().user?.timezone,
                              timezone.getValue(),
                            )}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={7}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <Typography
                            fontSize={14}
                            fontWeight={600}
                            sx={{ width: '150px' }}
                          >
                            Language pair
                          </Typography>
                          <Typography
                            fontSize={14}
                            fontWeight={400}
                            color='rgba(76, 78, 100, 0.60)'
                          >
                            {languageHelper(item.sourceLanguage)}
                            &nbsp;&rarr;&nbsp;
                            {languageHelper(item.targetLanguage)}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={5}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <Typography
                            fontSize={14}
                            fontWeight={600}
                            sx={{ width: '150px' }}
                          >
                            Price
                          </Typography>
                          <Typography
                            fontSize={14}
                            fontWeight={400}
                            color='rgba(76, 78, 100, 0.60)'
                          >
                            {item.initialPrice?.name}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Divider sx={{ my: '20px !important' }} />

                    <PriceHistoryRow
                      priceHistoryDetail={item.detail}
                      showMinimum={item.minimumPriceApplied}
                      minimumPrice={item.minimumPrice ?? null}
                      initialPrice={item.initialPrice!}
                      totalPrice={item.totalPrice}
                      setDarkMode={false}
                    />
                  </Card>
                )
              })
            : null}
        </Box>
      </Box>
    </Box>
  )
}

export default PriceHistoryModal
