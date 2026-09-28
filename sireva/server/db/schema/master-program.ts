import { pgSchema, pgTable, serial, varchar, text, timestamp, numeric } from 'drizzle-orm/pg-core'

const keuangan = pgSchema('keuangan')

export const masterProgram = keuangan.table('master_program', {
	id: serial('id').primaryKey(),
	kodeProgram: varchar('kode_program'),
	namaProgram: text('nama_program'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
	total: numeric('total'),
})
