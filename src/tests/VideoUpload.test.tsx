import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';

// Mock Component as specified in the request
const UploadVideo = ({ role }: { role: string }) => {
  if (role !== 'chef') return null;
  return (
    <div>
      <h3>Upload Video</h3>
      <button>Upload Video</button>
    </div>
  );
};

describe('UploadVideo', () => {
  it('shows upload button for chefs', () => {
    render(<UploadVideo role="chef" />);
    expect(screen.getByText(/upload video/i)).toBeInTheDocument();
  });

  it('blocks upload for non-chefs', () => {
    render(<UploadVideo role="user" />);
    expect(screen.queryByText(/upload video/i)).not.toBeInTheDocument();
  });
});
