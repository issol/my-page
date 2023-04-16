import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { StandardPriceListType } from '@src/types/common/standard-price'
import { useState, MouseEvent, SetStateAction, Dispatch } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Box from '@mui/material/Box'
import {
  ExtraNumberChip,
  JobTypeChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

export function Row(props: {
  row: StandardPriceListType
  onClickDeletePrice: (priceData: StandardPriceListType) => void
  onClickEditPrice: (priceData: StandardPriceListType) => void
  setSelectedRow: Dispatch<SetStateAction<StandardPriceListType | null>>

  selected: number | null

  handleRowClick: (row: StandardPriceListType) => void

  isSelected: (index: number) => boolean
}) {
  const {
    row,
    onClickDeletePrice,
    onClickEditPrice,
    setSelectedRow,

    selected,

    handleRowClick,

    isSelected,
  } = props
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

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
          cursor: 'pointer',
        }}
        // hover
        onClick={() => {
          handleRowClick(row)
        }}
        selected={isSelected(row.id)}
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
          >
            {isSelected(row.id) ? (
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
          <Typography variant='body1'>{row.priceName}</Typography>
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
            gap: '5px',
          }}
          size='small'
        >
          <ServiceTypeChip label={row.serviceType[0]} />
          <ExtraNumberChip label={`+${row.serviceType.slice(1).length}`} />
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
          <Typography variant='body1'>
            {row.currency === 'USD'
              ? '$ USD'
              : row.currency === 'SGD'
              ? '$ SGD'
              : row.currency === 'KRW'
              ? '₩ KRW'
              : row.currency === 'JPY'
              ? '¥ JPY'
              : '-'}
          </Typography>
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
          <Typography variant='body1'> {row.catBasis}</Typography>
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
            <MenuItem sx={{ gap: 2 }} onClick={() => onClickDeletePrice(row)}>
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
          <Collapse in={row.id === selected} timeout='auto' unmountOnExit>
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
            <Grid container xs={12} padding='0 60px 20px 60px'>
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
