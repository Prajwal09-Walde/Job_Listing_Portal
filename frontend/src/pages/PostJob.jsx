import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createJob } from '../api';
import { useAuth } from '../context/AuthContext';
import { Briefcase, MapPin, DollarSign, Plus, X, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

const JOB_TYPES = ['full-time', 'part-time', 'remote', 'contract', 'internship'];
const EXP_LEVELS = [{ value: 'entry', label: 'Entry Level' }, { value: 'mid', label: 'Mid Level' }, { value: 'senior', label: 'Senior' }, { value: 'lead', label: 'Lead' }, { value: 'executive', label: 'Executive' }];

export default function PostJob() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { jobType: 'full-time', experienceLevel: 'mid', salaryCurrency: 'USD' }
  });
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) { setSkills([...skills, s]); }
    setSkillInput('');
  };

  const onSubmit = async (data) => {
    setApiError(''); setLoading(true);
    try {
      await createJob({ ...data, skills });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: '16px' }}>
            <ArrowLeft size={14} /> Back
          </button>
          <h1 className="section-title">Post a <span className="gradient-text">New Job</span></h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Fill in the details below to attract the right candidates</p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px', maxWidth: '800px' }}>
        {success && (
          <div className="alert alert-success" style={{ marginBottom: '24px' }}>
            <CheckCircle size={16} /> Job posted successfully! Redirecting to dashboard...
          </div>
        )}
        {apiError && (
          <div className="alert alert-error" style={{ marginBottom: '24px' }}>
            <AlertCircle size={16} /> {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Basic Info */}
          <div className="card">
            <h2 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={18} color="var(--accent-primary)" /> Basic Information
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" htmlFor="job-title">Job Title <span>*</span></label>
                <input id="job-title" type="text" className="form-input" placeholder="e.g. Senior React Developer"
                  {...register('title', { required: 'Job title is required' })} />
                {errors.title && <span className="form-error">{errors.title.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="job-type">Job Type</label>
                <select id="job-type" className="form-select" {...register('jobType')}>
                  {JOB_TYPES.map(t => <option key={t} value={t} style={{ textTransform: 'capitalize' }}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="exp-level">Experience Level</label>
                <select id="exp-level" className="form-select" {...register('experienceLevel')}>
                  {EXP_LEVELS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" htmlFor="job-location">Location <span>*</span></label>
                <div className="input-icon-wrapper">
                  <MapPin size={16} className="input-icon" />
                  <input id="job-location" type="text" className="form-input" placeholder="e.g. New York, NY or Remote"
                    {...register('location', { required: 'Location is required' })} />
                </div>
                {errors.location && <span className="form-error">{errors.location.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="job-industry">Industry</label>
                <input id="job-industry" type="text" className="form-input" placeholder="e.g. Technology" {...register('industry')} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="job-deadline">Application Deadline</label>
                <input id="job-deadline" type="date" className="form-input" {...register('applicationDeadline')} />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <h2 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '1.05rem' }}>Job Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="job-desc">Job Description <span>*</span></label>
                <textarea id="job-desc" className="form-textarea" rows={6} placeholder="Describe the role, what the candidate will do, team culture..."
                  {...register('description', { required: 'Description is required' })} />
                {errors.description && <span className="form-error">{errors.description.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="job-qual">Qualifications</label>
                <textarea id="job-qual" className="form-textarea" rows={4} placeholder="Required education, certifications, or experience..."
                  {...register('qualifications')} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="job-resp">Responsibilities</label>
                <textarea id="job-resp" className="form-textarea" rows={4} placeholder="Day-to-day responsibilities and duties..."
                  {...register('responsibilities')} />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <h2 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '1.05rem' }}>Required Skills</h2>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input type="text" className="form-input" placeholder="Add a skill (press Enter or click +)" value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                id="skill-input"
              />
              <button type="button" className="btn btn-secondary" onClick={addSkill} id="add-skill-btn"><Plus size={16} /></button>
            </div>
            {skills.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {skills.map((s, i) => (
                  <span key={i} className="skill-chip">
                    {s}
                    <button className="skill-chip-remove" onClick={() => setSkills(skills.filter((_, idx) => idx !== i))} type="button"><X size={11} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Salary */}
          <div className="card">
            <h2 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign size={18} color="var(--accent-success)" /> Salary Range (optional)
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="salary-currency">Currency</label>
                <select id="salary-currency" className="form-select" {...register('salaryCurrency')}>
                  {['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="salary-min">Minimum</label>
                <input id="salary-min" type="number" className="form-input" placeholder="e.g. 50000" {...register('salaryMin', { valueAsNumber: true })} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="salary-max">Maximum</label>
                <input id="salary-max" type="number" className="form-input" placeholder="e.g. 80000" {...register('salaryMax', { valueAsNumber: true })} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading} id="post-job-submit-btn">
              {loading ? 'Posting...' : '🚀 Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
