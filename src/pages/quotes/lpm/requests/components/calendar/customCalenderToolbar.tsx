import React, {
  ForwardedRef,
  forwardRef,
  MutableRefObject,
  ReactElement,
  useState,
} from 'react'
import { Box } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import FullCalendar from '@fullcalendar/react'
import dayjs from 'dayjs'
import styled from '@emotion/styled'

const CustomCalenderToolbar = forwardRef(
  (
    props: { children: ReactElement },
    ref: ForwardedRef<FullCalendar | null>,
  ) => {
    const { children } = props

    const calenderRef = ref as MutableRefObject<FullCalendar>

    const [title, setTitle] = useState(dayjs().format('MMMM YYYY'))

    const handleCalenderMonthPrev = () => {
      const calenderApi = calenderRef.current?.getApi()
      calenderApi?.prev()
      setTitle(calenderApi?.view.title || '')
    }

    const handleCalenderMonthNext = () => {
      const calenderApi = calenderRef.current?.getApi()
      calenderApi?.next()
      setTitle(calenderApi?.view.title || '')
    }

    return (
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Box display='flex' alignItems='center'>
          <ButtonGroup>
            <button onClick={handleCalenderMonthPrev}>
              <ArrowBackIosIcon style={{ width: '18px' }} />
            </button>
            <button onClick={handleCalenderMonthNext}>
              <ArrowForwardIosIcon style={{ width: '18px' }} />
            </button>
          </ButtonGroup>
          <CalenderTitle>{title}</CalenderTitle>
        </Box>
        {children}
      </Box>
    )
  },
)

const CalenderTitle = styled.h4`
  font-size: 20px;
  font-weight: 500;
`

const ButtonGroup = styled.div`
  width: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 10px;

  & > button {
    background: none;
    border: none;
    cursor: pointer;
  }
`

export default CustomCalenderToolbar
