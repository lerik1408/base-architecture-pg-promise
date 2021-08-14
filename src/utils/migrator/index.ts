import fs from 'fs';
import db from '../../database/index';

interface Table {
  schemaname: string,
  tablename: string,
  tableowner: string,
  tablespace: null | null,
  hasindexes: boolean,
  hasrules: boolean,
  hastriggers: boolean,
  rowsecurity: boolean
}

class Migrator {
  static async create() {
    await fs.promises.mkdir('./migrations', { recursive: true });
    fs.writeFileSync(`./migrations/${Math.round(+new Date() / 1000)}-${process.argv[process.argv.length - 1]}.sql`, '-- update\n\n-- downgrade\n');
  }

  static async run() {
    const tables: Table[] = await db.query(`
      SELECT *
      FROM pg_catalog.pg_tables
      WHERE schemaname != 'pg_catalog' AND
      schemaname != 'information_schema';
    `);

    let filesName: string[] = fs.readdirSync('./migrations');

    filesName = filesName.map((file) => file.slice(0, -4)).sort();

    // MB change on switch case without brake or just delete else =)
    if (!tables.find((table) => table.tablename === 'migrations')) {
      await db.query(`
      CREATE TABLE migrations (
        id serial primary key,
        name varchar(225)
      );`);
    } else {
      const existingMigrations: Array<{id: number, name: string}> = await db.query(`
        SELECT * FROM "migrations"
      `);

      const notExistingMigrations = new Set(filesName.map((migration) => migration));

      existingMigrations.forEach((migration) => {
        notExistingMigrations.delete(migration.name);
      });

      // TODO create one big transaction for all migrations
      for (let i = 0; i < notExistingMigrations.size; i += 1) {
        const fileName = [...notExistingMigrations][i];
        const [update] = fs.readFileSync(`migrations/${fileName}.sql`).toString().split('-- downgrade');

        // eslint-disable-next-line no-await-in-loop
        await db.tx('migration-run', async (t) => {
          await t.query(update);
        })
          .then(async () => {
            await db.query(`INSERT INTO migrations (name) VALUES ('${fileName}');`);
          })
          .catch((e) => {
            throw new Error(`Wrong migration: ${fileName}, ${e.message}`);
          });
      }
    }
  }

  static async revert(specified: undefined | number) {
    const tables: Table[] = await db.query(`
    SELECT *
      FROM pg_catalog.pg_tables
      WHERE schemaname != 'pg_catalog' AND
      schemaname != 'information_schema';
    `);

    let filesName: string[] = fs.readdirSync('./migrations');
    filesName = filesName.map((file) => file.slice(0, -4)).sort();

    if (!tables.find((table) => table.tablename === 'migrations')) {
      throw new Error('Create first migration');
    }
    const allMigration: Array<{id: number, name: string}> = await db.query(`
      SELECT * FROM "migrations" ORDER BY id DESC
    `);
    let migrationForRevert = allMigration[0];
    if (specified) {
      migrationForRevert = allMigration.find((m) => m.id === specified);
    }

    const existFile = filesName.find((fileName) => fileName === migrationForRevert?.name);
    if (!existFile) {
      throw new Error(`File for migration ${migrationForRevert?.name} not found`);
    }

    const [, downgrade] = fs.readFileSync(`migrations/${existFile}.sql`).toString().split('-- downgrade');
    await db.tx('migration-revert', async (t) => {
      await t.query(downgrade);
    })
      .then(async () => {
        await db.query(`DELETE FROM migrations WHERE id = ${migrationForRevert.id}`);
      })
      .catch((err) => {
        throw new Error(`Problem with revert migration ${err.message}`);
      });
  }
}

export default Migrator;
