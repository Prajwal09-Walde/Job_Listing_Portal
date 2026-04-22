import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, ArrowRight, Zap, Users, Building2, TrendingUp } from 'lucide-react';
import { getJobs } from '../api';
import JobCard from '../components/jobs/JobCard';

const CATEGORIES = [
  { icon: '💻', label: 'Technology', query: 'technology' },
  { icon: '📊', label: 'Finance', query: 'finance' },
  { icon: '🎨', label: 'Design', query: 'design' },
  { icon: '🏥', label: 'Healthcare', query: 'healthcare' },
  { icon: '📢', label: 'Marketing', query: 'marketing' },
  { icon: '⚖️', label: 'Legal', query: 'legal' },
  { icon: '🎓', label: 'Education', query: 'education' },
  { icon: '🔬', label: 'Engineering', query: 'engineering' },
];

const STATS = [
  { icon: Briefcase, label: 'Active Jobs', value: '10,000+' },
  { icon: Building2, label: 'Companies', value: '2,500+' },
  { icon: Users, label: 'Job Seekers', value: '500,000+' },
  { icon: TrendingUp, label: 'Hires Made', value: '50,000+' },
];

export default function Home() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    getJobs({ limit: 6 })
      .then(res => setFeaturedJobs(res.data.jobs || []))
      .catch(() => {})
      .finally(() => setLoadingJobs(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (location) params.set('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div>
      {/* ── Hero Section ── */}
      <section style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.25) 0%, transparent 60%), var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
        padding: '80px 0',
      }}>
        {/* Animated orbs */}
        {[
          { top: '10%', left: '5%', size: 300, color: 'rgba(99,102,241,0.08)' },
          { top: '60%', right: '5%', size: 250, color: 'rgba(139,92,246,0.07)' },
          { top: '40%', left: '60%', size: 200, color: 'rgba(6,182,212,0.06)' },
        ].map((orb, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: orb.size, height: orb.size,
            top: orb.top, left: orb.left, right: orb.right,
            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
            borderRadius: '50%',
            animation: `float ${4 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.8}s`,
          }} />
        ))}

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '99px', padding: '6px 16px', marginBottom: '28px' }}>
            <Zap size={14} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent-primary)' }}>New jobs posted daily</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '20px' }}>
            Find Your <span className="gradient-text">Dream Job</span><br />Today
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto 40px', lineHeight: 1.7 }}>
            Connect with top employers. Search thousands of jobs across every industry and location. Your next opportunity is one click away.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '8px',
            display: 'flex',
            gap: '8px',
            maxWidth: '720px',
            margin: '0 auto',
            flexWrap: 'wrap',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
          }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '180px' }}>
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Job title, keyword..."
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px 12px 40px',
                  background: 'transparent', border: 'none', outline: 'none',
                  color: 'var(--text-primary)', fontSize: '0.95rem',
                }}
                id="hero-keyword-input"
              />
            </div>
            <div style={{ width: '1px', background: 'var(--border)', margin: '8px 0', flexShrink: 0 }} />
            <div style={{ position: 'relative', flex: '1', minWidth: '140px' }}>
              <MapPin size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Location..."
                value={location}
                onChange={e => setLocation(e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px 12px 40px',
                  background: 'transparent', border: 'none', outline: 'none',
                  color: 'var(--text-primary)', fontSize: '0.95rem',
                }}
                id="hero-location-input"
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }} id="hero-search-btn">
              <Search size={16} /> Search Jobs
            </button>
          </form>

          {/* Popular searches */}
          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Trending:</span>
            {['React Developer', 'UI Designer', 'Data Analyst', 'DevOps'].map(term => (
              <button key={term} onClick={() => { setKeyword(term); navigate(`/jobs?keyword=${encodeURIComponent(term)}`); }} style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
                borderRadius: '99px', padding: '4px 12px', fontSize: '0.78rem',
                color: 'var(--text-secondary)', cursor: 'pointer', transition: 'var(--transition)',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-primary)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >{term}</button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '28px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '24px' }}>
            {STATS.map(({ icon: Icon, label, value }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Icon size={18} color="var(--accent-primary)" />
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{value}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section style={{ padding: '72px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 className="section-title">Browse by <span className="gradient-text">Category</span></h2>
            <p className="section-subtitle" style={{ margin: '12px auto 0' }}>Explore jobs in your field of expertise</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
            {CATEGORIES.map(({ icon, label, query }) => (
              <button key={label} onClick={() => navigate(`/jobs?keyword=${query}`)} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '24px 16px',
                cursor: 'pointer', transition: 'var(--transition)',
                textAlign: 'center', color: 'var(--text-primary)',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{icon}</div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{label}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Jobs ── */}
      <section style={{ padding: '0 0 72px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 className="section-title">Latest <span className="gradient-text">Opportunities</span></h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '8px' }}>Fresh job postings just for you</p>
            </div>
            <Link to="/jobs" className="btn btn-secondary" style={{ gap: '8px' }}>
              View All Jobs <ArrowRight size={16} />
            </Link>
          </div>

          {loadingJobs ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', height: '180px', animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          ) : featuredJobs.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
              {featuredJobs.map(job => <JobCard key={job._id} job={job} />)}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><Briefcase size={28} /></div>
              <h3>No jobs yet</h3>
              <p>Be the first to post a job listing!</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section style={{
        padding: '72px 0',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">Ready to hire <span className="gradient-text">top talent?</span></h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '16px', marginBottom: '36px', maxWidth: '520px', margin: '16px auto 36px', lineHeight: 1.7 }}>
            Post your job listing and reach thousands of qualified candidates. It's fast, easy, and effective.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg" id="cta-register-btn">
              <Zap size={18} /> Get Started Free
            </Link>
            <Link to="/jobs" className="btn btn-secondary btn-lg">
              Browse Jobs <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
