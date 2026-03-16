import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Submission } from '../App'
import emergenC from '../assets/emergen-c.webp'
import greenValley from '../assets/green-valley.webp'
import pendulum from '../assets/pendulum.jpg'
import ad1 from '../assets/ad1.png'
import ad2 from '../assets/ad2.png'
import ad3 from '../assets/ad3.png'
import ad4 from '../assets/ad4.png'
import ad5 from '../assets/ad5.png'
import ad6 from '../assets/ad6.png'

const ADS = [ad1, ad2, ad3, ad4, ad5, ad6]

const STATUSES = ['New', 'In Review', 'Approved', 'Rejected']

const COMPETITORS = [
  { name: 'Emergen-C', img: emergenC },
  { name: 'Pendulum Probiotic', img: pendulum },
  { name: 'Fabric Wholesales', img: null },
  { name: 'Day-guard', img: null },
  { name: 'Green Valley Natural', img: greenValley },
]

function SubmissionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('New')
  const [competitorsReady, setCompetitorsReady] = useState(() => localStorage.getItem(`comp-${id}`) === '1')
  const [creativeReady, setCreativeReady] = useState(() => localStorage.getItem(`creative-${id}`) === '1')
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    if (!competitorsReady) {
      timers.push(setTimeout(() => { localStorage.setItem(`comp-${id}`, '1'); setCompetitorsReady(true) }, 10000))
    }
    if (!creativeReady) {
      timers.push(setTimeout(() => {
        localStorage.setItem(`creative-${id}`, '1')
        setCreativeReady(true)
        fetch(`http://localhost:8000/submissions/${id}/creative-ready`, { method: 'PATCH' }).catch(() => {})
      }, 18000))
    }
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    fetch('http://localhost:8000/submissions')
      .then(r => r.json())
      .then((data: Submission[]) => {
        const found = data.find(s => s.id === Number(id))
        setSubmission(found ?? null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return <div className="admin-layout"><div className="admin-empty">Loading...</div></div>
  if (!submission) return <div className="admin-layout"><div className="admin-empty">Submission not found.</div></div>

  return (
    <div className="admin-layout">
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <button className="admin-back-btn" onClick={() => navigate('/')}>← Back</button>
          <span className="admin-logo">Moonstack Admin</span>
        </div>
        <div className="admin-status-row">
          {STATUSES.map(s => (
            <button
              key={s}
              className={`admin-status-btn ${status === s ? 'active' : ''}`}
              onClick={() => setStatus(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </header>

      <div className="detail-body">
        {/* Left: company info */}
        <aside className="detail-sidebar">
          <h3 className="admin-section-title">Submission Info</h3>

          <div className="detail-info-block">
            <span className="admin-label">URL</span>
            <a className="detail-url" href={submission.url} target="_blank" rel="noopener noreferrer">{submission.url}</a>
          </div>
          <div className="detail-info-block">
            <span className="admin-label">Submitted</span>
            <span className="admin-value">{new Date(submission.submitted_at).toLocaleString()}</span>
          </div>
          <div className="detail-info-block">
            <span className="admin-label">Company</span>
            <span className="admin-value">{submission.company_name}</span>
          </div>
          <div className="detail-info-block">
            <span className="admin-label">Type</span>
            <span className="admin-value">{submission.company_type}</span>
          </div>
          <div className="detail-info-block">
            <span className="admin-label">Colors</span>
            <div className="admin-tags">
              {submission.colors.map(c => <span key={c} className="admin-tag">{c}</span>)}
            </div>
          </div>
          <div className="detail-info-block">
            <span className="admin-label">Products</span>
            <div className="admin-tags">
              {submission.products.map(p => <span key={p} className="admin-tag">{p}</span>)}
            </div>
          </div>
        </aside>

        {/* Right: workspace */}
        <main className="detail-main">
          <div className="agent-box">
            <div className="agent-box-header">
              <span className="agent-dot agent-dot-done" />
              <span className="agent-title">Brand Agent</span>
            </div>
            <div className="agent-result">
              <div className="agent-result-row">
                <span className="admin-label">Company</span>
                <span className="agent-result-value">{submission.company_name}</span>
              </div>
              <div className="agent-result-row">
                <span className="admin-label">Type</span>
                <span className="agent-result-value">{submission.company_type}</span>
              </div>
              <div className="agent-result-row">
                <span className="admin-label">Main Colors</span>
                <div className="admin-tags">
                  {submission.colors.map(c => <span key={c} className="admin-tag">{c}</span>)}
                </div>
              </div>
              <div className="agent-result-row">
                <span className="admin-label">Products</span>
                <div className="admin-tags">
                  {submission.products.map(p => <span key={p} className="admin-tag">{p}</span>)}
                </div>
              </div>
            </div>
          </div>

          <div className="agent-box">
            <div className="agent-box-header">
              <span className={`agent-dot ${competitorsReady ? 'agent-dot-done' : 'agent-dot-loading'}`} />
              <span className="agent-title">Competitive Analysis Agent</span>
            </div>
            {!competitorsReady ? (
              <div className="agent-loading-row">
                <span className="agent-spinner" />
                <span className="agent-loading-text">Analyzing competitors...</span>
              </div>
            ) : (
              <div className="agent-competitors">
                <div className="competitor-name-list">
                  {COMPETITORS.map(c => (
                    <span key={c.name} className="competitor-name-tag">{c.name}</span>
                  ))}
                </div>
                <span className="admin-label" style={{ marginTop: '0.5rem' }}>Ad Creatives</span>
                <div className="competitor-img-grid">
                  {COMPETITORS.filter(c => c.img).map(c => (
                    <div key={c.name} className="competitor-img-card">
                      <img src={c.img!} alt={c.name} className="competitor-ad-img clickable-img" onClick={() => setLightboxSrc(c.img!)} />
                      <span className="competitor-img-label">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="agent-box">
            <div className="agent-box-header">
              <span className={`agent-dot ${creativeReady ? 'agent-dot-done' : competitorsReady ? 'agent-dot-loading' : ''}`} />
              <span className="agent-title">Creative Agent</span>
            </div>
            {!competitorsReady && (
              <p className="agent-placeholder">Waiting for competitive analysis...</p>
            )}
            {competitorsReady && !creativeReady && (
              <div className="agent-loading-row">
                <span className="agent-spinner" />
                <span className="agent-loading-text">Generating ad creatives...</span>
              </div>
            )}
            {creativeReady && (
              <div className="creative-ad-grid">
                {ADS.map((src, i) => (
                  <img key={i} src={src} alt={`Ad ${i + 1}`} className="creative-ad-img clickable-img" onClick={() => setLightboxSrc(src)} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {lightboxSrc && (
        <div className="lightbox-overlay" onClick={() => setLightboxSrc(null)}>
          <img src={lightboxSrc} className="lightbox-img" alt="Expanded" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  )
}

export default SubmissionDetail
