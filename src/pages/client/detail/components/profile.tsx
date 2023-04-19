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
import { updateClientInfo } from '@src/apis/client.api'

type Props = {
  clientId: string | string[] | undefined
  clientInfo: ClientDetailType | null
  memo: { data: Array<ClientMemoType>; count: number }
}
/**
 * TODO
 * delete client
 * form controls
 *
 */
export default function ClientProfile({ clientInfo, memo }: Props) {
  const queryClient = useQueryClient()
  //queryClient.invalidateQueries('test-material-list')

  //   const updateCompanyInfoMutation = useMutation(
  //     (id: number) => updateClientInfo(id),
  //     {
  //       onSuccess: () => {
  //         router.push('/certification-test')
  //       },
  //       onError: () => {
  //         toast.error('Something went wrong. Please try again.', {
  //           position: 'bottom-left',
  //         })
  //       },
  //     },
  //   )

  return (
    <Suspense fallback={<FallbackSpinner />}>
      <Grid container spacing={6} mt='0px'>
        {clientInfo ? (
          <Grid item xs={4}>
            <Box display='flex' flexDirection='column' gap='24px'>
              <ClientInfo clientInfo={clientInfo} />
              <ClientAddresses clientInfo={clientInfo} />
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
            {clientInfo ? <ContactPersons clientInfo={clientInfo} /> : null}
            {memo ? <ClientMemo memo={memo} /> : null}
          </Box>
        </Grid>
      </Grid>
    </Suspense>
  )
}
