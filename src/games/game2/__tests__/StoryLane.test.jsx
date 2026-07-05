import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StoryLane from '../components/StoryLane';

const story = {
  id: 'story-0',
  priority: 1,
  title: 'As a user, I want to log in securely',
  storyPoints: 8,
  businessValue: 3200,
  tasks: [
    { id: 't-0', storyId: 'story-0', name: 'Write Tests', estimatedHours: 10, progressHours: 0, status: 'todo', isWriteTests: true, isBug: false, changed: false },
    { id: 't-1', storyId: 'story-0', name: 'Build UI', estimatedHours: 14, progressHours: 0, status: 'todo', isWriteTests: false, isBug: false, changed: false },
  ],
};

describe('StoryLane', () => {
  it('renders the priority badge', () => {
    render(<StoryLane story={story} />);
    expect(screen.getByText('P1')).toBeInTheDocument();
  });

  it('renders the story title', () => {
    render(<StoryLane story={story} />);
    expect(screen.getByText(/log in securely/i)).toBeInTheDocument();
  });

  it('renders story points', () => {
    render(<StoryLane story={story} />);
    expect(screen.getByText('8 pts')).toBeInTheDocument();
  });

  it('renders business value', () => {
    render(<StoryLane story={story} />);
    expect(screen.getByText('$3,200')).toBeInTheDocument();
  });

  it('renders task names', () => {
    render(<StoryLane story={story} />);
    expect(screen.getByText('Write Tests')).toBeInTheDocument();
    expect(screen.getByText('Build UI')).toBeInTheDocument();
  });
});
