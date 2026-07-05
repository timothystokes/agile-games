import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GamePlaceholder from '../components/GamePlaceholder';

const game = {
  id: 'game-3',
  title: 'Game 3: Teamwork',
  principle: 'Teamwork',
  accentColour: 'blue',
  description: 'Cross-functional collaboration.',
};

describe('GamePlaceholder', () => {
  it('renders the game title', () => {
    render(<GamePlaceholder game={game} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Game 3: Teamwork'
    );
  });

  it('renders the principle name', () => {
    render(<GamePlaceholder game={game} />);
    expect(screen.getByText('Teamwork')).toBeInTheDocument();
  });

  it('renders a back-to-home link', () => {
    render(<GamePlaceholder game={game} />);
    const link = screen.getByRole('link', { name: /back to home/i });
    expect(link).toHaveAttribute('href', '#');
  });

  it('applies the accent colour class', () => {
    const { container } = render(<GamePlaceholder game={game} />);
    expect(container.firstChild).toHaveClass('accent-blue');
  });
});
