export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/?(*.)+(test).[jt]s?(x)', '**/?(*.)+(test).mjs'],
  collectCoverageFrom: [
    'app.js',
    'routes.js',
    '!app.test.mjs',
    '!server.test.mjs'
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/public/']
};