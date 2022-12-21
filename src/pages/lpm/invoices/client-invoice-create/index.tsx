const LpmClientInvoiceCreate = () => {
  return <div>LPM Client Invoice Create</div>
}

export default LpmClientInvoiceCreate

LpmClientInvoiceCreate.acl = {
  action: 'clientInvoiceCreate-read',
  subject: 'LPM',
}
