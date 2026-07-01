import { useState, useEffect } from 'react'
import API from '../api/axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

function Profile() {
  const { user } = useAuth()
  const [skills, setSkills] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/auth/me')
        setSkills(res.data.user.skills?.join(', ') || '')
        setPhone(res.data.user.phone || '')
      } catch (err) {
        console.log(err)
      }
    }
    fetchProfile()
  }, [])

  const handleSave = async () => {
    try {
      setLoading(true)
      const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean)
      await API.put('/auth/profile', { skills: skillsArray, phone })
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Neon Orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-600 rounded-full blur-[140px] opacity-15 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[160px] opacity-15 pointer-events-none"></div>

      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850 rounded-2xl p-8 w-full max-w-md shadow-2xl relative z-10">
        <h2 className="text-3xl font-black text-center mb-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
          My Profile
        </h2>
        <p className="text-center text-xs text-slate-500 mb-8">Keep your professional details up to date</p>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-slate-400 font-semibold mb-1 block">Full Name</label>
            <input 
              className="w-full bg-slate-950/50 border border-slate-900 rounded-xl px-4 py-3 text-sm text-slate-450 cursor-not-allowed focus:outline-none"
              value={user?.name || ''} 
              disabled 
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-semibold mb-1 block">Email Address</label>
            <input 
              className="w-full bg-slate-950/50 border border-slate-900 rounded-xl px-4 py-3 text-sm text-slate-450 cursor-not-allowed focus:outline-none"
              value={user?.email || ''} 
              disabled 
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-semibold mb-1 block">Phone Number</label>
            <input 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-700 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200"
              type="text" 
              placeholder="Your contact number"
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-semibold mb-1 block">Skills (comma separated)</label>
            <input 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-700 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200"
              type="text" 
              placeholder="React, Node.js, Python, SQL"
              value={skills} 
              onChange={(e) => setSkills(e.target.value)} 
            />
            {skills && (
              <div className="flex flex-wrap gap-1 mt-2.5">
                {skills.split(',').map((s, idx) => s.trim() && (
                  <span key={idx} className="bg-indigo-950/60 text-indigo-300 border border-indigo-900/40 text-[10px] px-2 py-0.5 rounded-md font-medium">
                    {s.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={handleSave} 
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-750 hover:to-purple-750 text-white py-3 rounded-xl font-bold transition duration-200 shadow-lg shadow-indigo-600/20 mt-4 disabled:opacity-50 active:scale-95"
          >
            {loading ? 'Saving Changes...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile