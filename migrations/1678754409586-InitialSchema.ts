import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1678754409586 implements MigrationInterface {
    name = 'InitialSchema1678754409586'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`book\`
            ADD \`userId\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\` CHANGE \`id\` \`id\` bigint NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\` DROP PRIMARY KEY
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\` DROP COLUMN \`id\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\`
            ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\` DROP COLUMN \`title\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\`
            ADD \`title\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\` DROP COLUMN \`content\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\`
            ADD \`content\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`id\` \`id\` bigint NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP PRIMARY KEY
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`id\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`email\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`email\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`password\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`password\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\`
            ADD CONSTRAINT \`FK_04f66cf2a34f8efc5dcd9803693\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`book\` DROP FOREIGN KEY \`FK_04f66cf2a34f8efc5dcd9803693\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`password\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`password\` varchar(256) CHARACTER SET "utf8mb3" COLLATE "utf8mb3_bin" NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`email\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`email\` varchar(256) CHARACTER SET "utf8mb3" COLLATE "utf8mb3_bin" NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`id\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`id\` bigint NOT NULL AUTO_INCREMENT
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD PRIMARY KEY (\`id\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`id\` \`id\` bigint NOT NULL AUTO_INCREMENT
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\` DROP COLUMN \`content\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\`
            ADD \`content\` varchar(256) CHARACTER SET "utf8mb3" COLLATE "utf8mb3_bin" NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\` DROP COLUMN \`title\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\`
            ADD \`title\` varchar(256) CHARACTER SET "utf8mb3" COLLATE "utf8mb3_bin" NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\` DROP COLUMN \`id\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\`
            ADD \`id\` bigint NOT NULL AUTO_INCREMENT
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\`
            ADD PRIMARY KEY (\`id\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\` CHANGE \`id\` \`id\` bigint NOT NULL AUTO_INCREMENT
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\` DROP COLUMN \`userId\`
        `);
    }

}
