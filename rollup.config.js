import {nodeResolve} from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import del from 'rollup-plugin-delete';
import {terser} from 'rollup-plugin-terser';

export default [
	{
		input: ['src/index.ts'],
		plugins: [
			typescript({
				tsconfig: './tsconfig.json',
				sourceMap: process.env.NODE_ENV !== 'production',
			}),
			nodeResolve(),
			commonjs({extensions: ['.js', '.ts']}),
			json(),
			del({targets: 'dist/*'}),
			process.env.NODE_ENV === 'production' && terser(),
		],
		output: [
			{
				dir: 'dist',
				format: 'cjs',
				exports: 'named',
				sourcemap: process.env.NODE_ENV !== 'production',
			},
		],
	},
];
