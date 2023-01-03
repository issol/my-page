import mock from 'src/@fake-db/mock'

const data = {
  dashboard: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  account: { create: false, read: false, update: false, delete: false },
  myPage: { create: false, read: true, update: false, delete: false },
  email: { create: false, read: false, update: false, delete: false },
  onboarding: { create: false, read: false, update: false, delete: false },
  recruiting: { create: false, read: false, update: false, delete: false },
  pros: {
    create: false,
    read: true,
    update: true,
    delete: false,
  },
  clients: {
    create: false,
    read: false,
    update: false,
    delete: true,
  },
  quotes: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  orders: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  jobs: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  jobList: {
    create: false,
    read: true,
    update: false,
    deleted: false,
  },
  invoices: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  proInvoiceList: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  certificationTest: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  certificationTestList: {
    create: false,
    read: true,
    update: false,
    deleted: false,
  },
  certificationTestMaterials: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
}

const clientData = {
  dashboard: {
    create: false,
    read: true,
    update: true,
    delete: false,
  },
  account: { create: false, read: true, update: false, delete: false },
  myPage: { create: false, read: false, update: false, delete: false },
  email: { create: false, read: true, update: false, delete: false },
  onboarding: { create: false, read: false, update: false, delete: false },
  recruiting: { create: false, read: false, update: false, delete: false },
  pros: {
    create: false,
    read: true,
    update: true,
    delete: false,
  },
  clients: {
    create: false,
    read: false,
    update: false,
    delete: true,
  },
  quotes: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  quoteList: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  quoteCreate: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  orders: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },

  orderList: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },

  jobs: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  jobList: {
    create: false,
    read: false,
    update: false,
    deleted: false,
  },
  invoices: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  clientInvoiceList: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  proInvoiceList: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  certificationTest: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  certificationTestList: {
    create: false,
    read: false,
    update: false,
    deleted: false,
  },
  certificationTestMaterials: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
}

const tadData = {
  dashboard: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  account: { create: false, read: true, update: false, delete: false },
  myPage: { create: false, read: false, update: false, delete: false },
  email: { create: false, read: true, update: false, delete: false },
  onboarding: { create: false, read: true, update: false, delete: false },
  onboardingList: { create: false, read: true, update: false, delete: false },
  recruiting: { create: false, read: true, update: false, delete: false },
  recruitingList: { create: false, read: true, update: false, delete: false },
  recruitingCreate: { create: false, read: true, update: true, delete: false },
  jobPosting: { create: false, read: true, update: true, delete: false },

  pros: {
    create: false,
    read: false,
    update: true,
    delete: false,
  },
  clients: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  clientList: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  clientCreate: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  quotes: {
    create: true,
    read: false,
    update: false,
    delete: false,
  },
  quoteList: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  quoteCreate: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  orders: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },

  orderList: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },

  jobs: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  jobList: {
    create: false,
    read: false,
    update: false,
    deleted: false,
  },
  invoices: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  clientInvoiceList: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  proInvoiceList: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  certificationTest: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  certificationTestList: {
    create: false,
    read: false,
    update: false,
    deleted: false,
  },
  certificationTestMaterials: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
}

const lpmData = {
  dashboard: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  account: { create: false, read: true, update: false, delete: false },
  myPage: { create: false, read: false, update: false, delete: false },
  email: { create: false, read: true, update: false, delete: false },
  onboarding: { create: false, read: false, update: false, delete: false },
  onboardingList: { create: false, read: false, update: false, delete: false },
  recruiting: { create: false, read: false, update: false, delete: false },
  recruitingList: { create: false, read: false, update: false, delete: false },
  recruitingCreate: { create: false, read: false, update: true, delete: false },
  jobPosting: { create: false, read: false, update: true, delete: false },

  pros: {
    create: false,
    read: true,
    update: true,
    delete: false,
  },
  proList: {
    create: false,
    read: true,
    update: true,
    delete: false,
  },
  proCreate: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  clients: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  clientList: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  clientCreate: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  quotes: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  quoteList: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  quoteCreate: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  orders: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },

  orderList: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },

  orderCreate: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },

  jobs: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  jobList: {
    create: false,
    read: false,
    update: false,
    deleted: false,
  },
  invoices: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  clientInvoiceList: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  createClientInvoice: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  proInvoiceList: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  createProInvoice: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  certificationTest: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  certificationTestList: {
    create: false,
    read: false,
    update: false,
    deleted: false,
  },
  certificationTestMaterials: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
}

const defaultMenu = [
  'dashboard',
  'account',
  'myPage',
  'email',
  'onboarding',
  'onboardingList',
  'recruiting',
  'recruitingList',
  'recruitingCreate',
  'jobPosting',
  'pros',
  'proList',
  'proCreate',
  'clients',
  'clientList',
  'clientCreate',
  'quotes',
  'quoteList',
  'quoteCreate',
  'orders',
  'orderList',
  'orderCreate',
  'jobs',
  'jobList',
  'invoices',
  'clientInvoiceList',
  'createClientInvoice',
  'proInvoiceList',
  'createProInvoice',
  'certificationTest',
  'certificationTestList',
  'certificationTestMaterials',
  'roles',
]

const clientMasterMenu = [
  'dashboard',
  'account',
  'email',
  'quotes',
  'quoteList',
  'quoteCreate',
  'orders',
  'orderList',
  'invoices',
  'clientInvoiceList',
  'roles',
]

const generatePermission = (role?: string, id?: number) => {
  if (role === 'CLIENT' && id === 41) {
    const res = clientMasterMenu.reduce((acc, value, index) => {
      return {
        ...acc,
        [value]: {
          create: true,
          read: true,
          update: true,
          delete: true,
        },
      }
    }, {})

    return res
  } else {
    const res = defaultMenu.reduce((acc, value, index) => {
      return {
        ...acc,
        [value]: {
          create: value === 'roles' ? false : Math.random() >= 0.5,
          read:
            value === 'dashboard'
              ? true
              : value === 'roles'
              ? false
              : Math.random() >= 0.5,
          update: value === 'roles' ? false : Math.random() >= 0.5,
          delete: value === 'roles' ? false : Math.random() >= 0.5,
        },
      }
    }, {})

    return res
  }
}

mock.onGet('/api/policy/data').reply(request => {
  const { role, id } = request.params

  switch (role) {
    case 'PRO':
      return [200, generatePermission(role, id)]
    case 'CLIENT':
      return [200, generatePermission(role, id)]
    case 'TAD':
      return [200, generatePermission(role, id)]
    case 'LPM':
      return [200, generatePermission(role, id)]

    default:
      return [200, generatePermission(role, id)]
  }
})
// mock.onGet('/api/policy/data', { params: { role: 'CLIENT' } }).reply(() => {
//   return [200, clientData]
// })
// mock.onGet('/api/policy/data', { params: { role: 'TAD' } }).reply(() => {
//   return [200, tadData]
// })
// mock.onGet('/api/policy/data', { params: { role: 'LPM' } }).reply(() => {
//   return [200, lpmData]
// })
