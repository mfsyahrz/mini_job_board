'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { JobType } from '@/lib/database.types';

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
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Job Listings</h1>

        {/* Filter Controls */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Location
              </label>
              <input
                type="text"
                id="location"
                placeholder="Enter city or country..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Job Type
              </label>
              <select
                id="type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as JobType | '')}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
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
            <p className="mt-2 text-gray-600">Loading jobs...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Jobs List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h2>
              <p className="text-gray-600 mb-2">{job.company}</p>
              <p className="text-gray-500 mb-4">{job.location}</p>
              <div className="flex justify-between items-center">
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
                  {job.type}
                </span>
                <a
                  href={`/jobs/${job.id}`}
                  className="text-primary hover:text-blue-600 font-medium"
                >
                  View Details →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && jobs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">No jobs found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
