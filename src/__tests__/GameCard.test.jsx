import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GameCard from '../components/GameCard';

const game = {
  id: 'game-1',
  title: 'Game 1: Alignment',
  accentColour: 'pink',
  description: 'Shared understanding transforms a team.',
};

describe('GameCard', () => {
  it('renders the game title', () => {
    render(<GameCard game={game} />);
    expect(screen.getByText('Game 1: Alignment')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<GameCard game={game} />);
    expect(
      screen.getByText('Shared understanding transforms a team.')
    ).toBeInTheDocument();
  });

  it('applies the accent colour class', () => {
    const { container } = render(<GameCard game={game} />);
    expect(container.firstChild).toHaveClass('accent-pink');
  });

  it('renders a link to the game hash', () => {
    render(<GameCard game={game} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '#game-1');
  });
});
