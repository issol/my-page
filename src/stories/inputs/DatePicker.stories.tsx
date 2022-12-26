import React, { useState } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import ReactDatePicker from 'src/pages/forms/form-elements/pickers'
import { Alert, Divider } from '@mui/material'

export default {
  title: 'Input Fields/DatePicker',
  component: ReactDatePicker,
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
} as ComponentMeta<typeof ReactDatePicker>

export const Examples = () => {
  return (
    <div>
      <Alert severity='info'>
        DatePicker를 사용할 때 반드시{' '}
        <code>
          import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
        </code>
        를 해준 뒤 해당 컴포넌트로 DatePicker를 감싸주세요. 그래야 템플릿
        스타일이 오버라이딩 됩니다.
      </Alert>
      <Divider />
      <ReactDatePicker />
    </div>
  )
}
