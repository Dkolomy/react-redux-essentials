import { PostsList } from './PostsList'
import { AddPostForm } from './AddPostForm'

const PostMainPage = () => {
  return (
    <section className="posts-container">
      <AddPostForm />
      <PostsList />
    </section>
  )
}

export default PostMainPage