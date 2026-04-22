import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Filter, X, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { getJobs } from '../api';
import JobCard from '../components/jobs/JobCard';

const JOB_TYPES = ['full-time', 'part-time', 'remote', 'contract', 'internship'];
const EXP_LEVELS = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
  { value: 'executive', label: 'Executive' },
];

export default function JobListings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || '');
  const [experienceLevel, setExperienceLevel] = useState(searchParams.get('experienceLevel') || '');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (keyword) params.keyword = keyword;
      if (location) params.location = location;
      if (jobType) params.jobType = jobType;
      if (experienceLevel) params.experienceLevel = experienceLevel;

      const res = await getJobs(params);
      setJobs(res.data.jobs || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [keyword, location, jobType, experienceLevel, page]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    const p = {};
    if (keyword) p.keyword = keyword;
    if (location) p.location = location;
    if (jobType) p.jobType = jobType;
    if (experienceLevel) p.experienceLevel = experienceLevel;
    setSearchParams(p);
  };

  const clearFilters = () => {
    setKeyword(''); setLocation('');
    setJobType(''); setExperienceLevel('');
    setPage(1); setSearchParams({});
  };

  const hasFilters = keyword || location || jobType || experienceLevel;

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h1 className="section-title">Browse <span className="gradient-text">All Jobs</span></h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>
            {total > 0 ? `${total.toLocaleString()} opportunities found` : 'Discover your next opportunity'}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginTop: '28px', flexWrap: 'wrap' }}>
            <div className="input-icon-wrapper" style={{ flex: '2', minWidth: '200px' }}>
              <Search size={16} className="input-icon" />
              <input type="text" className="form-input" placeholder="Job title, keyword..." value={keyword} onChange={e => setKeyword(e.target.value)} id="jobs-keyword-input" />
            </div>
            <div className="input-icon-wrapper" style={{ flex: '1', minWidth: '160px' }}>
              <MapPin size={16} className="input-icon" />
              <input type="text" className="form-input" placeholder="Location..." value={location} onChange={e => setLocation(e.target.value)} id="jobs-location-input" />
            </div>
            <button type="button" onClick={() => setShowFilters(!showFilters)} className="btn btn-secondary" id="toggle-filters-btn">
              <Filter size={16} /> Filters {hasFilters && <span style={{ background: 'var(--accent-primary)', color: '#fff', borderRadius: '99px', padding: '1px 6px', fontSize: '0.7rem' }}>!</span>}
            </button>
            <button type="submit" className="btn btn-primary" id="jobs-search-btn">
              <Search size={16} /> Search
            </button>
          </form>

          {/* Filter Chips */}
          {showFilters && (
            <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', animation: 'fadeIn 0.2s ease' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginRight: '8px' }}>Job Type:</span>
                {JOB_TYPES.map(type => (
                  <button key={type} onClick={() => { setJobType(jobType === type ? '' : type); setPage(1); }} style={{
                    marginRight: '6px', marginBottom: '6px', padding: '5px 12px',
                    borderRadius: '99px', border: `1px solid ${jobType === type ? 'var(--accent-primary)' : 'var(--border)'}`,
                    background: jobType === type ? 'rgba(99,102,241,0.2)' : 'var(--bg-card)',
                    color: jobType === type ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
                    transition: 'var(--transition)',
                  }}>{type}</button>
                ))}
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginRight: '8px' }}>Experience:</span>
                {EXP_LEVELS.map(({ value, label }) => (
                  <button key={value} onClick={() => { setExperienceLevel(experienceLevel === value ? '' : value); setPage(1); }} style={{
                    marginRight: '6px', marginBottom: '6px', padding: '5px 12px',
                    borderRadius: '99px', border: `1px solid ${experienceLevel === value ? 'var(--accent-primary)' : 'var(--border)'}`,
                    background: experienceLevel === value ? 'rgba(99,102,241,0.2)' : 'var(--bg-card)',
                    color: experienceLevel === value ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}>{label}</button>
                ))}
              </div>
              {hasFilters && (
                <button onClick={clearFilters} className="btn btn-danger btn-sm" id="clear-filters-btn">
                  <X size={13} /> Clear All
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Job Results */}
      <div className="container" style={{ padding: '40px 24px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {[...Array(9)].map((_, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', height: '180px' }} />
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '20px' }}>
              Showing {jobs.length} of {total} results
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {jobs.map(job => <JobCard key={job._id} job={job} />)}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="pagination">
                <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} id="prev-page-btn">
                  <ChevronLeft size={16} />
                </button>
                {[...Array(pages)].map((_, i) => (
                  <button key={i} className={`page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>
                    {i + 1}
                  </button>
                ))}
                <button className="page-btn" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} id="next-page-btn">
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon"><Briefcase size={28} /></div>
            <h3>No jobs found</h3>
            <p>Try adjusting your search filters or keywords</p>
            {hasFilters && <button className="btn btn-secondary mt-4" onClick={clearFilters}>Clear Filters</button>}
          </div>
        )}
      </div>
    </div>
  );
}
