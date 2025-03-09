import { FlatCompat } from '@eslint/eslintrc'
import pluginQuery from '@tanstack/eslint-plugin-query'
import pluginVitest from '@vitest/eslint-plugin'
import pluginJsxA11y from 'eslint-plugin-jsx-a11y'
import pluginReact from 'eslint-plugin-react'
import pluginTestingLibrary from 'eslint-plugin-testing-library'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  ...compat.config({
    extends: [
      'next/core-web-vitals',
      'next/typescript',
      'prettier',
      'plugin:testing-library/react',
    ],
  }),
  ...pluginQuery.configs['flat/recommended'],
  {
    ...pluginJsxA11y.flatConfigs.strict,
    ...pluginReact.configs.flat.recommended,
    ...pluginTestingLibrary.configs['flat/react'],
    plugins: { vitest: pluginVitest },
    rules: {
      ...pluginVitest.configs.all.rules,

      'react/boolean-prop-naming': ['warn'],
      'react/forward-ref-uses-ref': ['warn'],
      'react/hook-use-state': ['warn'],
      'react/iframe-missing-sandbox': ['warn'],
      'react/jsx-boolean-value': ['warn', 'never'],
      'react/jsx-fragments': ['warn'],
      'react/jsx-handler-names': ['warn'],
      'react/jsx-no-bind': ['error'],
      'react/jsx-no-leaked-render': ['error'],
      'react/jsx-no-useless-fragment': ['warn', { allowExpressions: true }],
      'react/jsx-props-no-spread-multi': ['warn'],
      'react/sort-default-props': ['warn'],
      'react/jsx-sort-props': ['warn'],
      'react/no-array-index-key': ['error'],
      'react/no-invalid-html-attribute': ['warn'],
      'react/no-this-in-sfc': ['warn'],
      'react/no-unstable-nested-components': ['error'],
      'react/no-unused-state': ['warn'],
      'react/no-will-update-set-state': ['warn'],
      'react/prefer-read-only-props': ['warn'],
      'react/prefer-stateless-function': ['error'],
      'react/require-default-props': ['error'],
      'react/style-prop-object': ['warn'],

      'vitest/no-hooks': [
        'error',
        {
          allow: ['beforeEach', 'afterEach', 'beforeAll', 'afterAll'],
        },
      ],
    },
  },
]

export default eslintConfig
