import {useAppSelector} from '../../app/hooks'
import { Link } from 'react-router-dom'
import { type Post, selectAllPosts } from './postsSlice'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'

const orderedPosts = (posts: Post[]) => {
  return posts.slice().sort((a, b) => b.date.localeCompare(a.date))
}

export const PostsList = () => {
  const posts = useAppSelector(selectAllPosts)

  const renderedPosts = orderedPosts(posts).map((post) => (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <PostAuthor userId={post.userId} />
      <p className="post-content">{post.content.substring(0, 100)}</p>
      <TimeAgo timestamp={post.date} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  ))

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {renderedPosts}
    </section>
  )
}