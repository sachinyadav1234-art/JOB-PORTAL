import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

function PostJob() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '', description: '', company: '',
    location: '', salary: '', jobType: 'full-time', skills: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const jobData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim())
      }
      await API.post('/jobs', jobData)
      toast.success('Job posted successfully!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    }
  }

  if (user?.role === 'student') {
    return <p className="text-center mt-20 text-gray-500">Only recruiters can post jobs</p>
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Post a New Job</h2>

        <div className="flex flex-col gap-4">
          <input className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
            type="text" name="title" placeholder="Job Title"
            value={formData.title} onChange={handleChange} />

          <input className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
            type="text" name="company" placeholder="Company Name"
            value={formData.company} onChange={handleChange} />

          <input className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
            type="text" name="location" placeholder="Location (e.g. Delhi, Remote)"
            value={formData.location} onChange={handleChange} />

          <input className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
            type="text" name="salary" placeholder="Salary (e.g. 5-8 LPA)"
            value={formData.salary} onChange={handleChange} />

          <select className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
            name="jobType" value={formData.jobType} onChange={handleChange}>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="internship">Internship</option>
            <option value="remote">Remote</option>
          </select>

          <input className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
            type="text" name="skills" placeholder="Skills (React, Node, MongoDB)"
            value={formData.skills} onChange={handleChange} />

          <textarea className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 resize-none"
            name="description" rows={5} placeholder="Job Description..."
            value={formData.description} onChange={handleChange} />

          <button onClick={handleSubmit}
            className="bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-700">
            Post Job
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostJob