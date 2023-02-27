// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

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
      title: 'Recruiting',
      icon: 'mdi:account-outline',
      action: 'read',
      subject: 'recruiting',
      children: [
        {
          title: 'Recruiting Info',
          path: `/recruiting`,
          action: 'read',
          icon: 'ic:baseline-perm-contact-calendar',
          subject: 'recruiting',
        },
        {
          title: 'Job Posting',
          path: `/jobPosting`,
          icon: 'ic:baseline-home-repair-service',
          action: 'read',
          subject: 'job_posting',
        },
      ],
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
    {
      title: 'Onboarding',
      icon: 'mdi:account-outline',
      action: 'read',
      subject: 'onboarding',
      children: [
        {
          title: 'Onboarding List',
          path: `/onboarding`,
          action: 'read',
          icon: 'mdi:list-box-outline',
          subject: 'onboarding',
        },
        {
          title: 'Client Guidelines',
          path: `/onboarding/client-guideline`,
          icon: 'mdi:playlist-check',
          action: 'read',
          subject: 'onboarding',
        },
      ],
    },
  ]
}

export default navigation
