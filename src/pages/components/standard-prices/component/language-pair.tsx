import { yupResolver } from '@hookform/resolvers/yup'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { v4 as uuidv4 } from 'uuid'
import {
  DataGrid,
  GridActionsCellItem,
  GridCellModes,
  GridCellModesModel,
  GridCellParams,
  GridColumns,
  GridEditRowsModel,
  GridEventListener,
  GridRowClassNameParams,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  MuiEvent,
} from '@mui/x-data-grid'
import languageHelper from '@src/shared/helpers/language.helper'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import { LanguagePairListType } from '@src/types/common/standard-price'

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useState,
  FocusEvent,
  useMemo,
} from 'react'

import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import useModal from '@src/hooks/useModal'
import LanguagePairActionModal from '../../standard-prices-modal/modal/language-pair-action-modal'

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
  onClickAddNewLanguagePair: () => void
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
  onClickAddNewLanguagePair,
  existPriceUnit,
}: Props) => {
  const { openModal, closeModal } = useModal()
  const [isEditingLanguagePair, setIsEditingLanguagePair] = useState(false)

  const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({})

  const getCellClassName = (
    params: GridCellParams<any, LanguagePairListType, any>,
  ) => {
    // console.log(params)
    const isEditMode = params.cellMode === 'edit'
    return isEditMode
      ? 'edit-row'
      : params.field === 'action'
      ? 'action-row'
      : ''
  }

  const [editRowsModel, setEditRowsModel] = useState<GridEditRowsModel>({})

  const handleEditRowModelChange = useCallback((model: GridEditRowsModel) => {
    setEditRowsModel(model)
  }, [])

  const handleSave = useCallback(() => {
    // Save the changes to your data store here
    console.log(editRowsModel)
    setIsEditingLanguagePair(false)
    setEditRowsModel({})
  }, [editRowsModel])

  const handleDelete = (id: number) => {
    console.log(`${id} deleted`)
  }

  const handleEditCancel = () => {
    setEditRowsModel({})
    setIsEditingLanguagePair(false)
  }

  const onClickEditLanguagePair = () => {
    setIsEditingLanguagePair(true)
  }

  const onClickCancelEditLanguagePair = () => {
    openModal({
      type: 'editCancelLanguagePairModal',
      children: (
        <LanguagePairActionModal
          type='Cancel'
          onClose={() => closeModal('editCancelLanguagePairModal')}
          onClickAction={() => handleEditCancel()}
        />
      ),
    })
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
    console.log('delete')
  }

  const handleCellKeyDown = useCallback<GridEventListener<'cellKeyDown'>>(
    (params, event) => {
      if (event.key === 'Enter') {
        event.defaultMuiPrevented = true
        console.log(params)
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
      editable: isEditingLanguagePair,
      renderHeader: () => <Box>Price factor</Box>,
      renderCell: ({ row }: { row: LanguagePairListType }) => (
        <Box>
          {row.currency === 'USD' || row.currency === 'SGD'
            ? '$'
            : row.currency === 'KRW'
            ? '₩'
            : row.currency === 'JPY'
            ? '¥'
            : '-'}
          &nbsp;
          {row.priceFactor}
        </Box>
      ),
    },
    {
      flex: 0.172,
      minWidth: 102,
      field: 'minimumPrice',
      headerName: 'Min. price',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      editable: isEditingLanguagePair,
      renderHeader: () => <Box>Min. price</Box>,
      renderCell: ({ row }: { row: LanguagePairListType }) => (
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
            {isEditingLanguagePair ? (
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
                  onClick={onClickEditLanguagePair}
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
          onClick={onClickAddNewLanguagePair}
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
          // disableSelectionOnClick
          hideFooterSelectedRowCount
          paginationMode='server'
          pageSize={listPageSize}
          rowsPerPageOptions={[5, 10, 25, 50]}
          page={listPage}
          rowCount={listCount ?? 0}
          onCellClick={onCellClick}
          editRowsModel={editRowsModel}
          onEditRowsModelChange={handleEditRowModelChange}
          onCellKeyDown={handleCellKeyDown}
          onCellFocusOut={(params, event) => (event.defaultMuiPrevented = true)}
          getCellClassName={getCellClassName}
          // cellModesModel={cellModesModel}
          // onCellModesModelChange={model => setCellModesModel(model)}
          onPageChange={(newPage: number) => {
            // setFilters((prevState: OnboardingFilterType) => ({
            //   ...prevState,
            //   skip: newPage * onboardingListPageSize,
            // }))
            setListPage(newPage)
          }}
          onPageSizeChange={(newPageSize: number) => {
            // setFilters((prevState: OnboardingFilterType) => ({
            //   ...prevState,
            //   take: newPageSize,
            // }))
            setListPageSize(newPageSize)
          }}
        />
      </Box>
    </Card>
  )
}

export default LanguagePair
