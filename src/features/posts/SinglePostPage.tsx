import { Link, useParams } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { selectPostById } from './postsSlice'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { selectCurrentUsername } from '../auth/authSlice'
import { ReactionButtons } from './ReactionButtons'

const SinglePostPage = () => {
  const { postId } = useParams()
  const post = useAppSelector((state) => selectPostById(state, postId ?? ''))
  const currentUsername = useAppSelector(selectCurrentUsername)

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  const canEdit = currentUsername === post.userId

  return (
    <section>
      <article className="post">
        <h2>{post.title}</h2>
        <div>
          <PostAuthor userId={post.userId} />
          <TimeAgo timestamp={post.date} />
        </div>
        <p className="post-content">{post.content}</p>
        <ReactionButtons post={post} />
        {canEdit && (
          <Link to={`/editPost/${postId ?? ''}`} className="button">
            Edit Post
          </Link>
        )}
      </article>
    </section>
  ) 
}

export default SinglePostPage