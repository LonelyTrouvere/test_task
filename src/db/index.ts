import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
 
const client = new Client({
  connectionString: "postgresql://postgres:postgres@localhost:5433/testDB",
});

export const db = drizzle(client)
 
export const connect = async () => {
  console.log('Conecting to db...')
  await client.connect();
  console.log('Connected tp db!')
}
