import { useState, useEffect } from 'react'
import API from '../api/axios'
import toast from 'react-hot-toast'

function VerifiedJobs() {
  const [jobs, setJobs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchJobs = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true)
        toast.loading('Crawling & officially verifying live careers pages... This may take up to 10 seconds.', { id: 'crawl' })
      } else {
        setLoading(true)
      }
      const res = await API.get(`/ai/verified-fresher-jobs${forceRefresh ? '?refresh=true' : ''}`)
      setJobs(res.data.jobs)
      if (forceRefresh) {
        toast.success(`Found and verified ${res.data.jobs.length} fresher jobs!`, { id: 'crawl' })
      }
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to fetch verified jobs', { id: 'crawl' })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const filteredJobs = jobs.filter(job => {
    const term = searchTerm.toLowerCase();
    return (
      job.title.toLowerCase().includes(term) ||
      job.company.toLowerCase().includes(term) ||
      (job.location && job.location.toLowerCase().includes(term)) ||
      (job.skills && job.skills.some(s => s.toLowerCase().includes(term)))
    );
  })

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="flex justify-between items-center flex-wrap gap-4 mb-10 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Verified Fresher & Intern Jobs
            </h1>
            <p className="text-slate-400 mt-2 text-sm md:text-base">
              Officially verified directly from official career boards (Lever, Greenhouse, MyWorkday). Zero third-party spam.
            </p>
          </div>
          <button
            onClick={() => fetchJobs(true)}
            disabled={refreshing}
            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-slate-900 rounded-md group-hover:bg-opacity-0 font-bold">
              {refreshing ? 'Verifying Live...' : 'Sync Live Careers Feeds 🔄'}
            </span>
          </button>
        </div>

        {/* Local Search Filter */}
        {jobs.length > 0 && (
          <div className="mb-8 max-w-md">
            <input
              type="text"
              placeholder="Filter these verified jobs by title, company, or skills..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-700 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {/* Jobs Feed Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-slate-400 text-sm">Fetching verified job postings...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 bg-slate-900 bg-opacity-40 rounded-2xl border border-slate-800 border-dashed">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-slate-300">No Verified Jobs Cached</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
              Click the 'Sync Live Careers Feeds' button above to crawl the web and verify open fresher jobs in real time.
            </p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-slate-900 bg-opacity-40 rounded-2xl border border-slate-800 border-dashed">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-slate-300">No matching jobs found</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
              Try adjusting your filter keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div 
                key={job._id} 
                className="group relative bg-slate-900 bg-opacity-40 hover:bg-opacity-65 backdrop-blur-md rounded-2xl p-6 border border-slate-800 hover:border-indigo-500/50 shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Verified & Job Type Badge */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold tracking-wide uppercase inline-flex items-center gap-1">
                      <span>✓</span> Verified Official
                    </span>
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize">
                      {job.jobType}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors duration-200 line-clamp-1">
                    {job.title}
                  </h3>
                  <p className="text-slate-300 font-semibold text-sm mt-1">🏢 {job.company}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                    <span>📍 {job.location || 'India (Remote / Hybrid)'}</span>
                    {job.salary && <span>💰 {job.salary}</span>}
                  </div>

                  <p className="text-slate-400 text-sm mt-4 line-clamp-3 leading-relaxed">
                    {job.description || 'No description provided. Click Apply below to view specific requirements on the official portal.'}
                  </p>
                </div>

                <div>
                  {/* Skills tags */}
                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-slate-800/60">
                      {job.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="bg-indigo-950/40 text-indigo-300 text-xs px-2.5 py-0.5 rounded-md border border-indigo-900/30 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Apply Button */}
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 w-full inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-750 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-indigo-600/20"
                  >
                    Apply on Official Careers Page ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifiedJobs
