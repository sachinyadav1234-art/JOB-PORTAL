import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const linkClass = (path) => 
    `text-sm font-semibold transition-all duration-200 py-1.5 px-3 rounded-lg ${
      isActive(path) 
        ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20' 
        : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent'
    }`

  const mobileLinkClass = (path) =>
    `text-base font-bold transition-all duration-200 py-3 px-4 rounded-xl block ${
      isActive(path)
        ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/25'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
    }`

  return (
    <nav className="bg-slate-950/80 backdrop-blur-md border-b border-slate-900 sticky top-0 z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
          JobPortal
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2">
          <Link to="/jobs" className={linkClass('/jobs')}>Jobs</Link>

          {user ? (
            <>
              {user.role === 'recruiter' && (
                <Link to="/post-job" className={linkClass('/post-job')}>Post Job</Link>
              )}
              {user.role === 'student' && (
                <>
                  <Link to="/verified-jobs" className={linkClass('/verified-jobs')}>Verified Jobs</Link>
                  <Link to="/events" className={linkClass('/events')}>Drives & Fairs</Link>
                  <Link to="/ats-reviewer" className={linkClass('/ats-reviewer')}>Resume Review</Link>
                  <Link to="/mock-prep" className={linkClass('/mock-prep')}>Interview Prep</Link>
                </>
              )}
              <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
              <Link to="/profile" className={linkClass('/profile')}>Profile</Link>
              <button
                onClick={handleLogout}
                className="ml-2 bg-gradient-to-r from-red-500/10 to-rose-600/10 hover:from-red-500/20 hover:to-rose-600/20 text-rose-400 border border-rose-500/30 px-4 py-2 rounded-lg text-sm font-semibold transition duration-200 shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass('/login')}>Login</Link>
              <Link to="/register" className="ml-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition duration-200 border border-indigo-500/30">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-300 hover:text-white p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 rounded-lg"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[65px] bg-slate-950/95 backdrop-blur-lg z-40 transition-all duration-300 px-6 py-6 border-t border-slate-900">
          <div className="flex flex-col gap-2">
            <Link 
              to="/jobs" 
              onClick={() => setMobileMenuOpen(false)} 
              className={mobileLinkClass('/jobs')}
            >
              Jobs
            </Link>

            {user ? (
              <>
                {user.role === 'recruiter' && (
                  <Link 
                    to="/post-job" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className={mobileLinkClass('/post-job')}
                  >
                    Post Job
                  </Link>
                )}
                {user.role === 'student' && (
                  <>
                    <Link 
                      to="/verified-jobs" 
                      onClick={() => setMobileMenuOpen(false)} 
                      className={mobileLinkClass('/verified-jobs')}
                    >
                      Verified Jobs
                    </Link>
                    <Link 
                      to="/events" 
                      onClick={() => setMobileMenuOpen(false)} 
                      className={mobileLinkClass('/events')}
                    >
                      Drives & Fairs
                    </Link>
                    <Link 
                      to="/ats-reviewer" 
                      onClick={() => setMobileMenuOpen(false)} 
                      className={mobileLinkClass('/ats-reviewer')}
                    >
                      Resume Review
                    </Link>
                    <Link 
                      to="/mock-prep" 
                      onClick={() => setMobileMenuOpen(false)} 
                      className={mobileLinkClass('/mock-prep')}
                    >
                      Interview Prep
                    </Link>
                  </>
                )}
                <Link 
                  to="/dashboard" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className={mobileLinkClass('/dashboard')}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/profile" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className={mobileLinkClass('/profile')}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left mt-4 bg-gradient-to-r from-red-500/10 to-rose-600/10 text-rose-400 border border-rose-500/25 py-3 px-4 rounded-xl font-bold transition duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 mt-4">
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className={mobileLinkClass('/login')}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-bold shadow-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar