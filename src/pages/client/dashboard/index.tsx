const ClientDashboard = () => {
  return <div>Client Dashboard</div>
}

export default ClientDashboard

ClientDashboard.acl = {
  action: 'dashboard-read',
  subject: 'CLIENT',
}
