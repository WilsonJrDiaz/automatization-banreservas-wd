export type Book = {
  title: string;
  author?: string;
  isbn?: string;
};

export const BOOKS_CATALOG: Book[] = [
  { title: 'Git Pocket Guide', author: 'Richard E. Silverman' },
  { title: 'Learning JavaScript Design Patterns', author: 'Addy Osmani' },
  { title: 'Designing Evolvable Web APIs with ASP.NET', author: 'Glenn Block et al.' },
  { title: 'Speaking JavaScript', author: 'Axel Rauschmayer' },
  { title: "You Don't Know JS", author: 'Kyle Simpson' },
  { title: 'Programming JavaScript Applications', author: 'Eric Elliott' },
  { title: 'Eloquent JavaScript, Second Edition', author: 'Marijn Haverbeke' },
  { title: 'Understanding ECMAScript 6', author: 'Nicholas C. Zakas' },
];

export const SEARCH_TERMS = {
  // Outline TC-BOOKS-005: términos distintos a los ya cubiertos por TC-001 ("Git") y TC-002 ("JavaScript")
  existing: [
    { keyword: 'Speaking', expectedTitle: 'Speaking JavaScript' },
    { keyword: 'Eloquent', expectedTitle: 'Eloquent JavaScript, Second Edition' },
  ],
  // Outline TC-BOOKS-006: términos distintos al ya cubierto por TC-003 ("ISTQB Fundamentals")
  nonExisting: [
    'TerminoQueNoExiste',
    '12345XYZ',
  ],
};
