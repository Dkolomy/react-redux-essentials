import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

import { useAppSelector } from './app/hooks'
import { Navbar } from './components/Navbar'
import { LoginPage } from './features/auth/LoginPage'
import PostMainPage from './features/posts/PostMainPage'
import SinglePostPage from './features/posts/SinglePostPage'
import EditPostForm from './features/posts/EditPostForm'

import { selectCurrentUsername } from './features/auth/authSlice'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAppSelector(selectCurrentUsername)

  if (!user) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/posts"
            element={
              <ProtectedRoute>
                <PostMainPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/:postId"
            element={
              <ProtectedRoute>
                <SinglePostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editPost/:postId"
            element={
              <ProtectedRoute>
                <EditPostForm />
              </ProtectedRoute>
            }
          />
          {/* Redirect any unknown routes to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
