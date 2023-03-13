import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1678682205057 implements MigrationInterface {
    name = 'InitialSchema1678682205057'

    public async up(queryRunner: QueryRunner): Promise<void> {
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
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
    }

}
