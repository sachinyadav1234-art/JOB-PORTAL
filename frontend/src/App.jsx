import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import Dashboard from './pages/Dashboard'
import PostJob from './pages/PostJob'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import VerifiedJobs from './pages/VerifiedJobs'
import Events from './pages/Events'
import ATSReviewer from './pages/ATSReviewer'
import MockPrep from './pages/MockPrep'


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/post-job" element={
          <ProtectedRoute>
            <PostJob />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/verified-jobs" element={
          <ProtectedRoute>
            <VerifiedJobs />
          </ProtectedRoute>
        } />
        <Route path="/events" element={
          <ProtectedRoute>
            <Events />
          </ProtectedRoute>
        } />
        <Route path="/ats-reviewer" element={
          <ProtectedRoute>
            <ATSReviewer />
          </ProtectedRoute>
        } />
        <Route path="/mock-prep" element={
          <ProtectedRoute>
            <MockPrep />
          </ProtectedRoute>
        } />
      </Routes>



      
    </BrowserRouter>
  )
}

export default App