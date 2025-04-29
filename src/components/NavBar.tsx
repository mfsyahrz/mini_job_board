'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';

/**
 * Navigation bar component that shows different links based on authentication state
 */
export default function NavBar() {
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-primary">
            Mini Job Board
          </Link>
          
          <div className="flex space-x-4">
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link 
                      href="/post-job" 
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      Post a Job
                    </Link>
                    <Link 
                      href="/dashboard" 
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      Login
                    </Link>
                    <Link 
                      href="/signup" 
                      className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 