// PRUEBA UNITARIA CON SIMULACIONES (mocks)
// Probamos el "portero" que valida los datos, sin servidor ni base de datos.
const yup = require("yup");
const validate = require("../../src/middleware/validate");

function crearRespuestaFalsa() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

const schema = yup.object({ nombre: yup.string().required("El nombre es requerido") });

test("Datos válidos: deja pasar la petición (llama a next)", async () => {
    const next = jest.fn();
    await validate(schema)({ body: { nombre: "Ana" } }, crearRespuestaFalsa(), next);
    expect(next).toHaveBeenCalled();
});

test("Datos inválidos: responde 400 y explica el error", async () => {
    const res = crearRespuestaFalsa();
    const next = jest.fn();
    await validate(schema)({ body: {} }, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].detalles[0].field).toBe("nombre");
});

test("Error inesperado: responde 500", async () => {
    const schemaRoto = { validate: () => Promise.reject(new Error("falla interna")) };
    const res = crearRespuestaFalsa();
    await validate(schemaRoto)({ body: {} }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
});