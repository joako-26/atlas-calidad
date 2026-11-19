/**
 * Calcula el estado de un contrato (RF-5.4) según sus fechas.
 * Devuelve: "pendiente", "activo", "por_vencer" o "expirado".
 */
function calcularEstadoContrato(fechaInicio, fechaFin, hoy = new Date(), diasAviso = 30) {
    if (!fechaInicio || !fechaFin) {
        throw new Error("Las fechas de inicio y término son obligatorias");
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) {
        throw new Error("Formato de fecha inválido");
    }
    if (fin < inicio) {
        throw new Error("La fecha de término no puede ser anterior a la de inicio");
    }

    if (hoy < inicio) return "pendiente";
    if (hoy > fin) return "expirado";

    const limiteAviso = new Date(hoy);
    limiteAviso.setDate(limiteAviso.getDate() + diasAviso);

    if (fin <= limiteAviso) return "por_vencer";
    return "activo";
}

module.exports = { calcularEstadoContrato };