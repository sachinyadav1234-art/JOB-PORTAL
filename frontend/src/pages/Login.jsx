import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [guestLoading, setGuestLoading] = useState({ student: false, recruiter: false })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      toast.error('Please enter email and password')
      return
    }
    try {
      setLoading(true)
      const res = await API.post('/auth/login', formData)
      login(res.data.user, res.data.token)
      toast.success('Welcome back!')
      navigate('/jobs')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const handleGuestLogin = async (role) => {
    try {
      setGuestLoading(prev => ({ ...prev, [role]: true }))
      const res = await API.post('/auth/guest-login', { role })
      login(res.data.user, res.data.token)
      toast.success(`Logged in as Guest ${role === 'recruiter' ? 'Recruiter' : 'Student'}!`)
      if (role === 'recruiter') {
        navigate('/dashboard')
      } else {
        navigate('/jobs')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Guest login failed')
    } finally {
      setGuestLoading(prev => ({ ...prev, [role]: false }))
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-600 rounded-full blur-[140px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-[160px] opacity-15 pointer-events-none"></div>

      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850 rounded-2xl p-8 w-full max-w-md shadow-2xl relative z-10">
        <h2 className="text-3xl font-black text-center mb-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="text-center text-xs text-slate-500 mb-8">Access your personalized tech career portal</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-slate-400 font-semibold mb-1 block">Email Address</label>
            <input
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-700 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200"
              type="email" 
              name="email" 
              placeholder="name@example.com"
              value={formData.email} 
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-semibold mb-1 block">Password</label>
            <input
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-700 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200"
              type="password" 
              name="password" 
              placeholder="••••••••"
              value={formData.password} 
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-750 hover:to-purple-750 text-white py-3 rounded-xl font-bold transition duration-200 shadow-lg shadow-indigo-600/20 mt-2 disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-slate-800/80"></div>
          <span className="flex-shrink mx-4 text-slate-650 text-[10px] font-bold uppercase tracking-wider">Or Quick Demo Login</span>
          <div className="flex-grow border-t border-slate-800/80"></div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            disabled={guestLoading.student || guestLoading.recruiter}
            onClick={() => handleGuestLogin('student')}
            className="flex items-center justify-center gap-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-indigo-500/40 text-indigo-400 rounded-xl py-3 text-xs font-bold transition-all duration-200"
          >
            <span>👤</span> {guestLoading.student ? 'Entering...' : 'Student Guest'}
          </button>
          <button
            type="button"
            disabled={guestLoading.student || guestLoading.recruiter}
            onClick={() => handleGuestLogin('recruiter')}
            className="flex items-center justify-center gap-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-purple-500/40 text-purple-400 rounded-xl py-3 text-xs font-bold transition-all duration-200"
          >
            <span>💼</span> {guestLoading.recruiter ? 'Entering...' : 'Recruiter Guest'}
          </button>
        </div>

        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:underline font-bold ml-1">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login