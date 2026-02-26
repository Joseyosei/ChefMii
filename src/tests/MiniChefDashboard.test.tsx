import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';

// Mock Component as specified in the request
const MiniChefDashboard = ({ loading }: { loading: boolean }) => {
  if (loading) return <p>Loading MiniChef profile...</p>;
  return <div>MiniChef Dashboard</div>;
};

describe('MiniChefDashboard', () => {
  it('renders loading message initially', () => {
    render(<MiniChefDashboard loading={true} />);
    expect(screen.getByText(/loading minichef/i)).toBeInTheDocument();
  });
});
