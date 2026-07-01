import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'
import toast from 'react-hot-toast'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'student'
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }
    try {
      setLoading(true)
      await API.post('/auth/register', formData)
      toast.success('Account created! Please login')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-600 rounded-full blur-[140px] opacity-15 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[160px] opacity-15 pointer-events-none"></div>

      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850 rounded-2xl p-8 w-full max-w-md shadow-2xl relative z-10">
        <h2 className="text-3xl font-black text-center mb-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
          Create Account
        </h2>
        <p className="text-center text-xs text-slate-500 mb-8">Join the ultimate developer career launchpad</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-slate-400 font-semibold mb-1 block">Full Name</label>
            <input
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-700 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200"
              type="text" 
              name="name" 
              placeholder="John Doe"
              value={formData.name} 
              onChange={handleChange}
            />
          </div>

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
              placeholder="Minimum 6 characters"
              value={formData.password} 
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-semibold mb-1 block">I want to join as a</label>
            <select
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-300 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200 cursor-pointer"
              name="role" 
              value={formData.role} 
              onChange={handleChange}
            >
              <option value="student">Student / Job Seeker</option>
              <option value="recruiter">Recruiter / Employer</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-750 hover:to-purple-750 text-white py-3 rounded-xl font-bold transition duration-200 shadow-lg shadow-indigo-600/20 mt-2 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:underline font-bold ml-1">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register