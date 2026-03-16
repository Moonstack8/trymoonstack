import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

const moonstackLogoBlack = '/moonstack-logo.png'

const companyInfo = {
  name: 'Basemicrobe',
  colors: ['Green', 'Gray', 'White'],
  type: 'Biotech',
  products: ['Psyllium Colon Cleanse', 'Fruit Fizz-C', 'Vegan Leather'],
}

const ADS = [1, 2, 3, 4, 5, 6].map(i => `/ads/ad${i}.png`)

function Create() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const url = searchParams.get('url') || ''
  const submissionId = searchParams.get('id')
  const [infoVisible, setInfoVisible] = useState(false)
  const [adsReady, setAdsReady] = useState(false)

  useEffect(() => {
    document.body.style.background = '#f7f8fa'
    document.body.style.color = '#000000'
    return () => {
      document.body.style.background = ''
      document.body.style.color = ''
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setInfoVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!submissionId) return
    const poll = setInterval(() => {
      fetch(`http://localhost:8000/submissions/${submissionId}`)
        .then(r => r.json())
        .then(data => {
          if (data.creative_ready) {
            setAdsReady(true)
            clearInterval(poll)
          }
        })
        .catch(() => {})
    }, 3000)
    return () => clearInterval(poll)
  }, [submissionId])

  return (
    <div className="create-layout">
      {/* Top Bar */}
      <header className="create-topbar">
        <div className="create-topbar-left">
          <button className="create-back-btn" onClick={() => navigate('/')}>
            ← Back
          </button>
          <img src={moonstackLogoBlack} alt="Moonstack" className="create-logo" />
        </div>
        <div className="create-url-pill">
          <span className="create-url-dot" />
          <span className="create-url-text">{url || 'No URL provided'}</span>
        </div>
        <div className="create-topbar-right">
          <button
            className={`create-action-btn ${!adsReady ? 'disabled' : ''}`}
            disabled={!adsReady}
            onClick={() => {
              ADS.forEach((src, i) => {
                setTimeout(() => {
                  const a = document.createElement('a')
                  a.href = src
                  a.download = `ad${i + 1}.png`
                  a.click()
                }, i * 150)
              })
            }}
          >
            Export
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="create-body">
        {/* Left Sidebar */}
        <aside className="create-sidebar">
          <h3 className="create-sidebar-title">About the Company</h3>

          <div className={`create-sidebar-content ${infoVisible ? 'visible' : ''}`}>
            <div className="create-info-block">
              <span className="create-info-label">Company Name</span>
              <span className="create-info-value">{companyInfo.name}</span>
            </div>

            <div className="create-info-block">
              <span className="create-info-label">Type</span>
              <span className="create-info-value">{companyInfo.type}</span>
            </div>

            <div className="create-info-block">
              <span className="create-info-label">Main Colors</span>
              <div className="create-color-tags">
                {companyInfo.colors.map(color => (
                  <span key={color} className="create-tag">{color}</span>
                ))}
              </div>
            </div>

            <div className="create-info-block">
              <span className="create-info-label">Products</span>
              <div className="create-product-list">
                {companyInfo.products.map(product => (
                  <span key={product} className="create-product-item">{product}</span>
                ))}
              </div>
            </div>
          </div>

          {!infoVisible && (
            <div className="create-sidebar-loading">
              <div className="create-skeleton" />
              <div className="create-skeleton short" />
              <div className="create-skeleton" />
              <div className="create-skeleton short" />
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="create-main">
          {!adsReady ? (
            <div className="create-placeholder">
              <p>Your workspace will appear here.</p>
            </div>
          ) : (
            <div className="create-ads-grid">
              {ADS.map((src, i) => (
                <img key={i} src={src} alt={`Ad ${i + 1}`} className="create-ad-img" />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Create
