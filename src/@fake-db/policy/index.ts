import mock from 'src/@fake-db/mock'

const data = {
  dashboard: {
    create: false,
    read: true,
    write: false,
    delete: false,
  },
  account: { create: false, read: false, write: false, delete: false },
  myPage: { create: false, read: true, write: false, delete: false },
  email: { create: false, read: false, write: false, delete: false },
  onboarding: { create: false, read: false, write: false, delete: false },
  recruiting: { create: false, read: false, write: false, delete: false },
  pros: {
    create: false,
    read: true,
    write: true,
    delete: false,
  },
  clients: {
    create: false,
    read: false,
    write: false,
    delete: true,
  },
  quotes: {
    create: false,
    read: false,
    write: false,
    delete: false,
  },
  orders: {
    create: false,
    read: false,
    write: false,
    delete: false,
  },
  jobs: {
    create: false,
    read: true,
    write: false,
    delete: false,
  },
  jobList: {
    create: false,
    read: true,
    write: false,
    deleted: false,
  },
  invoices: {
    create: false,
    read: true,
    write: false,
    delete: false,
  },
  proInvoiceList: {
    create: false,
    read: true,
    write: false,
    delete: false,
  },
  certificationTest: {
    create: false,
    read: true,
    write: false,
    delete: false,
  },
  certificationTestList: {
    create: false,
    read: true,
    write: false,
    deleted: false,
  },
  certificationTestMaterials: {
    create: false,
    read: false,
    write: false,
    delete: false,
  },
}

const clientData = {
  dashboard: {
    create: false,
    read: true,
    write: true,
    delete: false,
  },
  account: { create: false, read: true, write: false, delete: false },
  myPage: { create: false, read: false, write: false, delete: false },
  email: { create: false, read: true, write: false, delete: false },
  onboarding: { create: false, read: false, write: false, delete: false },
  recruiting: { create: false, read: false, write: false, delete: false },
  pros: {
    create: false,
    read: true,
    write: true,
    delete: false,
  },
  clients: {
    create: false,
    read: false,
    write: false,
    delete: true,
  },
  quotes: {
    create: true,
    read: true,
    write: false,
    delete: false,
  },
  quoteList: {
    create: false,
    read: true,
    write: false,
    delete: false,
  },
  quoteCreate: {
    create: false,
    read: true,
    write: false,
    delete: false,
  },
  orders: {
    create: false,
    read: true,
    write: false,
    delete: false,
  },

  orderList: {
    create: false,
    read: true,
    write: false,
    delete: false,
  },

  jobs: {
    create: false,
    read: false,
    write: false,
    delete: false,
  },
  jobList: {
    create: false,
    read: false,
    write: false,
    deleted: false,
  },
  invoices: {
    create: false,
    read: true,
    write: false,
    delete: false,
  },
  clientInvoiceList: {
    create: false,
    read: true,
    write: false,
    delete: false,
  },
  proInvoiceList: {
    create: false,
    read: false,
    write: false,
    delete: false,
  },
  certificationTest: {
    create: false,
    read: false,
    write: false,
    delete: false,
  },
  certificationTestList: {
    create: false,
    read: false,
    write: false,
    deleted: false,
  },
  certificationTestMaterials: {
    create: false,
    read: false,
    write: false,
    delete: false,
  },
}

