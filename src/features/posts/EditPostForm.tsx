// import { type SubmitEventHandler } from 'react'
import {useNavigate, useParams} from 'react-router-dom'
// import { useAppSelector, useAppDispatch } from '../../app/hooks'
// import { postUpdated, selectPostById } from './postsSlice'
import { useGetPostQuery, useEditPostMutation } from '../api/apiSlice'

const EditPostForm = () => {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()

  const { data: post } = useGetPostQuery(postId ?? '')

  const [updatePost, {isLoading}] = useEditPostMutation()

  if (!postId) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  const onSavePostClicked = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const title = formData.get('postTitle') as string
    const content = formData.get('postContent') as string
    
    if (title && content && post?.id) {
      await updatePost({ id: post.id, title, content }).unwrap()
      void navigate(`/posts/${postId}`)
    }
  }

  return (
    <section>
      <h2>Edit Post</h2>
      <form onSubmit={(e) => void onSavePostClicked(e)}>
        <label htmlFor="postTitle">Post Title:</label>
        <input type="text" id="postTitle" name="postTitle" defaultValue={post?.title} required />
        <label htmlFor="postContent">Content:</label>
        <textarea id="postContent" name="postContent" defaultValue={post?.content} required />
        <button type="submit">Save Post</button>
      </form>
    </section>
  )
}

export default EditPostForm