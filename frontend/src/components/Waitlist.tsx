import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const moonstackLogo = '/moonstack-all-white.webp'
const landingPageImg = '/landing_page_img.webp'

function Waitlist() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="app">
      {/* Navigation */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="logo">
            <Link to="/">
              <img src={moonstackLogo} alt="Moonstack" className="logo-icon" />
            </Link>
          </div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <a href="https://calendar.app.google/WdqnkAnLUJQvMKcY6" target="_blank" rel="noopener noreferrer" className="btn-primary">Book a Call</a>
          </div>
        </div>
      </nav>

      {/* Waitlist Section */}
      <section className="hero" style={{ backgroundImage: `url(${landingPageImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', alignItems: 'center', justifyContent: 'center' }}>
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        <div className="hero-content" style={{ marginTop: '-22vh' }}>
          <h1 className="hero-title">Join the Waitlist</h1>
          <p className="hero-description">
            Be the first to know when Moonstack launches. Enter your email below.
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              setStatus('loading')
              try {
                const res = await fetch('/api/waitlist', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email }),
                })
                if (!res.ok) throw new Error()
                setStatus('success')
                setEmail('')
              } catch {
                setStatus('error')
              }
            }}
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '32px' }}
          >
            <input
              ref={emailRef}
              type="email"
              placeholder="Enter your email"
              className="waitlist-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                padding: '12px 20px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '16px',
                width: '320px',
                outline: 'none',
              }}
            />
            <button type="submit" className="btn-primary btn-large" disabled={status === 'loading'}>
              {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
            </button>
          </form>
          <div style={{ position: 'relative', height: '2rem' }}>
            {status === 'success' && (
              <p style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', marginTop: '8px', color: 'rgba(255,255,255,0.85)', fontSize: '1rem' }}>
                You're on the list! We'll be in touch.
              </p>
            )}
            {status === 'error' && (
              <p style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', marginTop: '8px', color: '#ff8080', fontSize: '1rem' }}>
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Waitlist
