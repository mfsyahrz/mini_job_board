'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { JobType } from '@/lib/database.types';
import Link from 'next/link';

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState<JobType>('Full-Time');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const { data: job, error: fetchError } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', params.id)
          .eq('created_by', user.id)
          .single();

        if (fetchError) throw fetchError;
        if (!job) throw new Error('Job not found');

        setTitle(job.title);
        setCompany(job.company);
        setDescription(job.description);
        setLocation(job.location);
        setJobType(job.type);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred while fetching the job');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [params.id, router]);

  const handleUpdateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to edit a job.');
      }

      const { error: updateError } = await supabase
        .from('jobs')
        .update({
          title,
          company,
          description,
          location,
          type: jobType,
        })
        .eq('id', params.id)
        .eq('created_by', user.id);

      if (updateError) throw updateError;

      // Navigate to dashboard after successful update
      router.push('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred while updating the job');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-text-secondary">Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary">Edit Job</h1>
          <Link
            href="/dashboard"
            className="text-primary hover:text-blue-700 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="card">
          <form onSubmit={handleUpdateJob} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="title" className="form-label">
                Job Title
              </label>
              <input
                type="text"
                id="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                placeholder="e.g. Senior Frontend Developer"
              />
            </div>

            <div>
              <label htmlFor="company" className="form-label">
                Company Name
              </label>
              <input
                type="text"
                id="company"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="form-input"
                placeholder="e.g. Acme Inc."
              />
            </div>

            <div>
              <label htmlFor="location" className="form-label">
                Location
              </label>
              <input
                type="text"
                id="location"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="form-input"
                placeholder="e.g. San Francisco, CA"
              />
            </div>

            <div>
              <label htmlFor="jobType" className="form-label">
                Job Type
              </label>
              <select
                id="jobType"
                required
                value={jobType}
                onChange={(e) => setJobType(e.target.value as JobType)}
                className="form-input"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="form-label">
                Job Description
              </label>
              <textarea
                id="description"
                required
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-input"
                placeholder="Describe the role, responsibilities, and requirements..."
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={saving}
                className={`btn-primary flex-1 flex justify-center items-center ${
                  saving ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {saving ? 'Saving Changes...' : 'Save Changes'}
              </button>
              <Link
                href="/dashboard"
                className="btn-secondary flex-1 flex justify-center items-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 