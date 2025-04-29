'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { JobType } from '@/lib/database.types';
import Link from 'next/link';

interface Job {
  id: number;
  title: string;
  company: string;
  description: string;
  location: string;
  type: JobType;
  created_at: string;
}

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<JobType | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });

        if (locationFilter) {
          query = query.ilike('location', `%${locationFilter}%`);
        }
        if (typeFilter) {
          query = query.eq('type', typeFilter);
        }

        const { data, error } = await query;

        if (error) throw error;
        setJobs(data || []);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred while fetching jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [locationFilter, typeFilter]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <h1 className="page-title">Job Listings</h1>

        {/* Filter Controls */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="form-label">
                Filter by Location
              </label>
              <input
                type="text"
                id="location"
                placeholder="Enter city or country..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <label htmlFor="type" className="form-label">
                Filter by Job Type
              </label>
              <select
                id="type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as JobType | '')}
                className="form-input"
              >
                <option value="">All Types</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            <p className="mt-2 text-text-secondary">Loading jobs...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 p-4 rounded-md mb-8">
            {error}
          </div>
        )}

        {/* Jobs List */}
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="card hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-text-primary mb-2">{job.title}</h2>
              <p className="text-text-secondary mb-1">{job.company}</p>
              <p className="text-text-muted mb-4">{job.location}</p>
              <div className="flex justify-between items-center">
                <span className="bg-secondary text-text-secondary px-3 py-1 rounded-full text-sm">
                  {job.type}
                </span>
                <Link 
                  href={`/jobs/${job.id}`} 
                  className="text-primary hover:text-blue-700 font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && jobs.length === 0 && (
          <div className="card text-center py-8">
            <p className="text-text-secondary">No jobs found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
