import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyApplications, withdrawApplication, getMyJobs, deleteJob, getJobApplications, updateApplicationStatus } from '../api';
import { Briefcase, Building2, MapPin, Clock, Trash2, Edit, Eye, Users, ChevronDown, ChevronUp, CheckCircle, AlertCircle, X } from 'lucide-react';

const STATUS_COLORS = { pending: 'badge-warning', reviewing: 'badge-info', shortlisted: 'badge-primary', rejected: 'badge-danger', hired: 'badge-success' };
const STATUS_LABELS = ['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'];

function timeAgo(d) {
  const days = Math.floor((Date.now() - new Date(d)) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days}d ago`;
  return new Date(d).toLocaleDateString();
}

// ─── Job Seeker Dashboard ──────────────────────────────────────
function SeekerDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', msg: '' });

  useEffect(() => {
    getMyApplications().then(res => setApplications(res.data.applications || []))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleWithdraw = async (id) => {
    if (!window.confirm('Withdraw this application?')) return;
    try {
      await withdrawApplication(id);
      setApplications(prev => prev.filter(a => a._id !== id));
      setFeedback({ type: 'success', msg: 'Application withdrawn.' });
    } catch (err) {
      setFeedback({ type: 'error', msg: err.response?.data?.message || 'Failed to withdraw.' });
    }
    setTimeout(() => setFeedback({ type: '', msg: '' }), 3000);
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    hired: applications.filter(a => a.status === 'hired').length,
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Total Applied', value: stats.total, color: 'var(--accent-primary)' },
          { label: 'Pending', value: stats.pending, color: 'var(--accent-warning)' },
          { label: 'Shortlisted', value: stats.shortlisted, color: 'var(--accent-secondary)' },
          { label: 'Hired', value: stats.hired, color: 'var(--accent-success)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color }}>{value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{label}</div>
          </div>
        ))}
      </div>

      {feedback.msg && (
        <div className={`alert alert-${feedback.type}`}>
          {feedback.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />} {feedback.msg}
        </div>
      )}

      {/* Applications List */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.05rem' }}>My Applications ({applications.length})</h2>
        </div>
        {applications.length === 0 ? (
          <div className="empty-state" style={{ padding: '48px 24px' }}>
            <div className="empty-state-icon"><Briefcase size={26} /></div>
            <h3>No applications yet</h3>
            <p>Start applying to jobs to see them here</p>
            <Link to="/jobs" className="btn btn-primary mt-4">Browse Jobs</Link>
          </div>
        ) : (
          <div>
            {applications.map(app => {
              const job = app.job;
              return (
                <div key={app._id} style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', gap: '16px', transition: 'var(--transition)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      <Link to={`/jobs/${job?._id}`} style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', textDecoration: 'none' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-primary)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}
                      >{job?.title || 'Unknown Job'}</Link>
                      <span className={`badge ${STATUS_COLORS[app.status] || 'badge-secondary'}`} style={{ textTransform: 'capitalize' }}>{app.status}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {job?.company && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Building2 size={12} /> {job.company}</span>}
                      {job?.location && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {job.location}</span>}
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> Applied {timeAgo(app.createdAt)}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <Link to={`/jobs/${job?._id}`} className="btn btn-secondary btn-sm" title="View job"><Eye size={13} /></Link>
                    {app.status === 'pending' && (
                      <button onClick={() => handleWithdraw(app._id)} className="btn btn-danger btn-sm" title="Withdraw application"><X size={13} /></button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Employer Dashboard ────────────────────────────────────────
function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJob, setExpandedJob] = useState(null);
  const [applications, setApplications] = useState({});
  const [loadingApps, setLoadingApps] = useState({});
  const [feedback, setFeedback] = useState({ type: '', msg: '' });

  useEffect(() => {
    getMyJobs().then(res => setJobs(res.data.jobs || []))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job listing? This cannot be undone.')) return;
    try {
      await deleteJob(id);
      setJobs(prev => prev.filter(j => j._id !== id));
      setFeedback({ type: 'success', msg: 'Job deleted successfully.' });
    } catch (err) {
      setFeedback({ type: 'error', msg: err.response?.data?.message || 'Failed to delete job.' });
    }
    setTimeout(() => setFeedback({ type: '', msg: '' }), 3000);
  };

  const toggleApplications = async (jobId) => {
    if (expandedJob === jobId) { setExpandedJob(null); return; }
    setExpandedJob(jobId);
    if (!applications[jobId]) {
      setLoadingApps(prev => ({ ...prev, [jobId]: true }));
      try {
        const res = await getJobApplications(jobId);
        setApplications(prev => ({ ...prev, [jobId]: res.data.applications || [] }));
      } catch (err) {
        setFeedback({ type: 'error', msg: 'Failed to load applications.' });
      } finally {
        setLoadingApps(prev => ({ ...prev, [jobId]: false }));
      }
    }
  };

  const handleStatusChange = async (appId, status) => {
    try {
      await updateApplicationStatus(appId, { status });
      setApplications(prev => {
        const updated = { ...prev };
        for (const jobId in updated) {
          updated[jobId] = updated[jobId].map(a => a._id === appId ? { ...a, status } : a);
        }
        return updated;
      });
      setFeedback({ type: 'success', msg: 'Status updated.' });
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Failed to update status.' });
    }
    setTimeout(() => setFeedback({ type: '', msg: '' }), 2500);
  };

  const totalApplications = jobs.reduce((sum, j) => sum + (j.applicationCount || 0), 0);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Active Jobs', value: jobs.filter(j => j.isActive).length, color: 'var(--accent-success)' },
          { label: 'Total Jobs', value: jobs.length, color: 'var(--accent-primary)' },
          { label: 'Total Applications', value: totalApplications, color: 'var(--accent-warning)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color }}>{value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{label}</div>
          </div>
        ))}
        <Link to="/post-job" className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px', textDecoration: 'none', border: '1px dashed rgba(99,102,241,0.4)', background: 'rgba(99,102,241,0.05)', transition: 'var(--transition)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.05)'}
        >
          <div style={{ fontSize: '1.5rem', color: 'var(--accent-primary)' }}>+</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600 }}>Post New Job</div>
        </Link>
      </div>

      {feedback.msg && (
        <div className={`alert alert-${feedback.type}`}>
          {feedback.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />} {feedback.msg}
        </div>
      )}

      {/* Job Listings */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.05rem' }}>My Job Listings ({jobs.length})</h2>
        </div>
        {jobs.length === 0 ? (
          <div className="empty-state" style={{ padding: '48px 24px' }}>
            <div className="empty-state-icon"><Briefcase size={26} /></div>
            <h3>No job listings yet</h3>
            <p>Create your first job posting to find talent</p>
            <Link to="/post-job" className="btn btn-primary mt-4">Post a Job</Link>
          </div>
        ) : (
          <div>
            {jobs.map(job => (
              <div key={job._id}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{job.title}</span>
                        <span className={`badge ${job.isActive ? 'badge-success' : 'badge-secondary'}`}>{job.isActive ? 'Active' : 'Closed'}</span>
                        <span className="badge badge-secondary" style={{ textTransform: 'capitalize' }}>{job.jobType}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {job.location}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={12} /> {job.applicationCount || 0} applicants</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {timeAgo(job.createdAt)}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <button onClick={() => toggleApplications(job._id)} className="btn btn-secondary btn-sm" title="View applications" id={`view-apps-${job._id}`}>
                        <Users size={13} /> {expandedJob === job._id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </button>
                      <Link to={`/jobs/${job._id}`} className="btn btn-secondary btn-sm" title="View job"><Eye size={13} /></Link>
                      <Link to={`/edit-job/${job._id}`} className="btn btn-secondary btn-sm" title="Edit job" id={`edit-job-${job._id}`}><Edit size={13} /></Link>
                      <button onClick={() => handleDelete(job._id)} className="btn btn-danger btn-sm" title="Delete job" id={`delete-job-${job._id}`}><Trash2 size={13} /></button>
                    </div>
                  </div>
                </div>

                {/* Applications Panel */}
                {expandedJob === job._id && (
                  <div style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border)', animation: 'fadeIn 0.2s ease' }}>
                    {loadingApps[job._id] ? (
                      <div style={{ padding: '24px', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
                    ) : (applications[job._id] || []).length === 0 ? (
                      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No applications yet</div>
                    ) : (
                      <div>
                        <div style={{ padding: '12px 24px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                          {applications[job._id].length} application(s)
                        </div>
                        {(applications[job._id] || []).map(app => (
                          <div key={app._id} style={{ padding: '14px 24px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '2px' }}>{app.applicant?.name}</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{app.applicant?.email}</div>
                              {app.applicant?.headline && <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{app.applicant.headline}</div>}
                              {app.coverLetter && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '400px' }}>"{app.coverLetter}"</div>}
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexShrink: 0, alignItems: 'center' }}>
                              <select
                                value={app.status}
                                onChange={e => handleStatusChange(app._id, e.target.value)}
                                style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', padding: '5px 10px', fontSize: '0.78rem', cursor: 'pointer', outline: 'none' }}
                                id={`status-${app._id}`}
                              >
                                {STATUS_LABELS.map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <div className="page-header">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h1 className="section-title">
            {user?.role === 'employer' ? (
              <><span className="gradient-text">Employer</span> Dashboard</>
            ) : (
              <><span className="gradient-text">My</span> Dashboard</>
            )}
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        {user?.role === 'employer' ? <EmployerDashboard /> : <SeekerDashboard />}
      </div>
    </div>
  );
}
