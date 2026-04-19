import { useNavigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectAllUsers } from '../users/usersSlice'
import { userLoggedIn } from './authSlice'

export const LoginPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const users = useAppSelector(selectAllUsers)

  const handleUserSelected: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const username = e.currentTarget.value
    if (username) {
      dispatch(userLoggedIn(username))
      void navigate('/posts')
    }
  }

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))

  return (
    <section>
      <h2>Welcome to React Redux Essentials</h2>
      <label htmlFor="username">Username:</label>
      <select id="username" name="username" required onChange={handleUserSelected}>
        <option value=""></option>
        {usersOptions}
      </select>
    </section>
  )
}
