import { Icon } from '@iconify/react'
import { Box, Grid, IconButton } from '@mui/material'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import { MouseEvent, useState } from 'react'
import { SyntheticEvent } from 'react-draft-wysiwyg'
import styled from 'styled-components'
import HistoryAssignPro from './history-assign-pro'

type Props = {
  id: number
  title: string
  onClose: () => void
}

/* TODO
  JobInfo, Prices 컴포넌트 이식하기
  Assign pro에 데이터 제대로 넘기기

*/
export default function HistoryDetail({ id, title, onClose }: Props) {
  const [value, setValue] = useState<string>('jobInfo')

  const [proListSkip, setProListSkip] = useState(0)
  const [proPageSize, setProPageSize] = useState(10)

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box display='flex' alignItems='center' gap='8px'>
          <IconButton onClick={onClose}>
            <Icon icon='material-symbols:arrow-back-ios-new' />
          </IconButton>
          <Typography variant='h6'>{title}</Typography>
        </Box>
      </Grid>

      <TabContext value={value}>
        <Grid item xs={12}>
          <TabList
            onChange={handleChange}
            aria-label='Job History detail tab menu'
            style={{
              borderBottom: '1px solid rgba(76, 78, 100, 0.12)',
            }}
          >
            <CustomTab
              value='jobInfo'
              label='Job info'
              iconPosition='start'
              icon={<Icon icon='iconoir:large-suitcase' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            <CustomTab
              value='prices'
              label='Prices'
              iconPosition='start'
              icon={<Icon icon='mdi:dollar' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            <CustomTab
              value='assignPro'
              label='Assign pro'
              iconPosition='start'
              icon={<Icon icon='mdi:account-outline' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
          </TabList>
        </Grid>
        <Grid item xs={12}>
          <TabPanel value='jobInfo'>
            <Typography>
              Cake apple pie chupa chups biscuit liquorice tootsie roll
              liquorice sugar plum. Cotton candy wafer wafer jelly cake caramels
              brownie gummies.
            </Typography>
          </TabPanel>
          <TabPanel value='prices'>
            <Typography>
              Chocolate bar carrot cake candy canes sesame snaps. Cupcake pie
              gummi bears jujubes candy canes. Chupa chups sesame snaps halvah.
            </Typography>
          </TabPanel>
          <TabPanel value='assignPro'>
            <HistoryAssignPro
              list={{ data: [], totalCount: 0 }}
              isLoading={false}
              pageSize={proPageSize}
              setPageSize={setProPageSize}
              skip={proListSkip}
              setSkip={setProListSkip}
            />
          </TabPanel>
        </Grid>
      </TabContext>
    </Grid>
  )
}

const CustomTab = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`
