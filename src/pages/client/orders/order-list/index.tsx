const ClientOrderList = () => {
  return <div>Client Order List</div>
}

export default ClientOrderList

ClientOrderList.acl = {
  action: 'orderList-read',
  subject: 'CLIENT',
}
