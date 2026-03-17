import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Submission } from '../App'

function SubmissionsList() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchSubmissions = () => {
    fetch('http://localhost:8000/submissions')
      .then(r => r.json())
      .then(data => { setSubmissions(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  const deleteSubmission = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    fetch(`http://localhost:8000/submissions/${id}`, { method: 'DELETE' })
      .then(() => {
        localStorage.removeItem(`comp-${id}`)
        localStorage.removeItem(`creative-${id}`)
        setSubmissions(prev => prev.filter(s => s.id !== id))
      })
      .catch(() => {})
  }

  useEffect(() => {
    fetchSubmissions()
    const interval = setInterval(fetchSubmissions, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="admin-layout">
      <header className="admin-topbar">
        <span className="admin-logo">Moonstack Admin</span>
        <span className="admin-badge">{submissions.length} submission{submissions.length !== 1 ? 's' : ''}</span>
      </header>

      <main className="admin-main">
        <h2 className="admin-section-title">Submissions</h2>

        {loading && <div className="admin-empty">Loading...</div>}

        {!loading && submissions.length === 0 && (
          <div className="admin-empty">No submissions yet. Waiting for users...</div>
        )}

        <div className="admin-cards">
          {submissions.map(s => (
            <div key={s.id} className="admin-card admin-card-clickable" onClick={() => navigate(`/submissions/${s.id}`)}>
              <div className="admin-card-header">
                <span className="admin-card-url">{s.url}</span>
                <div className="admin-card-header-right">
                  <span className="admin-card-time">{new Date(s.submitted_at).toLocaleString()}</span>
                  <button className="admin-delete-btn" onClick={(e) => deleteSubmission(e, s.id)}>Delete</button>
                </div>
              </div>
              <div className="admin-card-body">
                <div className="admin-field">
                  <span className="admin-label">Company</span>
                  <span className="admin-value">{s.company_name}</span>
                </div>
                <div className="admin-field">
                  <span className="admin-label">Type</span>
                  <span className="admin-value">{s.company_type}</span>
                </div>
                <div className="admin-field">
                  <span className="admin-label">Colors</span>
                  <div className="admin-tags">
                    {s.colors.map(c => <span key={c} className="admin-tag">{c}</span>)}
                  </div>
                </div>
                <div className="admin-field">
                  <span className="admin-label">Products</span>
                  <div className="admin-tags">
                    {s.products.map(p => <span key={p} className="admin-tag">{p}</span>)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default SubmissionsList
