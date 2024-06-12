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
import { styled } from '@mui/system'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

const ACTIVE_COLOR = 'rgba(76, 78, 100, 0.87)'
const DISABLED_COLOR = 'rgba(76, 78, 100, 0.26)'

const CustomCalenderToolbar = forwardRef(
  (
    props: { children?: ReactElement; height?: number },
    ref: ForwardedRef<FullCalendar | null>,
  ) => {
    const { height, children } = props

    const calenderRef = ref as MutableRefObject<FullCalendar>

    const [title, setTitle] = useState(dayjs().format('MMMM YYYY'))
    const [isDisabledPrev, setIsDisabledPrev] = useState(false)
    const [isDisabledNext, setIsDisabledNext] = useState(false)

    const currentDateForDisabledState = () => {
      // 현재 날짜의 시간 이후만 Active
      const calenderApi = calenderRef.current?.getApi()

      const isSameOrAfter = dayjs(calenderApi.view.currentStart).isSameOrAfter(
        calenderApi.view.activeStart,
      )

      // 현재 날짜의 시간 이전만 Active
      const isSameOrBefore = dayjs(calenderApi.view.currentEnd).isSameOrBefore(
        calenderApi.view.activeEnd,
      )
      setIsDisabledPrev(!isSameOrAfter)
      setIsDisabledNext(!isSameOrBefore)
    }

    const handleCalenderMonthPrev = () => {
      const calenderApi = calenderRef.current?.getApi()
      calenderApi?.prev()
      currentDateForDisabledState()
      const date = calenderApi?.view.title.split(' – ')
      setTitle(`${date[0]}` || '')
    }

    const handleCalenderMonthNext = () => {
      const calenderApi = calenderRef.current?.getApi()
      calenderApi?.next()
      currentDateForDisabledState()
      const date = calenderApi?.view.title.split(' – ')
      setTitle(`${date[0]}` || '')
    }

    return (
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        sx={{
          width: '100%',
          height: height || 'auto',
        }}
      >
        <Box display='flex' alignItems='center'>
          <ButtonGroup>
            <Button disabled={isDisabledPrev} onClick={handleCalenderMonthPrev}>
              <ArrowBackIosIcon
                style={{
                  color: isDisabledPrev ? DISABLED_COLOR : ACTIVE_COLOR,
                }}
              />
            </Button>
            <Button disabled={isDisabledNext} onClick={handleCalenderMonthNext}>
              <ArrowForwardIosIcon
                style={{
                  color: isDisabledNext ? DISABLED_COLOR : ACTIVE_COLOR,
                }}
              />
            </Button>
          </ButtonGroup>
          <CalenderTitle>{title}</CalenderTitle>
        </Box>
        {children}
      </Box>
    )
  },
)

const CalenderTitle = styled('h4')`
  font-size: 20px;
  font-weight: 500;
`

const ButtonGroup = styled('div')`
  width: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 10px;
`

const Button = styled('button')<{ disabled: boolean }>(disabled => ({
  background: 'none',
  border: 'none',
  cursor: 'pointer',

  '& > svg': {
    width: '18px',
    color: ACTIVE_COLOR,
  },
}))
export default CustomCalenderToolbar
