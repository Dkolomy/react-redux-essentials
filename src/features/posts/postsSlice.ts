import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

export type Post = {
  id: string
  title: string
  content: string
}

const initialState: Post[] = [
  { id: '1', title: 'First Post!', content: 'Hello!' },
  { id: '2', title: 'Second Post', content: 'More text' }
]

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer: (state, action: PayloadAction<Post>) => {
        state.push(action.payload)
      },
      prepare: (title: string, content: string) => {
        return {
          payload: {
            id: nanoid(),
            title,
            content
          }
        }
      }
    },
    postUpdated: {
      reducer: (state, action: PayloadAction<Post>) => {
        const { id, title, content } = action.payload
        const existingPost = state.find((post) => post.id === id)
        if (existingPost) {
          existingPost.title = title
          existingPost.content = content
        }
      },
      prepare: (title: string, content: string, id: string) => {
        return {
          payload: {
            id,
            title,
            content
          }
        }
      }
    }
  }
})

export const { postAdded, postUpdated } = postsSlice.actions

export default postsSlice.reducer

export const selectAllPosts = (state: RootState) => state.posts

export const selectPostById = (state: RootState, postId: string) => {
  return state.posts.find((post) => post.id === postId)
}

