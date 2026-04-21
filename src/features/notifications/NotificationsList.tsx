import {useLayoutEffect} from 'react'

import {useAppDispatch, useAppSelector} from '../../app/hooks'

import {TimeAgo} from '../posts/TimeAgo'

import {PostAuthor} from '../posts/PostAuthor'

import {selectAllNotifications, allNotificationsRead, type ClientNotification} from './notificationsSlice'

export const NotificationsList = () => {
  const dispatch = useAppDispatch()
  const notifications = useAppSelector(selectAllNotifications)

  useLayoutEffect(() => {
    dispatch(allNotificationsRead())
  })

  const renderedNotifications = notifications.map((notification: ClientNotification) => {
    const notificationClassname = notification.isNew ? 'notification new' : 'notification'

    return (
    <div key={notification.id} className={notificationClassname}>
      <div>
        <b>
          <PostAuthor userId={notification.user} showPrefix={false} />
        </b>{' '}
        {notification.message}
      </div>
      <TimeAgo timestamp={notification.date} />
    </div>
    )
  })

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  )
} 
