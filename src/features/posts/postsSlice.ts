import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import {client} from '../../api/client'
import {createAppAsyncThunk} from '../../app/withTypes'

import type { RootState } from '../../app/store'
// import { sub } from 'date-fns'

import {userLoggedOut} from '../auth/authSlice'

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
type NewPost = Pick<Post, 'title' | 'content' | 'userId'>

export const addNewPost = createAppAsyncThunk(
  'posts/addNewPost', 
  async (initialPost: NewPost) => {
    const response = await client.post<Post>('/fakeApi/posts', initialPost)
    return response.data
  }
)

type PostsState = {
  posts: Post[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: PostsState = {
  posts: [],
  status: 'idle',
  error: null
}

// const initialReactions: Reactions = {
//   thumbsUp: 0,
//   tada: 0,
//   heart: 0,
//   rocket: 0,
//   eyes: 0
// }

export const fetchPosts = createAppAsyncThunk(
  'posts/fetchPosts', 
  async () => {
    const response = await client.get<Post[]>('/fakeApi/posts')
    return response.data
  },{
    condition: (_arg, thunkApi) => {
      const postsStatus  = selectPostsStatus(thunkApi.getState())
      if (postsStatus !== 'idle') {
        return false
      }
    }
  }
)

// const initialState: Post[] = [
//   { 
//     id: '1', 
//     title: 'First Post!', 
//     content: 'Hello!', 
//     userId: '0',
//     date: sub(new Date(), { minutes: 10 }).toISOString(), 
//     reactions: initialReactions
//   },
//   { 
//     id: '2', 
//     title: 'Second Post', 
//     content: 'More text', 
//     userId: '2',
//     date: sub(new Date(), { minutes: 5 }).toISOString(),
//     reactions: initialReactions
//   }
// ]

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // postAdded: {
    //   reducer: (state, action: PayloadAction<Post>) => {
    //     state.posts.push(action.payload)
    //   },
    //   prepare: (title: string, content: string, userId: string) => {
    //     return {
    //       payload: {
    //         id: nanoid(),
    //         date: sub(new Date(), { minutes: 10 }).toISOString(),
    //         title,
    //         content,
    //         userId,
    //         reactions: initialReactions
    //       }
    //     }
    //   }
    // },
    postUpdated: {
      reducer: (state, action: PayloadAction<PostUpdate>) => {
        const { id, title, content } = action.payload
        const existingPost = state.posts.find((post) => post.id === id)
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
      const existingPost = state.posts.find((post) => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userLoggedOut, () => {
      return {
        ...initialState,
        posts: []
      }
    })
    .addCase(fetchPosts.pending, (state) => {
      state.status = 'loading'
    })
    .addCase(fetchPosts.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.posts.push(...action.payload)
    })
    .addCase(fetchPosts.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.error.message ?? 'Something went wrong'
    })
    .addCase(addNewPost.fulfilled, (state, action) => {
      state.posts.push(action.payload)
    })
  }
})

export const { postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

export const selectAllPosts = (state: RootState) => state.posts.posts

export const selectPostById = (state: RootState, postId: string) => {
  return state.posts.posts.find((post) => post.id === postId)
}

export const selectPostsStatus = (state: RootState) => state.posts.status
export const selectPostsError = (state: RootState) => state.posts.error

