// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (role: string): VerticalNavItemsType => {
  return [
    // ** Dashboard - Client, LPM, TAD, Pro
    {
      title: 'Dashboard',
      icon: 'mdi:home-outline',
      action: 'dashboard-read',
      subject: `${role}`,
      path: `/${role.toLowerCase()}/dashboard`,
    },
    // ** Account - Client, LPM, TAD
    {
      title: 'Account',
      icon: 'mdi:home-outline',
      action: 'account-read',
      subject: `${role}`,
      path: `/${role.toLowerCase()}/account`,
    },
    // ** My Page - Pro
    {
      title: 'My Page',
      icon: 'mdi:home-outline',
      action: 'myPage-read',
      subject: `${role}`,
      path: `/${role.toLowerCase()}/my-page`,
    },
    {
      title: 'Email',
      icon: 'mdi:home-outline',
      action: 'email-read',
      subject: `${role}`,
      path: `/${role.toLowerCase()}/email`,
    },
    {
      title: 'Onboarding',
      icon: 'mdi:home-outline',
      action: 'onboarding-read',
      subject: `${role}`,
      children: [
        {
          title: 'Onboarding List',
          path: `/${role.toLowerCase()}/onboarding/onboarding-list`,
          action: 'onboardingList-read',
          subject: `${role}`,
        },
      ],
    },
    {
      title: 'Recruiting',
      icon: 'mdi:home-outline',
      action: 'recruiting-read',
      subject: `${role}`,
      children: [
        {
          title: 'Recruiting List',
          path: `/${role.toLowerCase()}/recruiting/recruiting-list`,
          action: 'recruitingList-read',
          subject: `${role}`,
        },
        {
          title: 'Create Recruiting',
          path: `/${role.toLowerCase()}/recruiting/recruiting-create`,
          action: 'recruitingCreate-read',
          subject: `${role}`,
        },
        {
          title: 'Job Posting',
          path: `/${role.toLowerCase()}/recruiting/job-posting`,
          action: 'recruitingJobPosting-read',
          subject: `${role}`,
        },
      ],
    },
    {
      title: 'Pros',
      icon: 'mdi:home-outline',
      action: 'pros-read',
      subject: `${role}`,
      children: [
        {
          title: 'Pro List',
          path: `/${role.toLowerCase()}/pros/pro-list`,
          action: 'proList-read',
          subject: `${role}`,
        },
        {
          title: 'Create Pro',
          path: `/${role.toLowerCase()}/pros/pro-create`,
          action: 'proCreate-read',
          subject: `${role}`,
        },
      ],
    },
    {
      title: 'Clients',
      icon: 'mdi:home-outline',
      action: 'clients-read',
      subject: `${role}`,
      children: [
        {
          title: 'Client List',
          path: `/${role.toLowerCase()}/clients/client-list`,
          action: 'clientList-read',
          subject: `${role}`,
        },
        {
          title: 'Create Client',
          path: `/${role.toLowerCase()}/clients/client-create`,
          action: 'clientCreate-read',
          subject: `${role}`,
        },
      ],
    },
    {
      title: 'Quotes',
      icon: 'mdi:home-outline',
      action: 'quotes-read',
      subject: `${role}`,
      children: [
        {
          title: 'Quote List',
          path: `/${role.toLowerCase()}/quotes/quote-list`,
          action: 'quoteList-read',
          subject: `${role}`,
        },
        {
          title: 'Create Quote',
          path: `/${role.toLowerCase()}/quotes/quote-create`,
          action: 'quoteCreate-read',
          subject: `${role}`,
        },
      ],
    },
    {
      title: 'Orders',
      icon: 'mdi:home-outline',
      action: 'orders-read',
      subject: `${role}`,
      children: [
        {
          title: 'Order List',
          path: `/${role.toLowerCase()}/orders/order-list`,
          action: 'orderList-read',
          subject: `${role}`,
        },
        {
          title: 'Create Order',
          path: `/${role.toLowerCase()}/orders/order-create`,
          action: 'orderCreate-read',
          subject: `${role}`,
        },
      ],
    },
    {
      title: 'Jobs',
      icon: 'mdi:home-outline',
      action: 'jobs-read',
      subject: `${role}`,
      children: [
        {
          title: 'Job List',
          action: 'jobList-read',
          subject: `${role}`,
          path: `/${role.toLowerCase()}/jobs/job-list`,
        },
      ],
    },
    {
      title: 'Invoices',
      icon: 'mdi:home-outline',
      action: 'invoices-read',
      subject: `${role}`,
      children: [
        {
          title: `Client's invoice list`,
          path: `/${role.toLowerCase()}/invoices/client-invoice-list`,
          action: 'clientInvoiceList-read',
          subject: `${role}`,
        },
        {
          title: `Create client's invoice`,
          path: `/${role.toLowerCase()}/invoices/client-invoice-create`,
          action: 'clientInvoiceCreate-read',
          subject: `${role}`,
        },
        {
          title: `Pros' invoice list`,
          path: `/${role.toLowerCase()}/invoices/pro-invoice-list`,
          action: 'proInvoiceList-read',
          subject: `${role}`,
        },
        {
          title: `Create pro’s invoice`,
          path: `/${role.toLowerCase()}/invoices/pro-invoice-create`,
          action: 'proInvoiceCreate-read',
          subject: `${role}`,
        },
      ],
    },
    {
      title: 'Certification Test',
      icon: 'mdi:home-outline',
      action: 'certificationTest-read',
      subject: `${role}`,
      children: [
        {
          title: `Test List`,
          path: `/${role.toLowerCase()}/certification-test/test-list`,
          action: 'certificationTestList-read',
          subject: `${role}`,
        },
        {
          title: `Test Materials`,
          path: `/${role.toLowerCase()}/certification-test/test-materials`,
          action: 'certificationTestMaterials-read',
          subject: `${role}`,
        },
      ],
    },

    {
      sectionTitle: 'Apps & Pages',
    },
    {
      title: 'Editor',
      icon: 'mdi:library-edit-outline',
      path: '/apps/editor',
    },
  ]
}

export default navigation
