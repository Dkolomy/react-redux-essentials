import { type SubmitEventHandler } from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { postUpdated, selectPostById } from './postsSlice'

const EditPostForm = () => {
  const { postId } = useParams()
  const post = useAppSelector((state) => selectPostById(state, postId ?? ''))

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    const form = e.currentTarget
    const formData = new FormData(form)
    const title = formData.get('postTitle') as string
    const content = formData.get('postContent') as string

    if (postId && typeof title === 'string' && typeof content === 'string' && title && content) {
      dispatch(postUpdated(title, content, postId));
      void navigate(`/posts/${postId}`);
    }
  }

  return (
    <section>
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="postTitle">Post Title:</label>
        <input type="text" id="postTitle" name="postTitle" defaultValue={post.title} required />
        <label htmlFor="postContent">Content:</label>
        <textarea id="postContent" name="postContent" defaultValue={post.content} required />
        <button type="submit">Save Post</button>
      </form>
    </section>
  )
}

export default EditPostForm