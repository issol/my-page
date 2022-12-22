const ClientInvoiceList = () => {
  return <div>Client Invoice List</div>
}

export default ClientInvoiceList

ClientInvoiceList.acl = {
  action: 'clientInvoiceList-read',
  subject: 'CLIENT',
}
