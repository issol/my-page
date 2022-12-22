module.exports = {
  arrowParens: 'avoid',
  bracketSpacing: true,
  htmlWhitespaceSensitivity: 'css',
  insertPragma: false,
  bracketSameLine: false,
  jsxSingleQuote: true,

  proseWrap: 'preserve',
  quoteProps: 'as-needed',
  requirePragma: false,
  semi: false,
  singleQuote: true,
  tabWidth: 2,

  useTabs: false,

  singleQuote: true,
  semi: false,
  tabWidth: 2,
  trailingComma: 'all',
  printWidth: 80,
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 120
      }
    }
  ]
}
