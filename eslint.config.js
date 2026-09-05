import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import typescriptEslint from 'typescript-eslint';

export default [
  { ignores: ['.next/', 'node_modules/', 'dist/', 'build/', '.agents/', 'crewai-agents/', 'scripts/', '*.config.js', '*.config.mjs'] },
  ...typescriptEslint.configs.recommended,
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        performance: 'readonly',
        crypto: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        prompt: 'readonly',
        React: 'readonly',
        JSX: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLFormElement: 'readonly',
        FormData: 'readonly',
        File: 'readonly',
        URL: 'readonly',
        IntersectionObserver: 'readonly',
      },
    },
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      'react/no-unescaped-entities': 'off',
      'prefer-const': 'warn',
    },
  },
];