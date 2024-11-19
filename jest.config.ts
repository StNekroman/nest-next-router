export default {
  displayName: 'nest-next-router',
  preset: '../jest.preset.js',
  testEnvironment: 'node',
  rootDir: './test',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: './coverage/nest-next-router',
};
