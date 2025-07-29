import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('Verifying your email...');
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Verification token is missing.');
      return;
    }
    fetch(`/api/v1/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data.success) {
          setStatus('success');
          setMessage('Your email has been verified! You can now log in.');
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('An error occurred while verifying your email.');
      });
  }, [searchParams]);

  return (
    <div style={{
      maxWidth: 480,
      margin: '100px auto',
      padding: 40,
      border: '1px solid #e0e0e0',
      borderRadius: 16,
      textAlign: 'center',
      background: '#fff',
      boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
    }}>
      <h2 style={{ fontSize: 32, marginBottom: 24, fontWeight: 700, letterSpacing: 1 }}>Email Verification</h2>
      <p style={{
        fontSize: 20,
        marginBottom: 32,
        color: status === 'error' ? '#d32f2f' : status === 'success' ? '#388e3c' : '#333',
        fontWeight: 500,
        minHeight: 40,
      }}>{message}</p>
      {status === 'success' && (
        <a
          href="/login"
          style={{
            display: 'inline-block',
            marginTop: 12,
            padding: '12px 32px',
            fontSize: 18,
            background: '#1976d2',
            color: '#fff',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)',
            transition: 'background 0.2s',
          }}
        >
          Go to Login
        </a>
      )}
    </div>
  );
};

export default VerifyEmail; 