module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'karma-typescript'],
    files: [
      { pattern: 'src/**/*.ts', type: 'module' },
      { pattern: 'srcw/**/*.ts', type: 'module' },
      { pattern: 'tests/**/*.spec.ts', type: 'module' }
    ],
    preprocessors: {
      '**/*.ts': ['karma-typescript']
    },
    karmaTypescriptConfig: {
      compilerOptions: {
        module: "ES2022",
        moduleResolution: "node",
        target: "ES2022",
        sourceMap: true,
        esModuleInterop: true
      },
      tsconfig: './tsconfig.json',
      bundlerOptions: {
        transforms: [
          require('karma-typescript-es6-transform')()
        ]
      }
    },
    reporters: ['progress', 'karma-typescript'],
    browsers: ['ChromeHeadless'],
    singleRun: true,
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-typescript'
    ]
  });
}