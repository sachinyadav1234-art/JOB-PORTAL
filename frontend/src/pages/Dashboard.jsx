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
    if (status === 'accepted') return 'bg-green-500'
    if (status === 'rejected') return 'bg-red-500'
    if (status === 'reviewed') return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  const handleDeleteJob = async (jobId) => {
    try {
      await API.delete(`/jobs/${jobId}`)
      toast.success('Job deleted!')
      setMyJobs(myJobs.filter(j => j._id !== jobId))
    } catch (err) {
      toast.error('Failed to delete job')
    }
  }

  const handleWithdraw = async (appId) => {
    try {
      await API.delete(`/applications/${appId}`)
      toast.success('Application withdrawn!')
      setApplications(applications.filter(a => a._id !== appId))
    } catch (err) {
      toast.error('Failed to withdraw')
    }
  }

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading...</p>

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">

      {/* Profile Box */}
      <div className="bg-gray-900 text-white rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-1">👋 Welcome, {user?.name}</h2>
        <p className="text-gray-400 text-sm">Role: <span className="text-white font-medium">{user?.role}</span></p>
        <p className="text-gray-400 text-sm">Email: {user?.email}</p>
      </div>

      {/* AI Features — Student only */}
      {user?.role === 'student' && (
        <>
          <AIJobMatcher />
          <RealJobSearch />
        </>
      )}

      {/* Student Applications */}
      {user?.role === 'student' && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            My Applications ({applications.length})
          </h3>
          {applications.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No applications yet</p>
          ) : (
            applications.map((app) => (
              <div key={app._id} className="bg-white rounded-xl shadow p-5 mb-3 flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-800">{app.job?.title}</h4>
                  <p className="text-gray-500 text-sm">🏢 {app.job?.company}</p>
                  <p className="text-gray-400 text-sm">📍 {app.job?.location}</p>
                  <p className="text-gray-400 text-sm">
                    Applied: {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`${statusColor(app.status)} text-white text-xs px-3 py-1 rounded-full capitalize`}>
                    {app.status}
                  </span>
                  <button
                    onClick={() => handleWithdraw(app._id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-lg"
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Recruiter Jobs */}
      {(user?.role === 'recruiter' || user?.role === 'admin') && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            My Posted Jobs ({myJobs.length})
          </h3>
          {myJobs.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No jobs posted yet</p>
          ) : (
            myJobs.map((job) => (
              <div key={job._id} className="bg-white rounded-xl shadow p-5 mb-3 flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-800">{job.title}</h4>
                  <p className="text-gray-500 text-sm">🏢 {job.company}</p>
                  <p className="text-gray-400 text-sm">📍 {job.location}</p>
                  <p className="text-gray-400 text-sm">⏰ {job.jobType}</p>
                </div>
                <button
                  onClick={() => handleDeleteJob(job._id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-lg"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Dashboard