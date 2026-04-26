import { 
  createSlice, 
  createEntityAdapter, 
  createSelector,
  createAction,
  isAnyOf
 } from '@reduxjs/toolkit'

// import {client} from '../../api/client'

import type { RootState, AppDispatch } from '../../app/store'

// import {createAppAsyncThunk} from '../../app/withTypes'

import {forceGenerateNotifications} from '../../api/server'

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

// export const { useGetNotificationsQuery } = apiSliceWithNotifications

// export const fetchNotifications = createAppAsyncThunk(
//   'notifications/fetchNotifications',
//   async () => {
//     const response = await client.get<ServerNotification[]>(
//       `/fakeApi/notifications`
//     )
//     return response.data
//   }
// )

const metadataAdapter = createEntityAdapter<NotificationMetadata>()

const initialState = metadataAdapter.getInitialState()

const notificetionsReceived = createAction<ServerNotification[]>('notifications/notificationsReceived')

export const apiSliceWithNotifications = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getNotifications: builder.query<ServerNotification[], void>({
      query: () => '/notifications',
      async onCacheEntryAdded(arg, lifecycleApi) {
        const ws = new WebSocket('ws://localhost')
        try {
          await lifecycleApi.cacheDataLoaded

          const listener = (event: MessageEvent<string>) => {
            const message: {
              type: 'notifications'
              payload: ServerNotification[]
            } = JSON.parse(event.data) as {
              type: 'notifications'
              payload: ServerNotification[]
            }
            switch (message.type) {
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              case 'notifications': {
                lifecycleApi.updateCachedData((draft) => {
                  draft.push(...message.payload)
                  draft.sort((a, b) => b.date.localeCompare(a.date))
                })
                lifecycleApi.dispatch(notificetionsReceived(message.payload))
                break
              }
              default: {
                break
              }
            }
          }

          ws.addEventListener('message', listener)

          // Wait for the cache to be removed, then cleanup
          await lifecycleApi.cacheEntryRemoved

          ws.removeEventListener('message', listener)
          ws.close()
        } catch {
          // If an error occurs, always close the socket
          ws.close()
        }
      },
    })
  }),
})

export const { useGetNotificationsQuery } = apiSliceWithNotifications

const matchNotificationsReceived = isAnyOf(
  notificetionsReceived,
  apiSliceWithNotifications.endpoints.getNotifications.matchFulfilled,
)

export const fetchNotificationsWebsocket =
  () => (_dispatch: AppDispatch, getState: () => RootState) => {
    const allNotifications = selectNotificationsData(getState())
    const [latestNotification] = allNotifications
    const latestTimestamp = latestNotification.date
    forceGenerateNotifications(latestTimestamp)
  }

const emptyNotifications: ServerNotification[] = []

export const seelctNotificationsResult = 
  apiSliceWithNotifications.endpoints.getNotifications.select()

const selectNotificationsData = createSelector(
  seelctNotificationsResult,
  (notificationsResult) => notificationsResult.data ?? emptyNotifications
)

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
      matchNotificationsReceived,
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