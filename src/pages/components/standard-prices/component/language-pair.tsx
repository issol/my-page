import { yupResolver } from '@hookform/resolvers/yup'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
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
import {
  LanguagePairListType,
  LanguagePairParams,
  StandardPriceListType,
} from '@src/types/common/standard-price'

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
import {
  formatCurrency,
  countDecimalPlaces,
} from '@src/shared/helpers/price.helper'
import { useMutation, useQueryClient } from 'react-query'
import {
  deleteLanguagePair,
  patchLanguagePair,
} from '@src/apis/company/company-price.api'
import toast from 'react-hot-toast'
import { decimalPlace } from '@src/shared/const/price/decimalPlace'
import { useConfirmLeave } from '@src/hooks/useConfirmLeave'

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
  selectedLanguagePair: LanguagePairListType | null
  priceData: StandardPriceListType
  page: 'client' | 'pro'
}

interface SelectedCellParams {
  id: GridRowId
  field: string
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
  selectedLanguagePair,
  priceData,
  page,
}: Props) => {
  const { openModal, closeModal } = useModal()
  const queryClient = useQueryClient()
  const [isWarn, setIsWarn] = useState(false)
  const [selectedCellParams, setSelectedCellParams] =
    useState<SelectedCellParams | null>(null)
  const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({})
  const [isEditingLanguagePair, setIsEditingLanguagePair] = useState<
    number | null
  >(null)
  const handleCellFocus = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      const row = event.currentTarget.parentElement
      const id = row!.dataset.id!
      const field = event.currentTarget.dataset.field!
      setSelectedCellParams({ id, field })
    },
    [],
  )
  const cellMode = useMemo(() => {
    if (!selectedCellParams) {
      return 'view'
    }
    const { id, field } = selectedCellParams
    return cellModesModel[id]?.[field]?.mode || 'view'
  }, [cellModesModel, selectedCellParams])

  const patchLanguagePairMutation = useMutation(
    (value: { data: LanguagePairParams; id: number }) =>
      patchLanguagePair(value.data, value.id, page),
    {
      onSuccess: data => {
        // refetch()
        queryClient.invalidateQueries(`standard-${page}-prices`)

        toast.success(`Success`, {
          position: 'bottom-left',
        })
      },
      onError: error => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )

  const deleteLanguagePairMutation = useMutation(
    (id: number) => deleteLanguagePair(id, page),
    {
      onSuccess: data => {
        // refetch()
        queryClient.invalidateQueries(`standard-${page}-prices`)

        toast.success(`Success`, {
          position: 'bottom-left',
        })
      },
      onError: error => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )

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

  const [editRowsModel, setEditRowsModel] = useState<GridEditRowsModel>({})

  const handleEditRowModelChange = useCallback(
    (model: GridEditRowsModel, details: any) => {
      setEditRowsModel(model)
    },
    [],
  )

  const handleSave = useCallback(() => {
    if (isEditingLanguagePair !== null && selectedLanguagePair != null) {
      // console.log(editRowsModel[isEditingLanguagePair].priceFactor)
      const res = {
        source: selectedLanguagePair?.source,
        target: selectedLanguagePair.target,
        priceFactor:
          editRowsModel[isEditingLanguagePair].priceFactor.value.toString(),
        minimumPrice:
          editRowsModel[isEditingLanguagePair].minimumPrice.value.toString(),
        currency: priceData.currency,
      }

      patchLanguagePairMutation.mutate({ data: res, id: isEditingLanguagePair })
    }

    setIsEditingLanguagePair(null)
    setEditRowsModel({})
  }, [editRowsModel, isEditingLanguagePair, selectedLanguagePair])

  const handleDelete = (id: number) => {
    deleteLanguagePairMutation.mutate(id)
    // console.log(`${id} deleted`)
  }

  const handleEditCancel = () => {
    setIsWarn(false)
    setEditRowsModel({})
    setIsEditingLanguagePair(null)
    // setCellModes(prevModes => ({
    //   ...prevModes,
    //   [id]: GridCellModes.View,
    // }))
  }

  const onClickEditLanguagePair = (row: LanguagePairListType) => {
    setIsWarn(true)
    setEditRowsModel({
      [row.id]: {
        priceFactor: { mode: GridCellModes.Edit, value: row.priceFactor },
        minimumPrice: { mode: GridCellModes.Edit, value: row.minimumPrice },
      },
    })

    setIsEditingLanguagePair(row.id)
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
          onClickAction={() => {
            setIsWarn(false)
            handleSave()
          }}
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
  }

  const handleCellKeyDown = useCallback<GridEventListener<'cellKeyDown'>>(
    (params, event) => {
      if (event.key === 'Enter' || cellMode === 'edit') {
        event.defaultMuiPrevented = true
        // console.log(params)
      }
    },
    [cellMode],
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
        <Box
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          <Box key={row.id}>
            <Typography
              variant='body1'
              sx={{
                fontWeight: 600,
                fontSize: '14px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
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
      editable: selectedLanguagePair?.id === isEditingLanguagePair,
      renderHeader: () => <Box>Price factor</Box>,
      renderCell: ({ row }: { row: LanguagePairListType }) => (
        <Tooltip
          title={formatCurrency(
            row.priceFactor,
            row.currency,
            countDecimalPlaces(row.priceFactor),
          )}
          sx={{
            backgroundColor: 'black',
            color: 'white',
          }}
        >
          <Box
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {formatCurrency(
              row.priceFactor,
              row.currency,
              countDecimalPlaces(row.priceFactor),
            )}
          </Box>
        </Tooltip>
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
      editable: selectedLanguagePair?.id === isEditingLanguagePair,
      renderHeader: () => <Box>Min. price</Box>,
      renderCell: ({ row }: { row: LanguagePairListType }) => (
        <Tooltip
          title={formatCurrency(
            row.minimumPrice,
            row.currency,
            // price의 currency를 바꾸면 language pair의 currency가 같이 업데이트 되지 않는 이슈가 있음
            // 따라서 currency를 보고 decimalPlace 값을 컨트롤 하는것에 예외 케이스가 많아서, 우선은 decimalPlace 값이 10보다 클경우는 KRW, JPY로 보고
            // 그에 맞는 로직을 타도록 임시 수정 함
            priceData.decimalPlace >= 10
              ? countDecimalPlaces(priceData.decimalPlace)
              : priceData.decimalPlace,
          )}
          sx={{
            backgroundColor: 'black',
            color: 'white',
          }}
        >
          <Box
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {formatCurrency(
              row.minimumPrice,
              row.currency,
              priceData.decimalPlace >= 10
                ? countDecimalPlaces(priceData.decimalPlace)
                : priceData.decimalPlace,
            )}
          </Box>
        </Tooltip>
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
            {isEditingLanguagePair === row.id ? (
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

  const { ConfirmLeaveModal } = useConfirmLeave({
    // shouldWarn안에 isDirty나 isSubmitting으로 조건 줄 수 있음
    shouldWarn: isWarn,
  })

  return (
    <>
      <ConfirmLeaveModal />
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
                  ></Box>
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
            autoHeight={false}
            // disableSelectionOnClick
            hideFooterSelectedRowCount
            paginationMode='server'
            pageSize={listPageSize}
            rowsPerPageOptions={[5, 10, 25, 50]}
            page={listPage}
            rowCount={listCount ?? 0}
            onCellClick={onCellClick}
            onCellKeyDown={handleCellKeyDown}
            cellModesModel={cellModesModel}
            onCellModesModelChange={model => setCellModesModel(model)}
            editRowsModel={editRowsModel}
            onEditRowsModelChange={(editRowsModel, details) =>
              handleEditRowModelChange(editRowsModel, details)
            }
            onCellFocusOut={(params, event) =>
              (event.defaultMuiPrevented = true)
            }
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
    </>
  )
}

export default LanguagePair
