import Grid from '@mui/material/Grid'
import {
  GridItem,
  ReportItem,
  SectionTitle,
  SubDateDescription,
} from '@src/pages/dashboards/components/dashboardItem'
import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useDashboardReport } from '@src/queries/dashboard/dashnaord-lpm'

const Dashboards = () => {
  const { data } = useDashboardReport({ from: '', to: '' })

  return (
    <Grid container gap='24px' sx={{ minWidth: '1280px' }}>
      <Grid container gap='24px'>
        <GridItem width={290} height={76}>
          <div>sdfd</div>
        </GridItem>
        <GridItem height={76} sm>
          <div>sdfd</div>
        </GridItem>
        <GridItem width={76} height={76}>
          <div>sdfd</div>
        </GridItem>
      </Grid>
      <Grid container gap='24px'>
        <GridItem width={290} height={362}>
          <Box
            display='flex'
            flexDirection='column'
            sx={{ width: '100%', height: '100%' }}
          >
            <Box marginBottom='20px'>
              <SectionTitle>Report</SectionTitle>
              <SubDateDescription textAlign='left'>
                {dayjs('2023-01-24').format('MMMM D, YYYY')}
              </SubDateDescription>
              <Box
                component='ul'
                display='flex'
                flexDirection='column'
                sx={{ padding: 0 }}
              >
                {data &&
                  Object.entries(data).map(([key, value], index) => (
                    <ReportItem
                      key={`${key}-${index}`}
                      label={key}
                      value={value}
                      color='#FDB528'
                    />
                  ))}
              </Box>
            </Box>
          </Box>
        </GridItem>
        <GridItem height={362} sm>
          <div>sdfd</div>
        </GridItem>
      </Grid>
    </Grid>
  )
}

export default Dashboards

Dashboards.acl = {
  action: 'read',
  subject: 'members',
}
