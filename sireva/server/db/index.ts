import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
	throw new Error('DATABASE_URL is not set')
}

function getSslConfig() {
	let sslMode: string | undefined

	try {
		sslMode = new URL(connectionString as string).searchParams.get('sslmode')?.toLowerCase()
	} catch {
		sslMode = undefined
	}

	sslMode ??= process.env.PGSSLMODE?.toLowerCase()

	if (!sslMode || sslMode === 'disable') {
		return undefined
	}

	const rejectUnauthorized = process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === 'true'
		? true
		: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === 'false'
			? false
			: sslMode !== 'require'

	return { rejectUnauthorized }
}

// Pool PostgreSQL
export const pool = new Pool({
	connectionString,
	ssl: getSslConfig(),
})




// Instance drizzle ORM
export const db = drizzle(pool)

export * from './schema';
