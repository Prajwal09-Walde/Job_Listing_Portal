import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getJob, applyToJob, getMyApplications } from '../api';
import { useAuth } from '../context/AuthContext';
import { MapPin, Clock, DollarSign, Briefcase, Building2, Users, AlertCircle, CheckCircle, X, ArrowLeft, ExternalLink } from 'lucide-react';

const EXP_LABELS = { entry: 'Entry Level', mid: 'Mid Level', senior: 'Senior', lead: 'Lead', executive: 'Executive' };
const TYPE_COLORS = { 'full-time': 'badge-success', 'part-time': 'badge-info', 'remote': 'badge-primary', 'contract': 'badge-warning', 'internship': 'badge-secondary' };

function timeAgo(d) {
  const days = Math.floor((Date.now() - new Date(d)) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return `${Math.floor(days / 7)} weeks ago`;
}

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    getJob(id)
      .then(res => setJob(res.data.job))
      .catch(() => setError('Job not found'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user?.role === 'jobseeker') {
      getMyApplications()
        .then(res => {
          const applied = res.data.applications?.some(a => a.job?._id === id || a.job === id);
          setHasApplied(applied);
        })
        .catch(() => {});
    }
  }, [user, id]);

  const handleApply = async () => {
    setApplyError(''); setApplying(true);
    try {
      await applyToJob({ jobId: id, coverLetter });
      setApplySuccess(true);
      setHasApplied(true);
      setTimeout(() => setShowModal(false), 1500);
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Failed to apply. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (error) return <div style={{ padding: '80px 0', textAlign: 'center' }}><h2>{error}</h2><Link to="/jobs" className="btn btn-primary mt-4">Back to Jobs</Link></div>;

  const employer = job.employer || {};
  const salary = job.salaryMin || job.salaryMax
    ? `${job.salaryCurrency || 'USD'} ${job.salaryMin ? Math.round(job.salaryMin / 1000) + 'k' : ''} ${job.salaryMin && job.salaryMax ? '–' : ''} ${job.salaryMax ? Math.round(job.salaryMax / 1000) + 'k' : ''}`
    : null;

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: '20px', gap: '6px' }}>
            <ArrowLeft size={14} /> Back
          </button>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Building2 size={26} color="var(--accent-primary)" />
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, marginBottom: '6px' }}>{job.title}</h1>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Building2 size={14} /> {job.company}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={14} /> {job.location}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14} /> {timeAgo(job.createdAt)}</span>
                <span className={`badge ${TYPE_COLORS[job.jobType] || 'badge-secondary'}`} style={{ textTransform: 'capitalize' }}>{job.jobType}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px', alignItems: 'start' }}>
        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Quick info chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {[
              { icon: Briefcase, text: EXP_LABELS[job.experienceLevel] || job.experienceLevel },
              salary && { icon: DollarSign, text: salary, color: 'var(--accent-success)' },
              { icon: Users, text: `${job.applicationCount || 0} applicants` },
            ].filter(Boolean).map(({ icon: Icon, text, color }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '8px 14px', fontSize: '0.875rem', color: color || 'var(--text-secondary)' }}>
                <Icon size={14} /> {text}
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="card">
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '16px', color: 'var(--text-primary)' }}>Job Description</h2>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>{job.description}</div>
          </div>

          {job.qualifications && (
            <div className="card">
              <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '16px' }}>Qualifications</h2>
              <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>{job.qualifications}</div>
            </div>
          )}

          {job.responsibilities && (
            <div className="card">
              <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '16px' }}>Responsibilities</h2>
              <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>{job.responsibilities}</div>
            </div>
          )}

          {job.skills?.length > 0 && (
            <div className="card">
              <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '16px' }}>Required Skills</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {job.skills.map((s, i) => <span key={i} className="skill-chip">{s}</span>)}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '90px' }}>
          {/* Apply Card */}
          <div className="card" style={{ textAlign: 'center' }}>
            {hasApplied ? (
              <div>
                <CheckCircle size={32} color="var(--accent-success)" style={{ margin: '0 auto 12px' }} />
                <p style={{ color: 'var(--accent-success)', fontWeight: 700, marginBottom: '4px' }}>Application Submitted!</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Track it in your dashboard</p>
                <Link to="/dashboard" className="btn btn-secondary btn-sm" style={{ marginTop: '14px', width: '100%', justifyContent: 'center' }}>View Dashboard</Link>
              </div>
            ) : !user ? (
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '16px' }}>Sign in to apply for this job</p>
                <Link to="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} id="apply-login-btn">Sign In to Apply</Link>
              </div>
            ) : user.role === 'employer' ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Employers cannot apply to jobs</p>
            ) : (
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>Ready to Apply?</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Submit your application with a cover letter</p>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowModal(true)} id="apply-btn">
                  Apply Now
                </button>
              </div>
            )}
          </div>

          {/* Company Card */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '0.95rem' }}>About the Company</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '42px', height: '42px', background: 'rgba(99,102,241,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={20} color="var(--accent-primary)" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{employer.companyName || job.company}</div>
                {employer.industry && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{employer.industry}</div>}
              </div>
            </div>
            {employer.companyDescription && <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '12px' }}>{employer.companyDescription}</p>}
            {employer.location && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={12} /> {employer.location}</p>}
            {employer.companyWebsite && <a href={employer.companyWebsite} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--accent-primary)', fontSize: '0.8rem', marginTop: '10px' }}><ExternalLink size={12} /> Visit Website</a>}
          </div>

          {/* Deadline */}
          {job.applicationDeadline && (
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 'var(--radius-md)', padding: '14px', fontSize: '0.82rem', color: '#fcd34d' }}>
              ⏰ Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Apply for {job.title}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>

            {applySuccess ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <CheckCircle size={48} color="var(--accent-success)" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>Application Submitted!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Good luck! You can track it in your dashboard.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {applyError && <div className="alert alert-error"><AlertCircle size={15} /> {applyError}</div>}

                <div className="form-group">
                  <label className="form-label" htmlFor="cover-letter">Cover Letter <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                  <textarea
                    id="cover-letter"
                    className="form-textarea"
                    placeholder="Tell the employer why you're a great fit for this role..."
                    rows={6}
                    value={coverLetter}
                    onChange={e => setCoverLetter(e.target.value)}
                  />
                  <span className="form-hint">{coverLetter.length}/2000 characters</span>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                  <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleApply} disabled={applying} id="confirm-apply-btn">
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
