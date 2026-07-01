import { useState } from 'react'
import API from '../api/axios'
import toast from 'react-hot-toast'

function AIJobMatcher() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(false)

  const findMatches = async () => {
    try {
      setLoading(true)
      const res = await API.get('/ai/match-jobs')
      setMatches(res.data.matches)
      if (res.data.matches.length === 0) {
        toast('No matches found', { icon: 'ℹ️' })
      } else {
        toast.success('Found your best matches!')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Matching failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl p-6 mb-4 text-white" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
      <div className="flex justify-between items-center flex-wrap gap-3 mb-4">
        <h3 className="text-lg font-bold">🤖 AI Job Matcher</h3>
        <button
          onClick={findMatches}
          disabled={loading}
          className="bg-white text-purple-600 font-bold px-4 py-2 rounded-lg text-sm hover:bg-gray-100"
        >
          {loading ? 'Finding...' : 'Find My Best Matches'}
        </button>
      </div>

      {matches.map((m) => (
        <div key={m.job._id} className="bg-white bg-opacity-20 rounded-lg p-4 mb-2 flex justify-between items-center">
          <div>
            <h4 className="font-bold">{m.job.title}</h4>
            <p className="text-sm text-purple-100">🏢 {m.job.company} — 📍 {m.job.location}</p>
            <p className="text-xs text-purple-200 mt-1">💡 {m.reason}</p>
          </div>
          <div className="text-2xl font-bold">{m.matchPercent}%</div>
        </div>
      ))}
    </div>
  )
}

export default AIJobMatcher