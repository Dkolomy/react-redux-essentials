import {useEffect} from 'react'
import { Link } from 'react-router-dom'

import {useAppSelector, useAppDispatch} from '../../app/hooks'

import {Spinner} from '../../components/Spinner'
import { TimeAgo } from './TimeAgo'

import {PostAuthor} from './PostAuthor'
import { ReactionButtons } from './ReactionButtons'
import {
  type Post,
  selectAllPosts,
  selectPostsStatus,
  selectPostsError,
  fetchPosts
} from './postsSlice'

type PostExcerptProps = {
  post: Post
}

function PostExcerpt({ post }: PostExcerptProps) {
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

export const PostsList = () => {
  const dispatch = useAppDispatch()
  const posts = useAppSelector(selectAllPosts)
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
    const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
    content = orderedPosts.map((post) => (
      <PostExcerpt key={post.id} post={post} />
    ))
  } else if (postsStatus === 'failed') {
    content = <div>{postsError}</div>
  }

  // const renderedPosts = orderedPosts(posts).map((post) => (
  //   <article className="post-excerpt" key={post.id}>
  //     <h3>{post.title}</h3>
  //     <div>
  //       <PostAuthor userId={post.userId} />
  //       <TimeAgo timestamp={post.date} />
  //     </div>
  //     <ReactionButtons post={post} />
  //     <p className="post-content">{post.content.substring(0, 100)}</p>
  //     <Link to={`/posts/${post.id}`} className="button muted-button">
  //       View Post
  //     </Link>
  //   </article>
  // ))

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}