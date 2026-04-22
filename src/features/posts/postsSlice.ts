import { 
  createSlice, 
  type PayloadAction,
  createEntityAdapter,
  type EntityState,
} from '@reduxjs/toolkit'

import {client} from '../../api/client'
import {createAppAsyncThunk} from '../../app/withTypes'
import { createSelector } from '@reduxjs/toolkit'

import type { RootState } from '../../app/store'
// import { sub } from 'date-fns'

import {logout} from '../auth/authSlice'

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

type PostsState = EntityState<Post, string> & {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const postsAdapter = createEntityAdapter<Post>({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState: PostsState = postsAdapter.getInitialState({
  status: 'idle',
  error: null
})

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

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postUpdated: (state, action: PayloadAction<PostUpdate>) => {
      const { id, title, content } = action.payload
      postsAdapter.updateOne(state, { id, changes: { title, content } })
    },
    reactionAdded: (state, action: PayloadAction<{ postId: string; reaction: ReactionName }>) => {
      const { postId, reaction } = action.payload

      const existingPost = state.entities[postId] as Post | undefined
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, () => {
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
      postsAdapter.setAll(state, action.payload)
    })
    .addCase(fetchPosts.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.error.message ?? 'Something went wrong'
    })
    .addCase(addNewPost.fulfilled, (state, action) => {
      postsAdapter.addOne(state, action.payload)
    })
  }
})

export const { postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state: RootState) => state.posts)

export const selectPostsByUser = createSelector(
  [selectAllPosts, (_state: RootState, userId: string) => userId],
  (posts: Post[], userId: string) => posts.filter((post) => post.userId === userId)
)

export const selectPostsStatus = (state: RootState) => state.posts.status
export const selectPostsError = (state: RootState) => state.posts.error

