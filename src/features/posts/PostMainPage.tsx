import { PostsList } from './PostsList'
import { AddPostForm } from './AddPostForm'

const PostMainPage = () => {
  return (
    <section className="posts-container">
      <PostsList />
      <AddPostForm />
    </section>
  )
}

export default PostMainPage