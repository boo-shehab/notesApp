// migrations/YYYYMMDDHHMMSS_create_notes_table.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable('notes', (table) => {
      table.increments('id').primary();
      table.string('title', 255).notNullable();
      table.text('contents').notNullable();
      table.timestamp('created').defaultTo(knex.fn.now()).notNullable();
    });
  }
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export async function down(knex) {
    await knex.schema.dropTableIfExists('notes');
  }
  