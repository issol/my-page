import { Box, Button, ButtonGroup, styled } from '@mui/material'
import { useState } from 'react'

type MenuType = 'linguistTeam' | 'pro'

const AssignPro = () => {
  const [menu, setMenu] = useState<MenuType>('linguistTeam')
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          padding: '32px 20px 24px 20px',
          justifyContent: 'space-between',
        }}
      >
        <ButtonGroup variant='outlined'>
          <CustomBtn
            value='linguistTeam'
            $focus={menu === 'linguistTeam'}
            onClick={e => setMenu(e.currentTarget.value as MenuType)}
          >
            Linguist team
          </CustomBtn>
          <CustomBtn
            $focus={menu === 'pro'}
            value='pro'
            onClick={e => setMenu(e.currentTarget.value as MenuType)}
          >
            Search Pro
          </CustomBtn>
        </ButtonGroup>
      </Box>
    </Box>
  )
}

export default AssignPro

const CustomBtn = styled(Button)<{ $focus: boolean }>`
  width: 145px;
  background: ${({ $focus }) => ($focus ? 'rgba(102, 108, 255, 0.08)' : '')};
`
