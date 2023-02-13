import ComingSoon from '../pages/misc/coming-soon'

const Dashboards = () => {
  return <ComingSoon />
}

export default Dashboards

Dashboards.acl = {
  action: 'read',
  subject: 'members',
}
