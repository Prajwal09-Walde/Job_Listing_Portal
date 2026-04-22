import { Link } from 'react-router-dom';
import { Home, Frown } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 24px' }}>
      <div style={{ fontSize: '8rem', fontWeight: 900, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1, marginBottom: '16px' }}>
        404
      </div>
      <Frown size={48} color="var(--text-muted)" style={{ marginBottom: '20px' }} />
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>Page Not Found</h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '32px', lineHeight: 1.7 }}>
        Oops! The page you're looking for doesn't exist. It may have been moved or deleted.
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary btn-lg">
          <Home size={18} /> Go Home
        </Link>
        <Link to="/jobs" className="btn btn-secondary btn-lg">
          Browse Jobs
        </Link>
      </div>
    </div>
  );
}
