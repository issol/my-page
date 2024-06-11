import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'

import { useState, MouseEvent, SetStateAction, Dispatch } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Box from '@mui/material/Box'
import {
  ClientStatusChip,
  ExtraNumberChip,
  JobTypeChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
import IconButton from '@mui/material/IconButton'
import Icon from '@src/@core/components/icon'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { ClientProjectListType } from '@src/types/client/client-projects.type'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { UserDataType } from '@src/context/types'
import { useRecoilValueLoadable } from 'recoil'
import { timezoneSelector } from '@src/states/permission'

export default function ClientProjectsRows(props: {
  row: ClientProjectListType
  user: UserDataType
  selected: number | null
  handleRowClick: (row: ClientProjectListType) => void
  isSelected: (index: number) => boolean
}) {
  const { row, user, selected, handleRowClick, isSelected } = props
  const timezone = useRecoilValueLoadable(timezoneSelector)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const separateLine = () => {
    return (
      <TableCell
        sx={{
          height: '54px',

          padding: '16px 0',
          textAlign: 'center',
          flex: 0.0096,
        }}
      ></TableCell>
    )
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
        onClick={event => {
          handleRowClick(row)
        }}
        // selected={isSelected(row.id)}
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

            display: 'flex',
            alignItems: 'center',
            minWidth: '122px',
            flex: 0.0976,
          }}
          size='small'
        >
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 400,
              color:
                row.corporationId.charAt(0) === 'Q'
                  ? 'rgba(76, 78, 100, 0.87)'
                  : '#666CFF',
            }}
          >
            {row.corporationId}
          </Typography>
        </TableCell>
        {separateLine()}

        <TableCell
          sx={{
            flex: 0.1952,
            height: '54px',
            display: 'flex',
            alignItems: 'center',
            minWidth: '244px',
          }}
          size='small'
        >
          <Typography variant='body1' sx={{ fontWeight: 600 }}>
            {row.workName ?? '-'}
          </Typography>
        </TableCell>
        {separateLine()}
        <TableCell
          sx={{
            flex: 0.1928,
            height: '54px',
            display: 'flex',
            alignItems: 'center',
            minWidth: '241px',
          }}
          size='small'
        >
          <Typography variant='body1'>{row.projectName ?? '-'}</Typography>
        </TableCell>
        {separateLine()}
        <TableCell
          sx={{
            height: '54px',

            fontWeight: '400 !important',
            fontSize: '14px !important',
            // paddingRight: '0 !important',
            display: 'flex',
            alignItems: 'center',
            flex: 0.1456,
            gap: '5px',
            minWidth: '182px',
          }}
          size='small'
        >
          {row.category ? (
            <JobTypeChip label={row.category} type={row.category} />
          ) : (
            '-'
          )}
        </TableCell>
        {separateLine()}
        <TableCell
          sx={{
            flex: 0.2,
            height: '54px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: '250px',
          }}
          size='small'
        >
          {row.serviceType && row.serviceType.length ? (
            <ServiceTypeChip label={row.serviceType[0]} />
          ) : (
            '-'
          )}

          {row.serviceType && row.serviceType.slice(1).length ? (
            <ExtraNumberChip label={`+${row.serviceType.slice(1).length}`} />
          ) : null}
        </TableCell>
        {separateLine()}
        <TableCell
          sx={{
            flex: 0.224,
            height: '54px',
            display: 'flex',
            alignItems: 'center',
            minWidth: '280px',
          }}
          size='small'
        >
          <Typography variant='body1'>
            {convertTimeToTimezone(
              row.dueDate,
              user.timezone,
              timezone.getValue(),
            )}
          </Typography>
        </TableCell>
        {separateLine()}
        <TableCell
          sx={{
            height: '54px',

            fontWeight: '400 !important',
            fontSize: '14px !important',
            display: 'flex',

            alignItems: 'center',
            flex: 0.112,
            minWidth: '140px',
          }}
          size='small'
        >
          <ClientStatusChip label={row.status} status={'Active'} />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ p: '0 !important' }}>
          <Collapse in={row.id === selected} timeout='auto' unmountOnExit>
            <Grid container xs={12} padding='20px 64px'>
              <Grid item xs={3.2}>
                <Title>Order date</Title>
                <Desc>
                  {convertTimeToTimezone(
                    row.orderDate,
                    user.timezone,
                    timezone.getValue(),
                  )}
                </Desc>
              </Grid>
              <Grid item xs={3}>
                <Title>Project description</Title>
                <Desc>{row.projectDescription}</Desc>
              </Grid>
            </Grid>
            {/* <Grid container xs={12} padding='0 60px 20px 60px'>
              <Grid item xs={4}>
                <Title>Rounding procedure</Title>
                <Desc>{row.roundingProcedure}</Desc>
              </Grid>
            </Grid> */}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

const Title = styled(Typography)`
  color: #4c4e64;
  font-size: 0.875rem;
  font-weight: 700;
`
const Desc = styled(Typography)`
  font-size: 1rem;
  color: rgba(76, 78, 100, 0.87);
`
