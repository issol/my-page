// ** React Imports
import { useState, useContext, useEffect } from 'react'

// ** context
import { ModalContext } from '@src/context/ModalContext'
import { AuthContext } from '@src/context/AuthContext'
import { AbilityContext } from '@src/layouts/components/acl/Can'

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
import { company_price } from '@src/shared/const/permission-class'

export default function PriceUnits() {
  const { user } = useContext(AuthContext)
  const ability = useContext(AbilityContext)

  const [skip, setSkip] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [editModeRow, setEditModeRow] = useState<PriceUnitType>()
  const { setModal } = useContext(ModalContext)
  const [open, setOpen] = useState(false)

  const closeModal = () => setOpen(false)

  function abilityCheck(can: 'create' | 'update' | 'delete', id: number) {
    const writer = new company_price(id)
    return ability.can(can, writer)
  }

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
    ({ id, form }: { id: number; form: PriceUnitFormType }) =>
      updatePriceUnit(id, form),
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

  const deleteMutation = useMutation((id: number) => deletePriceUnit(id), {
    onSuccess: () => {
      onMutationSuccess()
    },
    onError: () => {
      onMutationError()
    },
  })

  function onMutationError() {
    return toast.error('Something went wrong. Please try again.', {
      position: 'bottom-left',
    })
  }

  function onMutationSuccess() {
    refetch()
    return toast.success('Succeed!', {
      position: 'bottom-left',
    })
  }

  function onEditClick(row: PriceUnitType) {
    setEditModeRow(row)
  }

  function addMutation(value: PriceUnitFormType) {
    postMutation.mutate(value)
  }
  function saveMutation(value: PriceUnitFormType) {
    updateMutation.mutate({ id: editModeRow?.id!, form: value })
  }

  function onToggleActive(id: number, value: boolean) {
    updateMutation.mutate({ id: id, form: { isActive: value } })
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
    deleteMutation.mutate(row.id!)
  }

  const [row, setRow] = useState<PriceUnitType>()
  function onBasePriceClick(isChecked: boolean, row: PriceUnitType) {
    if (!isChecked) {
      setOpen(true)
      setRow({ ...row })
    } else {
      setEditModeRow({
        ...row,
        isBase: true,
        weighting: 100,
        subPriceUnits: [
          {
            title: row.title,
            unit: row.unit,
            weighting: 100,
            isActive: true,
            id: 0,
            parentPriceUnitId: null,
            isBase: false,
          },
        ],
      })
    }
  }

  function onCancelBasePrice() {
    //@ts-ignore
    setEditModeRow({
      ...row,
      isBase: false,
      weighting: null,
      subPriceUnits: [],
    })
  }

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          title={
            <Box display='flex' justifyContent='space-between'>
              <Typography variant='h6'>
                Price units ({list?.totalCount || 0})
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
          abilityCheck={abilityCheck}
          user={user}
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