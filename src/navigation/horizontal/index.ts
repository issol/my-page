// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => {
  return [
    {
      title: 'Dashboards',
      icon: 'mdi:home-outline',
      action: 'read',
      subject: 'members',
      path: `/dashboards`,
    },
    {
      title: 'Pros',
      icon: 'ic:baseline-people-outline',
      action: 'read',
      subject: 'pro',
      path: `/pro`,
    },
    {
      title: 'Clients',
      icon: 'mdi:account-star-outline',
      action: 'read',
      subject: 'client',

      children: [
        {
          title: 'Client List',
          path: `/client`,
          action: 'read',

          icon: 'solar:dollar-minimalistic-bold',
          subject: 'client',
        },
        {
          title: 'Client guidelines',
          path: `/client/client-guideline`,
          action: 'read',
          icon: 'mdi:playlist-check',
          subject: 'client',
        },
      ],
    },
    {
      title: 'Recruiting',
      icon: 'material-symbols:person-search-outline',
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
          subject: 'recruiting',
        },
      ],
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
    {
      title: 'Certification Test',
      icon: 'mi:clipboard-check',
      action: 'read',
      subject: 'certification_test',
      path: `/certification-test`,
    },
    {
      title: 'Company',
      icon: 'mdi:briefcase-outline',
      action: 'update',
      subject: 'permission_request',
      children: [
        {
          title: 'Members',
          path: `/company`,
          action: 'update',
          icon: 'material-symbols:person',
          subject: 'permission_request',
        },
        {
          title: 'Standard Prices',
          path: `/company/price`,
          action: 'read',
          icon: 'solar:dollar-minimalistic-bold',
          subject: 'company_price',
        },
      ],
    },
    {
      title: 'Quotes',
      icon: 'material-symbols:request-quote-outline',
      path: '/quotes',
      action: 'read',
      subject: 'quote',
    },
    {
      title: 'Orders',
      icon: 'material-symbols:list-alt-outline-sharp',
      action: 'read',
      subject: 'order',
      children: [
        {
          title: 'Order List',
          path: `/orders/order-list`,
          action: 'read',

          icon: 'solar:dollar-minimalistic-bold',
          subject: 'order',
        },
        {
          title: 'Job List',
          path: `/orders/job-list`,
          action: 'read',
          icon: 'material-symbols:person',
          subject: 'job_list',
        },
      ],
    },
    {
      title: 'Invoices',
      icon: 'material-symbols:receipt-long',
      action: 'read',
      subject: 'invoice-receivable',
      children: [
        {
          title: 'Receivables',
          path: `/invoice/receivable`,
          action: 'read',

          icon: 'material-symbols:person',
          subject: 'invoice-receivable',
        },
        {
          title: 'Payables',
          path: `/invoice/payable`,
          action: 'read',
          icon: 'raphael:dollar',
          subject: 'invoice-payable',
        },
      ],
    },
  ]
}
export default navigation
