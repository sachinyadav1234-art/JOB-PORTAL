import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
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
  const [applying, setApplying] = useState(false)

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
      setApplying(true)
      await API.post(`/applications/${id}`, { coverLetter })
      toast.success('Applied successfully!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center py-20">
        <h3 className="text-xl font-bold text-slate-300">Job Not Found</h3>
        <Link to="/jobs" className="mt-4 text-indigo-400 hover:underline">Return to Job Directory</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6 relative overflow-hidden">
      {/* Background Neon Orbs */}
      <div className="absolute top-24 left-12 w-80 h-80 bg-blue-600 rounded-full blur-[140px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-24 right-12 w-96 h-96 bg-purple-600 rounded-full blur-[160px] opacity-10 pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Back Link */}
        <Link to="/jobs" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition duration-200">
          <span>←</span> Back to Directory
        </Link>

        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="border-b border-slate-850 pb-6 mb-6">
            <div className="flex justify-between items-start gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl font-extrabold text-white leading-tight mb-2">{job.title}</h1>
                <p className="text-lg text-slate-350 font-semibold mb-3">🏢 {job.company}</p>
              </div>
              <span className="bg-indigo-950 text-indigo-450 border border-indigo-900/60 text-xs px-3.5 py-1 rounded-full font-bold uppercase tracking-wider">
                {job.jobType}
              </span>
            </div>

            {/* Quick Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-slate-950 border border-slate-900 p-3.5 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">Location</span>
                <span className="text-sm font-semibold text-slate-200">📍 {job.location || 'India'}</span>
              </div>
              <div className="bg-slate-950 border border-slate-900 p-3.5 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">Est. Salary</span>
                <span className="text-sm font-semibold text-slate-200">💰 {job.salary || 'Not disclosed'}</span>
              </div>
              <div className="bg-slate-950 border border-slate-900 p-3.5 rounded-xl col-span-2 md:col-span-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">Recruiter Details</span>
                <span className="text-xs font-semibold text-slate-400 block truncate">{job.postedBy?.name || 'Recruiter'}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-base font-bold text-white mb-3">Job Description</h3>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>

          {/* Skills Required */}
          {job.skills && job.skills.length > 0 && (
            <div className="mb-8 border-t border-slate-850/60 pt-6">
              <h3 className="text-base font-bold text-white mb-3">Key Skills Required</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, i) => (
                  <span key={i} className="bg-indigo-950/40 text-indigo-350 text-xs px-3.5 py-1.5 rounded-lg border border-indigo-900/30 font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Apply section */}
          {user?.role === 'student' && (
            <div className="border-t border-slate-850 pt-6 mt-8">
              <h3 className="text-base font-bold text-white mb-3">Submit Application</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1.5 block">Cover Letter / Pitch (optional)</label>
                  <textarea
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-700 resize-none"
                    rows={5} 
                    placeholder="Briefly explain why you're a great fit for this tech role..."
                    value={coverLetter} 
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm transition duration-200 shadow-lg shadow-indigo-600/20 active:scale-98 disabled:opacity-50"
                >
                  {applying ? 'Submitting Application...' : 'Apply Now 🚀'}
                </button>
              </div>
            </div>
          )}

          {/* Prompt to login if not authenticated */}
          {!user && (
            <div className="border-t border-slate-850 pt-6 mt-8 text-center">
              <p className="text-slate-400 text-sm mb-4">You must be logged in as a candidate to apply for this job.</p>
              <Link 
                to="/login"
                className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl text-sm transition duration-200"
              >
                Log In to Apply
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobDetail