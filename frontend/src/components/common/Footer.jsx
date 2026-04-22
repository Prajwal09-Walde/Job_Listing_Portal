import { Link } from 'react-router-dom';
import { Briefcase, Globe, ExternalLink, Heart, Mail } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: 'rgba(13, 17, 23, 0.95)',
      borderTop: '1px solid var(--border)',
      padding: '48px 0 24px',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '40px',
        }}>
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', textDecoration: 'none' }}>
              <div style={{
                width: '36px', height: '36px',
                background: 'var(--gradient-primary)',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff',
              }}>
                <Briefcase size={18} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>JobPortal</span>
            </Link>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.7', maxWidth: '240px' }}>
              Connecting talented professionals with the world's best companies and opportunities.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              {[Globe, ExternalLink, Mail].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: '34px', height: '34px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)',
                  transition: 'var(--transition)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-primary)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Job Seekers */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)', fontSize: '0.95rem' }}>For Job Seekers</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none' }}>
              {[['Browse Jobs', '/jobs'], ['Create Profile', '/profile'], ['Dashboard', '/dashboard'], ['Register', '/register']].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} style={{
                    color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'none',
                    transition: 'var(--transition)',
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)', fontSize: '0.95rem' }}>For Employers</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none' }}>
              {[['Post a Job', '/post-job'], ['Manage Listings', '/dashboard'], ['Find Talent', '/jobs'], ['Company Profile', '/profile']].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} style={{
                    color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'none',
                    transition: 'var(--transition)',
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Company</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none' }}>
              {['About Us', 'Privacy Policy', 'Terms of Service', 'Contact'].map((label) => (
                <li key={label}>
                  <a href="#" style={{
                    color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'none',
                    transition: 'var(--transition)',
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >{label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            © {year} JobPortal. All rights reserved.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Made with <Heart size={13} color="#ef4444" fill="#ef4444" /> for job seekers & employers
          </p>
        </div>
      </div>
    </footer>
  );
}
