'use client';

import Image from "next/image";
import { useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Database } from "../../lib/database.types";

export default function Home() {
  useEffect(() => {
    supabase.from('jobs').select('*').then((result) => {
      console.log('Supabase query result:', result);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">
          Mini Job Board
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/*todo: add job cards here*/}
        </div>
      </main>
    </div>
  );
}
