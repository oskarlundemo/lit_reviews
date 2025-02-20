import './App.css'
import {Header} from "./components/Header.jsx";
import {Routes, Route} from 'react-router-dom';
import Home from "./pages/Home.jsx";
import CreateUser from './pages/CreateUser.jsx'
import {Login} from "./pages/Login.jsx";
import {Dashboard} from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";




function App() {
  return (
      <div className="App">
          <Header></Header>
          <main className="main-content">
              <Routes>
                  <Route path="/" element={<Home/>} />
                  <Route path="/login" element={<Login/>} />
                  <Route path="/create-user" element={<CreateUser/>}/>
                  <Route
                      path="/dashboard"
                      element={
                          <ProtectedRoute>
                              <Dashboard />
                          </ProtectedRoute>
                      }
                  />
              </Routes>
          </main>
      </div>
  )
}

export default App
