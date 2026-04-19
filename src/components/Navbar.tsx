import { Link } from "react-router-dom"

import { useAppDispatch, useAppSelector } from '../app/hooks'

import { userLoggedOut } from '../features/auth/authSlice'
import { selectCurrentUser } from '../features/users/usersSlice'

import { UserIcon } from './UserIcon'

export const Navbar = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectCurrentUser)

  const isLoggedIn = Boolean(user)

  let navContent: React.ReactNode = null

  if (isLoggedIn && user) {
    const onLogoutClicked = () => {
      dispatch(userLoggedOut())
    }

    navContent = (
      <div className="navContent">
        <div className="navLinks">
          <Link to="/posts">Posts</Link>
          <Link to="/users">Users</Link>
        </div>
        <div className="userDetails">
          <UserIcon size={32} />
          <span>{user.name}</span>
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
