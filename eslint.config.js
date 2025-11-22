import js from '@eslint/js';
import globals from 'globals';
import { defineConfig, globalIgnores } from 'eslint/config';

// Plugins for React linting
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginImport from 'eslint-plugin-import';
import pluginReactRefresh from 'eslint-plugin-react-refresh';

// Prettier configuration for ESLint
import prettierConfig from 'eslint-config-prettier';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'jsx-a11y': pluginJsxA11y,
      import: pluginImport,
      'react-refresh': pluginReactRefresh,
    },
    extends: [
      js.configs.recommended,
      pluginReact.configs.flat.recommended,
      pluginReactHooks.configs.recommended,
      pluginJsxA11y.configs.recommended,
      pluginImport.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react-refresh/only-export-components': 'error',
      'no-unused-vars': 'warn',
      'no-var': 'error',
      'no-var-requires': 'off',
    },
  },
  prettierConfig,
]);
