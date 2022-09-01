import {SyncOptions, ExecaSyncReturnValue} from 'execa';
import {join} from 'path';
import {expect} from 'chai';
import sinon from 'sinon';

const binpath: string = join(__dirname, '../bin');

const getXrun = async ():
	Promise<(args: string[], options?: SyncOptions<string>) => ExecaSyncReturnValue<string>> => {
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
	let processExit;
	let xrun;

	before(async () => {
		xrun = await getXrun();
    processExit = sinon.stub(process, 'exit');
  });

	after(() => {
    processExit = processExit.restore();
  });


	it('should succeed if env === is argument', async () => {
		const {stdout} = xrun(['TEST_ENV', '--is', 'testing'], {
			cwd: __dirname,
		});
		expect(stdout).contains('Continuing execution as TEST_ENV === testing');
	});

	it('should fail if env !== is argument', async () => {		
		expect(() => {
			const {stdout} = xrun(['TEST_ENV', '--is', 'production'], {
				cwd: __dirname,
			});
			sinon.assert.called(processExit);
			expect(stdout).contains('Exiting as TEST_ENV !== production');
		});
	});

	it('should succeed if env is NOT IN not argument', async () => {
		const {stdout} = xrun(['TEST_ENV', '--not', 'staging,qa'], {
			cwd: __dirname,
		});
		expect(stdout).contains('Continuing execution as TEST_ENV not in staging,qa');
	});

	it('should fail if env IS IN not argument', async () => {		
		expect(() => {
			const {stdout} = xrun(['TEST_ENV', '--not', 'testing,development'], {
				cwd: __dirname,
			});
			sinon.assert.called(processExit);
			expect(stdout).contains('Exiting as TEST_ENV === testing');
		})

	});

	it('should not log to console if silent flag is provided', async () => {
		const {stdout} = xrun(
			['TEST_ENV', '--not', 'staging,qa', '--silent'],
			{
				cwd: __dirname,
			},
		);
		expect(stdout).eq('\u001b[32mfalse\u001b[0m');
	});

	it('should fallback to NODE_ENV if no env var is provided', async () => {
		const {stdout} = xrun(
			['NODE_ENV', '--not', 'staging,qa'],
			{
				cwd: __dirname,
			},
		);
		expect(stdout).contains('Continuing execution as NODE_ENV not in staging,qa');
	});
});
