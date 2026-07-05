import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CountdownOverlay from '../components/CountdownOverlay';

describe('CountdownOverlay', () => {
  it('renders GET READY text', () => {
    render(<CountdownOverlay value={5} />);
    expect(screen.getByText(/get ready/i)).toBeInTheDocument();
  });

  it('displays the current countdown value', () => {
    render(<CountdownOverlay value={3} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('displays GO when value is 0', () => {
    render(<CountdownOverlay value={0} />);
    expect(screen.getByText('GO!')).toBeInTheDocument();
  });
});
