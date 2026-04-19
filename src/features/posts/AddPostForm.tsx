import { type SubmitEventHandler } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { postAdded } from './postsSlice'
// import { selectAllUsers } from '../users/usersSlice'
import { selectCurrentUsername } from '../auth/authSlice'

export const AddPostForm = () => {
  const dispatch = useAppDispatch()
  const currentUsername = useAppSelector(selectCurrentUsername)
  // const users = useAppSelector(selectAllUsers)

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    const form = e.currentTarget
    const formData = new FormData(form)
    const title = formData.get('postTitle') as string
    const content = formData.get('postContent') as string
    const userId = currentUsername ?? ''

    if (title && content) {
      dispatch(postAdded(title, content, userId))
    }

    form.reset()
  }

  // const usersOptions = users.map((user) => (
  //   <option key={user.id} value={user.id}>
  //     {user.name}
  //   </option>
  // ))

  return (
    <section>
      <h2>Add a New Post</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="postTitle">Post Title:</label>
        <input type="text" id="postTitle" name="postTitle" required />
        {/* <label htmlFor="postAuthor">Author:</label> */}
        {/* <select id="postAuthor" name="postAuthor" required>
          <option value=""></option>
          {usersOptions}
        </select> */}
        <label htmlFor="postContent">Content:</label>
        <textarea id="postContent" name="postContent" required />
        <button type="submit">Save Post</button>
      </form>
    </section>
  )
}