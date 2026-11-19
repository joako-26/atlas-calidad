// PRUEBAS DE INTEGRACIÓN
// Verifican que la API, la validación, la seguridad (JWT) y la base de datos
// PostgreSQL funcionen bien JUNTAS. Requieren la base de datos encendida.
const request = require("supertest");
const app = require("../../src/app");
const { pool } = require("../../src/db");

async function iniciarSesion(usuario, clave) {
    const res = await request(app)
        .post("/autenticacion/login")
        .send({ nombre_usuario: usuario, password: clave });
    return res.body.token;
}

function clienteDePrueba() {
    const id = Date.now();
    return {
        nombre: "Cliente Prueba",
        correo: `cliente${id}@prueba.cl`,
        telefono: "912345678",
        rut: "11111111-1",
        nombre_fantasia: "Prueba SpA",
        giro_actividad_economica: "Servicios",
        nombre_representante: "Ana Pérez",
        cargo_representante: "Gerente",
        correo_representante: `rep${id}@prueba.cl`,
        telefono_representante: "912345678",
        relacion_representante: "Representante legal",
        direccion_calle: "Av. Siempre Viva",
        direccion_numero: "742",
        direccion_ciudad: "Santiago",
        direccion_region: "Metropolitana",
        sitio_web: "https://www.prueba.cl",
        telefono_corporativo: "223456789",
        nombre_banco: "Banco Estado",
        numero_cuenta: "123456",
        titular_cuenta: "Prueba SpA",
        metodo_pago: "transferencia",
        dia_pago: "5",
        moneda: "CLP",
    };
}

afterAll(async () => {
    await pool.end();
});

describe("RF-1 Autenticación", () => {
    test("Credenciales correctas -> 200 y entrega un token", async () => {
        const res = await request(app)
            .post("/autenticacion/login")
            .send({ nombre_usuario: "admin", password: "admin" });
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    test("Contraseña incorrecta -> 401", async () => {
        const res = await request(app)
            .post("/autenticacion/login")
            .send({ nombre_usuario: "admin", password: "equivocada" });
        expect(res.status).toBe(401);
    });

    test("Datos incompletos -> 400 (lo detiene la validación)", async () => {
        const res = await request(app).post("/autenticacion/login").send({});
        expect(res.status).toBe(400);
    });
});

describe("RF-4 Gestión de clientes", () => {
    test("Sin token no se puede listar -> 401", async () => {
        const res = await request(app).get("/clientes");
        expect(res.status).toBe(401);
    });

    test("Con token de administrador se listan los clientes -> 200", async () => {
        const token = await iniciarSesion("admin", "admin");
        const res = await request(app).get("/clientes").set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test("Administrador crea un cliente válido -> 201", async () => {
        const token = await iniciarSesion("admin", "admin");
        const res = await request(app)
            .post("/clientes")
            .set("Authorization", `Bearer ${token}`)
            .send(clienteDePrueba());
        expect(res.status).toBe(201);
    });
});

describe("RB-4 Un editor solo tiene permisos de lectura", () => {
    test("Un editor NO puede eliminar clientes -> 403", async () => {
        const tokenAdmin = await iniciarSesion("admin", "admin");
        const creado = await request(app)
            .post("/clientes")
            .set("Authorization", `Bearer ${tokenAdmin}`)
            .send(clienteDePrueba());

        const tokenEditor = await iniciarSesion("editor", "editor");
        const res = await request(app)
            .delete(`/clientes/${creado.body.id}`)
            .set("Authorization", `Bearer ${tokenEditor}`);

        expect(res.status).toBe(403);
    });
});