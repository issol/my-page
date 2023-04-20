import { Box, Button, Card, CardContent, Grid } from '@mui/material'
import FallbackSpinner from '@src/@core/components/spinner'

import { ClientDetailType, ClientMemoType } from '@src/types/client/client'

// ** components
import { Suspense } from 'react'
import ClientInfo from './company-info'
import ClientAddresses from './addresses'
import ContactPersons from './contact-persons'
import ClientMemo from './memo-for-client'
import { useMutation, useQueryClient } from 'react-query'
import {
  updateClientInfo,
  updateClientInfoType,
  updateClientStatus,
} from '@src/apis/client.api'
import { toast } from 'react-hot-toast'

type Props = {
  clientId: string | string[] | undefined
  clientInfo: ClientDetailType | null
  memo: { data: Array<ClientMemoType>; count: number }
}
/**
 * TODO
 * delete client
 *
 */
export default function ClientProfile({ clientId, clientInfo, memo }: Props) {
  const id = Number(clientId)
  const queryClient = useQueryClient()

  return (
    <Suspense fallback={<FallbackSpinner />}>
      <Grid container spacing={6} mt='0px'>
        {clientInfo && !!id ? (
          <Grid item xs={4}>
            <Box display='flex' flexDirection='column' gap='24px'>
              <ClientInfo clientId={id} clientInfo={clientInfo} />
              <ClientAddresses clientId={id} clientInfo={clientInfo} />
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
            {clientInfo && !!id ? (
              <ContactPersons clientId={id} clientInfo={clientInfo} />
            ) : null}
            {memo && !!id ? <ClientMemo clientId={id} memo={memo} /> : null}
          </Box>
        </Grid>
      </Grid>
    </Suspense>
  )
}
