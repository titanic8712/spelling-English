type SpellingCellsProps = {
  letters: string[];
  activeIndex: number | null;
  isShaking: boolean;
};

export function SpellingCells({ letters, activeIndex, isShaking }: SpellingCellsProps) {
  return (
    <div className={isShaking ? "spelling-cells shake" : "spelling-cells"} aria-label="Spelling cells">
      {letters.map((letter, index) => {
        const classes = [
          "spelling-cell",
          letter ? "is-filled" : "",
          activeIndex === index ? "is-active" : "",
        ].filter(Boolean).join(" ");

        return (
          <span
            aria-current={activeIndex === index ? "true" : undefined}
            className={classes}
            key={`${index}-${letter}`}
            aria-label={`Letter ${index + 1}`}
          >
            {letter}
          </span>
        );
      })}
    </div>
  );
}
