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
  clientId: string | string[] | undefined
  clientInfo: ClientDetailType | null
  memo: { data: Array<ClientMemoType>; count: number }
  isUpdatable: boolean
  isDeletable: boolean
  isCreatable: boolean
}
/**
 * TODO
 * delete client
 *
 */
export default function ClientProfile({
  clientId,
  clientInfo,
  memo,
  isUpdatable,
  isDeletable,
  isCreatable,
}: Props) {
  const id = Number(clientId)

  return (
    <Suspense fallback={<FallbackSpinner />}>
      <Grid container spacing={6} mt='0px'>
        {clientInfo && !!id ? (
          <Grid item xs={4}>
            <Box display='flex' flexDirection='column' gap='24px'>
              <ClientInfo
                isUpdatable={isUpdatable}
                isDeletable={isDeletable}
                isCreatable={isCreatable}
                clientId={id}
                clientInfo={clientInfo}
              />
              <ClientAddresses
                isUpdatable={isUpdatable}
                isDeletable={isDeletable}
                isCreatable={isCreatable}
                clientId={id}
                clientInfo={clientInfo}
              />
              <Card>
                <CardContent>
                  <Button
                    variant='outlined'
                    color='error'
                    fullWidth
                    disabled={!isDeletable}
                  >
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
              <ContactPersons
                isUpdatable={isUpdatable}
                isDeletable={isDeletable}
                isCreatable={isCreatable}
                clientId={id}
                clientInfo={clientInfo}
              />
            ) : null}
            {memo && !!id ? <ClientMemo clientId={id} memo={memo} /> : null}
          </Box>
        </Grid>
      </Grid>
    </Suspense>
  )
}
