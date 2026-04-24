import {memo, useMemo} from 'react'
import { Link } from 'react-router-dom'

import {Spinner} from '../../components/Spinner'
import { TimeAgo } from './TimeAgo'

import {useGetPostsQuery, type Post} from '../../features/api/apiSlice'

import {PostAuthor} from './PostAuthor'
import { ReactionButtons } from './ReactionButtons'

type PostExcerptProps = {
  post: Post
}

let PostExcerpt = ({ post }: PostExcerptProps) => {
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h3>
      <div>
        <PostAuthor userId={post.userId ?? ''} />
        <TimeAgo timestamp={post.date ?? ''} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>
      <ReactionButtons post={post} />
    </article>
  )
}
PostExcerpt = memo(PostExcerpt) as typeof PostExcerpt

export const PostsList = () => {
  const {
    data: posts = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
    // refetch,
  } = useGetPostsQuery()

  const sortedPosts = useMemo(() => {
    const sortedPosts = posts.slice()
    sortedPosts.sort((a, b) => b.date?.localeCompare(a.date ?? '') ?? 0)
    return sortedPosts
  }, [posts])

  let content

  if(isLoading) {
    content = <Spinner text="Loading..." />
  } else if(isSuccess) {
    const renderedPosts = sortedPosts.map((post) => (
      <PostExcerpt key={post.id} post={post} />
    ))

    const containerClassname: string = [
      'posts-container',
      isFetching ? 'disabled' : ''
    ].filter(Boolean).join(' ')

    content = (
      <div className={containerClassname}>{renderedPosts}</div>
    )
  } else if(isError) {
    content = <div>{error instanceof Error ? error.message : 'Unknown error'}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {/* <button onClick={() => void refetch()}>Refetch Posts</button> */}
      {content}
    </section>
  )
}