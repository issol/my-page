import { MouseEventHandler, SyntheticEvent, useEffect, useState } from 'react'

import styled from 'styled-components'

// ** MUI Imports
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import { Grid } from '@mui/material'
import { Box } from '@mui/system'
import Filters from './list-view/filter'

// ** third parties
import isEqual from 'lodash/isEqual'

export type FilterType = {
  workName?: Array<{ value: string; label: string }>
  role?: Array<{ value: string; label: string }>
  status?: Array<{ value: string; label: string }>
  source?: Array<{ value: string; label: string }>
  target?: Array<{ value: string; label: string }>
  client?: Array<{ value: string; label: string }>
  skip?: number
  take?: number
}

export type FilterOmitType = Omit<FilterType, 'skip' | 'take'>

export const initialFilter: FilterOmitType = {
  workName: [],
  role: [],
  status: [],
  source: [],
  target: [],
  client: [],
}

type MenuType = 'list' | 'calendar'
export default function ProjectsDetail() {
  const [menu, setMenu] = useState<MenuType>('list')
  type FilterState = Array<{ value: string; label: string }>
  const [filter, setFilter] = useState<FilterOmitType>({ ...initialFilter })
  const [skip, setSkip] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState(true)
  console.log(filter)
  function onReset() {
    setFilter({ ...initialFilter })
  }

  useEffect(() => {
    if (isEqual(initialFilter, filter)) {
      // refetch()
    }
  }, [filter])

  return (
    <Box display='flex' flexDirection='column'>
      <Box
        display='flex'
        width={'100%'}
        justifyContent='right'
        padding='10px 0 24px'
      >
        <ButtonGroup variant='outlined'>
          <CustomBtn
            value='list'
            focus={menu === 'list'}
            onClick={e => setMenu(e.currentTarget.value as MenuType)}
          >
            List view
          </CustomBtn>
          <CustomBtn
            focus={menu === 'calendar'}
            value='calendar'
            onClick={e => setMenu(e.currentTarget.value as MenuType)}
          >
            Calendar view
          </CustomBtn>
        </ButtonGroup>
      </Box>
      <Box>
        {menu === 'list' ? (
          <Grid>
            <Filters
              filter={filter}
              setFilter={setFilter}
              onReset={onReset}
              search={() => setSearch(true)}
            />
          </Grid>
        ) : (
          '캘린더~'
        )}
      </Box>
    </Box>
  )
}

const CustomBtn = styled(Button)<{ focus: boolean }>`
  width: 145px;
  background: ${({ focus }) => (focus ? 'rgba(102, 108, 255, 0.08)' : '')};
`
