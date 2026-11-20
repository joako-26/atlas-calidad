// PRUEBAS DE ACEPTACIÓN: cada prueba corresponde a un criterio de aceptación
// escrito en la ERS de Atlas. Formato: Dado / Cuando / Entonces.
const { test, expect } = require("@playwright/test");
const { iniciarSesion } = require("../apoyo");

test("CA-RF1: un login exitoso abre la sesión y muestra el panel", async ({ page }) => {
    // Dado un usuario registrado (admin)
    // Cuando ingresa sus credenciales correctas
    await iniciarSesion(page, "admin", "admin");
    // Entonces entra al panel principal y ve su nombre
    await expect(page).toHaveURL(/\/home/);
    await expect(page.getByText("Bienvenido")).toBeVisible();
});

test("CA-RF1: el cierre de sesión invalida el acceso", async ({ page, isMobile }) => {
    test.skip(isMobile, "En celular el menú lateral está oculto");
    // Dado un usuario con sesión iniciada
    await iniciarSesion(page, "admin", "admin");
    await expect(page).toHaveURL(/\/home/);
    // Cuando cierra la sesión
    await page.getByTestId("button-layout-logout").click();
    // Entonces vuelve al login y ya no puede entrar a páginas protegidas
    await expect(page).toHaveURL(/\/login/);
    await page.goto("/clientes");
    await expect(page).toHaveURL(/\/login/);
});