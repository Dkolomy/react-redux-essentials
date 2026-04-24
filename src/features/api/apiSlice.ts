import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

import type {Post, NewPost} from '../../features/posts/postsSlice'
import type {User} from '../../features/users/usersSlice'
import type {ClientNotification} from '../../features/notifications/notificationsSlice'
export type {Post, User, ClientNotification}

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
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getUsers: builder.query<User[], void>({
      query: () => '/users'
    }),
  }),
})

export const {
  useGetPostsQuery, 
  useGetPostQuery,
  useGetUsersQuery,
  useAddNewPostMutation,
  useEditPostMutation,
} = apiSlice