import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

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

function setHash(hash) {
  // jsdom supports setting location.hash directly via its setter
  window.location.hash = hash;
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}

describe('App routing', () => {
  beforeEach(() => { window.location.hash = ''; });

  it('renders without crashing', () => {
    render(<App />);
    expect(document.body).toBeInTheDocument();
  });

  it('renders HomeScreen links when hash is empty', async () => {
    render(<App />);
    const links = await screen.findAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('renders GamePlaceholder heading for a valid game hash', async () => {
    window.location.hash = '#game-3';
    render(<App />);
    const heading = await screen.findByRole('heading', { level: 1, name: /teamwork/i });
    expect(heading).toHaveTextContent('Game 3: Teamwork');
  });

  it('renders HomeScreen links for an unknown hash', async () => {
    window.location.hash = '#settings';
    render(<App />);
    const links = await screen.findAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('switches view on hashchange', async () => {
    render(<App />);
    await screen.findAllByRole('link');
    await act(async () => setHash('#game-2'));
    const heading = await screen.findByRole('heading', { level: 1, name: /persistence/i });
    expect(heading).toHaveTextContent('Game 2: Persistence');
  });
});
