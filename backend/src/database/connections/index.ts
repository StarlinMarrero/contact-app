import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "../../config/env";
import ormconfig from "./ormconfig";

const connection = new DataSource(ormconfig);

export async function createDataSourceConnections(): Promise<void> {
    await connection.initialize();
    console.log(`💾 Database connected to ${env.DATABASE_HOST}/${env.DATABASE_DATABASE}`);
}

export async function closeDataSourceConnections(): Promise<void> {
    if (!connection.isInitialized) return;
    await connection.destroy();
    console.log("💾 Database connection closed");
}

export default connection;
