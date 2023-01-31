// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { RoleType } from 'src/context/types'

// ** TODO : 렐과 상의 후 action, subject 수정하기
//role별 메뉴를 만드는게 좋을 것 같음. 그래야 action, subject를 정확히 줄 수 있음

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboards',
      icon: 'mdi:home-outline',
      action: 'read',
      subject: 'members',
      path: `/dashboards`,
    },

    {
      title: 'Company',
      icon: 'mdi:briefcase-outline',
      action: 'update',
      subject: 'permission_request',
      path: `/company`,
    },
    {
      title: 'Account',
      icon: 'mdi:account-outline',
      action: 'read',
      subject: 'members',
      path: `/account`,
    },
  ]
}

export default navigation
