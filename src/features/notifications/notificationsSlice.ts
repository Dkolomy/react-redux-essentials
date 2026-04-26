import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'

import {client} from '../../api/client'

import type {RootState} from '../../app/store'
import {createAppAsyncThunk} from '../../app/withTypes'

import {apiSlice} from '../api/apiSlice'

export type ServerNotification = {
  id: string
  date: string
  message: string
  user: string
}

export type NotificationMetadata = {
  id: string
  read: boolean
  isNew: boolean
}

export const fetchNotifications = createAppAsyncThunk(
  'notifications/fetchNotifications',
  async () => {
    const response = await client.get<ServerNotification[]>(
      `/fakeApi/notifications`
    )
    return response.data
  }
)

const metadataAdapter = createEntityAdapter<NotificationMetadata>()

const initialState = metadataAdapter.getInitialState()

export const apiSliceWithNotifications = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getNotifications: builder.query<ServerNotification[], void>({
      query: () => '/notifications',
    }),
  }),
})

export const { useGetNotificationsQuery } = apiSliceWithNotifications

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    allNotificationsRead(state) {
      Object.values(state.entities).forEach((metadata) => {
        metadata.read = true
      })
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      apiSliceWithNotifications.endpoints.getNotifications.matchFulfilled,
      (state, action) => {
        const notificationsWithMetadata: NotificationMetadata[] = 
          action.payload.map((notification) => ({
            id: notification.id,
            read: false,
            isNew: true,
          }))

      Object.values(state.entities).forEach((metadata) => {
        metadata.isNew = !metadata.read
      })

      metadataAdapter.upsertMany(state, notificationsWithMetadata)
    })
  }
})

export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

export const {
  selectAll: selectAllNotificationsMetadata,
  selectEntities: selectMetadataEntities,
} = metadataAdapter.getSelectors(
  (state: RootState) => state.notifications
)

export const selectUnreadNotificationsCount = (state: RootState) => {
  const allMetadata = selectAllNotificationsMetadata(state)
  const unreadNotifications = allMetadata.filter(
    (metadata) => !metadata.read
  )
  return unreadNotifications.length
}