const typecheck = () => 'pnpm typecheck';

const config = {
  '*.{js,jsx,ts,tsx}': ['pnpm lint', typecheck],
};

export default config;
