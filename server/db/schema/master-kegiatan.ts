import { pgSchema, pgTable, serial, varchar, text, timestamp, numeric, integer, foreignKey } from 'drizzle-orm/pg-core'
import { masterProgram } from './master-program'

const keuangan = pgSchema('keuangan')

export const masterKegiatan = keuangan.table('master_kegiatan', {
	id: serial('id').primaryKey(),
	kodeKegiatan: varchar('kode_kegiatan'),
	namaKegiatan: text('nama_kegiatan'),
	programId: integer('program_id').references(() => masterProgram.id),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
	total: numeric('total'),
})
