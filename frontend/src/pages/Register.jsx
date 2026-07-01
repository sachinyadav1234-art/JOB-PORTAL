import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'
import toast from 'react-hot-toast'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'student'
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await API.post('/auth/register', formData)
      toast.success('Account created! Please login')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Account</h2>

        <div className="flex flex-col gap-4">
          <input
            className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
            type="text" name="name" placeholder="Full Name"
            value={formData.name} onChange={handleChange}
          />
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
          <select
            className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
            name="role" value={formData.role} onChange={handleChange}
          >
            <option value="student">Student</option>
            <option value="recruiter">Recruiter</option>
          </select>

          <button
            onClick={handleSubmit}
            className="bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-700"
          >
            Register
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register