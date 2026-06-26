# Focused Study UI Design

## Goal

Turn the vocabulary trainer from a functional prototype into a calm, focused study interface for B1-B2 IELTS learners.

## Design Direction

Use a focused learning-tool layout rather than a marketing or game screen. The interface should feel quiet, clear, and motivating:

- Cyan/teal primary color for attention and pronunciation controls.
- Green accent for progress and successful completion.
- Warm amber only for hints and retry states.
- Generous whitespace without oversized decorative sections.
- Short, action-oriented labels that help learners know what to do next.

## Screen Requirements

### Today Screen

- Show the product identity and the daily learning promise in the first viewport.
- Present daily target, review count, and new-word count as scan-friendly metrics.
- Use a strong primary start button that cannot be visually lost below settings.
- Keep settings available but secondary to the practice start flow.
- Avoid mobile title clipping at narrow widths.

### Practice Screen

- Make the current task obvious: listen, type, then review.
- Treat the phonetic text as the main study target.
- Keep pronunciation replay and hint actions close to the task.
- Show retry feedback in a clear but non-punitive tone.
- Preserve letter-by-letter typing, shake animation, and sound feedback.

### Result And Summary Screens

- Keep completion feedback calm and confident.
- Show the word, phonetic, meaning, example, and countdown in a readable study card.
- Make the summary feel like the end of a study session rather than a raw report.

## Accessibility And Responsiveness

- Support keyboard users with visible focus states.
- Respect `prefers-reduced-motion` for shake and hover transitions.
- Keep touch targets at least 44px tall where practical.
- Verify mobile width around 375px and desktop width around 1280px.

## Out Of Scope

- No changes to the vocabulary data model.
- No cloud sync, account system, or import pipeline.
- No new routing framework.
- No additional animation libraries.
