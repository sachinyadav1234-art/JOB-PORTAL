import { useState } from 'react'
import API from '../api/axios'
import toast from 'react-hot-toast'

function RealJobSearch() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)

  const searchJobs = async () => {
    try {
      setLoading(true)
      const res = await API.get('/ai/search-jobs')
      setJobs(res.data.jobs)
      if (res.data.jobs.length === 0) {
        toast('No jobs found')
      } else {
        toast.success('Found ' + res.data.jobs.length + ' jobs!')
      }
    } catch (err) {
      toast.error('Search failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl p-6 mb-6 text-white" style={{background: 'linear-gradient(135deg, #11998e, #38ef7d)'}}>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">🌐 Search Real Jobs</h3>
        <button onClick={searchJobs} disabled={loading} className="bg-white text-green-700 font-bold px-4 py-2 rounded-lg text-sm">
          {loading ? 'Searching...' : 'Search Real Jobs'}
        </button>
      </div>

      {jobs.length > 0 && (
        <div>
          {jobs.map((job, i) => (
            <div key={i} className="bg-white bg-opacity-20 rounded-lg p-4 mb-2">
              <h4 className="font-bold">{job.title}</h4>
              <p className="text-sm text-green-100">🏢 {job.company}</p>
              <p className="text-xs text-green-200 mt-1">{job.snippet}</p>
              <a href={job.link} target="_blank" rel="noopener noreferrer" className="text-xs font-bold underline mt-2 block">
                View and Apply →
              </a>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default RealJobSearch