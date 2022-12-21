const LpmClientInvoiceList = () => {
  return <div>LPM Client Invoice List</div>
}

export default LpmClientInvoiceList

LpmClientInvoiceList.acl = {
  action: 'clientInvoiceList-read',
  subject: 'LPM',
}
