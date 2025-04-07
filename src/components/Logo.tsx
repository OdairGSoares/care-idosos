
import React from 'react';
import { HeartPulse } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-care-teal to-care-light-teal text-white shadow-md">
      <HeartPulse className="h-6 w-6" />
    </div>
  );
};

export default Logo;
