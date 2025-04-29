'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { JobType } from '@/lib/database.types';
import Link from 'next/link';
import ConfirmDialog from '@/components/ConfirmDialog';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: JobType;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobToDelete, setJobToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const { data: myJobs, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .eq('created_by', user.id)
          .order('created_at', { ascending: false });

        if (jobsError) throw jobsError;
        setJobs(myJobs || []);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred while fetching jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, [router]);

  const handleDelete = async (jobId: number) => {
    try {
      const { error: deleteError } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (deleteError) throw deleteError;

      setJobs((prev) => prev.filter(job => job.id !== jobId));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred while deleting the job');
    } finally {
      setJobToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading your jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Job Posts</h1>
          <Link
            href="/post-job"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Post New Job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <p className="text-gray-600">You have not posted any jobs yet.</p>
            <Link
              href="/post-job"
              className="text-primary hover:text-blue-600 mt-4 inline-block"
            >
              Post your first job →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h2>
                    <p className="text-gray-600 mb-2">{job.company}</p>
                    <p className="text-gray-500 mb-4">{job.location}</p>
                    <div className="flex items-center space-x-4">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
                        {job.type}
                      </span>
                      <span className="text-sm text-gray-500">
                        Posted on {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <Link
                      href={`/dashboard/edit/${job.id}`}
                      className="text-primary hover:text-blue-600 font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setJobToDelete(job.id)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <ConfirmDialog
          isOpen={jobToDelete !== null}
          onClose={() => setJobToDelete(null)}
          onConfirm={() => jobToDelete && handleDelete(jobToDelete)}
          title="Delete Job Post"
          message="Are you sure you want to delete this job post? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
        />
      </div>
    </div>
  );
} 