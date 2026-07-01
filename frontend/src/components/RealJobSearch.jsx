import { useState } from 'react'
import API from '../api/axios'
import toast from 'react-hot-toast'

function RealJobSearch() {
  const [jobs, setJobs] = useState([])
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)

  const searchJobs = async (e) => {
    if (e) e.preventDefault()
    try {
      setLoading(true)
      const res = await API.get(`/ai/search-jobs?keyword=${encodeURIComponent(keyword)}`)
      setJobs(res.data.jobs)
      if (res.data.jobs.length === 0) {
        toast('No live jobs found matching this query', { icon: 'ℹ️' })
      } else {
        toast.success(`Found ${res.data.jobs.length} live job listings!`)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850 rounded-2xl p-6 mb-6 shadow-xl relative overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3 mb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>🌐</span> Search Live Career Openings
          </h3>
          <p className="text-xs text-slate-400 mt-1">Queries Google Career indices in real-time for entry-level tech roles</p>
        </div>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={searchJobs} className="flex gap-2.5 mb-6">
        <input
          type="text"
          placeholder="Type keywords (e.g. React Developer, Java Intern)..."
          className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-700"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-750 text-white font-bold px-6 py-3 rounded-xl text-xs transition duration-200 disabled:opacity-50 shrink-0"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Results list */}
      {jobs.length > 0 && (
        <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
          {jobs.map((job, i) => (
            <div key={i} className="bg-slate-950/60 border border-slate-900 hover:border-slate-800 rounded-xl p-4 transition duration-200">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h4 className="font-bold text-white text-sm">{job.title}</h4>
                  <p className="text-xs text-indigo-400 font-semibold mt-0.5">🏢 {job.company}</p>
                </div>
                <a 
                  href={job.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-indigo-950/40 text-indigo-350 border border-indigo-900/30 hover:bg-indigo-650 hover:text-white px-2.5 py-1 rounded-md text-[10px] font-bold transition duration-200 whitespace-nowrap shrink-0"
                >
                  Apply Direct ↗
                </a>
              </div>
              <p className="text-slate-450 text-xs mt-2.5 leading-relaxed">{job.snippet}</p>
            </div>
          ))}
        </div>
      )}

      {jobs.length === 0 && !loading && (
        <div className="text-center py-6 bg-slate-950/30 rounded-xl border border-slate-900 border-dashed">
          <p className="text-xs text-slate-500">Enter custom keywords above and click search to crawl live career sites.</p>
        </div>
      )}

    </div>
  )
}

export default RealJobSearch