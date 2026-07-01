import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

function JobDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [coverLetter, setCoverLetter] = useState('')

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await API.get(`/jobs/${id}`)
        setJob(res.data.job)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [id])

  const handleApply = async () => {
    if (!user) {
      toast.error('Please login to apply')
      navigate('/login')
      return
    }
    try {
      await API.post(`/applications/${id}`, { coverLetter })
      toast.success('Applied successfully!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    }
  }

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading...</p>
  if (!job) return <p className="text-center mt-20 text-gray-500">Job not found</p>

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{job.title}</h2>
        <p className="text-gray-500 mb-1">🏢 {job.company}</p>
        <p className="text-gray-400 text-sm mb-1">📍 {job.location}</p>
        <p className="text-gray-400 text-sm mb-1">💰 {job.salary || 'Not disclosed'}</p>
        <p className="text-gray-400 text-sm mb-4">⏰ {job.jobType}</p>

        <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">{job.description}</p>

        <h3 className="font-semibold text-gray-700 mb-2">Skills Required</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills?.map((skill, i) => (
            <span key={i} className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full">
              {skill}
            </span>
          ))}
        </div>

        <h3 className="font-semibold text-gray-700 mb-1">Posted By</h3>
        <p className="text-gray-400 text-sm mb-6">{job.postedBy?.name} — {job.postedBy?.email}</p>

        {user?.role === 'student' && (
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-700 mb-2">Cover Letter (optional)</h3>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 resize-none"
              rows={4} placeholder="Write something about yourself..."
              value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)}
            />
            <button
              onClick={handleApply}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-medium"
            >
              Apply Now
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobDetail