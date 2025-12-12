import { Link } from 'react-router-dom'
import useStore from '../store/useStore'

const idols = [
  { name: "Woo-seok", img: "https://i.pinimg.com/736x/d3/6e/12/d36e12c80ed2b1d7f82e8b3e23e40f2d.jpg" },
  { name: "Song Kang", img: "https://i.pinimg.com/736x/1f/4d/f0/1f4df0a7d6aa24cae26ed94e8addb7a7.jpg" },
  { name: "Soo-hyun", img: "https://i.pinimg.com/736x/e9/94/90/e994901b8a78f4d0d25b456e7b24f3a8.jpg" },
  { name: "Felix", img: "https://i.pinimg.com/736x/fa/3f/de/fa3fde8dcd3f0ca48c6dd5f50dc9b4de.jpg" },
  { name: "Hyunjin", img: "https://i.pinimg.com/736x/61/c1/c2/61c1c25b3a0f31ce34f18f06b1cbe227.jpg" },
  { name: "In Yeop", img: "https://i.pinimg.com/736x/cb/d7/60/cbd760da3e9bbb67416ae5807b2cbeca.jpg" },
]

const modules = [
  { number: "01", title: "Grammar", sub: "Passé Composé", progress: 65, to: "/grammar" },
  { number: "02", title: "Vocabulary", sub: "Logical Connectors", progress: 40, to: "/vocabulary" },
  { number: "03", title: "Reading", sub: "Comprehension", progress: 30, to: "/reading" },
  { number: "04", title: "Writing", sub: "Task 2 Letters", progress: 20, to: "/writing" },
]

function Home() {
  const { grammarProgress, vocabularyProgress, readingProgress, listeningProgress } = useStore()

  // Calculate real progress for modules
  const totalExercises = Object.values(grammarProgress).reduce((sum, p) => sum + p.completed, 0)
  const totalCorrect = Object.values(grammarProgress).reduce((sum, p) => sum + p.correctFirst + p.correctRetry, 0)
  const accuracy = totalExercises > 0 ? Math.round((totalCorrect / totalExercises) * 100) : 0

  // Calculate streak (simplified - based on topics practiced)
  const topicsStarted = Object.keys(grammarProgress).length
  const streak = Math.min(7, topicsStarted)

  // Update module progress based on real data
  const updatedModules = modules.map(mod => {
    switch (mod.to) {
      case '/grammar':
        return { ...mod, progress: Math.min(100, topicsStarted * 2) }
      case '/vocabulary':
        return { ...mod, progress: Math.min(100, vocabularyProgress.mastered.length * 5) }
      case '/reading':
        return { ...mod, progress: Math.min(100, readingProgress.completed.length * 10) }
      default:
        return mod
    }
  })

  return (
    <div>
      {/* Hero */}
      <section className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-16 mb-18 items-start">
        <div className="pt-6">
          <p className="hero-label animate-in delay-100">Welcome Back</p>
          <h1 className="hero-title animate-in delay-200">
            Small steps,
            <br />
            <span className="hero-underline">beautiful</span> progress.
          </h1>
          <p className="hero-subtitle animate-in delay-300">
            Mastery is quiet. It happens in the small moments — each word
            learned, each phrase understood. You're closer than you think.
          </p>

          {/* Stats */}
          <div className="flex gap-10 mb-10 pb-10 border-b border-pearl animate-in delay-300">
            <div>
              <p className="stat-value">{streak}</p>
              <p className="stat-label">Day Streak</p>
              <div className="stat-hearts">
                {[...Array(7)].map((_, i) => (
                  <span key={i} className={`stat-heart ${i < streak ? 'filled' : ''}`}>
                    {i < streak ? '♥' : '♡'}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="stat-value">{totalExercises}</p>
              <p className="stat-label">Exercises</p>
            </div>
            <div>
              <p className="stat-value">{accuracy}%</p>
              <p className="stat-label">Accuracy</p>
            </div>
          </div>

          <Link to="/grammar" className="btn-primary animate-in delay-400">
            Continue
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Hero Image - Black & White */}
        <div className="image-frame aspect-[3/4] animate-in delay-200 group hidden md:block">
          <img
            src="https://i.pinimg.com/736x/d3/6e/12/d36e12c80ed2b1d7f82e8b3e23e40f2d.jpg"
            alt="Byeon Woo-seok"
            className="image-bw"
          />
          <span className="absolute -bottom-7 left-0 text-caption text-grey">
            Byeon Woo-seok
          </span>
        </div>
      </section>

      {/* Modules */}
      <section className="mb-18">
        <div className="section-header">
          <span className="section-title">Continue Learning</span>
          <span className="section-count">4 modules</span>
        </div>

        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {updatedModules.map((mod) => (
            <Link key={mod.to} to={mod.to} className="card">
              <span className="card-number">{mod.number}</span>
              <h3 className="card-title">{mod.title}</h3>
              <p className="card-subtitle">{mod.sub}</p>
              <div className="progress-bar">
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${mod.progress}%` }}
                  />
                </div>
                <span className="progress-value">{mod.progress}%</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Progress Cards */}
      <div className="card-grid mb-18" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="progress-card">
          <p className="progress-card-label">Target Level</p>
          <p className="progress-card-value">CLB 7</p>
          <p className="progress-card-sub">Your goal</p>
        </div>
        <div className="progress-card">
          <p className="progress-card-label">Current Level</p>
          <p className="progress-card-value">CLB 6</p>
          <p className="progress-card-sub">Almost there</p>
        </div>
        <div className="progress-card">
          <p className="progress-card-label">Listening</p>
          <p className="progress-card-value">458</p>
          <p className="progress-card-sub">Target: 502</p>
        </div>
        <div className="progress-card">
          <p className="progress-card-label">Reading</p>
          <p className="progress-card-value">467</p>
          <p className="progress-card-sub">Target: 498</p>
        </div>
      </div>

      {/* Gallery */}
      <section className="mb-18">
        <div className="section-header">
          <span className="section-title">Inspiration</span>
          <span className="section-count">6 portraits</span>
        </div>

        <div className="gallery-grid">
          {idols.map((idol) => (
            <div key={idol.name} className="gallery-item group">
              <img src={idol.img} alt={idol.name} className="image-bw" />
              <span className="gallery-name">{idol.name}</span>
              <span className="gallery-heart">♡</span>
            </div>
          ))}
        </div>
      </section>

      {/* Quote */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center py-14 border-t border-b border-pearl">
        <div className="image-inner-frame aspect-[4/5]">
          <img
            src="https://i.pinimg.com/736x/e9/94/90/e994901b8a78f4d0d25b456e7b24f3a8.jpg"
            alt="Kim Soo-hyun"
            className="image-bw w-full h-full object-cover"
          />
        </div>
        <div className="pr-10">
          <p className="quote-label">Daily French</p>
          <p className="quote-french">"Petit à petit, l'oiseau fait son nid."</p>
          <p className="quote-english">
            Little by little, the bird builds its nest.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>Made with</p>
        <span className="footer-heart">♥</span>
        <p>for your journey</p>
      </footer>
    </div>
  )
}

export default Home
