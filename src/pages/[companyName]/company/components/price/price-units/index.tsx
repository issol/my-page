// ** React Imports
import { useState, useContext } from 'react'

// ** context

import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { AbilityContext } from '@src/layouts/components/acl/Can'

// ** mui
import { Card, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import CardHeader from '@mui/material/CardHeader'

// ** logger
import logger from '@src/@core/utils/logger'

// ** types
import {
  PriceUnitFormType,
  PriceUnitType,
  PriceUnitDataType,
} from '@src/types/common/standard-price'

// ** components
import PriceUnitTable from './table'

// ** action
import { QueryObserverResult, useMutation } from 'react-query'
import { toast } from 'react-hot-toast'
import { company_price } from '@src/shared/const/permission-class'
import {
  deletePriceUnit,
  postPriceUnit,
  updatePriceUnit,
} from '@src/apis/price-units.api'
import FallbackSpinner from '@src/@core/components/spinner'
import useModal from '@src/hooks/useModal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
type Props = {
  list: PriceUnitDataType
  refetch: (
    options?: any,
  ) => Promise<QueryObserverResult<PriceUnitDataType, unknown>>
  skip: number
  setSkip: (n: number) => void
  pageSize: number
  setPageSize: (n: number) => void
}
export default function PriceUnits({
  list,
  refetch,
  skip,
  setSkip,
  pageSize,
  setPageSize,
}: Props) {
  const auth = useRecoilValueLoadable(authState)
  const ability = useContext(AbilityContext)
  const { openModal, closeModal } = useModal()

  const [editModeRow, setEditModeRow] = useState<PriceUnitType>()

  function abilityCheck(can: 'create' | 'update' | 'delete', id: number) {
    const writer = new company_price(id)
    return ability.can(can, writer)
  }

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
    openModal({
      type: 'DeletePriceUnitModal',
      children: (
        <CustomModal
          title={
            !row.isBase
              ? 'Are you sure you want to delete this price unit?'
              : 'Are you sure you want to delete this base price unit? The associated price units will also be deleted.'
          }
          onClose={() => closeModal('DeletePriceUnitModal')}
          vary='error'
          onClick={() => {
            onDelete(row)
            closeModal('DeletePriceUnitModal')
          }}
          rightButtonText='Delete'
        />
      ),
    })
  }

  function onDelete(row: PriceUnitType) {
    logger.info(row)
    deleteMutation.mutate(row.id!)
  }

  const [row, setRow] = useState<PriceUnitType>()
  function onBasePriceClick(isChecked: boolean, row: PriceUnitType) {
    if (!isChecked) {
      // setOpen(true)

      openModal({
        type: 'CancelBasePriceModal',
        children: (
          <CustomModal
            title='Are you sure you want to cancel the base price setting? The associated
          price units will be deleted.'
            leftButtonText='No'
            rightButtonText='Cancel'
            onClose={() => closeModal('CancelBasePriceModal')}
            onClick={() => {
              onCancelBasePrice()
              closeModal('CancelBasePriceModal')
            }}
            vary='error'
          />
        ),
      })
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
    <>
      {auth.state === 'loading' ? (
        <FallbackSpinner />
      ) : auth.state === 'hasValue' ? (
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
              list={list ?? { data: [], count: 0, totalCount: 0 }}
              onEditClick={onEditClick}
              onDeleteClick={onDeleteClick}
              onBasePriceClick={onBasePriceClick}
              addMutation={addMutation}
              saveMutation={saveMutation}
              editModeRow={editModeRow}
              cancelEditing={cancelEditing}
              onToggleActive={onToggleActive}
              abilityCheck={abilityCheck}
              user={auth.getValue().user}
            />
          </Card>
        </Grid>
      ) : null}
    </>
  )
}
