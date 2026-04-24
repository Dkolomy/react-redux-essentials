import { Link, useParams } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { useGetPostQuery } from '../api/apiSlice'
import { selectCurrentUsername } from '../auth/authSlice'
import { ReactionButtons } from './ReactionButtons'
import { Spinner } from '../../components/Spinner'

const SinglePostPage = () => {
  const { postId } = useParams()
  const currentUsername = useAppSelector(selectCurrentUsername)
  const {
    data: post,
    isFetching,
    isSuccess,
  } = useGetPostQuery(postId ?? '')

  const canEdit = currentUsername === post?.userId
  let content: React.ReactNode

  if(isFetching) {
    content = <Spinner text="Loading..." />
  } else if(isSuccess) {
    content = (
      <article className="post">
        <h2>{post.title}</h2>
        <div>
          <PostAuthor userId={post.userId ?? ''} />
          <TimeAgo timestamp={post.date ?? ''} />
        </div>
        <p className="post-content">{post.content}</p>
        <ReactionButtons post={post} />
        {canEdit && (
          <Link to={`/editPost/${postId ?? ''}`} className="button">
            Edit Post
          </Link>
        )}
      </article>
    )
  }

  return (
    <section>
      {content}
    </section>
  ) 
}

export default SinglePostPage