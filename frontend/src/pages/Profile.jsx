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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">My Profile</h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Name</label>
            <input className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-400"
              value={user?.name} disabled />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Email</label>
            <input className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-400"
              value={user?.email} disabled />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Phone</label>
            <input className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
              type="text" placeholder="Your phone number"
              value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Skills (comma separated)</label>
            <input className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
              type="text" placeholder="React, Node, MongoDB"
              value={skills} onChange={(e) => setSkills(e.target.value)} />
          </div>

          <button onClick={handleSave} disabled={loading}
            className="bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-700 mt-2">
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile