import {nodeResolve} from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import del from 'rollup-plugin-delete';
import {terser} from 'rollup-plugin-terser';

const production = process.env.BUILD === 'production';

export default {
	input: ['src/index.ts'],
	output: [
		{
			dir: 'dist',
			format: 'cjs',
			exports: 'named',
			sourcemap: !production,
		},
	],
	plugins: [
		typescript({
			tsconfig: './tsconfig.rollup.json',
			sourceMap: !production,
		}),
		nodeResolve(),
		commonjs({extensions: ['.js', '.ts']}),
		json(),
		del({targets: 'dist/*'}),
		production && terser(),
	],
};
