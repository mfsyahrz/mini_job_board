import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function JobDetailPage({ params, searchParams }: PageProps) {
  // Fetch the job by ID
  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !job) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white shadow-md rounded-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/"
              className="text-primary hover:text-blue-600 mb-4 inline-block"
            >
              ← Back to Jobs
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <p className="text-xl text-gray-600">{job.company}</p>
          </div>

          {/* Job Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-1">Location</h2>
              <p className="text-gray-900">{job.location}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-1">Job Type</h2>
              <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                {job.type}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h2>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap text-gray-700">{job.description}</p>
            </div>
          </div>

          {/* Posted Date */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Posted on {new Date(job.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 