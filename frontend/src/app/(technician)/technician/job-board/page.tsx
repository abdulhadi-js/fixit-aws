'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../../hooks/useAuth';

import { MapPin, Calendar, Clock, Filter, Search, CheckCircle2 } from 'lucide-react';

const MOCK_JOBS = [
  {
    id: '1',
    title: 'Install 3 Ceiling Fans in Living Room',
    category: 'ELECTRICAL',
    budget: '5000',
    date: '2026-07-06',
    time: '14:00',
    address: 'DHA Phase 5',
    city: 'Lahore',
    description: 'I need three standard ceiling fans installed. The wiring is already there, just need the fans mounted and connected.',
    posted_at: '2 hours ago'
  },
  {
    id: '2',
    title: 'Kitchen Sink Pipe Leaking',
    category: 'PLUMBING',
    budget: '2500',
    date: '2026-07-05',
    time: '10:00',
    address: 'Gulberg III',
    city: 'Lahore',
    description: 'The U-pipe under the kitchen sink is leaking continuously. Need it replaced or sealed.',
    posted_at: '5 hours ago'
  },
  {
    id: '3',
    title: 'Full AC Service (2 Tons)',
    category: 'HVAC',
    budget: '3500',
    date: '2026-07-07',
    time: 'Any Time',
    address: 'Bahria Town',
    city: 'Lahore',
    description: 'Dawlance 2-ton AC needs a full service. Not cooling properly.',
    posted_at: '1 day ago'
  },
];

export default function JobBoardPage() {
  const { role } = useAuth();
  const [filter, setFilter] = useState('ALL');
  const [acceptedJob, setAcceptedJob] = useState<string | null>(null);
  const [cities, setCities] = useState<string[]>(['Lahore', 'Islamabad', 'Karachi']);
  const [loadingCities, setLoadingCities] = useState(true);

  useEffect(() => {
    async function fetchCities() {
      try {
        const res = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country: 'pakistan' })
        });
        const data = await res.json();
        if (data && !data.error && Array.isArray(data.data)) {
          setCities(data.data);
        }
      } catch (err) {
        console.error('Failed to load cities', err);
      } finally {
        setLoadingCities(false);
      }
    }
    fetchCities();
  }, []);

  const handleAccept = (id: string) => {
    setAcceptedJob(id);
    setTimeout(() => {
      alert('Job accepted! It has been moved to your Dashboard Agenda.');
      setAcceptedJob(null);
    }, 1000);
  };

  const filteredJobs = filter === 'ALL' ? MOCK_JOBS : MOCK_JOBS.filter(j => j.category === filter);

  return (
    <div className="bg-canvas text-on-surface antialiased font-body-md min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-dot-pattern [mask-image:radial-gradient(ellipse_at_top,white,transparent_80%)] pointer-events-none opacity-60"></div>
      
      <div className="relative z-10 flex flex-col min-h-screen">

        
        <main className="flex-1 max-w-7xl w-full mx-auto px-margin-x py-12 flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar / Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-surface-high border border-border-soft rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filters
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">Category</label>
                  <div className="flex flex-col gap-2">
                    {['ALL', 'ELECTRICAL', 'PLUMBING', 'HVAC', 'MAINTENANCE'].map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${filter === cat ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-surface-muted text-text-secondary'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border-soft">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">Location</label>
                  <select disabled={loadingCities} className="w-full bg-canvas border border-border-soft rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary disabled:opacity-50">
                    {loadingCities ? (
                      <option>Loading cities...</option>
                    ) : (
                      cities.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Job Feed */}
          <div className="flex-1">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="font-display-md text-3xl font-bold">Open Jobs</h1>
                <p className="text-text-secondary">Find and accept custom service requests.</p>
              </div>
              <div className="relative w-64 hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input type="text" placeholder="Search jobs..." className="w-full pl-9 pr-4 py-2 bg-surface-high border border-border-soft rounded-full text-sm focus:outline-none focus:border-primary" />
              </div>
            </div>

            <div className="space-y-4">
              {filteredJobs.map((job, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={job.id} 
                  className="bg-surface-high border border-border-soft rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    
                    {/* Left: Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold px-2 py-1 bg-surface-muted rounded-md text-text-secondary">
                          {job.category}
                        </span>
                        <span className="text-xs text-text-secondary">{job.posted_at}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                      <p className="text-text-secondary text-sm mb-4 line-clamp-2">{job.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                        <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.address}, {job.city}</div>
                        <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {job.date}</div>
                        <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.time}</div>
                      </div>
                    </div>

                    {/* Right: Budget & Action */}
                    <div className="flex flex-col items-start md:items-end justify-between border-t md:border-t-0 md:border-l border-border-soft pt-4 md:pt-0 md:pl-6 min-w-[150px]">
                      <div className="mb-4 md:mb-0">
                        <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">Customer Budget</p>
                        <p className="text-2xl font-bold text-green-600">Rs. {job.budget}</p>
                      </div>
                      
                      <button 
                        onClick={() => handleAccept(job.id)}
                        disabled={acceptedJob === job.id}
                        className={`w-full px-4 py-2 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 ${acceptedJob === job.id ? 'bg-green-100 text-green-700' : 'bg-primary text-on-primary hover:bg-accent-hover'}`}
                      >
                        {acceptedJob === job.id ? <><CheckCircle2 className="w-4 h-4" /> Accepted</> : 'Accept Job'}
                      </button>
                    </div>

                  </div>
                </motion.div>
              ))}
              
              {filteredJobs.length === 0 && (
                <div className="text-center py-12 bg-surface-high border border-border-soft rounded-2xl">
                  <p className="text-text-secondary">No open jobs found in this category.</p>
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
