import { useState, useEffect } from 'react'
import API from '../api/axios'
import toast from 'react-hot-toast'

function ATSReviewer() {
  const [skills, setSkills] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    const fetchUserSkills = async () => {
      try {
        const res = await API.get('/auth/me')
        if (res.data.user.skills) {
          setSkills(res.data.user.skills.join(', '))
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchUserSkills()
  }, [])

  const handleReview = async () => {
    if (!skills && !resumeText) {
      toast.error('Please input your skills or paste your resume content')
      return
    }

    try {
      setLoading(true)
      const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean)
      const res = await API.post('/ai/review-resume', {
        skills: skillsArray,
        textContent: resumeText
      })
      setResult(res.data.analysis)
      toast.success('ATS Review Complete!')
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'ATS Review failed')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
    if (score >= 60) return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10'
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 border-b border-slate-800 pb-6">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            AI ATS Resume Reviewer
          </h1>
          <p className="text-slate-400 mt-2 text-sm md:text-base">
            Optimize your resume for software engineering screening. Checks core BTech IT academic topics and modern tooling.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Input Box */}
          <div className="lg:col-span-5 bg-slate-900 bg-opacity-40 border border-slate-850 rounded-2xl p-6 h-fit backdrop-blur-md">
            <h3 className="text-lg font-bold text-white mb-4">Input Profile / Resume</h3>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Your Core Skills (comma separated)</label>
                <input 
                  type="text" 
                  value={skills} 
                  onChange={(e) => setSkills(e.target.value)} 
                  placeholder="e.g. React, Node.js, Python, SQL"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-600"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Paste Resume Text Content (optional)</label>
                <textarea 
                  rows={8}
                  value={resumeText} 
                  onChange={(e) => setResumeText(e.target.value)} 
                  placeholder="Paste your achievements, work, college projects, and profile overview here for a deep scan..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-600 resize-none"
                />
              </div>

              <button
                onClick={handleReview}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/20"
              >
                {loading ? 'Analyzing with AI...' : 'Scan Resume Casing 🚀'}
              </button>
            </div>
          </div>

          {/* Results Analysis */}
          <div className="lg:col-span-7">
            {result ? (
              <div className="bg-slate-900 bg-opacity-40 border border-slate-850 rounded-2xl p-8 backdrop-blur-md flex flex-col gap-6">
                
                {/* Score Section */}
                <div className="flex items-center gap-6 pb-6 border-b border-slate-800">
                  <div className={`h-24 w-24 rounded-full border-4 flex flex-col items-center justify-center font-extrabold ${getScoreColor(result.atsScore)}`}>
                    <span className="text-3xl">{result.atsScore}</span>
                    <span className="text-xs font-normal">ATS Score</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">Analysis Breakdown</h4>
                    <p className="text-slate-400 text-sm mt-1">
                      {result.atsScore >= 75 
                        ? 'Great profile! Your resume has high chances of clearing entry-level ATS bots.' 
                        : 'Review the gaps below. Adding missing core IT subjects and tools will increase response rates.'
                      }
                    </p>
                  </div>
                </div>

                {/* Gaps / strengths */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-bold text-emerald-400 text-sm mb-3">✓ Key Strengths</h5>
                    <ul className="list-disc pl-5 text-xs text-slate-300 space-y-1.5">
                      {result.strengths?.map((s, idx) => <li key={idx}>{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-bold text-rose-400 text-sm mb-3">⚠ Critical Missing Skills</h5>
                    <ul className="list-disc pl-5 text-xs text-slate-300 space-y-1.5">
                      {result.criticalMissingSkills?.map((s, idx) => <li key={idx}>{s}</li>)}
                    </ul>
                  </div>
                </div>

                {/* Academic Gaps */}
                {result.academicGaps && result.academicGaps.length > 0 && (
                  <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl">
                    <h5 className="font-bold text-amber-400 text-sm mb-2">🎓 BTech IT Curriculum Gaps</h5>
                    <p className="text-xs text-slate-300 leading-relaxed mb-2">
                      Employers hiring freshers test core subjects. Consider detailing projects or certifications in:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.academicGaps.map((gap, idx) => (
                        <span key={idx} className="bg-amber-950/40 text-amber-300 border border-amber-900/30 text-xs px-2.5 py-0.5 rounded-md font-medium">
                          {gap}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Recommendations */}
                <div>
                  <h5 className="font-bold text-white text-sm mb-3">🛠 stand-Out Project Ideas for Freshers</h5>
                  <div className="space-y-3">
                    {result.projectRecommendations?.map((proj, idx) => (
                      <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                        <h6 className="font-bold text-indigo-400 text-sm mb-1">{proj.title}</h6>
                        <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ATS Formatting tips */}
                <div>
                  <h5 className="font-bold text-white text-sm mb-2">💡 ATS Optimization Tips</h5>
                  <ul className="list-decimal pl-5 text-xs text-slate-400 space-y-1.5">
                    {result.atsTips?.map((tip, idx) => <li key={idx}>{tip}</li>)}
                  </ul>
                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-center py-20 bg-slate-900 bg-opacity-20 border border-slate-800 rounded-2xl border-dashed px-6">
                <div className="text-5xl mb-4">🤖</div>
                <h3 className="text-lg font-bold text-slate-300">Run Your AI Resume Audit</h3>
                <p className="text-slate-500 text-xs mt-1 max-w-sm">
                  Paste details or skills on the left to review your resume against Indian IT recruiter standards (TCS, Infosys, top startups).
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}

export default ATSReviewer
