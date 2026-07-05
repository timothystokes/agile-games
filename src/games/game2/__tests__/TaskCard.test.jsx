import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskCard from '../components/TaskCard';

function makeTask(overrides = {}) {
  return {
    id: 't-0', name: 'Build UI', estimatedHours: 10,
    progressHours: 0, status: 'todo',
    isWriteTests: false, isBug: false, changed: false,
    ...overrides,
  };
}

describe('TaskCard', () => {
  it('renders the task name', () => {
    render(<TaskCard task={makeTask()} onAction={() => {}} />);
    expect(screen.getByText('Build UI')).toBeInTheDocument();
  });

  it('renders estimated hours', () => {
    render(<TaskCard task={makeTask()} onAction={() => {}} />);
    expect(screen.getByText('10h')).toBeInTheDocument();
  });

  it('shows START button when status is todo', () => {
    render(<TaskCard task={makeTask({ status: 'todo' })} onAction={() => {}} />);
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
  });

  it('shows PAUSE button when status is inProgress', () => {
    render(<TaskCard task={makeTask({ status: 'inProgress' })} onAction={() => {}} />);
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
  });

  it('shows RESUME button when status is blocked', () => {
    render(<TaskCard task={makeTask({ status: 'blocked' })} onAction={() => {}} />);
    expect(screen.getByRole('button', { name: /resume/i })).toBeInTheDocument();
  });

  it('shows no action button when status is done', () => {
    render(<TaskCard task={makeTask({ status: 'done', progressHours: 10 })} onAction={() => {}} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onAction with task id and action when START is clicked', () => {
    const onAction = jest.fn();
    render(<TaskCard task={makeTask({ status: 'todo' })} onAction={onAction} />);
    fireEvent.click(screen.getByRole('button', { name: /start/i }));
    expect(onAction).toHaveBeenCalledWith('t-0', 'start');
  });

  it('calls onAction with pause when PAUSE is clicked', () => {
    const onAction = jest.fn();
    render(<TaskCard task={makeTask({ status: 'inProgress' })} onAction={onAction} />);
    fireEvent.click(screen.getByRole('button', { name: /pause/i }));
    expect(onAction).toHaveBeenCalledWith('t-0', 'pause');
  });

  it('shows progress bar with correct fill percentage', () => {
    const { container } = render(<TaskCard task={makeTask({ status: 'inProgress', progressHours: 5 })} onAction={() => {}} />);
    const fill = container.querySelector('[data-progress-fill]');
    expect(fill.style.width).toBe('50%');
  });

  it('shows CHANGED badge when task is flagged', () => {
    render(<TaskCard task={makeTask({ changed: true })} onAction={() => {}} />);
    expect(screen.getByText('CHANGED')).toBeInTheDocument();
  });
});
