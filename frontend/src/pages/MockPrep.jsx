import { useState, useEffect } from 'react'
import API from '../api/axios'
import toast from 'react-hot-toast'

function MockPrep() {
  const [targetRole, setTargetRole] = useState('Software Engineer Intern')
  const [skills, setSkills] = useState('')
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState([])
  const [userAnswers, setUserAnswers] = useState({})
  
  const [grading, setGrading] = useState(false)
  const [evaluation, setEvaluation] = useState(null)

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

  const startInterview = async () => {
    try {
      setLoading(true)
      setEvaluation(null)
      setUserAnswers({})
      const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean)
      const res = await API.post('/ai/mock-interview/generate', {
        targetRole,
        skills: skillsArray
      })
      setQuestions(res.data.data.questions)
      toast.success('Interview questions generated! Start answering.')
    } catch (err) {
      console.error(err)
      toast.error('Failed to generate interview round')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (qId, val) => {
    setUserAnswers({ ...userAnswers, [qId]: val })
  }

  const submitInterview = async () => {
    // Check if answers are filled
    const missingCount = questions.filter(q => !userAnswers[q.id] || !userAnswers[q.id].trim()).length
    if (missingCount > 0) {
      toast.error('Please answer all questions before submitting.')
      return
    }

    try {
      setGrading(true)
      toast.loading('Analyzing and grading your responses... Please wait.', { id: 'grading' })
      const submissions = questions.map(q => ({
        question: q.question,
        answer: userAnswers[q.id]
      }))
      const res = await API.post('/ai/mock-interview/grade', { answers: submissions })
      setEvaluation(res.data.evaluation)
      toast.success('Interview evaluation complete!', { id: 'grading' })
    } catch (err) {
      console.error(err)
      toast.error('Failed to evaluate answers', { id: 'grading' })
    } finally {
      setGrading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 border-b border-slate-800 pb-6">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            AI Technical Mock Interview
          </h1>
          <p className="text-slate-400 mt-2 text-sm md:text-base">
            Test your knowledge in DSA, core IT academic subjects, and technologies. Get real-time grading and model answers.
          </p>
        </div>

        {/* Phase 1: Setup */}
        {questions.length === 0 && (
          <div className="bg-slate-900 bg-opacity-40 border border-slate-850 rounded-2xl p-8 backdrop-blur-md max-w-xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Configure Mock Round</h3>
            
            <div className="flex flex-col gap-5">
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Target Role / Drive Name</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-100"
                >
                  <option value="Software Engineer Intern">Software Engineer Intern</option>
                  <option value="TCS NQT / Infosys Recruitment Round">TCS NQT / Infosys Recruitment Prep</option>
                  <option value="Frontend Developer (React)">Frontend Developer</option>
                  <option value="Backend Developer (Node.js)">Backend Developer</option>
                  <option value="QA / Software Tester Intern">QA / Testing Intern</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Skills (comma separated)</label>
                <input 
                  type="text" 
                  value={skills} 
                  onChange={(e) => setSkills(e.target.value)} 
                  placeholder="e.g. Java, Python, SQL, React"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-600"
                />
              </div>

              <button
                onClick={startInterview}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/20"
              >
                {loading ? 'Generating questions...' : 'Generate AI Interview Round 🎙'}
              </button>
            </div>
          </div>
        )}

        {/* Phase 2: Questions round */}
        {questions.length > 0 && !evaluation && (
          <div className="bg-slate-900 bg-opacity-40 border border-slate-850 rounded-2xl p-8 backdrop-blur-md flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">Interview In Progress</h3>
              <button 
                onClick={() => setQuestions([])} 
                className="text-xs text-rose-400 hover:underline"
              >
                Cancel Session
              </button>
            </div>

            {questions.map((q) => (
              <div key={q.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-850">
                <div className="flex justify-between items-center mb-2">
                  <span className="bg-indigo-950 text-indigo-400 text-[10px] px-2.5 py-0.5 rounded-full border border-indigo-900 font-bold uppercase tracking-wider">
                    {q.category}
                  </span>
                  <span className="text-slate-500 text-xs font-semibold">Question {q.id} of 3</span>
                </div>
                <h4 className="text-base font-bold text-slate-200 leading-relaxed mb-4">{q.question}</h4>
                <textarea
                  rows={4}
                  value={userAnswers[q.id] || ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  placeholder="Type your detailed technical explanation or code block here..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-600 resize-none"
                />
              </div>
            ))}

            <button
              onClick={submitInterview}
              disabled={grading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/20"
            >
              {grading ? 'Reviewing submissions...' : 'Submit Answers for AI Grading 🎯'}
            </button>
          </div>
        )}

        {/* Phase 3: Feedback Report */}
        {evaluation && (
          <div className="flex flex-col gap-6">
            
            {/* Overall Score box */}
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-8 backdrop-blur-md flex flex-col md:flex-row items-center gap-6">
              <div className="h-28 w-28 rounded-full border-4 border-indigo-500 bg-indigo-500/10 flex flex-col items-center justify-center font-extrabold text-indigo-400 shrink-0">
                <span className="text-4xl">{evaluation.overallScore}%</span>
                <span className="text-[10px] font-normal uppercase tracking-wider mt-1">Grade Score</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Interview Performance Review</h3>
                <p className="text-slate-300 text-sm mt-2 leading-relaxed">{evaluation.overallFeedback}</p>
                <button
                  onClick={() => {
                    setEvaluation(null)
                    setQuestions([])
                  }}
                  className="mt-4 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 px-5 py-2 rounded-xl text-xs font-bold transition duration-200"
                >
                  Start New Session 🔄
                </button>
              </div>
            </div>

            {/* Individual Grades */}
            {evaluation.grades?.map((g, idx) => (
              <div key={idx} className="bg-slate-900 bg-opacity-40 border border-slate-850 rounded-2xl p-6 backdrop-blur-md">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <h4 className="font-bold text-white text-base leading-relaxed flex-1">{g.question}</h4>
                  <span className="bg-indigo-950 text-indigo-400 border border-indigo-900/60 font-bold px-3 py-1 rounded-lg text-sm shrink-0">
                    {g.score}/10
                  </span>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Your Submission</span>
                    <p className="text-slate-300 text-xs italic bg-slate-950 p-3 rounded-lg border border-slate-850 mt-1">{g.submittedAnswer}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">AI Evaluator Feedback</span>
                    <p className="text-slate-300 text-xs leading-relaxed mt-1">{g.feedback}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block font-medium">Sample Correct Answer</span>
                    <p className="text-slate-300 text-xs bg-emerald-950/20 border border-emerald-900/20 p-4 rounded-xl leading-relaxed mt-1 font-mono">{g.sampleCorrectAnswer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default MockPrep
