import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

import type {Post, NewPost} from '../../features/posts/postsSlice'
import type {User} from '../../features/users/usersSlice'
import type {ClientNotification} from '../../features/notifications/notificationsSlice'
export type {Post, User, ClientNotification}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getPosts: builder.query<Post[], void>({
      query: () => '/posts',
      providesTags: ['Post'],
    }),
    getPost: builder.query<Post, string>({
      query: (postId) => `/posts/${postId}`,
    }),
    addNewPost: builder.mutation<Post, NewPost>({
      query: (initialPost) => ({
        url: '/posts',
        method: 'POST',
        body: initialPost as unknown as Record<string, unknown>,
      }),
      invalidatesTags: ['Post'],
    }),
  }),
})

export const {useGetPostsQuery, useGetPostQuery, useAddNewPostMutation} = apiSlice