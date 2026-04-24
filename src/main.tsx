import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App'
import { store } from './app/store'
// import {apiSlice} from './features/api/apiSlice'
import {apiSliceWithUsers} from './features/users/usersSlice'
// import {fetchUsers} from './features/users/usersSlice'

import { worker } from './api/server'

import './primitiveui.css'
import './index.css'

type MockWorker = {
  start: (options?: { onUnhandledRequest?: 'bypass' | 'warn' | 'error' }) => Promise<unknown>
}

const mockWorker = worker as MockWorker

// Wrap app rendering so we can wait for the mock API to initialize
async function start() {
  // Start our mock API server
  await mockWorker.start({ onUnhandledRequest: 'bypass' })

  void store.dispatch(apiSliceWithUsers.endpoints.getUsers.initiate())

  const rootElement = document.getElementById('root')
  if (!rootElement) {
    throw new Error("Root element with id 'root' not found")
  }
  const root = createRoot(rootElement)

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  )
}

void start()
