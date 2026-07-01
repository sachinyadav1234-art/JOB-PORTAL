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
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6 relative overflow-hidden">
      {/* Background Neon Orbs */}
      <div className="absolute top-24 left-12 w-80 h-80 bg-blue-600 rounded-full blur-[140px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-24 right-12 w-96 h-96 bg-purple-600 rounded-full blur-[160px] opacity-10 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Page Header */}
        <div className="mb-10 border-b border-slate-900 pb-6">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Explore Careers
          </h1>
          <p className="text-slate-400 mt-2 text-sm md:text-base">
            Discover verified tech roles and apply directly to top development companies.
          </p>
        </div>

        {/* Search Bar Panel */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850 p-4 rounded-2xl flex flex-col md:flex-row gap-3 mb-10">
          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-650"
              type="text" 
              placeholder="Search by title, role, or skill..."
              value={keyword} 
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
            />
          </div>

          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            <input
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-650"
              type="text" 
              placeholder="Location (e.g. Remote, Bangalore)..."
              value={location} 
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
            />
          </div>

          <button
            onClick={fetchJobs}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-indigo-600/20 active:scale-95 shrink-0"
          >
            Find Jobs
          </button>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-slate-400 text-sm">Loading latest postings...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-24 bg-slate-900/20 rounded-2xl border border-slate-900 border-dashed">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-slate-350">No postings found</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
              We couldn't find any roles matching your search filters. Try using alternative keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div 
                key={job._id} 
                className="group relative bg-slate-900/40 hover:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-850 hover:border-indigo-500/50 shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-slate-300 font-extrabold text-sm block">🏢 {job.company}</span>
                    <span className="bg-indigo-950 text-indigo-400 border border-indigo-900/60 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {job.jobType}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors duration-250 line-clamp-1 mb-2">
                    {job.title}
                  </h3>

                  <div className="flex flex-col gap-1.5 text-xs text-slate-400 mt-3 border-b border-slate-900 pb-4">
                    <div className="flex items-center gap-1.5">
                      <span>📍</span>
                      <span className="text-slate-300">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>💰</span>
                      <span className="text-slate-300 font-medium">{job.salary || 'Not disclosed'}</span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {job.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="bg-indigo-950/40 text-indigo-300 text-[10px] px-2.5 py-0.5 rounded-md border border-indigo-900/30 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <Link
                    to={`/jobs/${job._id}`}
                    className="w-full inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-750 text-white font-bold py-2.5 rounded-xl text-sm transition-all duration-200 shadow-md shadow-indigo-600/10 active:scale-98"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Jobs