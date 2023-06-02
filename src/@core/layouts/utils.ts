// ** Types
import { NavGroup, NavLink } from 'src/@core/layouts/types'
import { NextRouter } from 'next/router'

/**
 * Check for URL queries as well for matching
 * Current URL & Item Path
 *
 * @param item
 * @param activeItem
 */
export const handleURLQueries = (router: NextRouter, path: string | undefined): boolean => {
  if (Object.keys(router.query).length && path) {
    const arr = Object.keys(router.query)

    return router.asPath.includes(path) && router.asPath.includes(router.query[arr[0]] as string) && path !== '/'
  }

  return false
}

/**
 * Check if the given item has the given url
 * in one of its children
 *
 * @param item
 * @param currentURL
 */
export const hasActiveChild = (item: NavGroup, currentURL: string): boolean => {
  // console.log("Hover check",item,currentURL)
  const { children } = item

  if (!children) {
    return false
  }

  for (const child of children) {
    if ((child as NavGroup).children) {
      if (hasActiveChild(child, currentURL)) {
        return true
      }
    }
    const childPath = (child as NavLink).path

    // Check if the child has a link and is active
    if (
      child &&
      childPath &&
      currentURL &&
      // (childPath === currentURL || (currentURL.includes(childPath) && childPath !== '/'))
      // 기존 로직에서 includes로 비교시 child의 경로에 다른 parent의 경로의 일부가 있다면 true가 됨, 그래서 split으로 짤라서 첫번째 depth 주소만 비교하게 변경함
      (childPath === currentURL || (currentURL.split('/')[1].includes(childPath.split('/')[1]) && childPath !== '/'))
    ) {
      return true
    }
  }

  return false
}

/**
 * Check if this is a children
 * of the given item
 *
 * @param children
 * @param openGroup
 * @param currentActiveGroup
 */
export const removeChildren = (children: NavLink[], openGroup: string[], currentActiveGroup: string[]) => {
  children.forEach((child: NavLink) => {
    if (!currentActiveGroup.includes(child.title)) {
      const index = openGroup.indexOf(child.title)
      if (index > -1) openGroup.splice(index, 1)

      // @ts-ignore
      if (child.children) removeChildren(child.children, openGroup, currentActiveGroup)
    }
  })
}
