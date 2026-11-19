// PRUEBAS UNITARIAS DE CAJA BLANCA
// Se diseñaron mirando el código: hay un caso por cada camino posible.
const { calcularEstadoContrato } = require("../../src/utils/estadoContrato");

const HOY = new Date("2026-06-15");

describe("calcularEstadoContrato (RF-5.4)", () => {
    test("Camino 1: faltan fechas -> error", () => {
        expect(() => calcularEstadoContrato(null, "2026-12-31", HOY)).toThrow("obligatorias");
    });

    test("Camino 2: fecha con formato inválido -> error", () => {
        expect(() => calcularEstadoContrato("hola", "2026-12-31", HOY)).toThrow("inválido");
    });

    test("Camino 3: término anterior al inicio -> error", () => {
        expect(() => calcularEstadoContrato("2026-12-31", "2026-01-01", HOY)).toThrow("anterior");
    });

    test("Camino 4: el contrato aún no comienza -> pendiente", () => {
        expect(calcularEstadoContrato("2026-07-01", "2026-12-31", HOY)).toBe("pendiente");
    });

    test("Camino 5: el contrato ya terminó -> expirado", () => {
        expect(calcularEstadoContrato("2026-01-01", "2026-06-01", HOY)).toBe("expirado");
    });

    test("Camino 6: termina dentro de 30 días -> por_vencer", () => {
        expect(calcularEstadoContrato("2026-01-01", "2026-07-01", HOY)).toBe("por_vencer");
    });

    test("Camino 7: termina en más de 30 días -> activo", () => {
        expect(calcularEstadoContrato("2026-01-01", "2026-12-31", HOY)).toBe("activo");
    });
});