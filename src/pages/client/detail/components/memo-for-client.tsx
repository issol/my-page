import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { AbilityContext } from '@src/layouts/components/acl/Can'
import { Fragment, useContext, useEffect, useState } from 'react'

// ** hooks
import useModal from '@src/hooks/useModal'

// ** style components
import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'

// ** types & mutation
import { useMutation, useQueryClient } from 'react-query'
import { ClientMemoType } from '@src/types/client/client'
import {
  createClientMemo,
  deleteClientMemo,
  updateClientMemo,
  updateClientMemoType,
} from '@src/apis/client.api'

// ** helpers
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { FullDateTimezoneHelper } from 'src/shared/helpers/date.helper'

// ** components
import DiscardChangesModal from '@src/pages/components/modals/discard-modals/discard-changes'
import ConfirmSaveAllChanges from '@src/pages/components/modals/confirm-save-modals/confirm-save-all-chages'
import DeleteCommentModal from '@src/pages/components/pro-detail-modal/modal/delete-comment-modal'
import CustomPagination from 'src/pages/components/custom-pagination'

// ** toast
import { toast } from 'react-hot-toast'
import SaveCommentModal from '@src/pages/components/pro-detail-modal/modal/save-comment-modal'
import { ClientMemoPostType } from '@src/types/client/client'
import CancelSaveCommentModal from '@src/pages/components/pro-detail-modal/modal/cancel-comment-modal'

// ** permission class
import { client_comment } from '@src/shared/const/permission-class'
import FallbackSpinner from '@src/@core/components/spinner'

type Props = {
  clientId: number
  memo: { data: Array<ClientMemoType>; count: number }
}

