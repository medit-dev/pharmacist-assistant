import tseslint from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPromise from 'eslint-plugin-promise';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import eslintPluginSecurity from 'eslint-plugin-security';
import eslintPluginPerfectionist from 'eslint-plugin-perfectionist';
import eslintPluginN from 'eslint-plugin-n';

export default [
  {
    ignores: [
      // Logs
      '**/logs/**',
      'npm-debug.log*',
      'pnpm-debug.log*',
      '.eslintcache',
      'lerna-debug.log*',
      '*.log',

      // Diagnostic reports
      'report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json',

      // Runtime data
      'pids',
      '*.pid',
      '*.seed',
      '*.pid.lock',

      // Coverage and testing
      'lib-cov',
      'coverage',
      '*.lcov',
      '.nyc_output',
      '.stryker-tmp',
      '/reports',

      // Build tools and dependencies
      '.grunt',
      'bower_components',
      '.lock-wscript',
      'build/Release',
      '**/node_modules/**',
      'node_modules/**',
      'jspm_packages',
      '**/build/**',
      'build/**',
      '**/dist/**',
      'dist/**',
      '**/documentation/**',
      'documentation/**',
      'web_modules',

      // Cache and temporary files
      '*.tsbuildinfo',
      '.npm',
      '.rpt2_cache/',
      '.rts2_cache_cjs/',
      '.rts2_cache_es/',
      '.rts2_cache_umd/',
      '.node_repl_history',
      '*.tgz',
      '.yarn-integrity',
      'yarn-debug.log*',
      'yarn-error.log*',
      '.cache',
      '.parcel-cache',
      '.temp',
      '.tmp',

      // Environment and config files
      '.env',
      '.env.test',
      '*/.env',
      '.env.development.local',
      '.env.test.local',
      '.env.production.local',
      '.env.local',

      // Framework specific
      '.next',
      'out',
      '.nuxt',
      '.cache/',
      '.vuepress/dist',
      '.serverless/',
      '.fusebox/',
      '.dynamodb/',
      '.tern-port',
      '.vscode-test',
      '*/.output',
      'e2e/esmCompatibility/.output',
      'src/e2e/esmCompatibility/.output',
      '**/0x',

      // Yarn v2
      '.yarn/cache',
      '.yarn/unplugged',
      '.yarn/build-state.yml',
      '.yarn/install-state.gz',
      '.pnp.*',

      // OS and IDE files
      '.DS_Store',
      '/.idea',
      '.project',
      '.classpath',
      '.c9/',
      '*.launch',
      '.settings/',
      '*.sublime-workspace',
      '.vscode/*',
      '!.vscode/settings.json',
      '!.vscode/tasks.json',
      '!.vscode/launch.json',
      '!.vscode/extensions.json'
    ]
  },
  eslintConfigPrettier,
  {
    files: ['**/*.{js,jsx,ts,tsx,cjs,mts,mjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tseslintParser,
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx']
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.cjs', '.mts', '.mjs']
        }
      },
      perfectionist: {
        type: 'line-length',
        partitionByComment: true
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: eslintPluginPrettier,
      promise: eslintPluginPromise,
      import: eslintPluginImport,
      unicorn: eslintPluginUnicorn,
      security: eslintPluginSecurity,
      perfectionist: eslintPluginPerfectionist,
      n: eslintPluginN
    },
    rules: {
      'n/exports-style': ['error', 'module.exports'],
      'n/no-extraneous-import': 'off',
      "n/no-unsupported-features/es-syntax": ["error", {
        "ignores": ['modules', 'dynamicImport']
      }],
      'n/no-missing-import': 'off',
      'n/no-unpublished-import': 'off',
      'perfectionist/sort-objects': ['error', {
        type: 'alphabetical'
      }],
      'perfectionist/sort-interfaces': ['error'],
      'import/no-unresolved': 'error',
      'prettier/prettier': 'error',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/indent': 'off',
      '@typescript-eslint/member-delimiter-style': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true
      }],
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/no-array-method-this-argument': 'warn',
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/prefer-module': 'off',
      'no-console': [
        'error',
        {
          allow: ['warn', 'error', 'log']
        }
      ]
    }
  }
];
