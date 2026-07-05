import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SprintBoard from '../components/SprintBoard';

const stories = [
  {
    id: 'story-0', priority: 1, title: 'Story One', storyPoints: 8, businessValue: 3000,
    tasks: [{ id: 't-0', storyId: 'story-0', name: 'Write Tests', estimatedHours: 10, progressHours: 0, status: 'todo', isWriteTests: true, isBug: false, changed: false }],
  },
];

describe('SprintBoard', () => {
  it('renders four column headers', () => {
    render(<SprintBoard stories={stories} elapsedHours={0} />);
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Blocked')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('renders a lane for each story', () => {
    render(<SprintBoard stories={stories} elapsedHours={0} />);
    expect(screen.getByText('Story One')).toBeInTheDocument();
  });
});
