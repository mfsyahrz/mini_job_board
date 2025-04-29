'use client';

import Link from 'next/link';
import { Database } from '../lib/database.types';

type Job = Database['public']['Tables']['jobs']['Row'];

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h2>
      <p className="text-gray-600 mb-2">{job.company}</p>
      <p className="text-gray-500 mb-4">{job.location}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {job.requirements.slice(0, 3).map((req, index) => (
          <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
            {req}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-primary font-medium">{job.salary_range}</span>
        <Link 
          href={`/jobs/${job.id}`}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
} 