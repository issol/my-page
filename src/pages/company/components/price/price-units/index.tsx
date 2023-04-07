// ** React Imports
import { useState, useContext, useEffect } from 'react'

// ** context
import { ModalContext } from '@src/context/ModalContext'

// ** mui
import { Card, Chip, Grid, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import CardHeader from '@mui/material/CardHeader'

// ** logger
import logger from '@src/@core/utils/logger'

// ** types
import {
  PriceUnitFormType,
  PriceUnitType,
  deletePriceUnit,
  postPriceUnit,
  updatePriceUnit,
} from '@src/apis/price-units.api'

// ** components
import PriceUnitTable from './table'
import DeleteModal from './modal/delete-modal'
import CancelModal from './modal/cancel-baseprice-modal'

// ** action
import { useMutation } from 'react-query'
import { useGetPriceUnitList } from '@src/queries/price-units.query'
import { toast } from 'react-hot-toast'

export default function PriceUnits() {
  const [skip, setSkip] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [editModeRow, setEditModeRow] = useState<PriceUnitType>()
  const { setModal } = useContext(ModalContext)
  const [open, setOpen] = useState(false)

  const closeModal = () => setOpen(false)

  const { data: list, refetch } = useGetPriceUnitList({
    skip: skip * pageSize,
    take: pageSize,
  })

  const postMutation = useMutation(
    (form: PriceUnitFormType) => postPriceUnit(form),
    {
      onSuccess: () => {
        onMutationSuccess()
      },
      onError: () => {
        onMutationError()
      },
    },
  )

  const updateMutation = useMutation(
    ({ userId, form }: { userId: number; form: PriceUnitFormType }) =>
      updatePriceUnit(userId, form),
    {
      onSuccess: () => {
        cancelEditing()
        onMutationSuccess()
      },
      onError: () => {
        onMutationError()
      },
    },
  )

  const deleteMutation = useMutation(
    (userId: number) => deletePriceUnit(userId),
    {
      onSuccess: () => {
        onMutationSuccess()
      },
      onError: () => {
        onMutationError()
      },
    },
  )

  function onMutationError() {
    return toast.error('Something went wrong. Please try again.', {
      position: 'bottom-left',
    })
  }

  function onMutationSuccess() {
    return toast.success('Succeed!', {
      position: 'bottom-left',
    })
  }

  // useEffect(() => {
  //   refetch()
  // }, [skip, pageSize])

  // ** TODO : mock data이므로 지우기
  // const list = {
  //   data: [
  //     {
  //       id: 1,
  //       isBase: true,
  //       authorId: 5,
  //       title: '프라이스',
  //       unit: 'Fixed rate',
  //       weighting: 100,
  //       isActive: false,
  //       subPriceUnits: [
  //         {
  //           id: 1,
  //           title: 'Ehrsldkf',
  //           unit: 'Fixed rate',
  //           weighting: 80,
  //           isActive: true,
  //         },
  //       ],
  //     },
  //     {
  //       id: 2,
  //       isBase: false,
  //       title: '알라깔라',
  //       unit: 'Fixed rate',
  //       weighting: 100,
  //       isActive: false,
  //       subPriceUnits: [],
  //     },
  //   ],
  //   count: 2,
  // }

  function onEditClick(row: PriceUnitType) {
    setEditModeRow(row)
  }

  function addMutation(value: PriceUnitFormType) {
    postMutation.mutate(value)
  }
  function saveMutation(value: PriceUnitFormType) {
    updateMutation.mutate({ userId: editModeRow?.authorId!, form: value })
  }

  function onToggleActive(id: number, value: boolean) {
    updateMutation.mutate({ userId: id, form: { isActive: value } })
  }

  function cancelEditing() {
    setEditModeRow(undefined)
  }

  function onDeleteClick(row: PriceUnitType) {
    setModal(
      <DeleteModal
        row={row}
        onDelete={onDelete}
        onClose={() => setModal(null)}
      />,
    )
  }

  function onDelete(row: PriceUnitType) {
    logger.info(row)
    deleteMutation.mutate(row.authorId!)
  }

  const [row, setRow] = useState<PriceUnitType>()
  function onBasePriceClick(isChecked: boolean, row: PriceUnitType) {
    if (!isChecked) {
      setOpen(true)
      setRow({ ...row })
    } else {
      setEditModeRow({ ...row, isBase: true })
    }
  }

  function onCancelBasePrice() {
    //@ts-ignore
    setEditModeRow({ ...row, isBase: false, subPriceUnits: [] })
  }

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          title={
            <Box display='flex' justifyContent='space-between'>
              <Typography variant='h6'>
                Price units ({list?.count || 0})
              </Typography>
            </Box>
          }
        />
        <PriceUnitTable
          skip={skip}
          setSkip={setSkip}
          pageSize={pageSize}
          setPageSize={setPageSize}
          list={list ?? { data: [], count: 0 }}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          onBasePriceClick={onBasePriceClick}
          addMutation={addMutation}
          saveMutation={saveMutation}
          editModeRow={editModeRow}
          cancelEditing={cancelEditing}
          onToggleActive={onToggleActive}
        />
      </Card>
      <CancelModal
        open={open}
        onCancelBasePrice={onCancelBasePrice}
        onClose={closeModal}
      />
    </Grid>
  )
}
