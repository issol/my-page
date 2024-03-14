const isTouchScreen =
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: none) and (pointer: coarse)').matches

const startEventName = isTouchScreen ? 'touchstart' : 'mousedown'
const moveEventName = isTouchScreen ? 'touchmove' : 'mousemove'
const endEventName = isTouchScreen ? 'touchend' : 'mouseup'

const getDelta = (
  startEvent: MouseEvent | TouchEvent,
  moveEvent: MouseEvent | TouchEvent,
) => {
  if (isTouchScreen) {
    const se = startEvent as TouchEvent
    const me = moveEvent as TouchEvent

    return {
      deltaX: me.touches[0].pageX - se.touches[0].pageX,
      deltaY: me.touches[0].pageY - se.touches[0].pageY,
    }
  }

  const se = startEvent as MouseEvent
  const me = moveEvent as MouseEvent

  // console.log(me.clientY - se.pageY)
  console.log(me.movementY)
  // console.log(se.pageY)

  return {
    deltaX: me.clientX - se.pageX,
    deltaY: me.clientY - se.pageY,
  }
}

export type DropItem = {
  droppableId: string
  index: number
}

export type DropEvent = {
  source: DropItem
  destination?: DropItem
}

export default function registDND(onDrop: (event: DropEvent) => void) {
  const clearDroppableShadow = () => {
    document
      .querySelectorAll<HTMLElement>('[data-droppable-id]')
      .forEach(element => {
        element.style.boxShadow = 'none'
      })
  }

  const startHandler = (startEvent: MouseEvent | TouchEvent) => {
    const target = (startEvent.target as HTMLElement).closest<HTMLElement>(
      '.dnd-handle',
    )
    const item = (startEvent.target as HTMLElement).closest<HTMLElement>(
      '.dnd-item',
    )

    if (
      !item ||
      item.classList.contains('moving') ||
      !target ||
      item.classList.contains('dnd-handle')
    ) {
      return
    }

    let destination: HTMLElement | null | undefined
    let destinationItem: HTMLElement | null | undefined
    let destinationIndex: number
    let destinationDroppableId: string

    const source = item.closest<HTMLElement>('[data-droppable-id]')
    if (!source)
      return console.warn('Need `data-droppable-id` at dnd-item parent')
    if (!item.dataset.index)
      return console.warn('Need `data-index` at dnd-item')
    // 다른 보드로 이동시 생성하는 임시 sourceItem
    let movingItem: HTMLElement
    const sourceIndex = Number(item.dataset.index)
    const sourceDroppableId = source.dataset.droppableId!

    const itemRect = item.getBoundingClientRect()
    const selectProElement = document.querySelector('.selectPro')
    console.log(selectProElement?.getBoundingClientRect().width)
    console.log(itemRect.left)

    //--- Ghost 만들기
    const ghostItem = item.cloneNode(true) as HTMLElement
    ghostItem.classList.add('ghost')
    ghostItem.style.position = 'fixed'
    ghostItem.style.top = `${itemRect.top}px`
    ghostItem.style.left = `${itemRect.left}px`
    ghostItem.style.width = `${itemRect.width}px`
    ghostItem.style.height = `${itemRect.height}px`
    ghostItem.style.pointerEvents = 'none'

    ghostItem.style.border = '2px solid rgb(96 165 250)'
    ghostItem.style.opacity = '0.95'
    ghostItem.style.boxShadow = '0 30px 60px rgba(0, 0, 0, .2)'
    ghostItem.style.transform = 'scale(1.05)'
    ghostItem.style.transition =
      'transform 200ms ease, opacity 200ms ease, boxShadow 200ms ease'

    item.classList.add('placeholder')
    item.style.cursor = 'grabbing'

    if (selectProElement) {
      selectProElement.appendChild(ghostItem)
      ghostItem.style.cursor = 'grabbing'
    }

    // document.body.style.cursor = 'grabbing'
    // document.body.appendChild(ghostItem)
    //--- Ghost 만들기 END

    document
      .querySelectorAll<HTMLElement>('.dnd-item:not(.ghost)')
      .forEach(item => {
        item.style.transition = 'all 200ms ease'
      })

    const moveHandler = (moveEvent: MouseEvent | TouchEvent) => {
      // Touch 이벤트에서 moveEvent와 scrollEvent가 겹치지 않도록 가능하면 방지한다.
      if (moveEvent.cancelable) moveEvent.preventDefault()

      //--- Ghost Drag
      const { deltaX, deltaY } = getDelta(startEvent, moveEvent)
      ghostItem.style.top = `${itemRect.top + deltaY}px`
      // ghostItem.style.left = `${itemRect.left + deltaX}px`

      //--- Ghost Drag END

      //--- Drop 영역 확인
      const ghostItemRect = ghostItem.getBoundingClientRect()

      const pointTarget = document.elementFromPoint(
        ghostItemRect.left + ghostItemRect.width / 2,
        ghostItemRect.top + ghostItemRect.height / 2,
      )

      const currentDestinationItem =
        pointTarget?.closest<HTMLElement>('.dnd-item')
      const currentDestination = pointTarget?.closest<HTMLElement>(
        '[data-droppable-id]',
      )
      const currentDestinationDroppableId =
        currentDestination?.dataset.droppableId
      const currentDestinationIndex = Number(
        currentDestinationItem?.dataset.index,
      )

      clearDroppableShadow()
      if (currentDestination) {
        currentDestination.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'
      }

      const currentSourceItem = movingItem ?? item
      const currentSourceIndex = Number(currentSourceItem.dataset.index)
      const currentSource = currentSourceItem.closest<HTMLElement>(
        '[data-droppable-id]',
      )!
      const currentSourceDroppableId = currentSource.dataset.droppableId

      if (
        currentDestinationItem?.isSameNode(currentSourceItem) ||
        currentDestinationItem?.classList.contains('moving')
      ) {
        return
      }

      if (
        currentDestination &&
        currentDestinationDroppableId &&
        currentDestinationDroppableId !== currentSourceDroppableId
      ) {
        if (!movingItem) {
          movingItem = item.cloneNode(true) as HTMLElement
          item.classList.remove('dnd-item')
          item.style.display = 'none'
        }

        currentDestination.appendChild(movingItem)
        destination = currentDestination
        destinationDroppableId = currentDestinationDroppableId
        destinationIndex =
          currentDestination.querySelectorAll('.dnd-item').length - 1

        currentDestination
          .querySelectorAll<HTMLElement>('.dnd-item')
          .forEach((v, i) => {
            v.dataset.index = i + ''
            v.style.transform = ''
            v.classList.remove('moved')
          })
        currentSource
          .querySelectorAll<HTMLElement>('.dnd-item')
          .forEach((v, i) => {
            v.dataset.index = i + ''
            v.style.transform = ''
            v.classList.remove('moved')
          })
      }

      console.log(
        `'${currentSourceDroppableId}': ${currentSourceIndex} -> '${currentDestinationDroppableId}': ${currentDestinationIndex}`,
      )

      if (!currentDestinationItem) {
        return
      }

      const distance = itemRect.height + 0

      destinationItem = currentDestinationItem
      destination = currentDestinationItem.closest<HTMLElement>(
        '[data-droppable-id]',
      )
      destinationDroppableId = destination?.dataset.droppableId + ''

      // 위에서 아래로 간다면 (ex. index 1 -> 3)
      const isForward = currentSourceIndex < currentDestinationIndex
      const isDestinationMoved = destinationItem.classList.contains('moved')
      let indexDiff = currentDestinationIndex - currentSourceIndex
      if (isDestinationMoved) {
        indexDiff += isForward ? -1 : 1
      }
      destinationIndex = currentSourceIndex + indexDiff

      const transX = indexDiff * distance
      currentSourceItem.style.transform = `translate3d(0, ${transX}px, 0)`

      let target = currentDestinationItem
      while (
        target &&
        target.classList.contains('dnd-item') &&
        !target.classList.contains('placeholder')
      ) {
        if (isDestinationMoved) {
          target.style.transform = ''
          target.classList.remove('moved')
          target = (
            isForward
              ? target.nextElementSibling
              : target.previousElementSibling
          ) as HTMLElement
        } else {
          target.style.transform = `translate3d(0, ${
            isForward ? -distance : distance
          }px, 0)`
          target.classList.add('moved')
          target = (
            isForward
              ? target.previousElementSibling
              : target.nextElementSibling
          ) as HTMLElement
        }
      }

      currentDestinationItem.classList.add('moving')
      currentDestinationItem.addEventListener(
        'transitionend',
        () => {
          currentDestinationItem?.classList.remove('moving')
        },
        { once: true },
      )
      setTimeout(() => {
        currentDestinationItem?.classList.remove('moving')
      }, 200)
      //--- Drop 영역 확인 END
    }

    const endHandler = () => {
      const sourceItem = movingItem ?? item
      item.classList.remove('placeholder')
      movingItem?.classList.remove('placeholder')

      document.body.removeAttribute('style')
      clearDroppableShadow()

      const itemRect = sourceItem.getBoundingClientRect()
      ghostItem.classList.add('moving')
      ghostItem.style.left = `${itemRect.left}px`
      ghostItem.style.top = `${itemRect.top}px`
      ghostItem.style.opacity = '1'
      ghostItem.style.transform = 'none'
      ghostItem.style.borderWidth = '0px'
      ghostItem.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.15)'
      ghostItem.style.transition = 'all 200ms ease'

      ghostItem.addEventListener(
        'transitionend',
        () => {
          setTimeout(() => {
            document
              .querySelectorAll<HTMLElement>('.dnd-item')
              .forEach(item => {
                item.removeAttribute('style')
                item.classList.remove('moving', 'moved')
              })

            item.classList.add('dnd-item')
            item.removeAttribute('style')
            movingItem?.remove()
          }, 0)

          ghostItem.remove()

          console.log(
            `result >> '${sourceDroppableId}': ${sourceIndex} -> '${destinationDroppableId}': ${destinationIndex}`,
          )

          onDrop({
            source: {
              droppableId: sourceDroppableId,
              index: sourceIndex,
            },
            destination: destination
              ? {
                  droppableId: destinationDroppableId,
                  index: destinationIndex,
                }
              : undefined,
          })
        },
        { once: true },
      )

      document.removeEventListener(moveEventName, moveHandler)
    }

    document.addEventListener(moveEventName, moveHandler, { passive: false })
    document.addEventListener(endEventName, endHandler, { once: true })
  }

  document.addEventListener(startEventName, startHandler)
  return () => document.removeEventListener(startEventName, startHandler)
}
