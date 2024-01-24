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
import { matchSorter } from 'match-sorter'

import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import { styled } from '@mui/system'

// ** Icon Imports
import Icon from '@src/@core/components/icon'
import { getUserInfo } from '@src/apis/user.api'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { useEffect, useState } from 'react'
import _ from 'lodash'

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
    value: number
    label: string
    jobTitle: string | undefined
  }>
  getValue: UseFormGetValues<ProjectTeamType>
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
  getValue,
}: Props) {
  const fieldOrder = ['supervisorId', 'projectManagerId', 'member']
  // const [list, setList] = useState<
  //   Array<{
  //     value: number
  //     label: string
  //     jobTitle: string | undefined
  //   }>
  // >(memberList)

  const setValueOptions = { shouldValidate: true, shouldDirty: true }

  const sortedFields = field.sort((a, b) => {
    const aIndex = fieldOrder.indexOf(a.type)
    const bIndex = fieldOrder.indexOf(b.type)
    return aIndex - bIndex
  })

  const [focusField, setFocusField] = useState<
    { idx: number; isFocus: boolean }[]
  >([
    {
      idx: 0,
      isFocus: false,
    },
  ])

  const handleFocusChange = (idx: number, isFocus: boolean) => {
    setFocusField(prevFocusField => {
      const newFocusField = [...prevFocusField]
      const targetField = newFocusField.find(field => field.idx === idx)
      if (targetField) {
        targetField.isFocus = isFocus
      }
      return newFocusField
    })
  }

  useEffect(() => {
    setFocusField(
      field.map((value, idx) => {
        return {
          idx: idx,
          isFocus: false,
        }
      }),
    )
  }, [field])

  function renderHeader(title: string) {
    return (
      <HeaderCell align='left' sx={{ width: '30%' }}>
        {title}
      </HeaderCell>
    )
  }

  function findMemberValue(value: number | null) {
    let findValue = memberList.find(item => item.value === value)
    if (!findValue && value) {
      getUserInfo(value!)
        .then(res => {
          // setList(
          //   list.concat({
          //     value: res.userId,
          //     label: getLegalName({
          //       firstName: res?.firstName!,
          //       middleName: res?.middleName,
          //       lastName: res?.lastName!,
          //     }),
          //     jobTitle: res.jobTitle ?? '',
          //   }),
          // )
          findValue = memberList.find(item => item.value === value)
        })
        .catch(e => {
          findValue = { value: 0, label: '', jobTitle: '' }
        })
    }
    return findValue || { value: 0, label: '', jobTitle: '' }
  }

  function renderMemberField(name: `teams.${number}.id`, idx: number) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => {
          return (
            <Autocomplete
              autoHighlight
              fullWidth
              isOptionEqualToValue={(option, newValue) => {
                return option.value === newValue.value
              }}
              filterOptions={(options, { inputValue }) => {
                return matchSorter(options, inputValue, {
                  keys: ['label'],
                })
              }}
              options={memberList}
              getOptionLabel={option => option.label}
              onChange={(e, v) => {
                if (v) {
                  onChange(Number(v.value))
                  setValue(`teams.${idx}.name`, v.label, setValueOptions)
                } else {
                  onChange(null)
                  handleFocusChange(idx, false)
                  const { name, ...rest } = getValue('teams')[idx]
                  update(idx, rest)
                  // setValue(`teams.${idx}.name`, '', setValueOptions)
                }
              }}
              disableClearable={
                getValue('teams')[idx].name === '' ||
                !getValue('teams')[idx].name
              }
              value={findMemberValue(value)}
              onClickCapture={() => handleFocusChange(idx, true)}
              onClose={() => handleFocusChange(idx, false)}
              renderInput={params => (
                <TextField
                  {...params}
                  // label='Member'
                  placeholder={focusField[idx]?.isFocus ? '' : 'Member'}
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={uuidv4()}>
                  {option.label}
                </li>
              )}
            />
          )
        }}
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
            className={
              memberList.filter(item => item.value === field?.value)[0]
                ?.jobTitle
                ? ''
                : 'disabled-hyphen'
            }
            value={
              memberList.filter(item => item.value === field?.value)[0]
                ?.jobTitle || '-'
            }
          />
        )}
      />
    )
  }

  function removeItem(id: string) {
    // console.log(id)

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
            <TableRow role='checkbox' tabIndex={-1} key={item.id}>
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
                {renderMemberField(`teams.${idx}.id`, idx)}
              </TableCell>
              <TableCell align='left'>
                {renderJobTitleField(`teams.${idx}.id`)}
              </TableCell>
              <TableCell align='left'>
                {item.type === 'member' && idx > 2 ? (
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
                onClick={() => append({ type: 'member', id: null, name: '' })}
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
