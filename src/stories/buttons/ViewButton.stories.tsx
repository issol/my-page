import React, { useState } from 'react'
import { ComponentMeta } from '@storybook/react'
import ToggleViewButton, {
  ToggleMenuType,
} from '@src/@core/components/toggle-view-button'

export default {
  title: 'Button/ViewButton',
  component: ToggleViewButton,
  decorators: [
    Story => (
      <div>
        <p>
          <code>
            {`import ToggleViewButton, {
    ToggleMenuType,
  } from '@src/@core/components/toggle-view-button'`}
          </code>
        </p>

        <Story />
      </div>
    ),
  ],
  argTypes: {
    name: {
      description: 'list view와 calendar view를 선택하는 버튼 컴포넌트',
    },
  },
} as ComponentMeta<typeof ToggleViewButton>

export const Default = () => {
  const [menu, setMenu] = useState<ToggleMenuType>('list')
  return <ToggleViewButton menu={menu} setMenu={setMenu} />
}
