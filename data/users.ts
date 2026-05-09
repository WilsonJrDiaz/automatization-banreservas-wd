export type User = {
  username: string;
  password: string;
  role: 'admin' | 'standard' | 'guest';
};

export const TEST_USERS = {
  standard: {
    username: process.env.DEMOQA_USERNAME ?? '',
    password: process.env.DEMOQA_PASSWORD ?? '',
    role: 'standard' as const,
  },
  invalid: {
    username: 'usuarioInvalido123',
    password: 'ClaveIncorrecta!',
    role: 'guest' as const,
  },
} satisfies Record<string, User>;
