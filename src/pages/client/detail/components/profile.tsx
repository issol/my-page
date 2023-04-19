import { Box, Button, Card, CardContent, Grid } from '@mui/material'
import FallbackSpinner from '@src/@core/components/spinner'

import { ClientDetailType, ClientMemoType } from '@src/types/client/client'

// ** components
import { Suspense } from 'react'
import ClientInfo from './company-info'
import ClientAddresses from './addresses'
import ContactPersons from './contact-persons'
import ClientMemo from './memo-for-client'

type Props = {
  userInfo: ClientDetailType | null
  memo: { data: Array<ClientMemoType>; count: number }
}
/**
 * TODO
 * delete client
 * form controls
 *
 */
export default function ClientProfile({ userInfo, memo }: Props) {
  return (
    <Suspense fallback={<FallbackSpinner />}>
      <Grid container spacing={6} mt='0px'>
        {userInfo ? (
          <Grid item xs={4}>
            <Box display='flex' flexDirection='column' gap='24px'>
              <ClientInfo userInfo={userInfo} />
              <ClientAddresses userInfo={userInfo} />
              <Card>
                <CardContent>
                  <Button variant='outlined' color='error' fullWidth>
                    Delete this client
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        ) : null}

        <Grid item xs={8}>
          <Box display='flex' flexDirection='column' gap='24px'>
            {userInfo ? <ContactPersons userInfo={userInfo} /> : null}
            {memo ? <ClientMemo memo={memo} /> : null}
          </Box>
        </Grid>
      </Grid>
    </Suspense>
  )
}
