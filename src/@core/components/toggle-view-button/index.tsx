import { Button, ButtonGroup } from '@mui/material'
import styled from 'styled-components'

export type ToggleMenuType = 'list' | 'calendar'
export type Props = {
  menu: ToggleMenuType
  setMenu: (n: ToggleMenuType) => void
}
export default function ToggleViewButton({ menu, setMenu }: Props) {
  return (
    <ButtonGroup variant='outlined'>
      <CustomBtn
        value='list'
        $focus={menu === 'list'}
        onClick={e => setMenu(e.currentTarget.value as ToggleMenuType)}
      >
        List view
      </CustomBtn>
      <CustomBtn
        $focus={menu === 'calendar'}
        value='calendar'
        onClick={e => setMenu(e.currentTarget.value as ToggleMenuType)}
      >
        Calendar view
      </CustomBtn>
    </ButtonGroup>
  )
}

const CustomBtn = styled(Button)<{ $focus: boolean }>`
  width: 145px;
  background: ${({ $focus }) => ($focus ? 'rgba(102, 108, 255, 0.08)' : '')};
`
