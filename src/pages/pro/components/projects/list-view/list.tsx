// ** React Imports
import { useState, Fragment } from 'react'

import styled from 'styled-components'

// ** mui
import {
  Button,
  Card,
  Chip,
  Grid,
  TablePagination,
  Tooltip,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import CardHeader from '@mui/material/CardHeader'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import Collapse from '@mui/material/Collapse'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import IconButton from '@mui/material/IconButton'
import TableContainer from '@mui/material/TableContainer'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** helpers
import { FullDateHelper } from 'src/shared/helpers/date.helper'
import {
  JobTypeChip,
  renderStatusChip,
  RoleChip,
  ServiceTypeChip,
  WorkStatusChip,
} from 'src/@core/components/chips/chips'

// ** types
import { ProProjectType } from '@src/apis/pro-projects.api'

type Props = {
  skip: number
  pageSize: number
  setSkip: (num: number) => void
  setPageSize: (num: number) => void
  list: {
    data: Array<ProProjectType> | []
    count: number
  }
  isLoading: boolean
}

export default function ProjectsList({
  skip,
  pageSize,
  setSkip,
  setPageSize,
  list,
  isLoading,
}: Props) {
  const Row = (props: { row: ProProjectType }) => {
    // ** Props
    const { row } = props

    // ** State
    const [open, setOpen] = useState<boolean>(false)

    return (
      <Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton
              aria-label='expand row'
              size='small'
              onClick={() => setOpen(!open)}
            >
              <Icon icon={open ? 'mdi:chevron-up' : 'mdi:chevron-down'} />
            </IconButton>
          </TableCell>
          <TableCell component='th' scope='row'>
            {row.workName}
          </TableCell>
          <TableCell align='left'>
            <ServiceTypeChip label={row.role} size='small' />
          </TableCell>
          <TableCell align='left'>{row.client}</TableCell>
          <TableCell align='left'>
            <Typography sx={{ fontWeight: 'bold' }} variant='body2'>
              {row.targetLanguage?.toUpperCase()} →{' '}
              {row.sourceLanguage?.toUpperCase()}
            </Typography>
          </TableCell>
          <TableCell align='left'>
            <Typography sx={{ overflow: 'scroll' }} variant='body2'>
              {FullDateHelper(row.dueDate)} ({row.dueDate ? row.timezone : ''})
            </Typography>
          </TableCell>
          <TableCell align='left'>{WorkStatusChip(row.status)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={6} sx={{ py: '0 !important' }}>
            <Collapse in={open} timeout='auto' unmountOnExit>
              <Grid container spacing={6} padding='20px 70px'>
                <Grid item xs={6} md={4} lg={4}>
                  <Grid item xs={12}>
                    <Title>Project name</Title>
                    <Desc>{row.projectName}</Desc>
                  </Grid>
                  <Grid item xs={12}>
                    <Title>Project Category</Title>
                    <Desc>{row.category}</Desc>
                  </Grid>
                </Grid>
                <Grid item xs={6} md={4} lg={4}>
                  <Grid item xs={12}>
                    <Title>Order date</Title>
                    <Desc>
                      {FullDateHelper(row.orderDate)} (
                      {row.orderDate ? row.timezone : ''})
                    </Desc>
                  </Grid>
                  <Grid item xs={12}>
                    <Title>Project no.</Title>
                    <Desc>{row.projectId}</Desc>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                  <Grid item xs={12}>
                    <Title>Description</Title>
                    <Desc>{row.description}</Desc>
                  </Grid>
                </Grid>
              </Grid>
            </Collapse>
          </TableCell>
        </TableRow>
      </Fragment>
    )
  }

  return (
    <Grid item xs={12} mt='24px'>
      <Card>
        <CardHeader
          title={
            <Box display='flex' justifyContent='space-between'>
              <Typography variant='h6'>
                Work list ({list?.count | 0})
              </Typography>
            </Box>
          }
        />
        <Box
          sx={{
            '& .hide': {
              position: 'relative',
              filter: 'grayscale(100%)',
              '&:hover': {
                background: 'rgba(76, 78, 100, 0.12)',
              },
              '&::after': {
                position: 'absolute',
                width: '100%',
                height: '100%',
                content: "''",
                background: 'rgba(76, 78, 100, 0.12)',
                mixBlendMode: 'revert',
                filter: 'grayscale(100%)',
              },
            },
          }}
        >
          <TableContainer component={Paper}>
            <Table aria-label='project list'>
              <TableHead
                style={{ background: '#F5F5F7', textTransform: 'none' }}
              >
                <TableRow>
                  <TableCell>
                    <IconButton aria-label='expand row' size='small'>
                      <Icon icon='mdi:chevron-down' />
                    </IconButton>
                  </TableCell>
                  <TableCell>Work name</TableCell>
                  <TableCell align='left'>Item name</TableCell>
                  <TableCell align='left'>Clients</TableCell>
                  <TableCell align='left'>Language</TableCell>
                  <TableCell align='left'>Due date</TableCell>
                  <TableCell align='left'>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.data?.map(row => (
                  <Row key={row.id} row={row} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            page={skip}
            component='div'
            count={list.count}
            rowsPerPage={pageSize}
            onPageChange={(e, page) => setSkip(page)}
            rowsPerPageOptions={[10, 25, 50]}
            onRowsPerPageChange={e => setPageSize(Number(e.target.value))}
          />
        </Box>
      </Card>
    </Grid>
  )
}

const Title = styled(Typography)`
  color: #4c4e64;
  font-size: 0.875rem;
  font-weight: 700;
`
const Desc = styled.p`
  font-size: 1rem;
  color: rgba(76, 78, 100, 0.87);
`
