import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'
import {
  ClientRequestStatusChip,
  JobTypeChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
import { useGetClientRequestDetail } from '@src/queries/requests/client-request.query'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import RequestDetailCard from './components/detail/request-detail'

export default function RequestDetail() {
  const router = useRouter()
  const { id } = router.query

  const { data } = useGetClientRequestDetail(Number(id))

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ background: '#fff', borderRadius: '8px', padding: '16px' }}>
          <Box display='flex' alignItems='center' gap='8px'>
            <IconButton onClick={() => router.back()}>
              <Icon icon='material-symbols:arrow-back-ios-new-rounded' />
            </IconButton>
            <img
              src='/images/icons/request-icons/airplane.png'
              aria-hidden
              alt='request detail'
            />
            <Typography variant='h6'>{data?.corporationId}</Typography>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={9}>
        <Card sx={{ padding: '24px' }}>
          <RequestDetailCard data={data} />
        </Card>
        <Grid item xs={4} mt='24px'>
          <Card sx={{ padding: '24px' }}>
            <Button fullWidth variant='outlined' color='error'>
              Cancel this request
            </Button>
          </Card>
        </Grid>
      </Grid>
      <Grid item xs={3}>
        <Box>
          <Card sx={{ padding: '24px' }}>
            <Typography fontWeight='bold'>Notes</Typography>
            <Typography variant='body2' mt='24px'>
              ㄴㅇㄹ
              {data?.notes ? data?.notes : '-'}
            </Typography>
          </Card>
        </Box>
      </Grid>
    </Grid>
  )
}

const LabelContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 2fr;
`
const CustomTypo = styled(Typography)`
  font-size: 14px;
`

const ItemBox = styled(Box)`
  padding: 20px;
  border-radius: 10px;
  background: #f5f5f5;
`

RequestDetail.acl = {
  subject: 'client_request',
  action: 'read',
}
