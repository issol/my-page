// ** React Imports
import { useState, Fragment, useContext } from 'react'

// ** context
import { ModalContext } from '@src/context/ModalContext'

import styled from 'styled-components'

// ** mui
import { Button, Card, Chip, Grid, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import CardHeader from '@mui/material/CardHeader'

// ** logger
import logger from '@src/@core/utils/logger'

// ** types
import { PriceUnitType } from '@src/apis/price-units.api'

// ** components
import PriceUnitTable from './table'
import DeleteModal from './modal/delete-modal'
import CancelModal from './modal/cancel-baseprice-modal'

/** TODO
 * 1. onEdit, onDelete함수 완성
 * 2. onDelete시 모달 추가 ❤️
 * 3. isActive 활성화 로직 추가
 * 4. editMode 컴포넌트 심기
 * 5. editMode가 있는 경우 나머지 row비활성화 처리
 * 6. subPrice도 display ❤️
 * 7. basePrice 체크/해제 시 모달 추가 ❤️
 * 8. basePrice 체크 시 자동 editMode되는 로직 추가
 *
 * add / edit모드 차이
 * edit모드에만 isActive체크하는게 있음
 * edit모드에는 Add버튼이 아닌 Save버튼이 있음 (모달도 다름)
 */

export default function PriceUnits() {
  const [skip, setSkip] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [editModeRow, setEditModeRow] = useState<PriceUnitType>()
  const { setModal } = useContext(ModalContext)
  const [open, setOpen] = useState(false)

  const closeModal = () => setOpen(false)

  // ** TODO : mock data이므로 지우기
  const list = {
    data: [
      {
        id: 1,
        isBase: true,
        authorId: 5,
        title: '프라이스',
        unit: 'Fixed rate',
        weighting: 100,
        isActive: false,
        subPriceUnits: [
          {
            id: 1,
            title: 'Ehrsldkf',
            unit: 'Fixed rate',
            weighting: 80,
            isActive: true,
          },
        ],
      },
      {
        id: 2,
        isBase: false,
        title: '알라깔라',
        unit: 'Fixed rate',
        weighting: 100,
        isActive: false,
        subPriceUnits: [],
      },
    ],
    totalCount: 2,
  }

  function onEditClick(row: PriceUnitType) {
    // logger.info(id)
    setEditModeRow(row)
  }

  function addMutation(value: PriceUnitType) {
    logger.info('addddd : ', value)
  }
  function saveMutation(value: PriceUnitType) {
    cancelEditing()
    logger.info('edddit : ', value)
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

  // ** TODO : delete api연결
  function onDelete(row: PriceUnitType) {
    logger.info(row)
  }

  function onBasePriceClick(isChecked: boolean, row: PriceUnitType) {
    // ** TODO : 현재 row의 id를 저장해야 함
    if (!isChecked) {
      setOpen(true)
    }
  }

  // ** TODO : basePrice체크를 해제하는 api호출. 이 api호출 시, subPrice는 모두 삭제되어야 함
  function onCancelBasePrice() {
    logger.info()
  }

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          title={
            <Box display='flex' justifyContent='space-between'>
              <Typography variant='h6'>
                Price units ({list?.totalCount | 0})
              </Typography>
            </Box>
          }
        />
        <PriceUnitTable
          skip={skip}
          setSkip={setSkip}
          pageSize={pageSize}
          setPageSize={setPageSize}
          list={list}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          onBasePriceClick={onBasePriceClick}
          addMutation={addMutation}
          saveMutation={saveMutation}
          editModeRow={editModeRow}
          cancelEditing={cancelEditing}
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
