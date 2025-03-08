import './App.css'
import {Header} from "./components/Header.jsx";
import {Routes, Route} from 'react-router-dom';
import Home from "./pages/Home.jsx";
import CreateUser from './pages/CreateUser.jsx'
import {Login} from "./pages/Login.jsx";
import {Dashboard} from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import {WriteBookReview} from "./pages/WriteBookReview.jsx";
import {BookReview} from "./pages/BookReview.jsx";
import {Posts} from "./pages/Posts.jsx";
import {Activity} from "./pages/Activity.jsx";




function App() {




  return (
      <div className="App">
          <Header></Header>
              <Routes>
                  <Route path="/" element={<Home/>} />
                  <Route path="/login" element={<Login/>} />
                  <Route path="/create-user" element={<CreateUser/>}/>
                  <Route path="/:title/:id" element={<BookReview />} />

                  <Route
                      path="/dashboard"
                      element={
                          <ProtectedRoute>
                              <Dashboard />
                          </ProtectedRoute>
                      }
                  />

                  <Route
                      path="/book-review"
                      element={
                          <ProtectedRoute>
                              <WriteBookReview/>
                          </ProtectedRoute>
                  }/>

                  <Route
                      path="/activity"
                      element={
                          <ProtectedRoute>
                              <Activity/>
                          </ProtectedRoute>
                      }/>


                  <Route
                      path="/posts"
                      element={
                      <ProtectedRoute>
                          <Posts/>
                      </ProtectedRoute>
                      }/>
              </Routes>
      </div>
  )
}

export default App
