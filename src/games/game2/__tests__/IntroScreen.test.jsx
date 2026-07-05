import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import IntroScreen from '../components/IntroScreen';

const game = {
  id: 'game-2',
  title: 'Game 2: Persistence',
  accentColour: 'pink',
  description: 'Demonstrates the importance of persisting with work in hand.',
  body: 'In this game you manage a sprint. Stop Starting, Start Finishing.',
};

describe('IntroScreen', () => {
  it('renders the game title', () => {
    render(<IntroScreen game={game} onStart={() => {}} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Game 2: Persistence');
  });

  it('renders the body content from the markdown file', () => {
    render(<IntroScreen game={game} onStart={() => {}} />);
    expect(screen.getByText(/Stop Starting, Start Finishing/)).toBeInTheDocument();
  });

  it('renders a Start button', () => {
    render(<IntroScreen game={game} onStart={() => {}} />);
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
  });

  it('calls onStart when Start is clicked', () => {
    const onStart = jest.fn();
    render(<IntroScreen game={game} onStart={onStart} />);
    fireEvent.click(screen.getByRole('button', { name: /start/i }));
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('renders a back-to-home link', () => {
    render(<IntroScreen game={game} onStart={() => {}} />);
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '#');
  });
});
