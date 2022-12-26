import React, { ChangeEvent, useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import CustomRadioBasic from 'src/@core/components/custom-radio/basic'
import { CustomRadioBasicData } from 'src/@core/components/custom-radio/types'

const data: CustomRadioBasicData[] = [
  {
    meta: 'Free',
    title: 'Basic',
    value: 'basic',
    isSelected: true,
    content: 'Get 1 project with 1 team member.',
  },
  {
    meta: '₩ 20,000',
    title: <h3 style={{ margin: 0, color: 'orange' }}>Expensive</h3>,
    value: 'expensive',
    isSelected: true,
    content: (
      <p style={{ margin: 0, fontSize: '1rem', color: 'black' }}>
        If you are rich, you can buy this!
      </p>
    ),
  },
]

export default {
  title: 'Button/RadioWithContainer',
  component: CustomRadioBasic,
  argTypes: {
    name: {
      description:
        'radio의 name이 같으면 한 그룹으로 간주되어, 같은 name의 radio버튼은 중복 선택이 안 됨',
    },
    color: {
      options: [
        'primary',
        'secondary',
        'error',
        'info',
        'success',
        'warning',
        'default',
      ],
      control: { type: 'select' },
    },
    selected: {
      description:
        'data의 value와 selected의 값이 같으면(둘 다 string) radio가 checked됨',
      control: { type: 'text' },
    },
    data: {
      description: `<code>value, content, isSelected, meta, title로 구성된 object<br/></code><code>value:string, content:string,isSelected:boolean,</code><code>meta:ReactNode|string, title:ReactNode|string</code>`,
      control: 'object',
    },
  },
} as ComponentMeta<typeof CustomRadioBasic>

export const Default = (args: typeof CustomRadioBasic) => {
  const [selected, setSelected] = useState<string>('')
  const handleChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
    if (typeof prop === 'string') {
      setSelected(prop)
    } else {
      setSelected((prop.target as HTMLInputElement).value)
    }
  }
  return (
    <CustomRadioBasic
      {...args}
      data={data[0]}
      selected={selected}
      name='custom-radios-basic'
      handleChange={handleChange}
      gridProps={{ sm: 6, xs: 12 }}
    />
  )
}
export const WithReactNode = (args: typeof CustomRadioBasic) => {
  const [selected, setSelected] = useState<string>('')
  const handleChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
    if (typeof prop === 'string') {
      setSelected(prop)
    } else {
      setSelected((prop.target as HTMLInputElement).value)
    }
  }
  return (
    <>
      <h2>
        Passed <code>data.title</code>, <code>data.content</code> as ReactNode.
      </h2>
      <CustomRadioBasic
        {...args}
        data={data[1]}
        selected={selected}
        name='custom-radios-basic'
        handleChange={handleChange}
        gridProps={{ sm: 6, xs: 12 }}
      />
    </>
  )
}
