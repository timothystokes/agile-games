import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Timeline from '../components/Timeline';

describe('Timeline', () => {
  it('renders 10 day segments', () => {
    const { container } = render(<Timeline elapsedHours={0} />);
    expect(container.querySelectorAll('[data-day]')).toHaveLength(10);
  });

  it('marker is at 0% when elapsed is 0', () => {
    const { container } = render(<Timeline elapsedHours={0} />);
    const marker = container.querySelector('[data-marker]');
    expect(marker.style.left).toBe('0%');
  });

  it('marker is at 50% when elapsed is 40 hours', () => {
    const { container } = render(<Timeline elapsedHours={40} />);
    const marker = container.querySelector('[data-marker]');
    expect(marker.style.left).toBe('50%');
  });

  it('marker is at 100% when elapsed is 80 hours', () => {
    const { container } = render(<Timeline elapsedHours={80} />);
    const marker = container.querySelector('[data-marker]');
    expect(marker.style.left).toBe('100%');
  });
});
