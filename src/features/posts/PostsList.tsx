import {memo, useEffect} from 'react'
import { Link } from 'react-router-dom'

import {useAppSelector, useAppDispatch} from '../../app/hooks'

import {Spinner} from '../../components/Spinner'
import { TimeAgo } from './TimeAgo'

import {PostAuthor} from './PostAuthor'
import { ReactionButtons } from './ReactionButtons'
import {
  fetchPosts,
  selectPostById,
  selectPostIds,
  selectPostsStatus,
  selectPostsError,
} from './postsSlice'

type PostExcerptProps = {
  postId: string
}

let PostExcerpt = ({ postId }: PostExcerptProps) => {
  const post = useAppSelector((state) => selectPostById(state, postId))
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h3>
      <div>
        <PostAuthor userId={post.userId} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>
      <ReactionButtons post={post} />
    </article>
  )
}
PostExcerpt = memo(PostExcerpt) as typeof PostExcerpt

export const PostsList = () => {
  const dispatch = useAppDispatch()
  const orderedPostIds = useAppSelector(selectPostIds)  
  const postsStatus = useAppSelector(selectPostsStatus)
  const postsError = useAppSelector(selectPostsError)

  useEffect(() => {
    if (postsStatus === 'idle') {
      void dispatch(fetchPosts())
    }
  }, [postsStatus, dispatch])

  let content: React.ReactNode

  if (postsStatus === 'loading') {  
    content = <Spinner text="Loading..." />
  } else if (postsStatus === 'succeeded') {
    content = orderedPostIds.map((postId) => (
      <PostExcerpt key={postId} postId={postId} />
    ))
  } else if (postsStatus === 'failed') {
    content = <div>{postsError}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}