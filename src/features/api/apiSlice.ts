import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

import type {Post, NewPost, ReactionName} from '../../features/posts/postsSlice'
import type {ServerNotification} from '../../features/notifications/notificationsSlice'
// import type { User } from '../users/usersSlice'
export type {Post, ServerNotification}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getPosts: builder.query<Post[], void>({
      query: () => '/posts',
      providesTags: (result = []) => [
        'Post',
        ...result.map(({ id }) => ({ type: 'Post' as const, id }))],
    }),
    getPost: builder.query<Post, string>({
      query: (postId) => `/posts/${postId}`,
      providesTags: (_result, _error, arg) => [{ type: 'Post' as const, id: arg }],
    }),
    addNewPost: builder.mutation<Post, NewPost>({
      query: (initialPost) => ({
        url: '/posts',
        method: 'POST',
        body: initialPost as unknown as Record<string, unknown>,
      }),
      invalidatesTags: ['Post'],
    }),
    editPost: builder.mutation<Post, Post>({
      query: (post) => ({
        url: `/posts/${post.id}`,
        method: 'PATCH',
        body: post as unknown as Record<string, unknown>,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Post' as const, id: arg.id }],
    }),
    addReaction: builder.mutation<
      Post, 
      { postId: string; reaction: ReactionName }>({
      query: ({ postId, reaction }) => ({
        url: `/posts/${postId}/reactions`,
        method: 'POST',
        body: { reaction },
      }),
      async onQueryStarted({ postId, reaction }, lifecycleApi) {
        const getPostsPatchResult = lifecycleApi.dispatch(
          apiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
            const post = draft.find((post) => post.id === postId)
            if (post?.reactions) {
              post.reactions[reaction]++
            }
       
          })
        )
        const getPostPatchResult = lifecycleApi.dispatch(
          apiSlice.util.updateQueryData('getPost', postId, (draft: Post) => {
            if (draft.reactions) {
              draft.reactions[reaction]++
            }
          })
        )

        try {
          await lifecycleApi.queryFulfilled
        } catch {
          getPostsPatchResult.undo()
          getPostPatchResult.undo()
        }
      }

    }),
  }),
})

export const {
  useGetPostsQuery, 
  useGetPostQuery,
  useAddNewPostMutation,
  useEditPostMutation,
  useAddReactionMutation,
} = apiSlice