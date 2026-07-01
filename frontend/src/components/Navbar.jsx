import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-white">JobPortal</Link>

      <div className="flex items-center gap-6">
        <Link to="/jobs" className="text-gray-300 hover:text-white">Jobs</Link>

        {user ? (
          <>
            {user.role === 'recruiter' && (
              <Link to="/post-job" className="text-gray-300 hover:text-white font-medium transition duration-200">Post Job</Link>
            )}
            {user.role === 'student' && (
              <>
                <Link to="/verified-jobs" className="text-gray-300 hover:text-white font-medium transition duration-200">Verified Jobs</Link>
                <Link to="/events" className="text-gray-300 hover:text-white font-medium transition duration-200">Drives & Fairs</Link>
                <Link to="/ats-reviewer" className="text-gray-300 hover:text-white font-medium transition duration-200">Resume Review</Link>
                <Link to="/mock-prep" className="text-gray-300 hover:text-white font-medium transition duration-200">Interview Prep</Link>
              </>
            )}
            <Link to="/dashboard" className="text-gray-300 hover:text-white font-medium transition duration-200">Dashboard</Link>
            <Link to="/profile" className="text-gray-300 hover:text-white font-medium transition duration-200">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
            <Link to="/register" className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-medium">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar