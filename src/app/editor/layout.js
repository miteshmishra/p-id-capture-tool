'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditorLayout({ children }) {
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn) {
      // Redirect to home page if not logged in
      router.push('/');
    }
  }, [router]);

  return children;
}