type RoleType = {
  role: string
  permission: string
}

export const splitRole = (role: string[]) => {
  return role.map(item => {
    const [role, permission] = item.split('-')
    return {
      role,
      permission
    }
  })
}

export const filterRole = (role: RoleType[]) => {
  return role.filter(item => item.role === 'LPM' || item.role === 'TAD')
}

export const sortRole = (role: RoleType[], mode: 'role' | 'permission') => {
  const sortedData = role.sort((a, b) => {
    // 1. role을 알파벳 내림차순으로 정렬
    if (a.role > b.role) {
      return 1;
    } else if (a.role < b.role) {
      return -1;
    } else {
      // 2. role이 같을 경우 permission을 Master, Manager, General 순서로 정렬
      const order = ['Master', 'Manager', 'General'];
      return order.indexOf(a.permission) - order.indexOf(b.permission);
    }
  });

  if(mode === 'role') return sortedData.map(item => item.role)
  else if(mode === 'permission') return sortedData.map(item => item.permission)
  else return []
}

export const joinRole = (role:string[]) => {
  // 현재는 새롭게 Role을 추가할때 permission은 무조건 General 이므로 ${role}-General 이 되도록 하드코딩함
  return role.map((item, idx) => `${item}-General`)
}
