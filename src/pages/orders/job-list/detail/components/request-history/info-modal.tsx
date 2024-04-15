import { Icon } from '@iconify/react'
import { Box, IconButton, Typography, styled, Tab } from '@mui/material'
import {
  useGetJobInfo,
  useGetRequestedProHistory,
} from '@src/queries/order/job.query'
import { JobType } from '@src/types/common/item.type'
import { UseQueryResult } from 'react-query'
import Image from 'next/image'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import { MouseEvent, SyntheticEvent, useState } from 'react'
import TabPanel from '@mui/lab/TabPanel'
import HistoryJobInfo from './components/job-info'
import HistoryJobPrices from './components/job-prices'
import HistoryRequestedPro from './components/requested-pro'
import { useGetStatusList } from '@src/queries/common.query'

type Props = {
  onClose: any
  historyId: number
}

type MenuType = 'info' | 'prices' | 'requestedPro'

const InfoModal = ({ onClose, historyId }: Props) => {
  const [value, setValue] = useState<MenuType>('info')
  const { data } = useGetJobInfo(historyId, true) as UseQueryResult<
    JobType,
    unknown
  >

  const { data: requestedPro } = useGetRequestedProHistory(historyId)
  const { data: jobStatusList, isLoading: statusListLoading } =
    useGetStatusList('JobAssignment')

  const handleChange = (event: SyntheticEvent, newValue: MenuType) => {
    setValue(newValue)
  }

  console.log(requestedPro)

  return (
    <Box
      sx={{
        maxWidth: '1180px',
        maxHeight: '80vh',
        width: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
        position: 'relative',
      }}
    >
      <IconButton
        sx={{ position: 'absolute', top: '20px', right: '20px' }}
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
            [Round {data?.round}] {data?.corporationId}
          </Typography>
        </Box>

        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            aria-label='Order detail Tab menu'
            sx={{
              minHeight: '64px',
              height: '64px',
              paddingLeft: '20px',
              borderBottom: '1px solid rgba(76, 78, 100, 0.12)',
              display: 'flex',
              alignItems: 'end',
            }}
          >
            <CustomTab
              value='info'
              label={
                <Box
                  sx={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                  }}
                >
                  Job Info
                </Box>
              }
              iconPosition='start'
              icon={<Icon icon='iconoir:large-suitcase' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />

            <CustomTab
              value='prices'
              label={
                <Box
                  sx={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                  }}
                >
                  Prices
                </Box>
              }
              iconPosition='start'
              icon={<Icon icon='mdi:dollar' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            <CustomTab
              value='requestedPro'
              label={
                <Box
                  sx={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                  }}
                >
                  Requested Pros
                </Box>
              }
              iconPosition='start'
              icon={<Icon icon='mdi:person-outline' fontSize={18} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
          </TabList>
          <TabPanel value='info' sx={{ height: '100%', padding: 0 }}>
            {data ? <HistoryJobInfo jobInfo={data} /> : null}
          </TabPanel>
          <TabPanel value='prices' sx={{ height: '100%', padding: 0 }}>
            {data && data.initialPrice ? (
              <HistoryJobPrices jobInfo={data} />
            ) : null}
          </TabPanel>
          <TabPanel value='requestedPro' sx={{ height: '100%', padding: 0 }}>
            {jobStatusList && requestedPro ? (
              <HistoryRequestedPro
                jobStatusList={jobStatusList}
                requestedPro={requestedPro}
              />
            ) : null}
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
  )
}

export default InfoModal

const CustomTab = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`
