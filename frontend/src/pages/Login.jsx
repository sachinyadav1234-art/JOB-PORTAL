import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post('/auth/login', formData)
      login(res.data.user, res.data.token)
      toast.success('Welcome back!')
      navigate('/jobs')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>

        <div className="flex flex-col gap-4">
          <input
            className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
            type="email" name="email" placeholder="Email"
            value={formData.email} onChange={handleChange}
          />
          <input
            className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
            type="password" name="password" placeholder="Password"
            value={formData.password} onChange={handleChange}
          />
          <button
            onClick={handleSubmit}
            className="bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-700"
          >
            Login
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login