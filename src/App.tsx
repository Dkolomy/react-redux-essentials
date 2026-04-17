import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { Navbar } from './components/Navbar'
import { PostsList } from './features/posts/PostsList'

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <section className="posts-container">
                <PostsList />
              </section>
            }
          ></Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
