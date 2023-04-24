// ** types
import { ProjectTeamType } from '@src/types/schema/project-team.schema'

// ** react hook form
import {
  Control,
  Controller,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'

// ** uuid
import { v4 as uuidv4 } from 'uuid'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import styled from 'styled-components'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

type Props = {
  control: Control<ProjectTeamType, any>
  field: FieldArrayWithId<ProjectTeamType, 'teams', 'id'>[]
  append: UseFieldArrayAppend<ProjectTeamType, 'teams'>
  remove: UseFieldArrayRemove
  update: UseFieldArrayUpdate<ProjectTeamType, 'teams'>
  setValue: UseFormSetValue<ProjectTeamType>
  errors: FieldErrors<ProjectTeamType>
  isValid: boolean
  watch: UseFormWatch<ProjectTeamType>
  memberList: Array<{
    value: string
    label: string
    jobTitle: string | undefined
  }>
}
export default function ProjectTeamForm({
  control,
  field,
  append,
  remove,
  update,
  setValue,
  errors,
  isValid,
  watch,
  memberList,
}: Props) {
  function renderHeader(title: string) {
    return (
      <HeaderCell align='left' sx={{ width: '30%' }}>
        {title}
      </HeaderCell>
    )
  }

  function renderMemberField(name: `teams.${number}.id`) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Autocomplete
            autoHighlight
            fullWidth
            {...field}
            options={memberList.map(item => ({
              value: item.value,
              label: item.label,
            }))}
            onChange={(e, v) => field.onChange(v.value)}
            disableClearable
            value={
              !field?.value
                ? { value: '', label: '' }
                : memberList.filter(
                    item => item.value === field.value?.toString(),
                  )[0]
            }
            renderInput={params => (
              <TextField
                {...params}
                label='Member'
                inputProps={{
                  ...params.inputProps,
                }}
              />
            )}
          />
        )}
      />
    )
  }

  function renderJobTitleField(name: `teams.${number}.id`) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            fullWidth
            disabled={true}
            value={
              memberList.filter(
                item => item.value === field?.value?.toString(),
              )[0]?.jobTitle || '-'
            }
          />
        )}
      />
    )
  }

  function removeItem(id: string) {
    const idx = field.map(item => item.id as string).indexOf(id)
    idx !== -1 && remove(idx)
  }

  return (
    <TableContainer
      component={Paper}
      style={{
        borderRadius: '14px',
        border: '1px solid rgba(76, 78, 100, 0.12)',
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {renderHeader('Position')}
            {renderHeader('Member')}
            {renderHeader('Job title')}
            {renderHeader('')}
          </TableRow>
        </TableHead>
        <TableBody>
          {field.map((item, idx) => (
            <TableRow hover role='checkbox' tabIndex={-1} key={item.id}>
              <TableCell align='left'>
                <Typography fontWeight='bold'>
                  {item.type === 'supervisorId'
                    ? 'Supervisor'
                    : item.type === 'projectManagerId'
                    ? 'Project manager*'
                    : 'Team member'}
                </Typography>
              </TableCell>
              <TableCell align='left'>
                {renderMemberField(`teams.${idx}.id`)}
              </TableCell>
              <TableCell align='left'>
                {renderJobTitleField(`teams.${idx}.id`)}
              </TableCell>
              <TableCell align='left'>
                {idx > 2 ? (
                  <IconButton onClick={() => removeItem(item.id)}>
                    <Icon icon='mdi:trash-outline' />
                  </IconButton>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell align='left'>
              <Button
                onClick={() => append({ type: 'member', id: null })}
                variant='contained'
                disabled={!isValid}
                sx={{ p: 0.7, minWidth: 26 }}
              >
                <Icon icon='material-symbols:add' />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const HeaderCell = styled(TableCell)`
  height: 20px;
  position: relative;
  text-transform: none;
  &::before {
    content: '';
    position: absolute;
    top: 20px;
    right: 0px;
    width: 2px;
    height: 30%;
    background: rgba(76, 78, 100, 0.12);
  }
`
