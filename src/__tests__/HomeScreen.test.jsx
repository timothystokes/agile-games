import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomeScreen from '../components/HomeScreen';

const MOCK_GAMES = [
  { id: 'game-1', title: 'Game 1: Alignment', principle: 'Alignment', accentColour: 'pink', description: 'Desc 1' },
  { id: 'game-2', title: 'Game 2: Persistence', principle: 'Persistence', accentColour: 'yellow', description: 'Desc 2' },
  { id: 'game-3', title: 'Game 3: Teamwork', principle: 'Teamwork', accentColour: 'blue', description: 'Desc 3' },
  { id: 'game-4', title: 'Game 4: Improvement', principle: 'Improvement', accentColour: 'cyan', description: 'Desc 4' },
  { id: 'game-5', title: 'Game 5: Delivery', principle: 'Delivery', accentColour: 'orange', description: 'Desc 5' },
];

jest.mock('../utils/content', () => ({
  fetchGameContent: jest.fn((id) =>
    Promise.resolve(MOCK_GAMES.find((g) => g.id === id) ?? null)
  ),
}));

describe('HomeScreen', () => {
  it('renders five game cards after loading', async () => {
    render(<HomeScreen />);
    await waitFor(() => {
      expect(screen.getAllByRole('link')).toHaveLength(5);
    });
  });

  it('renders each game title', async () => {
    render(<HomeScreen />);
    await waitFor(() => {
      expect(screen.getByText('Game 1: Alignment')).toBeInTheDocument();
      expect(screen.getByText('Game 5: Delivery')).toBeInTheDocument();
    });
  });

  it('renders a loading state initially', () => {
    render(<HomeScreen />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
