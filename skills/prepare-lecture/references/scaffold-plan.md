# Scaffold plan

Use a JSON object with a `lessons` array when lesson boundaries have been chosen. This example describes one shell, not a complete topic conversion:

```json
{
  "lessons": [
    {
      "slug": "motivation",
      "title": "Why IPv6?",
      "learning_goals": ["Explain why IPv4 address scarcity motivated IPv6."],
      "source_sections": ["1. Motivation and design goals"],
      "source_classification": "lecture_guide",
      "prerequisite_ids": [],
      "estimated_reading_minutes": 2
    }
  ]
}
```

Replace the source heading with an exact heading from the actual guide; the tool verifies it exists. Required fields are `slug`, `title`, `learning_goals`, `source_sections`, and `source_classification`. A slug contains lowercase letters, digits, and single hyphens. Classifications are explicit strings following the source convention, not inferred slide visibility.

The tool derives ordered IDs from the topic slug (`03_ipv6` → `ipv6-01`), canonical paths, source commit, and question fingerprints. It leaves Practice assignments empty, coverage unassessed, and bodies marked `TODO-CONTENT`. Review prerequisites and estimates rather than accepting defaults as content decisions.

Output must be a new directory. The tool refuses existing destinations, including an existing empty directory. It stages output before creating the destination and leaves input quizzes untouched. Do not point it at an existing topic. Resolve all placeholders and question reviews, then deliberately promote the draft manifest and lesson files; the progress generator ignores `manifest.draft.json`.
