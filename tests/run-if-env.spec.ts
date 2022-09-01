import {SyncOptions, ExecaSyncReturnValue} from 'execa';
import {join} from 'path';
import {expect} from 'chai';

const binpath: string = join(__dirname, '../bin');

const getXrun = async () => {
	const execa = await import('execa');
	const xrun = (
		args: string[],
		options: SyncOptions<string> = {},
	): ExecaSyncReturnValue<string> => {
		return execa.execaCommandSync(`node ${binpath} ${args.join(' ')}`, options);
	};

	return xrun;
};

describe('run-if-env', (): void => {
	it('should succeed if env === is argument', () => {
		getXrun()
			.then(xrun => {
				const {stdout} = xrun(['TEST_ENV', '--is', 'testing'], {
					cwd: __dirname,
				});
				expect(stdout).equals('Continuing execution as TEST_ENV === testing');
			})
			.catch(error => {
				console.log(error);
			});
	});

	it('should fail if env !== is argument', () => {
		getXrun().then(xrun => {
			const {stdout} = xrun(['TEST_ENV', '--is', 'production'], {
				cwd: __dirname,
			});
			expect(stdout).equals('Exiting as TEST_ENV !== production');
		});
	});

	it('should succeed if env is NOT IN not argument', () => {
		getXrun().then(xrun => {
			const {stdout} = xrun(['TEST_ENV', '--not', 'staging,qa'], {
				cwd: __dirname,
			});
			expect(stdout).equals('Exiting as TEST_ENV !== production');
		});
	});

	it('should fail if env IS IN not argument', () => {
		getXrun().then(xrun => {
			const {stdout} = xrun(['TEST_ENV', '--not', 'testing,development'], {
				cwd: __dirname,
			});
			expect(stdout).equals('Exiting as TEST_ENV !== production');
		});
	});
});
