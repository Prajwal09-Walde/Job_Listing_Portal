import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Briefcase, Building2 } from 'lucide-react';

const JOB_TYPE_COLORS = {
  'full-time': 'badge-success',
  'part-time': 'badge-info',
  'remote': 'badge-primary',
  'contract': 'badge-warning',
  'internship': 'badge-secondary',
};

const EXP_LABELS = {
  entry: 'Entry Level',
  mid: 'Mid Level',
  senior: 'Senior',
  lead: 'Lead',
  executive: 'Executive',
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function JobCard({ job }) {
  const employer = job.employer || {};
  const companyName = job.company || employer.companyName || employer.name || 'Company';
  const badgeClass = JOB_TYPE_COLORS[job.jobType] || 'badge-secondary';

  const formatSalary = () => {
    if (!job.salaryMin && !job.salaryMax) return null;
    const cur = job.salaryCurrency || 'USD';
    const fmt = (n) => n >= 1000 ? `${Math.round(n / 1000)}k` : n;
    if (job.salaryMin && job.salaryMax) return `${cur} ${fmt(job.salaryMin)} – ${fmt(job.salaryMax)}`;
    if (job.salaryMin) return `From ${cur} ${fmt(job.salaryMin)}`;
    return `Up to ${cur} ${fmt(job.salaryMax)}`;
  };

  return (
    <Link
      to={`/jobs/${job._id}`}
      className="job-card"
      style={{
        display: 'block',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        textDecoration: 'none',
        transition: 'var(--transition)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
          <div style={{
            width: '46px', height: '46px', flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Building2 size={20} color="var(--accent-primary)" />
          </div>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {job.title}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {companyName}
            </p>
          </div>
        </div>
        <span className={`badge ${badgeClass}`} style={{ flexShrink: 0, textTransform: 'capitalize' }}>
          {job.jobType}
        </span>
      </div>

      {/* Meta info */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <MapPin size={13} /> {job.location}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Briefcase size={13} /> {EXP_LABELS[job.experienceLevel] || job.experienceLevel}
        </span>
        {formatSalary() && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--accent-success)' }}>
            <DollarSign size={13} /> {formatSalary()}
          </span>
        )}
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
          <Clock size={13} /> {timeAgo(job.createdAt)}
        </span>
      </div>

      {/* Skills */}
      {job.skills?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {job.skills.slice(0, 5).map((skill, i) => (
            <span key={i} className="skill-chip">{skill}</span>
          ))}
          {job.skills.length > 5 && (
            <span className="skill-chip" style={{ opacity: 0.6 }}>+{job.skills.length - 5}</span>
          )}
        </div>
      )}
    </Link>
  );
}
