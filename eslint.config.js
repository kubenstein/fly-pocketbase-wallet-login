import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import eslintPluginSvelte from 'eslint-plugin-svelte'
import js from '@eslint/js'
import globals from 'globals'
import svelteParser from 'svelte-eslint-parser'
import tsEslint from 'typescript-eslint'
import tsParser from '@typescript-eslint/parser'

export default [
	js.configs.recommended,
	...tsEslint.configs.recommended,
	...eslintPluginSvelte.configs['flat/recommended'],
	eslintPluginPrettierRecommended, // must be last
	{
		languageOptions: {
			globals: globals.browser
		},
		rules: {
			'prettier/prettier': 'error',
			'no-empty-pattern': 'off',
			indent: 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					vars: 'all',
					args: 'after-used',
					ignoreRestSiblings: true,
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_'
				}
			]
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tsParser
			}
		}
	}
]
