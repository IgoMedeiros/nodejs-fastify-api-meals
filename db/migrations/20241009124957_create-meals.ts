import type { Knex } from "knex"


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('meals', (table) => {
        table.uuid('id').primary()
        table.string('name', 200).notNullable()
        table.text('description').notNullable()
        table.date('date').notNullable()
        table.time('time').notNullable()
        table.boolean('on_diet').notNullable().defaultTo(false)
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('meals')
}

