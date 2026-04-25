import { useAppSelector } from '../../app/hooks'
import { selectCurrentUsername } from '../auth/authSlice'
import { useAddNewPostMutation } from '../api/apiSlice'

export const AddPostForm = () => {
  const [addNewPost, {isLoading}] = useAddNewPostMutation()
  const userId = useAppSelector(selectCurrentUsername)

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget
    const formData = new FormData(form)
    const title = formData.get('postTitle') as string
    const content = formData.get('postContent') as string

    try {
      await addNewPost({ title, content, userId: userId ?? '' }).unwrap()
      form.reset()
    } catch (err) {
      console.error('Failed to save the post:', err)
    }
}

  return (
    <section>
      <h2>Add a New Post</h2>
      <form onSubmit={(e) => void handleSubmit(e)}>
        <label htmlFor="postTitle">Post Title:</label>
        <input 
          type="text" 
          id="postTitle" 
          name="postTitle"
          defaultValue=""
          required />
        <label htmlFor="postContent">Content:</label>
        <textarea 
          id="postContent" 
          name="postContent"
          defaultValue=""
          required />
        <button type="submit" disabled={isLoading}>
          Save Post
        </button>
      </form>
    </section>
  )
}