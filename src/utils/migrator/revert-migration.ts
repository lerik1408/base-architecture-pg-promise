import Migrator from './index';

Migrator.revert(+process.argv[process.argv.length - 1]);
