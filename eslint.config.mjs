import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginTs from '@typescript-eslint/eslint-plugin'
import { ESLint } from 'eslint'
import parser from '@typescript-eslint/parser'

export default [
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: parser, // Указываем правильный парсер
      parserOptions: {
        sourceType: 'module', // Используем ES модули
        project: './tsconfig.json', // Указываем путь к tsconfig.json
      },
    },
    plugins: {
      '@typescript-eslint': pluginTs,
      'eslint-plugin-js': pluginJs,
    },
    rules: {
      // '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'import/no-commonjs': 'off',
      'node/no-unsupported-features/es-syntax': 'off',
    },
  },
  {
    languageOptions: {
      globals: globals.node, // Разрешаем глобальные переменные для Node.js
    },
  },
]
