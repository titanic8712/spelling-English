type SpellingCellsProps = {
  letters: string[];
  isShaking: boolean;
};

export function SpellingCells({ letters, isShaking }: SpellingCellsProps) {
  return (
    <div className={isShaking ? "spelling-cells shake" : "spelling-cells"} aria-label="Spelling cells">
      {letters.map((letter, index) => (
        <span className="spelling-cell" key={`${index}-${letter}`} aria-label={`Letter ${index + 1}`}>
          {letter}
        </span>
      ))}
    </div>
  );
}
