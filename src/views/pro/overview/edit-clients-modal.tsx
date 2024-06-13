import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  TextField,
  Typography,
} from '@mui/material'
import CustomModalV2 from '@src/@core/components/common-modal/custom-modal-v2'

import useModal from '@src/hooks/useModal'

import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import _ from 'lodash'
import { useGetClientList } from '@src/queries/client.query'
import { updateProClients } from '@src/apis/pro/pro-details.api'
import { displayCustomToast } from '@src/shared/utils/toast'

type Props = {
  clients: Array<{ label: string; value: number }>

  onClose: () => void
  userId: number
}

const EditClientsModal = ({ clients, onClose, userId }: Props) => {
  const { openModal, closeModal } = useModal()
  const queryClient = useQueryClient()

  const [clientList, setClientList] = useState<
    {
      label: string
      value: number
    }[]
  >([])

  const [selectedClients, setSelectedClients] = useState<
    Array<{
      label: string
      value: number
    }>
  >(clients)

  const updateClientsMutation = useMutation(
    (data: number[]) => updateProClients(userId, data),
    {
      onSuccess: () => {
        displayCustomToast('Saved successfully', 'success')
        onClose()
        queryClient.invalidateQueries('pro-overview')
        queryClient.invalidateQueries('proClients')
      },
    },
  )

  const { data: allClients, isLoading: clientListLoading } = useGetClientList({
    take: 1000,
    skip: 0,
    sort: 'name',
    ordering: 'asc',
  })

  useEffect(() => {
    if (allClients && !clientListLoading) {
      const res = allClients.data.map(client => ({
        label: client.name,
        value: client.clientId,
      }))
      setClientList(res)
    }
  }, [allClients, clientListLoading])

  return (
    <Box
      sx={{
        maxWidth: '420px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
      }}
    >
      <Box
        sx={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <Typography fontSize={20} fontWeight={500}>
          Clients
        </Typography>
        <Box>
          <Autocomplete
            multiple
            fullWidth
            options={clientList}
            value={selectedClients}
            onChange={(e, v) => {
              setSelectedClients(v)
            }}
            getOptionLabel={option => option.label}
            isOptionEqualToValue={(option, newValue) => {
              return option.value === newValue.value
            }}
            disableCloseOnSelect
            limitTags={1}
            renderInput={params => <TextField {...params} autoComplete='off' />}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox checked={selected} sx={{ mr: 2 }} />
                {option.label}
              </li>
            )}
          />
        </Box>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <Button
            variant='outlined'
            onClick={() => {
              if (_.isEqual(clients.sort(), selectedClients.sort())) {
                onClose()
              } else {
                openModal({
                  type: 'DiscardChangesModal',
                  children: (
                    <CustomModalV2
                      title='Discard changes?'
                      subtitle='The changes will not be updated.'
                      rightButtonText='Discard'
                      vary='error'
                      onClick={() => {
                        closeModal('DiscardChangesModal')
                        onClose()
                      }}
                      onClose={() => {
                        closeModal('DiscardChangesModal')
                      }}
                    />
                  ),
                })
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              if (_.isEqual(clients.sort(), selectedClients.sort())) {
                onClose()
              } else {
                openModal({
                  type: 'SaveChangesModal',
                  children: (
                    <CustomModalV2
                      title='Save changes?'
                      subtitle='The changes will not be updated.'
                      rightButtonText='Save'
                      vary='successful'
                      onClick={() => {
                        closeModal('SaveChangesModal')
                        updateClientsMutation.mutate(
                          selectedClients.map(client => client.value),
                        )
                      }}
                      onClose={() => {
                        closeModal('SaveChangesModal')
                      }}
                    />
                  ),
                })
              }
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default EditClientsModal
