// ** hooks
import useModal from '@src/hooks/useModal'

// ** style components
import { Box, Button, Card, CardContent, Grid } from '@mui/material'
import FallbackSpinner from '@src/@core/components/spinner'

// ** types
import { ClientDetailType, ClientMemoType } from '@src/types/client/client'

// ** components
import { Suspense } from 'react'
import ClientInfo from './company-info'
import ClientAddresses from './addresses'
import ContactPersons from './contact-persons'
import ClientMemo from './memo-for-client'

// ** mutation & fetch
import { useMutation, useQueryClient } from 'react-query'
import { deleteClient } from '@src/apis/client.api'

// ** toast
import { toast } from 'react-hot-toast'
import DeleteClientModal from '../../components/modals/delete-client-modal'
import CannotDeleteClientModal from '../../components/modals/cannot-delete-client.modal'
import { useRouter } from 'next/router'

type Props = {
  clientId: string | string[] | undefined
  clientInfo: ClientDetailType | null
  memo: { data: Array<ClientMemoType>; count: number }
  isUpdatable: boolean
  isDeletable: boolean
  isCreatable: boolean
}

export default function ClientProfile({
  clientId,
  clientInfo,
  memo,
  isUpdatable,
  isDeletable,
  isCreatable,
}: Props) {
  const router = useRouter()
  const { openModal, closeModal } = useModal()
  const id = Number(clientId)
  const queryClient = useQueryClient()

  const createClientMemoMutation = useMutation(() => deleteClient(id), {
    onSuccess: () => onMutationSuccess(),
    onError: () => onMutationError(),
  })

  function onMutationSuccess() {
    router.push('/client')
    return queryClient.invalidateQueries(`get-client/memo`)
  }
  function onMutationError() {
    toast.error('Something went wrong. Please try again.', {
      position: 'bottom-left',
    })
  }

  function onDelete() {
    if (clientInfo?.isReferred) {
      openModal({
        type: 'cannot-delete-client',
        children: (
          <CannotDeleteClientModal
            open={true}
            clientName={clientInfo?.name!}
            onClose={() => closeModal('cannot-delete-client')}
          />
        ),
      })
    } else {
      openModal({
        type: 'delete-client',
        children: (
          <DeleteClientModal
            open={true}
            clientName={clientInfo?.name!}
            onDelete={() => createClientMemoMutation.mutate()}
            onClose={() => closeModal('delete-client')}
          />
        ),
      })
    }
  }
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
                    onClick={onDelete}
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
