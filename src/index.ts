import * as envcmd from 'env-cmd';
import minimist from 'minimist';

export async function init(argv: string[]) {
	try {
		const {_, not, only, file}: Record<string, string | undefined> = minimist(
			argv,
			{string: ['_']},
		);
		// eslint-disable-next-line new-cap
		const env: Record<string, string> = await envcmd.GetEnvVars({
			envFile: {filePath: file ?? undefined},
		});
		const nodeEnv: string = env.NODE_ENV;
		const customTargetVar = _![0];
		const notIn = not?.split(',') ?? [];
		const targetValue: string = env[customTargetVar] || nodeEnv;

		const exitWithLog = (conditionValue: string, equalityTerm: string) => {
			console.log(
				'\x1b[31m%s\x1b[0m',
				`Exiting as ${
					customTargetVar ?? 'NODE_ENV'
				} ${equalityTerm} ${conditionValue}.`,
			);

			return process.exit(1);
		};

		if (targetValue === undefined) {
			throw new Error('Conditionally: No valid target env var provided!');
		}

		if (not && only) {
			throw new Error(
				'Conditionally: You can enter only one conditional argument (not || only) at a time',
			);
		}

		notIn?.forEach(not => {
			if (targetValue === not) {
				return exitWithLog(not, '===');
			}
		});

		if (typeof only === 'string') {
			if (targetValue !== only) {
				return exitWithLog(only, '!==');
			}
		}

		console.log(
			'\x1b[32m%s\x1b[0m',
			`Continuing execution as ${customTargetVar ?? 'NODE_ENV'} ${
				not ? (notIn.length > 1 ? 'not in' : '!==') : '==='
			} ${not ?? only ?? 'the arguments you provided'}`,
		);
		return true;
	} catch (error: unknown) {
		console.error(error);
	}
}

export default init;
