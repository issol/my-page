import { NotificationType } from '@src/types/common/notification.type'
import { getLegalName } from '../helpers/legalname.helper'

export const transformMessage = (notification: NotificationType) => {
  const { type, action, before, after, entityCorporationId } = notification

  const message = `${entityCorporationId} ${type}`

  switch (action) {
    case 'created':
      return `${message} has been created.`
    case 'deleted':
      return `${message} has been deleted.`
    case 'assigned':
      return `${getLegalName({
        firstName: after?.firstName,
        lastName: after?.lastName,
        middleName: after?.middleName,
      })} has assigned ${message} to you.`
    case 'unassigned':
      return `${getLegalName({
        firstName: before?.firstName,
        lastName: before?.lastName,
        middleName: before?.middleName,
      })} has unassigned ${message} from you.`
    case 'statusUpdated':
      return `${message} has been changed into [${after?.status}].`
    case 'pastDeadline':
      return `${message} has past deadline.`
    case 'pastDueDate':
      return `${message} has past due.`
    case 'restored':
      return `[Ver. ${after?.version}] ${message} has been restored.`
    case 'edited':
      return `${message} has been edited.`
    case 'accepted':
      return `${getLegalName({
        firstName: after?.firstName,
        lastName: after?.lastName,
        middleName: after?.middleName,
      })} has accepted ${message}.`
    case 'rejected':
      return `${getLegalName({
        firstName: after?.firstName,
        lastName: after?.lastName,
        middleName: after?.middleName,
      })} has rejected ${message}.`
    case 'assignCanceled':
      return `${getLegalName({
        firstName: after?.firstName,
        lastName: after?.lastName,
        middleName: after?.middleName,
      })}'s assignment for ${message} has been canceled.`
    case 'msgRegistered':
      return `A new message has been registered in ${message}.`
    case 'feedbackRegistered':
      return `Feedback has been registered on ${message}.`
  }
}
