import React, { useState, useEffect } from 'react';

const VerifyOTPSimple = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else {
      setMessage('No email found');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Verifying...');
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('✅ Verified! Redirecting...');
        setTimeout(() => {
          window.location.href = `/reset-password?email=${encodeURIComponent(email)}`;
        }, 2000);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Server error');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Verify OTP (Simple)</h2>
      <p>Email: {email}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>
          Verify
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default VerifyOTPSimple;
