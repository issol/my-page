import {
  Button,
  CardHeader,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'

import { Icon } from '@iconify/react'
import { LinkType } from 'src/types/schema/jobPosting.schema'
import { styled } from '@mui/system'

type Props = {
  savedLink: { id?: string | number; category: string; link: string }
  onAdd: (item: LinkType) => void
  onClose: any
}
export default function EditLinkModal({ savedLink, onAdd, onClose }: Props) {
  const values = ['JobKorea', 'Albamon', '알바천국', 'Linkedin', 'Etc']
  const [state, setState] = useState({ category: '', link: '' })

  useEffect(() => {
    setState(savedLink)
  }, [savedLink])

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        onClose()
        onAdd(state)
      }}
    >
      <ModalContainer style={{ width: '550px' }}>
        <Box display='flex' sx={{ width: '100%' }} justifyContent='flex-end'>
          <Icon
            icon='material-symbols:close-sharp'
            opacity={0.7}
            cursor='pointer'
            onClick={close}
          />
        </Box>

        <CardHeader
          title='Add link'
          style={{ textAlign: 'left', paddingTop: 0, paddingLeft: 0 }}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <FormControl fullWidth>
            <InputLabel id='job post link'>Link category</InputLabel>
            <Select
              fullWidth
              id='job post link'
              labelId='select job post link'
              label='Link category'
              required
              style={{ textAlign: 'left' }}
              value={state.category}
              onChange={e => setState({ ...state, category: e.target.value! })}
            >
              {values.map((item, idx) => (
                <MenuItem key={idx} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <OutlinedInput
            fullWidth
            value={state.link}
            required
            id='jobPostLink'
            onChange={e => setState({ ...state, link: e.target.value })}
            placeholder='Link'
            endAdornment={
              <InputAdornment position='end'>
                <Icon icon='material-symbols:open-in-new' opacity={0.7} />
              </InputAdornment>
            }
          />
        </Box>
        <ModalButtonGroup style={{ margin: '24px 0 20px' }}>
          <Button variant='outlined' onClick={onClose}>
            Cancel
          </Button>
          <Button variant='contained' type='submit'>
            Add
          </Button>
        </ModalButtonGroup>
      </ModalContainer>
    </form>
  )
}

export const ModalContainer = styled(Box)`
  min-width: 250px;
  margin: 25px;
  padding: 24px;
  text-align: center;
  background: #ffffff;
  border-radius: 14px;
`

export const ModalButtonGroup = styled(Box)`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 8px;
`
