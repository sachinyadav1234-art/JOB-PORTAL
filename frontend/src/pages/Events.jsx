import { useState, useEffect } from 'react'
import API from '../api/axios'
import toast from 'react-hot-toast'

function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchEvents = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true)
        toast.loading('Searching and validating mass drives and tech fairs... Please wait.', { id: 'crawl-events' })
      } else {
        setLoading(true)
      }
      const res = await API.get(`/ai/job-fairs-mass-hiring${forceRefresh ? '?refresh=true' : ''}`)
      setEvents(res.data.events)
      if (forceRefresh) {
        toast.success(`Tracked ${res.data.events.length} active mass hiring campaigns and fairs!`, { id: 'crawl-events' })
      }
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to fetch events', { id: 'crawl-events' })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const getTypeStyle = (type) => {
    if (type === 'mass-hiring') {
      return {
        badgeBg: 'bg-orange-500/10 text-orange-400 border border-orange-500/30',
        cardBorder: 'hover:border-orange-500/50',
        glow: 'group-hover:shadow-orange-500/5'
      }
    }
    if (type === 'job-fair') {
      return {
        badgeBg: 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
        cardBorder: 'hover:border-purple-500/50',
        glow: 'group-hover:shadow-purple-500/5'
      }
    }
    return {
      badgeBg: 'bg-teal-500/10 text-teal-400 border border-teal-500/30',
      cardBorder: 'hover:border-teal-500/50',
      glow: 'group-hover:shadow-teal-500/5'
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="flex justify-between items-center flex-wrap gap-4 mb-10 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 via-rose-400 to-purple-500 bg-clip-text text-transparent">
              Mass Hiring & Job Fairs Tracker
            </h1>
            <p className="text-slate-400 mt-2 text-sm md:text-base">
              Real-time directory of MNC mass hiring campaigns (TCS, Wipro, Cognizant, Infosys) and regional tech job fairs.
            </p>
          </div>
          <button
            onClick={() => fetchEvents(true)}
            disabled={refreshing}
            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-orange-500 to-rose-500 group-hover:from-orange-500 group-hover:to-rose-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-rose-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-slate-900 rounded-md group-hover:bg-opacity-0 font-bold">
              {refreshing ? 'Searching Live...' : 'Scan For Mass Drives 🎯'}
            </span>
          </button>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500 mb-4"></div>
            <p className="text-slate-400 text-sm">Tracking upcoming events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 bg-slate-900 bg-opacity-40 rounded-2xl border border-slate-800 border-dashed">
            <div className="text-4xl mb-4">🎪</div>
            <h3 className="text-lg font-bold text-slate-300">No Events Scanned Yet</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
              Click 'Scan For Mass Drives' to crawl search engines and extract active recruitment drives and job fairs for freshers.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const styles = getTypeStyle(event.type);
              return (
                <div 
                  key={event._id} 
                  className={`group relative bg-slate-900 bg-opacity-40 hover:bg-opacity-65 backdrop-blur-md rounded-2xl p-6 border border-slate-800 shadow-xl transition-all duration-300 flex flex-col justify-between ${styles.cardBorder} ${styles.glow}`}
                >
                  <div>
                    {/* Badge type */}
                    <div className="flex justify-between items-center mb-4">
                      <span className={`${styles.badgeBg} text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider`}>
                        {event.type.replace('-', ' ')}
                      </span>
                      <span className="text-xs text-rose-400 font-semibold bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md">
                        📅 {event.date}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-rose-400 transition-colors duration-200 line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-slate-300 font-semibold text-sm mt-1">🏢 Organizer: {event.organizer}</p>

                    <div className="flex flex-col gap-1.5 mt-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500">📍 Location:</span>
                        <span className="text-slate-300 font-medium">{event.location || 'Online / Pan India'}</span>
                      </div>
                      <div className="flex items-start gap-1">
                        <span className="text-slate-500 min-w-[65px]">🎓 Eligibility:</span>
                        <span className="text-slate-300 font-medium leading-relaxed">{event.eligibility || 'B.Tech IT/CS, MCA or similar'}</span>
                      </div>
                    </div>

                    <p className="text-slate-400 text-sm mt-4 leading-relaxed">
                      {event.description || 'View details page for guidelines, syllabus, sample papers and recruitment processes details.'}
                    </p>
                  </div>

                  <div>
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 w-full inline-flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm border border-slate-700 hover:border-slate-500 transition-all duration-200 shadow-md"
                    >
                      Register Now / View Official Portal ↗
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Events
