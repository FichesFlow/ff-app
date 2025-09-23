import { useCallback, useEffect } from 'react';

export function useKeyboardControls(showAnswer, onShowAnswer, onScoreSelection) {
  const handleKeyDown = useCallback((e) => {
    if (e.code === 'Space' && !showAnswer) {
      onShowAnswer();
      e.preventDefault();
    } else if (showAnswer) {
      if (e.code === 'ArrowLeft') {
        onScoreSelection(0); // Je ne savais pas
      } else if (e.code === 'ArrowDown') {
        onScoreSelection(3); // Presque
      } else if (e.code === 'ArrowRight') {
        onScoreSelection(5); // Facile
      }
    }
  }, [onScoreSelection, showAnswer, onShowAnswer]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
