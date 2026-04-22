import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile, uploadResume } from '../api';
import { User, MapPin, Phone, Globe, Briefcase, Upload, CheckCircle, AlertCircle, Plus, X, Building2, GraduationCap, Save } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: '', headline: '', bio: '', location: '', phone: '', website: '',
    experience: '', education: '',
    companyName: '', companyDescription: '', companyWebsite: '', companySize: '', industry: '',
  });

  useEffect(() => {
    getProfile().then(res => {
      const u = res.data.user;
      setProfile(u);
      setSkills(u.skills || []);
      setForm({
        name: u.name || '', headline: u.headline || '', bio: u.bio || '',
        location: u.location || '', phone: u.phone || '', website: u.website || '',
        experience: u.experience || '', education: u.education || '',
        companyName: u.companyName || '', companyDescription: u.companyDescription || '',
        companyWebsite: u.companyWebsite || '', companySize: u.companySize || '',
        industry: u.industry || '',
      });
    }).catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills([...skills, s]);
    setSkillInput('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      const res = await updateProfile({ ...form, skills });
      setProfile(res.data.user);
      updateUser(res.data.user);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    setUploading(true); setError(''); setSuccess('');
    try {
      const fd = new FormData();
      fd.append('resume', resumeFile);
      const res = await uploadResume(fd);
      setProfile(p => ({ ...p, resume: res.data.resume, resumeOriginalName: res.data.resumeOriginalName }));
      setSuccess('Resume uploaded successfully!');
      setResumeFile(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h1 className="section-title">My <span className="gradient-text">Profile</span></h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Manage your personal and professional information</p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px', maxWidth: '800px' }}>
        {success && <div className="alert alert-success" style={{ marginBottom: '20px' }}><CheckCircle size={15} /> {success}</div>}
        {error && <div className="alert alert-error" style={{ marginBottom: '20px' }}><AlertCircle size={15} /> {error}</div>}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Personal Info */}
          <div className="card">
            <h2 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="var(--accent-primary)" /> Personal Information
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" htmlFor="p-name">Full Name</label>
                <input id="p-name" name="name" type="text" className="form-input" value={form.name} onChange={handleChange} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" htmlFor="p-headline">Professional Headline</label>
                <input id="p-headline" name="headline" type="text" className="form-input" placeholder="e.g. Senior React Developer" value={form.headline} onChange={handleChange} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" htmlFor="p-bio">Bio</label>
                <textarea id="p-bio" name="bio" className="form-textarea" rows={4} placeholder="Tell employers about yourself..." value={form.bio} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="p-location"><MapPin size={13} style={{ display: 'inline' }} /> Location</label>
                <input id="p-location" name="location" type="text" className="form-input" placeholder="City, Country" value={form.location} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="p-phone"><Phone size={13} style={{ display: 'inline' }} /> Phone</label>
                <input id="p-phone" name="phone" type="tel" className="form-input" placeholder="+1 555 000 0000" value={form.phone} onChange={handleChange} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" htmlFor="p-website"><Globe size={13} style={{ display: 'inline' }} /> Website / Portfolio</label>
                <input id="p-website" name="website" type="url" className="form-input" placeholder="https://yourportfolio.com" value={form.website} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Job Seeker sections */}
          {profile?.role === 'jobseeker' && (
            <>
              <div className="card">
                <h2 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Briefcase size={18} color="var(--accent-primary)" /> Experience & Education
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="p-exp">Work Experience</label>
                    <textarea id="p-exp" name="experience" className="form-textarea" rows={3} placeholder="Describe your work history..." value={form.experience} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="p-edu"><GraduationCap size={13} style={{ display: 'inline' }} /> Education</label>
                    <textarea id="p-edu" name="education" className="form-textarea" rows={3} placeholder="Degrees, certifications, courses..." value={form.education} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="card">
                <h2 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '1.05rem' }}>Skills</h2>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input type="text" className="form-input" placeholder="Add a skill (press Enter)" value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                    id="profile-skill-input" />
                  <button type="button" className="btn btn-secondary" onClick={addSkill} id="profile-add-skill-btn"><Plus size={16} /></button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {skills.map((s, i) => (
                    <span key={i} className="skill-chip">
                      {s} <button className="skill-chip-remove" type="button" onClick={() => setSkills(skills.filter((_, idx) => idx !== i))}><X size={11} /></button>
                    </span>
                  ))}
                  {skills.length === 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No skills added yet</span>}
                </div>
              </div>

              <div className="card">
                <h2 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Upload size={18} color="var(--accent-primary)" /> Resume
                </h2>
                {profile?.resumeOriginalName && (
                  <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'var(--accent-success)' }}>
                    <CheckCircle size={15} /> Current: <strong>{profile.resumeOriginalName}</strong>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <input type="file" accept=".pdf,.doc,.docx" id="resume-file-input"
                    onChange={e => setResumeFile(e.target.files[0])}
                    style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '8px', color: 'var(--text-primary)', fontSize: '0.875rem' }} />
                  <button type="button" className="btn btn-secondary" onClick={handleResumeUpload} disabled={!resumeFile || uploading} id="upload-resume-btn">
                    <Upload size={15} /> {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
                <p className="form-hint" style={{ marginTop: '6px' }}>PDF, DOC, DOCX — max 5MB</p>
              </div>
            </>
          )}

          {/* Employer sections */}
          {profile?.role === 'employer' && (
            <div className="card">
              <h2 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={18} color="var(--accent-primary)" /> Company Information
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label" htmlFor="p-company">Company Name</label>
                  <input id="p-company" name="companyName" type="text" className="form-input" value={form.companyName} onChange={handleChange} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label" htmlFor="p-company-desc">Company Description</label>
                  <textarea id="p-company-desc" name="companyDescription" className="form-textarea" rows={4} value={form.companyDescription} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="p-industry">Industry</label>
                  <input id="p-industry" name="industry" type="text" className="form-input" placeholder="Technology, Finance..." value={form.industry} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="p-company-size">Company Size</label>
                  <select id="p-company-size" name="companySize" className="form-select" value={form.companySize} onChange={handleChange}>
                    <option value="">Select size</option>
                    {['1-10', '11-50', '51-200', '201-500', '500-1000', '1000+'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label" htmlFor="p-company-web">Company Website</label>
                  <input id="p-company-web" name="companyWebsite" type="url" className="form-input" placeholder="https://company.com" value={form.companyWebsite} onChange={handleChange} />
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={saving} id="save-profile-btn">
            <Save size={18} /> {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
