import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Grid,
  Typography,
} from '@mui/material'
import { LinguistTeamListType } from '@src/types/pro/linguist-team'
import { MenuType } from '../..'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  data: {
    totalCount: number
    data: Array<LinguistTeamListType>
  }
  menu: MenuType
}

const LinguistTeamList = ({ data, menu }: Props) => {
  return (
    <Card>
      <CardHeader
        title={
          <Box display='flex' justifyContent='space-between'>
            <Typography variant='h6'>
              Linguist team ({data ? data.totalCount.toLocaleString() : 0})
            </Typography>
            <Button variant='contained'>Create new team</Button>
          </Box>
        }
        sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
      ></CardHeader>

      {menu === 'card' ? (
        <>
          <Divider />
          <Grid sx={{ padding: '20px' }} container spacing={6} rowSpacing={4}>
            {data.data.map((item, index) => {
              return (
                <Grid key={uuidv4()} item>
                  <Card sx={{ padding: '20px' }}>dd</Card>
                </Grid>
              )
            })}
          </Grid>
        </>
      ) : (
        <></>
      )}
    </Card>
  )
}

export default LinguistTeamList
