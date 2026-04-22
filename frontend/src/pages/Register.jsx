import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../api';
import { Briefcase, Mail, Lock, User, Eye, EyeOff, AlertCircle, Building2 } from 'lucide-react';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { role: 'jobseeker' } });
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const role = watch('role');

  const onSubmit = async (data) => {
    setApiError('');
    setLoading(true);
    try {
      const res = await registerUser(data);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 70%), var(--bg-primary)' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', background: 'var(--gradient-primary)', borderRadius: '16px', marginBottom: '16px', boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}>
            <Briefcase size={26} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>Create Account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Join thousands of professionals on JobPortal</p>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '20px', padding: '36px', backdropFilter: 'blur(20px)' }}>
          {apiError && (
            <div className="alert alert-error" style={{ marginBottom: '20px' }}>
              <AlertCircle size={16} /> {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Role Selector */}
            <div className="form-group">
              <label className="form-label">I am a <span>*</span></label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { value: 'jobseeker', icon: User, label: 'Job Seeker', desc: 'Looking for work' },
                  { value: 'employer', icon: Building2, label: 'Employer', desc: 'Hiring talent' },
                ].map(({ value, icon: Icon, label, desc }) => (
                  <label key={value} style={{ cursor: 'pointer' }}>
                    <input type="radio" value={value} {...register('role')} style={{ display: 'none' }} id={`role-${value}`} />
                    <div style={{
                      padding: '16px', borderRadius: 'var(--radius-md)', textAlign: 'center',
                      border: `2px solid ${role === value ? 'var(--accent-primary)' : 'var(--border)'}`,
                      background: role === value ? 'rgba(99,102,241,0.1)' : 'var(--bg-card)',
                      transition: 'var(--transition)',
                    }}>
                      <Icon size={22} color={role === value ? 'var(--accent-primary)' : 'var(--text-muted)'} style={{ margin: '0 auto 6px' }} />
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: role === value ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Full Name <span>*</span></label>
              <div className="input-icon-wrapper">
                <User size={16} className="input-icon" />
                <input id="reg-name" type="text" className="form-input" placeholder="John Doe"
                  {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Minimum 2 characters' } })} />
              </div>
              {errors.name && <span className="form-error">{errors.name.message}</span>}
            </div>

            {/* Company Name (employer only) */}
            {role === 'employer' && (
              <div className="form-group">
                <label className="form-label" htmlFor="reg-company">Company Name <span>*</span></label>
                <div className="input-icon-wrapper">
                  <Building2 size={16} className="input-icon" />
                  <input id="reg-company" type="text" className="form-input" placeholder="Acme Corp"
                    {...register('companyName', { required: role === 'employer' ? 'Company name is required' : false })} />
                </div>
                {errors.companyName && <span className="form-error">{errors.companyName.message}</span>}
              </div>
            )}

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email Address <span>*</span></label>
              <div className="input-icon-wrapper">
                <Mail size={16} className="input-icon" />
                <input id="reg-email" type="email" className="form-input" placeholder="you@example.com"
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} />
              </div>
              {errors.email && <span className="form-error">{errors.email.message}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password <span>*</span></label>
              <div className="input-icon-wrapper" style={{ position: 'relative' }}>
                <Lock size={16} className="input-icon" />
                <input id="reg-password" type={showPassword ? 'text' : 'password'} className="form-input" placeholder="Min. 6 characters" style={{ paddingRight: '44px' }}
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: 0 }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password.message}</span>}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px' }} disabled={loading} id="register-submit-btn">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
