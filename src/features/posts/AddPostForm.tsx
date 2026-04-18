import { type SubmitEventHandler } from 'react'
import { useAppDispatch } from '../../app/hooks'
import { postAdded } from './postsSlice'

export const AddPostForm = () => {
  const dispatch = useAppDispatch()

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    const form = e.currentTarget
    const formData = new FormData(form)
    const title = formData.get('postTitle') as string
    const content = formData.get('postContent') as string

    if (title && content) {
      dispatch(postAdded(title, content))
    }

    form.reset()
  }

  return (
    <section>
      <h2>Add a New Post</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="postTitle">Post Title:</label>
        <input type="text" id="postTitle" name="postTitle" required />
        <label htmlFor="postContent">Content:</label>
        <textarea id="postContent" name="postContent" required />
        <button type="submit">Save Post</button>
      </form>
    </section>
  )
}