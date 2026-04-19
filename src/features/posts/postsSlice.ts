import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { sub } from 'date-fns'

export type Reactions = {
  thumbsUp: number
  tada: number
  heart: number
  rocket: number
  eyes: number
}

export type ReactionName = keyof Reactions

export type Post = {
  id: string
  title: string
  content: string
  userId: string
  date: string
  reactions: Reactions
}

type PostUpdate = Pick<Post, 'id' | 'title' | 'content'>

const initialReactions: Reactions = {
  thumbsUp: 0,
  tada: 0,
  heart: 0,
  rocket: 0,
  eyes: 0
}

const initialState: Post[] = [
  { 
    id: '1', 
    title: 'First Post!', 
    content: 'Hello!', 
    userId: '0',
    date: sub(new Date(), { minutes: 10 }).toISOString(), 
    reactions: initialReactions
  },
  { 
    id: '2', 
    title: 'Second Post', 
    content: 'More text', 
    userId: '2',
    date: sub(new Date(), { minutes: 5 }).toISOString(),
    reactions: initialReactions
  }
]

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer: (state, action: PayloadAction<Post>) => {
        state.push(action.payload)
      },
      prepare: (title: string, content: string, userId: string) => {
        return {
          payload: {
            id: nanoid(),
            date: sub(new Date(), { minutes: 10 }).toISOString(),
            title,
            content,
            userId,
            reactions: initialReactions
          }
        }
      }
    },
    postUpdated: {
      reducer: (state, action: PayloadAction<PostUpdate>) => {
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
    },
    reactionAdded: (state, action: PayloadAction<{ postId: string; reaction: ReactionName }>) => {
      const { postId, reaction } = action.payload
      const existingPost = state.find((post) => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    }
  }
})

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

export const selectAllPosts = (state: RootState) => state.posts

export const selectPostById = (state: RootState, postId: string) => {
  return state.posts.find((post) => post.id === postId)
}

