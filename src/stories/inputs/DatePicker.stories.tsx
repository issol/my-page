import React, { useState } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { DatePicker } from './DatePicker'
import { addDays, getDay, setHours, setMinutes, subDays } from 'date-fns'

export default {
  title: 'Input Fields/DatePicker',
  component: DatePicker,
  argTypes: {
    customInput: {
      description:
        'storybook에서 ReactNode로 뭔갈 전달하려고 하면 에러가 발생하지만, 실제 사용시에는 이 prop에 ReactNode타입의 객체를 전달하면 됨',
    },
    includeDateIntervals: {
      description:
        '선택 가능한 날짜 범위를 고를 수 있는 Props. 선택된 범위 외의 날짜는 disabled처리 됨',
    },
    excludeDates: {
      description: '선택하지 못하게 할 date를 선정할 수 있음',
    },
    popperPlacement: {
      description: 'Date picker가 나타날 곳의 위치를 선정할 수 있음',
    },
    withPortal: {
      description: 'true일 경우 date picker가 모달 형태로 뜸',
    },
    shouldCloseOnSelect: {
      description: 'true일 경우 date를 선택해도 picker가 닫히지 않고 유지 됨',
    },
    showTimeSelect: {
      description: 'true일 경우 Date picker에 time picker가 포함됨',
    },
    filterDate: {
      description:
        '선택 가능한 날짜만 filter할 수 있음. excludeDates와 비슷함.',
    },
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof DatePicker>
const Template: ComponentStory<typeof DatePicker> = args => {
  const [date, setDate] = useState<null | Date>(null)
  return (
    <DatePicker {...args} onChange={date => setDate(date)} selected={date} />
  )
}

export const Default = Template.bind({})
Default.args = {}

export const Clearable = (args: typeof DatePicker) => {
  const [date, setDate] = useState<null | Date>(null)
  return (
    <DatePicker
      {...args}
      selected={date}
      onChange={date => setDate(date)}
      isClearable
      placeholderText='I have been cleared!'
    />
  )
}
export const WithCustomInput = (args: typeof DatePicker) => {
  const [date, setDate] = useState<null | Date>(null)
  return (
    <DatePicker
      {...args}
      selected={date}
      onChange={date => setDate(date)}
      customInput={
        <input
          value={date?.toString()}
          style={{
            border: '1px solid #eeeeee',
            padding: '8px',
            borderRadius: '8px',
            fontSize: '1rem',
            color: '#444444',
          }}
        />
      }
      placeholderText='Pass me a customInput!'
    />
  )
}

export const RangePicker = (args: typeof DatePicker) => {
  const [startDate, setStartDate] = useState<null | Date>(
    new Date('2022/02/08'),
  )
  const [endDate, setEndDate] = useState<null | Date>(new Date('2022/02/10'))
  return (
    <>
      <DatePicker
        {...args}
        selected={startDate}
        onChange={date => setStartDate(date)}
        selectsStart
        dateFormat='yyyy/MM/dd'
        startDate={startDate}
        endDate={endDate}
      />
      <DatePicker
        {...args}
        selected={endDate}
        onChange={date => setEndDate(date)}
        selectsEnd
        dateFormat='yyyy/MM/dd'
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
      />
    </>
  )
}

export const ShowWeekDayOnly = (args: typeof DatePicker) => {
  const [startDate, setStartDate] = useState<null | Date>(null)
  const isWeekday = (date: Date) => {
    const day = getDay(date)
    return day !== 0 && day !== 6
  }
  return (
    <DatePicker
      {...args}
      selected={startDate}
      onChange={date => setStartDate(date)}
      filterDate={isWeekday}
      placeholderText='Select a weekday'
    />
  )
}

export const DisablePassedTimes = (args: typeof DatePicker) => {
  const [startDate, setStartDate] = useState<null | Date>(
    setHours(setMinutes(new Date(), 0), 9),
  )
  const filterPassedTime = (time: Date) => {
    const currentDate = new Date()
    const selectedDate = new Date(time)

    return currentDate.getTime() < selectedDate.getTime()
  }
  return (
    <DatePicker
      {...args}
      selected={startDate}
      onChange={date => setStartDate(date)}
      showTimeSelect
      filterTime={filterPassedTime}
      dateFormat='MMMM d, yyyy h:mm aa'
    />
  )
}

export const YearPicker = Template.bind({})
YearPicker.args = {
  showYearPicker: true,
  dateFormat: 'yyyy',
}

export const PickToday = Template.bind({})
PickToday.args = {
  todayButton: 'Pick Today',
}
export const PickerPosition = Template.bind({})
PickerPosition.args = {
  popperPlacement: 'auto-end',
}
export const DisableSomeDates = Template.bind({})
DisableSomeDates.args = {
  excludeDates: [addDays(new Date(), 1), addDays(new Date(), 5)],
}
export const WithPortal = Template.bind({})
WithPortal.args = {
  withPortal: true,
}

export const IncludeDateIntervals = Template.bind({})
IncludeDateIntervals.args = {
  includeDateIntervals: [
    { start: subDays(new Date(), 5), end: addDays(new Date(), 5) },
  ],
}
