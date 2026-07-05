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
  maxWip: 2,
  hasBugs: false,
  hasDisruptions: false,
  tips: ['Stop starting, start finishing. WIP limits speed up throughput.'],
};

describe('ResultsScreen', () => {
  it('renders value delivered', () => {
    render(<ResultsScreen results={results} onPlayAgain={() => {}} />);
    expect(screen.getByText('$5,200')).toBeInTheDocument();
  });

  it('renders potential value alongside delivered', () => {
    render(<ResultsScreen results={results} onPlayAgain={() => {}} />);
    expect(screen.getByText('$7,700')).toBeInTheDocument();
  });

  it('renders throughput', () => {
    render(<ResultsScreen results={results} onPlayAgain={() => {}} />);
    expect(screen.getByText('$520')).toBeInTheDocument();
  });

  it('renders potential throughput', () => {
    render(<ResultsScreen results={results} onPlayAgain={() => {}} />);
    expect(screen.getByText('$770')).toBeInTheDocument();
  });

  it('renders stories completed count', () => {
    render(<ResultsScreen results={results} onPlayAgain={() => {}} />);
    expect(screen.getAllByText('2').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders the learning tip', () => {
    render(<ResultsScreen results={results} onPlayAgain={() => {}} />);
    expect(screen.getByText(results.tips[0])).toBeInTheDocument();
  });

  it('renders peak WIP metric', () => {
    render(<ResultsScreen results={results} onPlayAgain={() => {}} />);
    expect(screen.getAllByText('2').length).toBeGreaterThanOrEqual(1);
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
