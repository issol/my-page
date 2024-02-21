export const splitRoleName = (role: string) => {
  return role.split('-')[0]
}

export const splitPermissionName = (permission: string) => {
  return permission.split('-')[1]
}

// permissionGroups 값에서 Role 이름이 LPM, TAD, CLIENT 인것만 필터하여 보내줍니다.
export const filterRole = (role: string[]) => {
  return role.filter(item => item.includes('LPM') || item.includes('TAD') || item.includes('CLIENT'))
}

export const sortRole = (role: string[], mode: 'role' | 'permission') => {
  const sortedData = role.sort((a, b) => {
    if (a > b) {
      return 1
    } else if (a < b) {
      return -1
    }
    return 0
  });
  return sortedData
}

