import { Link, useParams } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { selectPostById } from './postsSlice'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'

const SinglePostPage = () => {
  const { postId } = useParams()
  const post = useAppSelector((state) => selectPostById(state, postId ?? ''))

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  return (
    <section>
      <article className="post">
        <h2>{post.title}</h2>
        <PostAuthor userId={post.userId} />
        <p className="post-content">{post.content}</p>
        <TimeAgo timestamp={post.date} />
        <Link to={`/editPost/${postId ?? ''}`} className="button">
          Edit Post
        </Link>
      </article>
    </section>
  ) 
}

export default SinglePostPage