import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import {
  DataGrid,
  GridCellParams,
  GridColumns,
  GridEventListener,
  MuiEvent,
} from '@mui/x-data-grid'
import languageHelper from '@src/shared/helpers/language.helper'
import { LanguagePairListType } from '@src/types/common/standard-price'

import { Dispatch, SetStateAction, useCallback, useState } from 'react'

import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import useModal from '@src/hooks/useModal'
import LanguagePairActionModal from '../standard-prices-modal/modal/language-pair-action-modal'

import styled from 'styled-components'
import { formatCurrency } from '@src/shared/helpers/price.helper'

type Props = {
  list: LanguagePairListType[]
  listCount: number
  isLoading: boolean
  listPage: number
  setListPage: Dispatch<SetStateAction<number>>
  listPageSize: number
  setListPageSize: Dispatch<SetStateAction<number>>
  onCellClick: (
    params: GridCellParams,
    event: MuiEvent<React.MouseEvent>,
  ) => void
  onAddLanguagePair: () => void
  onEditLanguagePair: (data: LanguagePairListType) => void
  onDeleteLanguagePair: (id: any) => void
  existPriceUnit: boolean
}

const LanguagePair = ({
  list,
  listCount,
  isLoading,
  listPage,
  setListPage,
  listPageSize,
  setListPageSize,
  onCellClick,
  onAddLanguagePair,
  onEditLanguagePair,
  onDeleteLanguagePair,
  existPriceUnit,
}: Props) => {
  const { openModal, closeModal } = useModal()

  const getCellClassName = (
    params: GridCellParams<any, LanguagePairListType, any>,
  ) => {
    const isEditMode = params.cellMode === 'edit'
    return isEditMode
      ? 'edit-row'
      : params.field === 'action'
      ? 'action-row'
      : ''
  }

  const [rowToEdit, setRowToEdit] = useState<LanguagePairListType | null>(null)

  const handleSave = useCallback(() => {
    // Save the changes to your data store here
    onEditLanguagePair(rowToEdit!)
    setRowToEdit(null)
  }, [rowToEdit])

  const handleDelete = (id: number) => {
    onDeleteLanguagePair(id)
  }

  const handleEditCancel = () => {
    setRowToEdit(null)
  }

  const onClickEditLanguagePair = (row: LanguagePairListType) => {
    setRowToEdit(row)
  }

  const onClickCancelEditLanguagePair = () => {
    handleEditCancel()
  }

  const onClickSaveEditLanguagePair = () => {
    openModal({
      type: 'editSaveLanguagePairModal',
      children: (
        <LanguagePairActionModal
          type='Save'
          onClose={() => closeModal('editSaveLanguagePairModal')}
          onClickAction={() => handleSave()}
        />
      ),
    })
  }

  const onClickDeleteLanguagePair = (row: LanguagePairListType) => {
    openModal({
      type: 'deleteLanguagePairModal',
      children: (
        <LanguagePairActionModal
          type='Delete'
          onClose={() => closeModal('deleteLanguagePairModal')}
          onClickAction={() => handleDelete(row.id)}
          source={row.source}
          target={row.target}
        />
      ),
    })
    // console.log('delete')
  }

  const handleCellKeyDown = useCallback<GridEventListener<'cellKeyDown'>>(
    (params, event) => {
      if (event.key === 'Enter') {
        event.defaultMuiPrevented = true
        // console.log(params)
      }
    },
    [],
  )

  const columns: GridColumns<LanguagePairListType> = [
    {
      flex: 0.5143,
      minWidth: 305,
      field: 'languages',
      headerName: 'Language pair',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,

      renderHeader: () => <Box>Language pair</Box>,
      renderCell: ({ row }: { row: LanguagePairListType }) => (
        <Box>
          <Box key={row.id}>
            <Typography
              variant='body1'
              sx={{ fontWeight: 600, fontSize: '14px' }}
            >
              {row.source && row.target ? (
                <>
                  {languageHelper(row.source)} &rarr;{' '}
                  {languageHelper(row.target)}
                </>
              ) : (
                '-'
              )}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      flex: 0.1922,
      minWidth: 114,
      field: 'priceFactor',
      headerName: 'Price factor',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Price factor</Box>,
      renderCell: ({ row }: { row: LanguagePairListType }) => {
        return (
          <>
            {!!rowToEdit && rowToEdit.id === row.id ? (
              <SmallInput
                type='number'
                value={rowToEdit.priceFactor}
                onChange={e =>
                  setRowToEdit({
                    ...rowToEdit,
                    priceFactor: Number(e.currentTarget.value),
                  })
                }
              />
            ) : (
              <Box>{formatCurrency(row.priceFactor, row.currency)}</Box>
            )}
          </>
        )
      },
    },
    {
      flex: 0.172,
      minWidth: 102,
      field: 'minimumPrice',
      headerName: 'Min. price',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Min. price</Box>,
      renderCell: ({ row }: { row: LanguagePairListType }) => (
        <>
          {!!rowToEdit && rowToEdit.id === row.id ? (
            <SmallInput
              type='number'
              value={rowToEdit.minimumPrice ?? ''}
              onChange={e =>
                setRowToEdit({
                  ...rowToEdit,
                  minimumPrice: Number(e.currentTarget.value),
                })
              }
            />
          ) : !row.minimumPrice ? (
            '-'
          ) : (
            <Box>
              {row.currency === 'USD' || row.currency === 'SGD'
                ? '$'
                : row.currency === 'KRW'
                ? '₩'
                : row.currency === 'JPY'
                ? '¥'
                : '-'}
              &nbsp;{row.minimumPrice}
            </Box>
          )}
        </>
      ),
    },
    {
      flex: 0.118,
      minWidth: 70,
      field: 'action',
      headerName: '',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      editable: false,
      renderHeader: () => <Box></Box>,
      cellClassName: 'action-row',

      renderCell: ({ row }: { row: LanguagePairListType }) => {
        return (
          <Box>
            {!!rowToEdit ? (
              <Box sx={{ display: 'flex', gap: '5px' }}>
                <Button
                  sx={{
                    width: '26px !important',
                    height: '26px',
                    minWidth: '26px !important',
                    padding: '0 !important',
                    border: 'none',
                    outline: 'none',
                  }}
                  type='button'
                  onClick={onClickCancelEditLanguagePair}
                >
                  <img
                    src='/images/icons/price-icons/lang-pair-cancel.svg'
                    alt=''
                  />
                </Button>

                <Button
                  variant='contained'
                  sx={{
                    width: '26px !important',
                    height: '26px',
                    minWidth: '26px !important',
                    padding: '0 !important',
                  }}
                  onClick={onClickSaveEditLanguagePair}
                >
                  <img
                    src='/images/icons/price-icons/lang-pair-check.svg'
                    alt=''
                  />
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: '5px' }}>
                <IconButton
                  onClick={() => onClickEditLanguagePair(row)}
                  size='small'
                  sx={{ padding: 0 }}
                >
                  <Icon icon='mdi:pencil-outline' />
                </IconButton>
                <IconButton
                  onClick={() => onClickDeleteLanguagePair(row)}
                  size='small'
                  sx={{ padding: 0 }}
                >
                  <Icon icon='mdi:delete-outline' />
                </IconButton>
              </Box>
            )}
          </Box>
        )
      },
    },
  ]

  return (
    <Card
      sx={{
        padding: '20px 0',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px 20px 20px',
        }}
      >
        <Typography variant='body1' sx={{ fontWeight: 600 }}>
          Language pairs ({listCount ?? 0})
        </Typography>
        <Button
          variant='contained'
          disabled={!existPriceUnit}
          size='small'
          onClick={onAddLanguagePair}
        >
          Add new pair
        </Button>
      </Box>
      <Box
        sx={{
          width: '100%',
          height: '262px',
          '& .MuiDataGrid-columnHeaderTitle': {
            textTransform: 'none',
          },
          '& .MuiDataGrid-main': {
            height: '214px',
          },
        }}
      >
        <DataGrid
          components={{
            NoRowsOverlay: () => {
              return (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                ></Box>
              )
            },
            NoResultsOverlay: () => {
              return (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  dd
                </Box>
              )
            },
          }}
          sx={{
            '& .edit-row': {
              outline: 'none !important',
              input: {
                border: '1px solid rgba(76, 78, 100, 0.22)',
                borderRadius: '6px',
                height: '30px',
                padding: '0px 8px',
              },
            },
            '& .action-row': {
              padding: '0 !important',
              display: 'flex',
              justifyContent: 'center',
            },
          }}
          columns={columns}
          loading={isLoading}
          editMode='row'
          rows={list ?? []}
          autoHeight
          hideFooterSelectedRowCount
          pageSize={listPageSize}
          rowsPerPageOptions={[5, 10, 25, 50]}
          page={listPage}
          rowCount={listCount ?? 0}
          onCellClick={onCellClick}
          onCellKeyDown={handleCellKeyDown}
          onCellFocusOut={(params, event) => (event.defaultMuiPrevented = true)}
          getCellClassName={getCellClassName}
          onPageChange={(newPage: number) => {
            setListPage(newPage)
          }}
          onPageSizeChange={(newPageSize: number) => {
            setListPageSize(newPageSize)
          }}
        />
      </Box>
    </Card>
  )
}

export default LanguagePair

const SmallInput = styled.input`
  max-width: 80px;
  padding: 4px;
  background: transparent;
  border: 1px solid rgba(76, 78, 100, 0.22);
  border-radius: 5px;
  /* Chrome, Safari, Edge, Opera */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  &[type='number'] {
    -moz-appearance: textfield;
  }
`
