import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'

function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const res = await API.get(`/jobs?keyword=${keyword}&location=${location}`)
      setJobs(res.data.jobs)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchJobs() }, [])

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">All Jobs</h2>

      {/* Search Bar */}
      <div className="flex gap-3 mb-8 flex-wrap">
        <input
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
          type="text" placeholder="Search by title or skill..."
          value={keyword} onChange={(e) => setKeyword(e.target.value)}
        />
        <input
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
          type="text" placeholder="Location..."
          value={location} onChange={(e) => setLocation(e.target.value)}
        />
        <button
          onClick={fetchJobs}
          className="bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-700"
        >
          Search
        </button>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <p className="text-center text-gray-500">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-center text-gray-500">No jobs found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
              <h3 className="text-lg font-bold text-gray-800">{job.title}</h3>
              <p className="text-gray-500 text-sm">🏢 {job.company}</p>
              <p className="text-gray-400 text-sm">📍 {job.location}</p>
              <p className="text-gray-400 text-sm">💰 {job.salary || 'Not disclosed'}</p>
              <p className="text-gray-400 text-sm">⏰ {job.jobType}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {job.skills?.map((skill, i) => (
                  <span key={i} className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
              <Link
                to={`/jobs/${job._id}`}
                className="mt-3 bg-red-500 hover:bg-red-600 text-white text-center py-2 rounded-lg text-sm font-medium"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Jobs