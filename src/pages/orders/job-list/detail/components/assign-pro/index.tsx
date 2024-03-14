import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  TextField,
  styled,
} from '@mui/material'
import { useGetLinguistTeam } from '@src/queries/pro/linguist-team'
import { JobType } from '@src/types/common/item.type'
import { useMemo, useState } from 'react'

type MenuType = 'linguistTeam' | 'pro'

type Props = {
  jobInfo: JobType
}

const AssignPro = ({ jobInfo }: Props) => {
  const [menu, setMenu] = useState<MenuType>('linguistTeam')
  const { data: linguistTeam, isLoading } = useGetLinguistTeam({
    take: 1000,
    skip: 0,
  })

  const [selectedLinguistTeam, setSelectedLinguistTeam] = useState<{
    value: number
    label: string
  } | null>(null)

  const linguistTeamList = useMemo(
    () =>
      linguistTeam?.data?.map(i => ({
        label: i.name,
        value: i.id,
        client: i.client,
      })) || [],
    [linguistTeam],
  )

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
        <Box className='filterFormSoloAutoComplete'>
          <Autocomplete
            fullWidth
            loading={isLoading}
            options={linguistTeamList}
            getOptionLabel={option => option.label}
            value={selectedLinguistTeam}
            onChange={(e, v) => {
              if (v) {
                setSelectedLinguistTeam(v)
              } else {
                setSelectedLinguistTeam(null)
              }
            }}
            renderInput={params => (
              <TextField {...params} placeholder='Select linguist team' />
            )}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default AssignPro

const CustomBtn = styled(Button)<{ $focus: boolean }>`
  width: 145px;
  background: ${({ $focus }) => ($focus ? 'rgba(102, 108, 255, 0.08)' : '')};
`
