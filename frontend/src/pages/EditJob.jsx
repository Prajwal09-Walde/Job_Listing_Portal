import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getJob, updateJob } from '../api';
import { AlertCircle, CheckCircle, ArrowLeft, Plus, X } from 'lucide-react';

const JOB_TYPES = ['full-time', 'part-time', 'remote', 'contract', 'internship'];
const EXP_LEVELS = [{ value: 'entry', label: 'Entry Level' }, { value: 'mid', label: 'Mid Level' }, { value: 'senior', label: 'Senior' }, { value: 'lead', label: 'Lead' }, { value: 'executive', label: 'Executive' }];

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getJob(id).then(res => {
      const job = res.data.job;
      reset({
        title: job.title,
        description: job.description,
        qualifications: job.qualifications,
        responsibilities: job.responsibilities,
        location: job.location,
        jobType: job.jobType,
        experienceLevel: job.experienceLevel,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        salaryCurrency: job.salaryCurrency || 'USD',
        industry: job.industry,
        applicationDeadline: job.applicationDeadline ? job.applicationDeadline.split('T')[0] : '',
        isActive: job.isActive,
      });
      setSkills(job.skills || []);
    }).catch(() => setApiError('Failed to load job'))
      .finally(() => setFetchLoading(false));
  }, [id, reset]);

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills([...skills, s]);
    setSkillInput('');
  };

  const onSubmit = async (data) => {
    setApiError(''); setLoading(true);
    try {
      await updateJob(id, { ...data, skills });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to update job.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: '16px' }}>
            <ArrowLeft size={14} /> Back
          </button>
          <h1 className="section-title">Edit <span className="gradient-text">Job Listing</span></h1>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px', maxWidth: '800px' }}>
        {success && <div className="alert alert-success" style={{ marginBottom: '20px' }}><CheckCircle size={15} /> Job updated! Redirecting...</div>}
        {apiError && <div className="alert alert-error" style={{ marginBottom: '20px' }}><AlertCircle size={15} /> {apiError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <h2 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '1.05rem' }}>Basic Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" htmlFor="edit-title">Job Title <span>*</span></label>
                <input id="edit-title" type="text" className="form-input" {...register('title', { required: 'Required' })} />
                {errors.title && <span className="form-error">{errors.title.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Job Type</label>
                <select className="form-select" {...register('jobType')}>
                  {JOB_TYPES.map(t => <option key={t} value={t} style={{ textTransform: 'capitalize' }}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Experience Level</label>
                <select className="form-select" {...register('experienceLevel')}>
                  {EXP_LEVELS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" htmlFor="edit-loc">Location <span>*</span></label>
                <input id="edit-loc" type="text" className="form-input" {...register('location', { required: 'Required' })} />
                {errors.location && <span className="form-error">{errors.location.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Industry</label>
                <input type="text" className="form-input" {...register('industry')} />
              </div>
              <div className="form-group">
                <label className="form-label">Deadline</label>
                <input type="date" className="form-input" {...register('applicationDeadline')} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
                <input type="checkbox" id="is-active" {...register('isActive')} style={{ width: '16px', height: '16px', accentColor: 'var(--accent-primary)' }} />
                <label htmlFor="is-active" className="form-label" style={{ marginBottom: 0 }}>Job is Active (accepting applications)</label>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '1.05rem' }}>Job Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-desc">Description <span>*</span></label>
                <textarea id="edit-desc" className="form-textarea" rows={5} {...register('description', { required: 'Required' })} />
                {errors.description && <span className="form-error">{errors.description.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Qualifications</label>
                <textarea className="form-textarea" rows={3} {...register('qualifications')} />
              </div>
              <div className="form-group">
                <label className="form-label">Responsibilities</label>
                <textarea className="form-textarea" rows={3} {...register('responsibilities')} />
              </div>
            </div>
          </div>

          <div className="card">
            <h2 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '1.05rem' }}>Skills</h2>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input type="text" className="form-input" placeholder="Add skill..." value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} />
              <button type="button" className="btn btn-secondary" onClick={addSkill}><Plus size={16} /></button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {skills.map((s, i) => (
                <span key={i} className="skill-chip">
                  {s} <button className="skill-chip-remove" type="button" onClick={() => setSkills(skills.filter((_, idx) => idx !== i))}><X size={11} /></button>
                </span>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '1.05rem' }}>Salary Range</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Currency</label>
                <select className="form-select" {...register('salaryCurrency')}>
                  {['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Min Salary</label>
                <input type="number" className="form-input" {...register('salaryMin', { valueAsNumber: true })} />
              </div>
              <div className="form-group">
                <label className="form-label">Max Salary</label>
                <input type="number" className="form-input" {...register('salaryMax', { valueAsNumber: true })} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading} id="update-job-btn">
              {loading ? 'Updating...' : '✅ Update Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
