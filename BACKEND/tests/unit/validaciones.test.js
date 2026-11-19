// PRUEBAS UNITARIAS DE CAJA NEGRA
// Se diseñaron leyendo los requisitos, sin mirar el código:
// particiones de equivalencia y valores límite.
const { loginSchema } = require("../../src/validations/auth");
const { createContractSchema } = require("../../src/validations/contracts");

const esValido = (schema, datos) => schema.isValid(datos);

describe("Login: largo del nombre de usuario (3 a 50 caracteres)", () => {
    test.each([
        ["vacío", "", false],
        ["2 caracteres (límite inferior - 1)", "ab", false],
        ["3 caracteres (límite inferior)", "abc", true],
        ["50 caracteres (límite superior)", "a".repeat(50), true],
        ["51 caracteres (límite superior + 1)", "a".repeat(51), false],
    ])("Usuario %s -> válido: %s", async (_caso, usuario, esperado) => {
        await expect(esValido(loginSchema, { nombre_usuario: usuario, password: "x" }))
            .resolves.toBe(esperado);
    });

    test("Sin contraseña -> inválido", async () => {
        await expect(esValido(loginSchema, { nombre_usuario: "admin" })).resolves.toBe(false);
    });
});

describe("Contratos: reglas de fechas y cliente", () => {
    const base = {
        cliente_id: 1,
        titulo: "Contrato de prueba",
        fecha_inicio: "2026-01-01",
        fecha_fin: "2026-12-31",
    };

    test("Datos correctos -> válido", async () => {
        await expect(esValido(createContractSchema, base)).resolves.toBe(true);
    });

    test("Término anterior al inicio -> inválido", async () => {
        await expect(esValido(createContractSchema, { ...base, fecha_fin: "2025-12-31" }))
            .resolves.toBe(false);
    });

    test.each([
        ["texto", "abc"],
        ["cero", 0],
        ["negativo", -5],
    ])("cliente_id %s -> inválido", async (_caso, valor) => {
        await expect(esValido(createContractSchema, { ...base, cliente_id: valor }))
            .resolves.toBe(false);
    });

    test("Título de 2 caracteres (bajo el mínimo de 3) -> inválido", async () => {
        await expect(esValido(createContractSchema, { ...base, titulo: "ab" })).resolves.toBe(false);
    });
});