// Datos de conexión que usan las pruebas cuando no se indican otros.
// Apuntan a la base de datos que levanta docker compose (puerto 15433).
process.env.DATABASE_URL =
    process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:15433/atlas";
process.env.JWT_SECRET = process.env.JWT_SECRET || "clave-solo-para-pruebas";