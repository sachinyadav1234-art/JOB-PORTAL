import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.company || !formData.location || !formData.skills || !formData.description) {
      toast.error('Please fill in all required fields')
      return
    }
    try {
      setLoading(true)
      const jobData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      }
      await API.post('/jobs', jobData)
      toast.success('Job posted successfully!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (user?.role === 'student') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center py-20">
        <h3 className="text-xl font-bold text-slate-350">Access Denied</h3>
        <p className="text-slate-500 text-sm mt-1">Only recruitment managers can post new job listings.</p>
        <Link to="/dashboard" className="mt-4 text-indigo-400 hover:underline text-sm font-bold">Return to Dashboard</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Neon Orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-600 rounded-full blur-[140px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[160px] opacity-10 pointer-events-none"></div>

      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850 rounded-2xl p-8 w-full max-w-lg shadow-2xl relative z-10">
        <h2 className="text-3xl font-black text-center mb-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
          Post a New Job
        </h2>
        <p className="text-center text-xs text-slate-500 mb-8">Reach thousands of freshers and tech graduates</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-slate-400 font-semibold mb-1 block">Job Title *</label>
            <input 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-700 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200"
              type="text" 
              name="title" 
              placeholder="e.g. Frontend Engineer Intern"
              value={formData.title} 
              onChange={handleChange} 
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-semibold mb-1 block">Company Name *</label>
            <input 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-700 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200"
              type="text" 
              name="company" 
              placeholder="e.g. Acme Corp"
              value={formData.company} 
              onChange={handleChange} 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1 block">Location *</label>
              <input 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-700 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200"
                type="text" 
                name="location" 
                placeholder="e.g. Remote / Bangalore"
                value={formData.location} 
                onChange={handleChange} 
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1 block">Salary Range</label>
              <input 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-700 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200"
                type="text" 
                name="salary" 
                placeholder="e.g. 6-8 LPA"
                value={formData.salary} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1 block">Job Type</label>
              <select 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-350 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200 cursor-pointer"
                name="jobType" 
                value={formData.jobType} 
                onChange={handleChange}
              >
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1 block">Required Skills (comma separated) *</label>
              <input 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-700 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200"
                type="text" 
                name="skills" 
                placeholder="React, Node.js, Git"
                value={formData.skills} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-semibold mb-1 block">Detailed Description *</label>
            <textarea 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-700 resize-none focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200"
              name="description" 
              rows={5} 
              placeholder="Outline role responsibilities, criteria, benefits, work models..."
              value={formData.description} 
              onChange={handleChange} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-750 hover:to-purple-750 text-white py-3.5 rounded-xl font-bold transition duration-200 shadow-lg shadow-indigo-600/20 mt-4 disabled:opacity-50 active:scale-95"
          >
            {loading ? 'Posting Listing...' : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PostJob