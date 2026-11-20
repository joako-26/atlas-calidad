// PRUEBAS DE ACEPTACIÓN: reglas de negocio RB-4 y RB-5 (roles)
const { test, expect } = require("@playwright/test");
const { iniciarSesion } = require("../apoyo");

test("CA-RB5: el administrador ve la opción de eliminar clientes", async ({ page }) => {
    await iniciarSesion(page, "admin", "admin");
    await expect(page).toHaveURL(/\/home/);
    await page.goto("/clientes");
    await expect(page.getByTestId("button-cliente-eliminar-1")).toBeVisible();
});

test("CA-RB4: el editor NO ve la opción de eliminar clientes", async ({ page }) => {
    await iniciarSesion(page, "editor", "editor");
    await expect(page).toHaveURL(/\/home/);
    await page.goto("/clientes");
    await expect(page.getByTestId("button-cliente-editar-1")).toBeVisible();
    await expect(page.getByTestId("button-cliente-eliminar-1")).toHaveCount(0);
});