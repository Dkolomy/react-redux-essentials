import { Link } from "react-router-dom"

import { useAppDispatch, useAppSelector } from '../app/hooks'

import { logout } from '../features/auth/authSlice'
import { selectCurrentUser } from '../features/users/usersSlice'
import { 
  fetchNotifications, 
  selectUnreadNotificationsCount 
} from '../features/notifications/notificationsSlice'
// import { selectCurrentUsername } from '../features/auth/authSlice'

import { UserIcon } from './UserIcon'

export const Navbar = () => {
  const dispatch = useAppDispatch()
  // const username = useAppSelector(selectCurrentUsername)
  const user = useAppSelector(selectCurrentUser)

  const numUnreadNotifications = useAppSelector(selectUnreadNotificationsCount)

  const isLoggedIn = Boolean(user)

  let navContent: React.ReactNode = null

  if (isLoggedIn && user) {
    const onLogoutClicked = () => {
      console.log('Navbar onLogoutClicked')
      void dispatch(logout())
    }

    const onRefreshNotificationsClicked = () => {
      console.log('Navbar onRefreshNotificationsClicked')
      void dispatch(fetchNotifications())
    }

    let unreadNotificationsBadge: React.ReactNode | undefined
    if (numUnreadNotifications > 0) {
      unreadNotificationsBadge = <span className="badge">{numUnreadNotifications}</span>
    }

    navContent = (
      <div className="navContent">
        <div className="navLinks">
          <Link to="/posts">Posts</Link>
          <Link to="/users">Users</Link>
          <Link to="/notifications">Notifications {unreadNotificationsBadge}</Link>
          <button className="button small" onClick={onRefreshNotificationsClicked}>
            Refresh Notifications
          </button>
        </div>
        <div className="userDetails">
          <UserIcon size={32} />&nbsp;
          <span>{user.name}</span>&nbsp;&nbsp;&nbsp;
          <button onClick={onLogoutClicked}>Logout</button>
        </div>
      </div>
    )
  }

  return (
    <nav>
      <section>
        <h1>Redux Essentials Example</h1>
        {navContent}
      </section>
    </nav>
  )
}
