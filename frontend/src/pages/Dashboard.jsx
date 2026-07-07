import { useState, useEffect } from 'react'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import AIJobMatcher from '../components/AIJobMatcher'
import RealJobSearch from '../components/RealJobSearch'

function Dashboard() {
  const { user } = useAuth()
  const [applications, setApplications] = useState([])
  const [myJobs, setMyJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedJobId, setExpandedJobId] = useState(null)
  const [selectedJobApplications, setSelectedJobApplications] = useState([])
  const [appsLoading, setAppsLoading] = useState(false)

  const handleToggleExpandJob = async (jobId) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null)
      setSelectedJobApplications([])
      return
    }
    try {
      setExpandedJobId(jobId)
      setAppsLoading(true)
      const res = await API.get(`/applications/job/${jobId}`)
      setSelectedJobApplications(res.data.applications)
    } catch {
      toast.error('Failed to load candidate applications')
    } finally {
      setAppsLoading(false)
    }
  }

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await API.put(`/applications/${appId}/status`, { status: newStatus })
      toast.success(`Application status updated to ${newStatus}`)
      setSelectedJobApplications(prev => 
        prev.map(app => app._id === appId ? { ...app, status: newStatus } : app)
      )
    } catch {
      toast.error('Failed to update status')
    }
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        if (user?.role === 'student') {
          const res = await API.get('/applications/myapplications')
          setApplications(res.data.applications)
        } else if (user?.role === 'recruiter' || user?.role === 'admin') {
          const res = await API.get('/jobs/recruiter/myjobs')
          setMyJobs(res.data.jobs)
        }
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [user])

  const statusColor = (status) => {
    if (status === 'accepted') return 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/30'
    if (status === 'rejected') return 'bg-rose-500/10 text-rose-450 border border-rose-500/30'
    if (status === 'reviewed') return 'bg-amber-500/10 text-amber-450 border border-amber-500/30'
    return 'bg-blue-500/10 text-blue-450 border border-blue-500/30'
  }

  const handleDeleteJob = async (jobId) => {
    try {
      await API.delete(`/jobs/${jobId}`)
      toast.success('Job deleted!')
      setMyJobs(myJobs.filter(j => j._id !== jobId))
    } catch {
      toast.error('Failed to delete job')
    }
  }

  const handleWithdraw = async (appId) => {
    try {
      await API.delete(`/applications/${appId}`)
      toast.success('Application withdrawn!')
      setApplications(applications.filter(a => a._id !== appId))
    } catch {
      toast.error('Failed to withdraw')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  // Calculate statistics
  const totalApps = applications.length
  const acceptedApps = applications.filter(a => a.status === 'accepted').length
  const pendingApps = applications.filter(a => a.status === 'applied' || a.status === 'pending').length
  const reviewedApps = applications.filter(a => a.status === 'reviewed').length

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6 relative overflow-hidden">
      {/* Background Neon Orbs */}
      <div className="absolute top-24 left-12 w-80 h-80 bg-blue-600 rounded-full blur-[140px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-24 right-12 w-96 h-96 bg-purple-600 rounded-full blur-[160px] opacity-10 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Profile Card Widget */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950/40 backdrop-blur-md border border-slate-850 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center gap-5 shadow-2xl">
          <div className="h-16 w-16 rounded-2xl bg-indigo-650 flex items-center justify-center font-extrabold text-2xl text-white shadow-lg shadow-indigo-650/30">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl font-black text-white">👋 Welcome Back, {user?.name}</h2>
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-1.5 text-xs">
              <span className="text-slate-400">Email: <span className="text-slate-200 font-semibold">{user?.email}</span></span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">Role: <span className="text-indigo-400 font-extrabold capitalize">{user?.role}</span></span>
            </div>
          </div>
        </div>

        {/* Candidate Dashboard View */}
        {user?.role === 'student' && (
          <div className="flex flex-col gap-8">
            
            {/* Stats Dashboard Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Total Applications</span>
                <span className="text-3xl font-black text-white">{totalApps}</span>
              </div>
              <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Offer Extended</span>
                <span className="text-3xl font-black text-emerald-450">{acceptedApps}</span>
              </div>
              <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Reviewed By HR</span>
                <span className="text-3xl font-black text-amber-450">{reviewedApps}</span>
              </div>
              <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Pending Sync</span>
                <span className="text-3xl font-black text-blue-450">{pendingApps}</span>
              </div>
            </div>

            {/* AI Tools Widgets */}
            <div className="grid grid-cols-1 gap-6">
              <AIJobMatcher />
              <RealJobSearch />
            </div>

            {/* My Applications Section */}
            <div>
              <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                <span>📁</span> My Applications ({applications.length})
              </h3>
              {applications.length === 0 ? (
                <div className="text-center py-10 bg-slate-900/10 rounded-xl border border-slate-900 border-dashed">
                  <p className="text-slate-500 text-sm">No applications submitted yet. Browse jobs to apply!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {applications.map((app) => (
                    <div 
                      key={app._id} 
                      className="bg-slate-900/40 hover:bg-slate-900/60 border border-slate-850 rounded-2xl p-5 flex justify-between items-center flex-wrap gap-4 transition duration-200"
                    >
                      <div>
                        <h4 className="font-bold text-white text-base leading-tight">{app.job?.title}</h4>
                        <p className="text-slate-350 text-sm font-semibold mt-1">🏢 {app.job?.company}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                          <span>📍 {app.job?.location || 'India'}</span>
                          <span>•</span>
                          <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`${statusColor(app.status)} text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider`}>
                          {app.status}
                        </span>
                        <button
                          onClick={() => handleWithdraw(app._id)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs px-3.5 py-1.5 rounded-xl font-semibold transition duration-200 active:scale-95"
                        >
                          Withdraw
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Recruiter Dashboard View */}
        {(user?.role === 'recruiter' || user?.role === 'admin') && (
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                <span>💼</span> My Posted Jobs ({myJobs.length})
              </h3>
              {myJobs.length === 0 ? (
                <div className="text-center py-10 bg-slate-900/10 rounded-xl border border-slate-900 border-dashed">
                  <p className="text-slate-500 text-sm">No jobs posted yet. Click 'Post Job' in navigation to list one!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {myJobs.map((job) => (
                    <div 
                      key={job._id} 
                      className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5 transition duration-200"
                    >
                      <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                          <h4 className="font-bold text-white text-base leading-tight">{job.title}</h4>
                          <p className="text-slate-350 text-sm font-semibold mt-1">🏢 {job.company}</p>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                            <span>📍 {job.location}</span>
                            <span>•</span>
                            <span className="capitalize">{job.jobType}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <button
                            onClick={() => handleToggleExpandJob(job._id)}
                            className="bg-indigo-650/15 hover:bg-indigo-650/30 text-indigo-400 border border-indigo-500/25 text-xs px-3.5 py-1.5 rounded-xl font-semibold transition duration-200 active:scale-95"
                          >
                            {expandedJobId === job._id ? 'Hide Applications' : 'View Applications'}
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job._id)}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs px-3.5 py-1.5 rounded-xl font-semibold transition duration-200 active:scale-95 shrink-0"
                          >
                            Delete Listing
                          </button>
                        </div>
                      </div>

                      {/* Expanded candidates view */}
                      {expandedJobId === job._id && (
                        <div className="mt-5 pt-5 border-t border-slate-850/80">
                          {appsLoading ? (
                            <div className="flex justify-center items-center py-6">
                              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
                            </div>
                          ) : selectedJobApplications.length === 0 ? (
                            <p className="text-slate-500 text-xs py-4 text-center bg-slate-950/20 rounded-xl border border-slate-900 border-dashed">
                              No candidates have applied for this position yet.
                            </p>
                          ) : (
                            <div className="flex flex-col gap-4 mt-3">
                              <h5 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">
                                Candidate Applications ({selectedJobApplications.length})
                              </h5>
                              <div className="flex flex-col gap-3">
                                {selectedJobApplications.map((app) => (
                                  <div key={app._id} className="bg-slate-950/60 border border-slate-900 rounded-xl p-4">
                                    <div className="flex justify-between items-start flex-wrap gap-3">
                                      <div>
                                        <h6 className="font-bold text-white text-sm">{app.applicant?.name}</h6>
                                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-400">
                                          <span>📧 {app.applicant?.email}</span>
                                          {app.applicant?.phone && <span>📞 {app.applicant?.phone}</span>}
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-slate-500 font-semibold uppercase">Status:</span>
                                        <select
                                          value={app.status}
                                          onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                                          className="bg-slate-900 border border-slate-850 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-500"
                                        >
                                          <option value="applied">Applied</option>
                                          <option value="reviewed">Reviewed</option>
                                          <option value="accepted">Accepted</option>
                                          <option value="rejected">Rejected</option>
                                        </select>
                                      </div>
                                    </div>

                                    {/* Skills */}
                                    {app.applicant?.skills && app.applicant.skills.length > 0 && (
                                      <div className="flex flex-wrap gap-1.5 mt-3">
                                        {app.applicant.skills.map((skill, index) => (
                                          <span 
                                            key={index} 
                                            className="bg-slate-900 text-slate-350 text-[10px] px-2 py-0.5 rounded-md border border-slate-850"
                                          >
                                            {skill}
                                          </span>
                                        ))}
                                      </div>
                                    )}

                                    {/* Cover Letter */}
                                    {app.coverLetter && (
                                      <div className="mt-3.5 bg-slate-900/40 p-3 rounded-lg border border-slate-850/50">
                                        <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Cover Letter</span>
                                        <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">{app.coverLetter}</p>
                                      </div>
                                    )}

                                    {/* Resume Link */}
                                    {app.applicant?.resume && (
                                      <div className="mt-3 text-right">
                                        <a 
                                          href={app.applicant.resume} 
                                          target="_blank" 
                                          rel="noopener noreferrer" 
                                          className="text-xs text-indigo-400 font-bold hover:underline inline-flex items-center gap-1"
                                        >
                                          📄 View Resume ↗
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard