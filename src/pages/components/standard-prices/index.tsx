import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid/DataGrid'
import { getStandardPriceColumns } from '@src/shared/const/columns/standard-price'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Icon from 'src/@core/components/icon'

import Paper from '@mui/material/Paper'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { StandardPriceListType } from '@src/types/common/standard-price'
import {
  Dispatch,
  SetStateAction,
  useState,
  MouseEvent,
  useContext,
  useEffect,
} from 'react'
import { v4 as uuidv4 } from 'uuid'
import Divider from '@mui/material/Divider'
import { JobTypeChip, ServiceTypeChip } from '@src/@core/components/chips/chips'
import TablePagination from '@mui/material/TablePagination'

import { styled } from '@mui/material/styles'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'

import AddSavePriceModal from '../standard-prices-modal/dialog/add-save-price-modal'
import { ModalContext } from '@src/context/ModalContext'
import NoPriceUnitModal from '../standard-prices-modal/modal/no-price-unit-modal'
import PriceActionModal from '../standard-prices-modal/modal/price-action-modal'
import { AddPriceType } from '@src/types/company/standard-client-prices'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { standardPricesSchema } from '@src/types/schema/standard-prices.schema'
import { ServiceTypeList } from '@src/shared/const/service-type/service-types'

function Row(props: {
  row: StandardPriceListType
  onClickDeletePrice: (id: number) => void
  onClickEditPrice: (priceData: StandardPriceListType) => void
}) {
  const { row, onClickDeletePrice, onClickEditPrice } = props

  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const [selected, setSelected] = useState<number>(-1)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <TableRow
        sx={{
          '& > *': { borderBottom: 'unset' },
          maxHeight: '54px',
          height: '54px',
          display: 'flex',
        }}
        hover
        onClick={() => setSelected(row.id)}
        selected={row.id === selected}
      >
        <TableCell
          sx={{
            height: '54px',
            maxWidth: '50px',
            width: '50px',
            flex: 0.04,

            justifyContent: 'center',
            alignItems: 'center',
          }}
          size='small'
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <KeyboardArrowUpIcon color='action' />
            ) : (
              <KeyboardArrowDownIcon color='action' />
            )}
          </Box>
        </TableCell>
        <TableCell
          sx={{
            height: '54px',

            fontWeight: '400 !important',
            fontSize: '14px !important',
            // paddingRight: '0 !important',
            display: 'flex',
            alignItems: 'center',

            flex: 0.34,
          }}
          size='small'
        >
          <Box>{row.priceName}</Box>
        </TableCell>
        <TableCell
          sx={{
            height: '54px',

            padding: '16px 0',
            textAlign: 'center',
            flex: 0.0096,
          }}
        ></TableCell>
        <TableCell
          sx={{
            flex: 0.136,
            height: '54px',
            display: 'flex',
            alignItems: 'center',
          }}
          size='small'
        >
          <JobTypeChip type={row.category} label={row.category} />
        </TableCell>
        <TableCell
          sx={{
            height: '54px',

            padding: '16px 0',
            textAlign: 'center',
            flex: 0.0096,
          }}
        ></TableCell>
        <TableCell
          sx={{
            height: '54px',

            fontWeight: '400 !important',
            fontSize: '14px !important',
            // paddingRight: '0 !important',
            display: 'flex',
            alignItems: 'center',
            flex: 0.264,
          }}
          size='small'
        >
          <ServiceTypeChip label={row.serviceType[0]} />
        </TableCell>
        <TableCell
          sx={{
            height: '54px',

            padding: '16px 0',
            textAlign: 'center',
            flex: 0.0096,
          }}
        ></TableCell>
        <TableCell
          sx={{
            flex: 0.096,
            height: '54px',
            display: 'flex',
            alignItems: 'center',
          }}
          size='small'
        >
          {row.currency === 'USD'
            ? '$ USD'
            : row.currency === 'SGD'
            ? '$ SGD'
            : row.currency === 'KRW'
            ? '₩ KRW'
            : row.currency === 'JPY'
            ? '¥ JPY'
            : '-'}
        </TableCell>
        <TableCell
          sx={{
            height: '54px',

            padding: '16px 0',
            textAlign: 'center',
            flex: 0.0096,
          }}
        ></TableCell>
        <TableCell
          sx={{
            flex: 0.104,
            height: '54px',
            display: 'flex',
            alignItems: 'center',
          }}
          size='small'
        >
          {row.catBasis}
        </TableCell>
        <TableCell
          sx={{
            height: '54px',

            padding: '16px 0',
            textAlign: 'center',
            flex: 0.0096,
          }}
        ></TableCell>
        <TableCell
          sx={{
            height: '54px',

            fontWeight: '400 !important',
            fontSize: '14px !important',
            // borderBottom: 'unset',
            // paddingRight: '0 !important',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            flex: 0.056,
          }}
          size='small'
        >
          <IconButton
            sx={{ width: '24px', height: '24px', padding: 0 }}
            onClick={handleClick}
          >
            <Icon icon='mdi:dots-horizontal' />
          </IconButton>
          <Menu
            keepMounted
            elevation={8}
            anchorEl={anchorEl}
            id='customized-menu'
            onClose={handleClose}
            open={Boolean(anchorEl)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem sx={{ gap: 2 }} onClick={() => onClickEditPrice(row)}>
              <ListItemIcon
                sx={{
                  minWidth: '16px !important',
                  marginRight: '0 !important',
                }}
              >
                <Icon icon='mdi:pencil-outline' fontSize={16} />
              </ListItemIcon>
              <ListItemText primary='Edit' />
            </MenuItem>
            <MenuItem
              sx={{ gap: 2 }}
              onClick={() => onClickDeletePrice(row.id)}
            >
              <ListItemIcon
                sx={{
                  minWidth: '16px !important',
                  marginRight: '0 !important',
                }}
              >
                <Icon icon='mdi:delete-outline' fontSize={16} />
              </ListItemIcon>
              <ListItemText primary='Delete' />
            </MenuItem>
          </Menu>
        </TableCell>
      </TableRow>
      <TableRow selected={row.id === selected}>
        <TableCell colSpan={6} sx={{ p: '0 !important' }}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Grid container xs={12} padding='20px 60px'>
              <Grid item xs={4}>
                <Title>Number of decimal places</Title>
                <Desc>{row.decimalPlace}</Desc>
              </Grid>
              <Grid item xs={4}>
                <Title>Memo for price</Title>
                <Desc>{row.memoForPrice}</Desc>
              </Grid>
            </Grid>
            <Grid container xs={12} padding='0px 60px'>
              <Grid item xs={4}>
                <Title>Rounding procedure</Title>
                <Desc>{row.roundingProcedure}</Desc>
              </Grid>
            </Grid>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

type Props = {
  list: StandardPriceListType[]
  listCount: number
  isLoading: boolean
  standardClientPriceListPage: number
  setStandardClientPriceListPage: Dispatch<SetStateAction<number>>
  standardClientPriceListPageSize: number
  setStandardClientPriceListPageSize: Dispatch<SetStateAction<number>>
}
const StandardPrices = ({
  list,
  listCount,
  isLoading,
  standardClientPriceListPage,
  setStandardClientPriceListPage,
  standardClientPriceListPageSize,
  setStandardClientPriceListPageSize,
}: Props) => {
  const { setModal } = useContext(ModalContext)

  const [noPriceUnitModalOpen, setNoPriceUnitModalOpen] = useState(false)
  const [priceActionModalOpen, setPriceActionModalOpen] = useState(false)
  const [addSaveModalOpen, setAddSaveModalOpen] = useState(false)
  const [addingPriceData, setAddingPriceData] = useState<AddPriceType | null>(
    null,
  )
  const [selectedPriceData, setSelectedPriceData] =
    useState<StandardPriceListType | null>(null)
  const [selectedAction, setSelectedAction] = useState('')
  const [selectedModalType, setSelectedModalType] = useState('')
  const [serviceTypeList, setServiceTypeList] = useState(ServiceTypeList)

  const onClickAction = (type: string) => {
    setPriceActionModalOpen(false)
    if (type === 'Add' || type === 'Discard') {
      setAddSaveModalOpen(false)
      setAddingPriceData(null)
      // resetData()
    }
    console.log(type)
  }

  const onClickAddNewPrice = () => {
    // TODO Price unit 있는지 판단 후 alert 모달 띄우기
    // setNoPriceUnitModalOpen(true)
    // setSelectedPriceData(priceData)
    setSelectedModalType('Add')
    setAddSaveModalOpen(true)
  }

  const onClickEditPrice = (priceData: StandardPriceListType) => {
    console.log(priceData)

    setSelectedPriceData(priceData)
    setSelectedModalType('Edit')
    setAddSaveModalOpen(true)
    // setModal()
  }

  const onClickDeletePrice = (id: number) => {
    console.log('delete')
  }

  const onSubmit = (data: AddPriceType) => {
    console.log(data)
    setAddingPriceData(data)
    setSelectedAction(selectedModalType === 'Add' ? 'Add' : 'Save')
    setModal(null)
    setPriceActionModalOpen(true)

    setModal(
      <PriceActionModal
        priceData={addingPriceData!}
        type={selectedModalType === 'Add' ? 'Add' : 'Save'}
        onClickAction={onClickAction}
      />,
    )
  }

  const newModalOpen = () => {
    if (addSaveModalOpen) {
      if (selectedModalType === 'Edit') {
        return (
          <AddSavePriceModal
            open={addSaveModalOpen}
            onClose={() => setAddSaveModalOpen(false)}
            type={selectedModalType}
            setPriceActionModalOpen={setPriceActionModalOpen}
            setAddingPriceData={setAddingPriceData}
            setSelectedAction={setSelectedAction}
            onSubmit={onSubmit}
            serviceTypeList={serviceTypeList}
            setServiceTypeList={setServiceTypeList}
            selectedPriceData={selectedPriceData!}
            onClickAction={onClickAction}
            addingPriceData={addingPriceData!}
          />
        )
      } else if (selectedModalType === 'Add') {
        return (
          <AddSavePriceModal
            open={addSaveModalOpen}
            onClose={() => setAddSaveModalOpen(false)}
            type={selectedModalType}
            setPriceActionModalOpen={setPriceActionModalOpen}
            setAddingPriceData={setAddingPriceData}
            setSelectedAction={setSelectedAction}
            onSubmit={onSubmit}
            serviceTypeList={serviceTypeList}
            setServiceTypeList={setServiceTypeList}
            onClickAction={onClickAction}
            addingPriceData={addingPriceData!}
            // selectedPriceData={selectedPriceData!}
          />
        )
      }
    }
  }

  // useEffect(() => {
  //   if (selectedModalType === 'Edit' && selectedPriceData) {
  //     console.log('hi')
  //   } else {
  //     setValue('currency', { label: '$ USD', value: 'USD' })
  //     setValue('catBasis', { label: 'Words', value: 'Words' })
  //   }
  // }, [selectedModalType, selectedPriceData])

  return (
    <Grid container xs={12} spacing={6}>
      <NoPriceUnitModal
        open={noPriceUnitModalOpen}
        onClose={() => setNoPriceUnitModalOpen(false)}
      />
      {newModalOpen()}

      <Grid item xs={12}>
        <Card sx={{ padding: '20px 0' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 20px 20px 20px',
            }}
          >
            <Typography variant='h6'>
              Standard client prices ({listCount})
            </Typography>
            <Button variant='contained' onClick={onClickAddNewPrice}>
              Add new price
            </Button>
          </Box>
          {isLoading ? null : (
            <>
              <TableContainer component={Paper}>
                <Table aria-label='collapsible table'>
                  <TableHead
                    sx={{
                      background: '#F5F5F7',
                      maxHeight: '54px',
                      textTransform: 'none',
                      width: '100%',
                      display: 'flex',
                    }}
                  >
                    <TableRow
                      sx={{
                        maxHeight: '54px',
                        height: '54px',
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <TableCell
                        sx={{
                          height: '54px',

                          fontWeight: '400 !important',
                          flex: 0.04,
                          maxWidth: '50px',
                          width: '50px',
                        }}
                        size='small'
                      >
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <KeyboardArrowDownIcon color='action' />
                        </Box>
                      </TableCell>

                      <TableCell
                        sx={{
                          height: '54px',

                          fontWeight: '400 !important',
                          fontSize: '14px !important',
                          // paddingRight: '0 !important',
                          display: 'flex !important',
                          alignItems: 'center',
                          flex: 0.34,
                        }}
                        size='small'
                      >
                        <Box>Price name</Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          height: '54px',
                          width: '12px',
                          padding: '16px 0',
                          textAlign: 'center',
                          flex: 0.0096,
                        }}
                      >
                        <img
                          src='/images/icons/pro-icons/seperator.svg'
                          alt='sep'
                        />
                      </TableCell>

                      <TableCell
                        sx={{
                          height: '54px',

                          fontWeight: '400 !important',
                          fontSize: '14px !important',
                          // paddingRight: '0 !important',
                          display: 'flex',
                          alignItems: 'center',
                          flex: 0.136,
                        }}
                        size='small'
                      >
                        <Box>Category</Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          height: '54px',
                          width: '12px',
                          padding: '16px 0',
                          textAlign: 'center',
                          flex: 0.0096,
                        }}
                      >
                        <img
                          src='/images/icons/pro-icons/seperator.svg'
                          alt='sep'
                        />
                      </TableCell>

                      <TableCell
                        sx={{
                          height: '54px',

                          fontWeight: '400 !important',
                          fontSize: '14px !important',
                          // paddingRight: '0 !important',
                          display: 'flex',
                          alignItems: 'center',
                          flex: 0.264,
                        }}
                        size='small'
                      >
                        <Box>Service type</Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          height: '54px',

                          padding: '16px 0',
                          textAlign: 'center',
                          flex: 0.0096,
                        }}
                      >
                        <img
                          src='/images/icons/pro-icons/seperator.svg'
                          alt='sep'
                        />
                      </TableCell>

                      <TableCell
                        sx={{
                          height: '54px',

                          fontWeight: '400 !important',
                          fontSize: '14px !important',
                          // paddingRight: '0 !important',
                          display: 'flex',
                          alignItems: 'center',
                          flex: 0.096,
                        }}
                        size='small'
                      >
                        <Box>Currency</Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          height: '54px',

                          padding: '16px 0',
                          textAlign: 'center',
                          flex: 0.0096,
                        }}
                      >
                        <img
                          src='/images/icons/pro-icons/seperator.svg'
                          alt='sep'
                        />
                      </TableCell>

                      <TableCell
                        sx={{
                          height: '54px',

                          fontWeight: '400 !important',
                          fontSize: '14px !important',
                          // paddingRight: '0 !important',
                          display: 'flex',

                          alignItems: 'center',
                          flex: 0.104,
                        }}
                        size='small'
                      >
                        <Box>CAT basis</Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          height: '54px',

                          padding: '16px 0',
                          textAlign: 'center',
                          flex: 0.0096,
                        }}
                      >
                        <img
                          src='/images/icons/pro-icons/seperator.svg'
                          alt='sep'
                        />
                      </TableCell>

                      <TableCell
                        sx={{
                          height: '54px',

                          fontWeight: '400 !important',
                          fontSize: '14px !important',
                          // paddingRight: '0 !important',
                          display: 'flex',
                          alignItems: 'center',
                          flex: 0.056,
                        }}
                        size='small'
                      ></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {list?.map(row => (
                      <Row
                        key={uuidv4()}
                        row={row}
                        onClickEditPrice={onClickEditPrice}
                        onClickDeletePrice={onClickDeletePrice}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                page={standardClientPriceListPage}
                component='div'
                count={listCount}
                rowsPerPage={standardClientPriceListPageSize}
                onPageChange={(e, page) => setStandardClientPriceListPage(page)}
                rowsPerPageOptions={[10, 25, 50]}
                onRowsPerPageChange={e =>
                  setStandardClientPriceListPageSize(Number(e.target.value))
                }
              />
            </>
          )}

          {/* <Box
            sx={{
              '& .MuiDataGrid-columnHeaderTitle': {
                textTransform: 'none',
              },
              '& .MuiDataGrid-columnHeader.price-collapsible': {
                padding: '0 !important',
                paddingLeft: '0 !important',

                display: 'flex',
                justifyContent: 'center',

                '& .MuiDataGrid-columnHeaderTitleContainerContent': {
                  margin: '0 auto',
                },
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
                    >
                      <Typography variant='subtitle1'>
                        There are no Pros
                      </Typography>
                    </Box>
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
                      <Typography variant='subtitle1'>
                        There are no Pros
                      </Typography>
                    </Box>
                  )
                },
              }}
              sx={{ overflowX: 'scroll' }}
              columns={getStandardPriceColumns()}
              loading={isLoading}
              rows={list ?? []}
              autoHeight
              disableSelectionOnClick
              paginationMode='server'
              pageSize={standardClientPriceListPageSize}
              rowsPerPageOptions={[5, 10, 25, 50]}
              page={standardClientPriceListPage}
              rowCount={listCount}

              // onPageChange={(newPage: number) => {
              //   setFilters((prevState: ProListFilterType) => ({
              //     ...prevState,
              //     skip: newPage * proListPageSize,
              //   }))
              //   setProListPage(newPage)
              // }}
              // onPageSizeChange={(newPageSize: number) => {
              //   setFilters((prevState: ProListFilterType) => ({
              //     ...prevState,
              //     take: newPageSize,
              //   }))
              //   setProListPageSize(newPageSize)
              // }}
            />
          </Box> */}
        </Card>
      </Grid>
    </Grid>
  )
}

const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
  '& .MuiMenu-paper': {
    border: `1px solid ${theme.palette.divider}`,
  },
}))

// Styled MenuItem component
const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  '&:focus': {
    backgroundColor: theme.palette.primary.main,
    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
      color: theme.palette.common.white,
    },
  },
}))

const Title = styled(Typography)`
  color: #4c4e64;
  font-size: 0.875rem;
  font-weight: 700;
`
const Desc = styled(Typography)`
  font-size: 1rem;
  color: rgba(76, 78, 100, 0.87);
`

export default StandardPrices
