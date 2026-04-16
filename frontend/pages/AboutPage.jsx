import { useNavigate } from 'react-router-dom'

const VALUES = [
  { icon: '📖', title: 'Curated Excellence', desc: 'Every title on BookHub is chosen by our editorial team for quality, originality, and lasting impact.' },
  { icon: '🌍', title: 'Global Voices', desc: 'We actively champion authors from every culture, language, and background — amplifying stories that deserve to be heard.' },
  { icon: '⚡', title: 'Instant Everywhere', desc: 'EPUB, PDF, MOBI. Download once, read forever — on your phone, tablet, e-reader, or desktop.' },
  { icon: '🔒', title: 'Privacy Always', desc: 'We will never sell your reading habits. Your library is yours, and your data stays that way.' },
  { icon: '♻️', title: 'Sustainable Reading', desc: 'Digital books mean fewer trees felled. Every purchase on BookHub plants 10 minutes of reading in a school library.' },
  { icon: '💬', title: 'Reader Community', desc: 'Join thousands of readers discussing, reviewing, and recommending books in our growing community forums.' },
]

export default function AboutPage() {
  const navigate = useNavigate()

  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-inner">
          <p className="hero-eyebrow">Our Story</p>
          <h1>
            Built for <em>Readers,</em><br />by Readers
          </h1>
          <p className="about-hero-sub">
            BookHub started as a personal library and grew into a platform
            for every curious, passionate, and devoted reader on the planet.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="about-mission">
        <div className="mission-inner">
          <div className="mission-text">
            <span className="section-tag">Our Mission</span>
            <h2>
              Every great story<br /><em>deserves a reader</em>
            </h2>
            <p>
              We believe books are the most powerful technology ever invented.
              BookHub exists to make the world's best literature accessible,
              affordable, and beautifully delivered — to anyone, anywhere.
            </p>
            <p>
              Since 2021, we've grown from a 200-title catalogue to over 12,000
              carefully curated ebooks, and from one reader in Bangalore to
              over 50,000 members across 80 countries.
            </p>
            <button className="btn-primary" onClick={() => navigate('/store')}>
              Explore the Library
            </button>
          </div>
          <div className="mission-stats-col">
            {[
              { value: '12,000+', label: 'Books in Library' },
              { value: '50,000+', label: 'Active Readers' },
              { value: '80+', label: 'Countries Reached' },
              { value: '4.8 ★', label: 'Average Rating' },
            ].map(({ value, label }) => (
              <div key={label} className="mission-stat">
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <div className="values-inner">
          <div className="values-header">
            <span className="section-tag">What We Stand For</span>
            <h2>Our <em>Values</em></h2>
          </div>
          <div className="values-grid">
            {VALUES.map(({ icon, title, desc }) => (
              <div key={title} className="value-card">
                <span className="value-icon">{icon}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="about-cta-inner">
          <h2>
            Ready to start<br /><em>your reading journey?</em>
          </h2>
          <p>
            Join tens of thousands of readers who've made BookHub their
            home for ebooks.
          </p>
          <div className="about-cta-btns">
            <button className="btn-primary" onClick={() => navigate('/signup')}>
              Join Free Today
            </button>
            <button className="btn-ghost-light" onClick={() => navigate('/store')}>
              Browse Books
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
