// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'
import { RoleType } from 'src/context/types'

// ** TODO : 렐과 상의 후 action, subject 수정하기
//role별 메뉴를 만드는게 좋을 것 같음. 그래야 action, subject를 정확히 줄 수 있음
const navigation = (role: RoleType | null): HorizontalNavItemsType => {
  switch (role) {
    case 'TAD':
      return [
        {
          title: 'Dashboards',
          icon: 'mdi:home-outline',
          action: 'read',
          subject: 'members',
          path: `/${role?.toLowerCase()}/dashboard`,
        },

        {
          title: 'Company',
          icon: 'mdi:briefcase-outline',
          action: 'update',
          subject: 'permission_request',
          path: `/${role?.toLowerCase()}/company`,
        },
        {
          title: 'Account',
          icon: 'mdi:account-outline',
          action: 'read',
          subject: 'members',
          path: `/${role?.toLowerCase()}/account`,
        },
        {
          //**TODO : action, subject 수정하기 */
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
    case 'LPM':
      return [
        {
          title: 'Dashboards',
          icon: 'mdi:home-outline',
          action: 'read',
          subject: 'members',
          path: `/${role?.toLowerCase()}/dashboard`,
        },
        {
          title: 'Company',
          icon: 'mdi:briefcase-outline',
          action: 'update',
          subject: 'permission_request',
          path: `/${role?.toLowerCase()}/company`,
        },
        {
          title: 'Account',
          icon: 'mdi:account-outline',
          action: 'read',
          subject: 'members',
          path: `/${role?.toLowerCase()}/account`,
        },
      ]
    case 'CLIENT':
      return [
        {
          title: 'Dashboards',
          icon: 'mdi:home-outline',
          action: 'read',
          subject: 'members',
          path: `/${role?.toLowerCase()}/dashboard`,
        },
        {
          title: 'Company',
          icon: 'mdi:briefcase-outline',
          action: 'read',
          subject: 'members',
          path: `/${role?.toLowerCase()}/company`,
        },
        {
          title: 'Account',
          icon: 'mdi:account-outline',
          action: 'read',
          subject: 'members',
          path: `/${role?.toLowerCase()}/account`,
        },
      ]
    case 'PRO':
      return [
        {
          title: 'Dashboards',
          icon: 'mdi:home-outline',
          action: 'read',
          subject: 'personalInfo_pro',
          path: `/${role?.toLowerCase()}/dashboard`,
        },

        {
          title: 'Company',
          icon: 'mdi:briefcase-outline',
          action: 'read',
          subject: 'members',
          path: `/${role?.toLowerCase()}/company`,
        },
        {
          title: 'My Page',
          icon: 'mdi:home-outline',
          action: 'read',
          subject: 'members',
          path: `/${role?.toLowerCase()}/my-page`,
        },
      ]
    //** TODO: 임시로 넣어둔 메뉴. 메뉴 정리 되면 지우기 */
    default:
      return [
        {
          title: 'Dashboards',
          icon: 'mdi:home-outline',
          action: 'read',
          subject: 'members',
          path: `/tad/dashboard`,
        },

        {
          title: 'Company',
          icon: 'mdi:briefcase-outline',
          action: 'update',
          subject: 'permission_request',
          path: `/tad/company`,
        },
        {
          title: 'Account',
          icon: 'mdi:account-outline',
          action: 'read',
          subject: 'members',
          path: `/account`,
        },
        {
          //**TODO : action, subject 수정하기 */
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
}

// const navigation = (role: string | null): HorizontalNavItemsType => {
//   console.log(role)
//   return [
//     // ** Dashboard - Client, LPM, TAD, Pro
//     {
//       title: 'Dashboards',
//       icon: 'mdi:home-outline',
//       // icon: '/images/icons/gnb-icons/gnb-company.png',
//       action: 'B1072',
//       subject: `${role}`,
//       path: `/${role?.toLowerCase()}/dashboard`,
//     },

//     {
//       title: 'Company',
//       icon: 'mdi:briefcase-outline',
//       action: 'L8870',
//       subject: `${role}`,
//       path: `/${role?.toLowerCase()}/company`,
//     },
//     // ** Account - Client, LPM, TAD
//     {
//       title: 'Account',
//       icon: 'mdi:account-outline',
//       action: 'AC0010',
//       subject: `${role}`,
//       path: `/${role?.toLowerCase()}/account`,
//     },
//     // ** My Page - Pro
//     {
//       title: 'My Page',
//       icon: 'mdi:home-outline',
//       action: 'BP9001',
//       subject: `${role}`,
//       path: `/${role?.toLowerCase()}/my-page`,
//     },
//     {
//       title: 'Email',
//       icon: 'mdi:airplane-landing',
//       action: 'MB0333',
//       subject: `${role}`,
//       path: `/${role?.toLowerCase()}/email`,
//     },
//     {
//       title: 'Onboarding',
//       icon: 'mdi:airplane-landing',
//       action: 'LH4465',
//       subject: `${role}`,
//       children: [
//         {
//           title: 'Onboarding List',
//           path: `/${role?.toLowerCase()}/onboarding/onboarding-list`,
//           action: 'onboardingList-read',
//           subject: `${role}`,
//         },
//       ],
//     },
//     {
//       title: 'Recruiting',
//       icon: 'mdi:home-outline',
//       action: 'PH2323',
//       subject: `${role}`,
// children: [
//   {
//     title: 'Recruiting List',
//     path: `/${role?.toLowerCase()}/recruiting/recruiting-list`,
//     action: 'recruitingList-read',
//     subject: `${role}`,
//   },
//   {
//     title: 'Create Recruiting',
//     path: `/${role?.toLowerCase()}/recruiting/recruiting-create`,
//     action: 'recruitingCreate-read',
//     subject: `${role}`,
//   },
//   {
//     title: 'Job Posting',
//     path: `/${role?.toLowerCase()}/recruiting/job-posting`,
//     action: 'recruitingJobPosting-read',
//     subject: `${role}`,
//   },
// ],
//     },
//     {
//       title: 'Pros',
//       icon: 'mdi:home-outline',
//       action: 'BU5945',
//       subject: `${role}`,
//       children: [
//         {
//           title: 'Pro List',
//           path: `/${role?.toLowerCase()}/pros/pro-list`,
//           action: 'proList-read',
//           subject: `${role}`,
//         },
//         {
//           title: 'Create Pro',
//           path: `/${role?.toLowerCase()}/pros/pro-create`,
//           action: 'proCreate-read',
//           subject: `${role}`,
//         },
//       ],
//     },
//     {
//       title: 'Clients',
//       icon: 'mdi:home-outline',
//       action: 'BU7644',
//       subject: `${role}`,
//       children: [
//         {
//           title: 'Client List',
//           path: `/${role?.toLowerCase()}/clients/client-list`,
//           action: 'clientList-read',
//           subject: `${role}`,
//         },
//         {
//           title: 'Create Client',
//           path: `/${role?.toLowerCase()}/clients/client-create`,
//           action: 'clientCreate-read',
//           subject: `${role}`,
//         },
//       ],
//     },
//     {
//       title: 'Quotes',
//       icon: 'mdi:home-outline',
//       action: 'PO5800',
//       subject: `${role}`,
//       children: [
//         {
//           title: 'Quote List',
//           path: `/${role?.toLowerCase()}/quotes/quote-list`,
//           action: 'quoteList-read',
//           subject: `${role}`,
//         },
//         {
//           title: 'Create Quote',
//           path: `/${role?.toLowerCase()}/quotes/quote-create`,
//           action: 'quoteCreate-read',
//           subject: `${role}`,
//         },
//       ],
//     },
//     {
//       title: 'Orders',
//       icon: 'mdi:home-outline',
//       action: 'NO2001',
//       subject: `${role}`,
//       children: [
//         {
//           title: 'Order List',
//           path: `/${role?.toLowerCase()}/orders/order-list`,
//           action: 'orderList-read',
//           subject: `${role}`,
//         },
//         {
//           title: 'Create Order',
//           path: `/${role?.toLowerCase()}/orders/order-create`,
//           action: 'orderCreate-read',
//           subject: `${role}`,
//         },
//       ],
//     },
//     {
//       title: 'Jobs',
//       icon: 'mdi:home-outline',
//       action: 'JK7777',
//       subject: `${role}`,
//       children: [
//         {
//           title: 'Job List',
//           action: 'jobList-read',
//           subject: `${role}`,
//           path: `/${role?.toLowerCase()}/jobs/job-list`,
//         },
//       ],
//     },
//     {
//       title: 'Invoices',
//       icon: 'mdi:home-outline',
//       action: 'EV6630',
//       subject: `${role}`,
//       children: [
//         {
//           title: `Client's invoice list`,
//           path: `/${role?.toLowerCase()}/invoices/client-invoice-list`,
//           action: 'clientInvoiceList-read',
//           subject: `${role}`,
//         },
//         {
//           title: `Create client's invoice`,
//           path: `/${role?.toLowerCase()}/invoices/client-invoice-create`,
//           action: 'clientInvoiceCreate-read',
//           subject: `${role}`,
//         },
//         {
//           title: `Pros' invoice list`,
//           path: `/${role?.toLowerCase()}/invoices/pro-invoice-list`,
//           action: 'proInvoiceList-read',
//           subject: `${role}`,
//         },
//         {
//           title: `Create pro’s invoice`,
//           path: `/${role?.toLowerCase()}/invoices/pro-invoice-create`,
//           action: 'proInvoiceCreate-read',
//           subject: `${role}`,
//         },
//       ],
//     },
//     {
//       title: 'Certification Test',
//       icon: 'mdi:home-outline',
//       action: 'TE0650',
//       subject: `${role}`,
//       children: [
//         {
//           title: `Test List`,
//           path: `/${role?.toLowerCase()}/certification-test/test-list`,
//           action: 'certificationTestList-read',
//           subject: `${role}`,
//         },
//         {
//           title: `Test Materials`,
//           path: `/${role?.toLowerCase()}/certification-test/test-materials`,
//           action: 'certificationTestMaterials-read',
//           subject: `${role}`,
//         },
//       ],
//     },

//     {
//       title: 'Roles & Permission',
//       icon: 'mdi:home-outline',
//       action: 'roles-read',
//       subject: `${role}`,
//       path: `/${role?.toLowerCase()}/roles`,
//     },

//     {
//       title: 'Editor',
//       icon: 'mdi:library-edit-outline',
//       path: '/apps/editor',
//     },
//   ]
// }

export default navigation
