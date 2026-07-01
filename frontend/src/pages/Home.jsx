import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      
      {/* Background Neon Glow Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600 rounded-full blur-[150px] opacity-15 pointer-events-none"></div>

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto text-center pt-28 pb-20 px-6 relative z-10">
        
        {/* Launching tag */}
        <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mb-6">
          <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping"></span>
          Tailored For BTech IT & CSE Freshers
        </span>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          The Ultimate Launchpad for{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Tech Graduates
          </span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
          Stop getting lost in fake job listings and third-party spam. Get direct official verified application portals, real-time mass hiring alerts, AI resume ATS audits, and interactive mock coding interviews.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to="/jobs" 
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-750 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-xl text-lg shadow-lg shadow-indigo-600/30 transition-all duration-200"
          >
            Launch Job Directory 🚀
          </Link>
          <Link 
            to="/events" 
            className="bg-slate-900 hover:bg-slate-850 text-slate-100 border border-slate-800 hover:border-slate-600 font-bold px-8 py-4 rounded-xl text-lg transition-all duration-200 shadow-md"
          >
            Scan Job Fairs & Drives 🎪
          </Link>
        </div>
      </div>

      {/* Features Showcase Section */}
      <div className="bg-slate-900 bg-opacity-30 border-t border-slate-900/60 py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center text-white mb-2">Designed to Solve the Fresher Crisis</h2>
          <p className="text-slate-500 text-center mb-16 text-sm max-w-md mx-auto">Everything a BTech IT/CSE graduate needs to secure their first engineering role.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-slate-900 bg-opacity-45 border border-slate-850 hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-300 shadow-xl group">
              <div className="text-4xl mb-4 p-3 bg-indigo-600/10 w-fit rounded-xl border border-indigo-500/10">🔍</div>
              <h3 className="font-bold text-white text-lg mb-2 group-hover:text-indigo-400 transition-colors">Officially Verified Feeds</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Direct integration with greenhouse.io, lever.co and official career pages. Zero dead links or agent scams.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900 bg-opacity-45 border border-slate-850 hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-300 shadow-xl group">
              <div className="text-4xl mb-4 p-3 bg-orange-600/10 w-fit rounded-xl border border-orange-500/10">🎪</div>
              <h3 className="font-bold text-white text-lg mb-2 group-hover:text-orange-400 transition-colors">Mass Drives & Fairs</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Stay updated on pooled campus drives, government hiring schemes, and mass recruiters (TCS NQT, Infosys, Wipro Elite).
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900 bg-opacity-45 border border-slate-850 hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-300 shadow-xl group">
              <div className="text-4xl mb-4 p-3 bg-teal-600/10 w-fit rounded-xl border border-teal-500/10">🤖</div>
              <h3 className="font-bold text-white text-lg mb-2 group-hover:text-teal-400 transition-colors">AI ATS Audit</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Scanner tailored for BTech IT curricula. Evaluates your profile for crucial database, network, and development tools.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-900 bg-opacity-45 border border-slate-850 hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-300 shadow-xl group">
              <div className="text-4xl mb-4 p-3 bg-purple-600/10 w-fit rounded-xl border border-purple-500/10">🎙️</div>
              <h3 className="font-bold text-white text-lg mb-2 group-hover:text-purple-400 transition-colors">Mock Prep Rounds</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Practice DSA coding problems and core CS subjects under live AI assessment. Get score grades and step-by-step feedback.
              </p>
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}

export default Home