export default function ClientMemo({ clientId, memo }: Props) {
  const ability = useContext(AbilityContext)

  const auth = useRecoilValueLoadable(authState)
  const User = new client_comment(auth.getValue().user?.id!)

  const isUpdatable = ability.can('update', User)
  const isDeletable = ability.can('delete', User)

  const queryClient = useQueryClient()

  const { openModal, closeModal } = useModal()

  const [page, setPage] = useState(0)
  const [isCreate, setIsCreate] = useState(false)
  const [currentMemo, setCurrentMemo] = useState<{
    memoId: number | null
    memo: string
  }>({ memoId: 0, memo: '' })
  const [currentMemoList, setCurrentMemoList] = useState<Array<ClientMemoType>>(
    [],
  )
  const [newMemo, setNewMemo] = useState('')

  const modalType = {
    discardCommentChange: 'discardCommentChange',
    confirmSave: 'confirmSave',
    confirmDelete: 'confirmDelete',
    confirmCreate: 'confirmCreate',
    discardCommentCreate: 'discardCommentCreate',
  }

  const ROWS_PER_PAGE = 3

  const handlePageChange = (direction: string) => {
    const changedPage =
      direction === 'prev'
        ? Math.max(page - 1, 0)
        : direction === 'next'
        ? page + 1
        : 0

    setPage(changedPage)
  }

  useEffect(() => {
    setCurrentMemoList(
      memo.data.slice(
        page * ROWS_PER_PAGE,
        page * ROWS_PER_PAGE + ROWS_PER_PAGE,
      ),
    )
  }, [page, memo])

  const createClientMemoMutation = useMutation(
    (data: ClientMemoPostType) => createClientMemo(data),
    {
      onSuccess: () => onMutationSuccess(),
      onError: () => onMutationError(),
    },
  )

  const updateClientMemoMutation = useMutation(
    (data: updateClientMemoType) =>
      updateClientMemo({ memoId: data.memoId, memo: data.memo }),
    {
      onSuccess: () => onMutationSuccess(),
      onError: () => onMutationError(),
    },
  )

  const deleteClientMemoMutation = useMutation(
    (memoId: number) => deleteClientMemo(memoId),
    {
      onSuccess: () => onMutationSuccess(),
      onError: () => onMutationError(),
    },
  )

  function onMutationSuccess() {
    setCurrentMemo({ memoId: null, memo: '' })
    setNewMemo('')
    setIsCreate(false)
    return queryClient.invalidateQueries(`get-client/memo`)
  }
  function onMutationError() {
    setCurrentMemo({ memoId: null, memo: '' })
    setNewMemo('')
    setIsCreate(false)
    toast.error('Something went wrong. Please try again.', {
      position: 'bottom-left',
    })
  }

  function setEditor(item: ClientMemoType) {
    setCurrentMemo({ memoId: item.id, memo: item.memo })
  }

  function onConfirm() {
    if (isCreate && auth.state === 'hasValue') {
      openModal({
        type: modalType.confirmCreate,
        children: (
          <SaveCommentModal
            open={true}
            saveComment={() => {
              createClientMemoMutation.mutate({
                clientId,
                writerId: auth.getValue().user?.id!,
                writerFirstName: auth.getValue().user?.firstName!,
                writerMiddleName: auth.getValue().user?.middleName!,
                writerLastName: auth.getValue().user?.lastName!,
                writerEmail: auth.getValue().user?.email!,
                memo: newMemo,
              })
            }}
            onClose={() => closeModal(modalType.confirmCreate)}
          />
        ),
      })
    } else {
      openModal({
        type: modalType.confirmSave,
        children: (
          <ConfirmSaveAllChanges
            onSave={() => {
              updateClientMemoMutation.mutate({
                memoId: currentMemo.memoId as number,
                memo: currentMemo.memo,
              })
            }}
            onClose={() => closeModal(modalType.confirmSave)}
          />
        ),
      })
    }
  }

  function onSaveCancel() {
    if (isCreate) {
      openModal({
        type: modalType.discardCommentChange,
        children: (
          <CancelSaveCommentModal
            open={true}
            cancelSave={() => {
              setNewMemo('')
              setIsCreate(false)
            }}
            onClose={() => closeModal(modalType.discardCommentChange)}
          />
        ),
      })
    } else {
      openModal({
        type: modalType.discardCommentChange,
        children: (
          <DiscardChangesModal
            onDiscard={() => setCurrentMemo({ memoId: null, memo: '' })}
            onClose={() => closeModal(modalType.discardCommentChange)}
          />
        ),
      })
    }
  }

  function onDelete(item: ClientMemoType) {
    openModal({
      type: modalType.confirmDelete,
      children: (
        <DeleteCommentModal
          open={true}
          deleteComment={() => deleteClientMemoMutation.mutate(item.id)}
          onClose={() => closeModal(modalType.confirmDelete)}
        />
      ),
    })
  }

  return (
    <>
      {auth.state === 'loading' ? (
        <FallbackSpinner />
      ) : auth.state === 'hasValue' ? (
        <Card>
          <CardHeader
            title={
              <Box
                display='flex'
                alignItems='center'
                justifyContent='space-between'
              >
                <Typography variant='h6'>Memo for client</Typography>
                <Button
                  variant='contained'
                  disabled={!!currentMemo.memoId || isCreate}
                  onClick={() => setIsCreate(true)}
                >
                  Add comment
                </Button>
              </Box>
            }
          />
          <CardContent>
            {!isCreate ? null : (
              <Box display='flex' flexDirection='column' gap='10px'>
                <Divider />
                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                >
                  <Box display='flex' gap='8px' height={20} alignItems='center'>
                    <CustomChip
                      skin='light'
                      color='error'
                      size='small'
                      label='Writer'
                    />
                    <Typography variant='subtitle1' color='#666CFF'>
                      {getLegalName({
                        firstName: auth.getValue().user?.firstName!,
                        middleName: auth.getValue().user?.middleName,
                        lastName: auth.getValue().user?.lastName!,
                      })}
                    </Typography>
                    <Divider
                      component='div'
                      role='presentation'
                      orientation='vertical'
                      variant='middle'
                    />
                    <Typography variant='body2'>
                      {auth.getValue().user?.email}
                    </Typography>
                  </Box>
                </Box>
                <Box display='flex' flexDirection='column'>
                  <TextField
                    sx={{ margin: '16px 0' }}
                    multiline
                    maxRows={4}
                    value={newMemo}
                    onChange={e => setNewMemo(e.target.value)}
                    id='textarea-outlined-controlled'
                  />
                  <Box
                    display='flex'
                    gap='8px'
                    justifyContent='flex-end'
                    mb='16px'
                  >
                    <Button
                      color='secondary'
                      variant='outlined'
                      onClick={onSaveCancel}
                    >
                      Cancel
                    </Button>
                    <Button variant='contained' onClick={onConfirm}>
                      Confirm
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}
            {!currentMemoList?.length
              ? '-'
              : currentMemoList.map(item => (
                  <Box
                    key={item.id}
                    display='flex'
                    flexDirection='column'
                    gap='10px'
                  >
                    <Divider />
                    <Box
                      display='flex'
                      alignItems='center'
                      justifyContent='space-between'
                    >
                      <Box
                        display='flex'
                        gap='8px'
                        height={20}
                        alignItems='center'
                      >
                        <CustomChip
                          skin='light'
                          color='error'
                          size='small'
                          label='Writer'
                        />
                        <Typography
                          variant='subtitle1'
                          color={
                            auth.getValue().user?.id === item.writerId
                              ? '#666CFF'
                              : ''
                          }
                        >
                          {getLegalName({
                            firstName: item.writerFirstName,
                            middleName: item?.writerMiddleName,
                            lastName: item.writerLastName,
                          })}
                        </Typography>
                        <Divider
                          component='div'
                          role='presentation'
                          orientation='vertical'
                          variant='middle'
                        />
                        <Typography variant='body2'>
                          {item.writerEmail}
                        </Typography>
                      </Box>

                      {currentMemo.memoId !== item.id ? (
                        <Box>
                          {isUpdatable ? (
                            <IconButton
                              onClick={() => setEditor(item)}
                              disabled={!!currentMemo.memoId || isCreate}
                            >
                              <Icon icon='mdi:pencil-outline' />
                            </IconButton>
                          ) : null}
                          {isDeletable ? (
                            <IconButton
                              onClick={() => onDelete(item)}
                              disabled={!!currentMemo.memoId || isCreate}
                            >
                              <Icon icon='mdi:trash-outline' />
                            </IconButton>
                          ) : null}
                        </Box>
                      ) : null}
                    </Box>
                    {currentMemo.memoId !== item.id ? (
                      <Fragment>
                        <Typography variant='body2'>
                          {FullDateTimezoneHelper(
                            item.createdAt,
                            auth.getValue().user?.timezone.code!,
                          )}
                        </Typography>
                        <Typography>{item.memo}</Typography>
                      </Fragment>
                    ) : (
                      <Box display='flex' flexDirection='column'>
                        <TextField
                          sx={{ margin: '16px 0' }}
                          multiline
                          maxRows={4}
                          value={currentMemo.memo}
                          onChange={e =>
                            setCurrentMemo({
                              ...currentMemo,
                              memo: e.target.value,
                            })
                          }
                          id='textarea-outlined-controlled'
                        />
                        <Box
                          display='flex'
                          gap='8px'
                          justifyContent='flex-end'
                          mb='16px'
                        >
                          <Button
                            color='secondary'
                            variant='outlined'
                            onClick={onSaveCancel}
                          >
                            Cancel
                          </Button>
                          <Button variant='contained' onClick={onConfirm}>
                            Confirm
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </Box>
                ))}
            <CustomPagination
              listCount={memo?.data?.length ?? 0}
              page={page}
              handleChangePage={handlePageChange}
              rowsPerPage={ROWS_PER_PAGE}
            />
            <Divider />
          </CardContent>
        </Card>
      ) : null}
    </>
  )
}