const tadData = {
  dashboard: {
    create: false,
    read: true,
    write: false,
    delete: false,
  },
  account: { create: false, read: true, write: false, delete: false },
  myPage: { create: false, read: false, write: false, delete: false },
  email: { create: false, read: true, write: false, delete: false },
  onboarding: { create: false, read: true, write: false, delete: false },
  onboardingList: { create: false, read: true, write: false, delete: false },
  recruiting: { create: false, read: true, write: false, delete: false },
  recruitingList: { create: false, read: true, write: false, delete: false },
  recruitingCreate: { create: false, read: true, write: true, delete: false },
  jobPosting: { create: false, read: true, write: true, delete: false },

  pros: {
    create: false,
    read: false,
    write: true,
    delete: false,
  },
  clients: {
    create: false,
    read: false,
    write: false,
    delete: false,
  },
  clientList: {
    create: false,
    read: false,
    write: false,
    delete: false,
  },
  clientCreate: {
    create: false,
    read: false,
    write: false,
    delete: false,
  },
  quotes: {
    create: true,
    read: false,
    write: false,
    delete: false,
  },
  quoteList: {
    create: false,
    read: false,
    write: false,
    delete: false,
  },
  quoteCreate: {
    create: false,
    read: false,
    write: false,
    delete: false,
  },
  orders: {
    create: false,
    read: false,
    write: false,
    delete: false,
  },

  orderList: {
    create: false,
    read: false,
    write: false,
    delete: false,
  },

  jobs: {
    create: false,
    read: false,
    write: false,
    delete: false,
  },
  jobList: {
    create: false,
    read: false,
    write: false,
    deleted: false,
  },
  invoices: {
    create: false,
    read: false,
    write: false,
    delete: false,
  },
  clientInvoiceList: {
    create: false,
    read: false,
    write: false,
    delete: false,
  },
  proInvoiceList: {
    create: false,
    read: false,
    write: false,
    delete: false,
  },
  certificationTest: {
    create: false,
    read: true,
    write: false,
    delete: false,
  },
  certificationTestList: {
    create: false,
    read: false,
    write: false,
    deleted: false,
  },
  certificationTestMaterials: {
    create: false,
    read: true,
    write: false,
    delete: false,
  },
}

const lpmData = {
  dashboard: {
    create: false,
    read: true,
    write: false,
    delete: false,
  },
  account: { create: false, read: true, write: false, delete: false },
  myPage: { create: false, read: false, write: false, delete: false },
  email: { create: false, read: true, write: false, delete: false },
  onboarding: { create: false, read: false, write: false, delete: false },
  onboardingList: { create: false, read: false, write: false, delete: false },
  recruiting: { create: false, read: false, write: false, delete: false },
  recruitingList: { create: false, read: false, write: false, delete: false },
  recruitingCreate: { create: false, read: false, write: true, delete: false },
  jobPosting: { create: false, read: false, write: true, delete: false },

  pros: {
    create: false,
    read: true,
    write: true,
    delete: false,
  },
  proList: {
    create: false,
    read: true,
    write: true,
    delete: false,
  },
  proCreate: {
    create: false,
    read: true,
    write: false,
    delete: false,
  },
  clients: {
    create: false,
    read: true,
    write: false,
    delete: false,
  },
  clientList: {
    create: false,
    read: true,
    write: false,
    delete: false,
  },
  clientCreate: {
    create: false,
    read: true,
    write: false,
    delete: false,
  },
  quotes: {
    create: true,
    read: true,
    write: false,
    delete: false,
  },
  quoteList: {
    create: false,
    read: true,
    write: false,
    delete: false,
  },
  quoteCreate: {
    create: false,
    read: true,
    write: false,
    delete: false,
  },
  orders: {
    create: false,
    read: true,
    write: false,
    delete: false,
  },

  orderList: {
    create: false,
    read: true,
    write: false,
    delete: false,
  },

  orderCreate: {
    create: true,
    read: true,
    write: false,
    delete: false,
  },

  jobs: {
    create: false,
    read: false,
    write: false,
    delete: false,
  },
  jobList: {
    create: false,
    read: false,
    write: false,
    deleted: false,
  },
  invoices: {
    create: false,
    read: true,
    write: false,
    delete: false,
  },
  clientInvoiceList: {
    create: false,
    read: true,
    write: false,
    delete: false,
  },
  createClientInvoice: {
    create: false,
    read: true,
    write: false,
    delete: false,
  },
  proInvoiceList: {
    create: false,
    read: true,
    write: false,
    delete: false,
  },
  createProInvoice: {
    create: false,
    read: true,
    write: false,
    delete: false,
  },
  certificationTest: {
    create: false,
    read: false,
    write: false,
    delete: false,
  },
  certificationTestList: {
    create: false,
    read: false,
    write: false,
    deleted: false,
  },
  certificationTestMaterials: {
    create: false,
    read: false,
    write: false,
    delete: false,
  },
}

mock.onGet('/api/policy/data', { params: { role: 'PRO' } }).reply(() => {
  return [200, data]
})
mock.onGet('/api/policy/data', { params: { role: 'CLIENT' } }).reply(() => {
  return [200, clientData]
})
mock.onGet('/api/policy/data', { params: { role: 'TAD' } }).reply(() => {
  return [200, tadData]
})
mock.onGet('/api/policy/data', { params: { role: 'LPM' } }).reply(() => {
  return [200, lpmData]
})
