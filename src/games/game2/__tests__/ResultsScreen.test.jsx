import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResultsScreen from '../components/ResultsScreen';

const results = {
  valueDelivered: 5200,
  potentialValue: 7700,
  throughput: 520,
  cycleTime: 45,
  storiesCompleted: 2,
  storiesTotal: 3,
  hasBugs: false,
  hasDisruptions: false,
  tip: 'Stop starting, start finishing. WIP limits speed up throughput.',
};

describe('ResultsScreen', () => {
  it('renders value delivered', () => {
    render(<ResultsScreen results={results} onPlayAgain={() => {}} />);
    expect(screen.getByText('$5,200')).toBeInTheDocument();
  });

  it('renders potential value', () => {
    render(<ResultsScreen results={results} onPlayAgain={() => {}} />);
    expect(screen.getByText('$7,700')).toBeInTheDocument();
  });

  it('renders throughput', () => {
    render(<ResultsScreen results={results} onPlayAgain={() => {}} />);
    expect(screen.getByText('$520')).toBeInTheDocument();
  });

  it('renders stories completed count', () => {
    render(<ResultsScreen results={results} onPlayAgain={() => {}} />);
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
  });

  it('renders the learning tip', () => {
    render(<ResultsScreen results={results} onPlayAgain={() => {}} />);
    expect(screen.getByText(results.tip)).toBeInTheDocument();
  });

  it('calls onPlayAgain when Play Again is clicked', () => {
    const onPlayAgain = jest.fn();
    render(<ResultsScreen results={results} onPlayAgain={onPlayAgain} />);
    fireEvent.click(screen.getByRole('button', { name: /play again/i }));
    expect(onPlayAgain).toHaveBeenCalledTimes(1);
  });

  it('renders a Back to Home link pointing to root hash', () => {
    render(<ResultsScreen results={results} onPlayAgain={() => {}} />);
    const link = screen.getByRole('link', { name: /back/i });
    expect(link).toHaveAttribute('href', '#');
  });
});
