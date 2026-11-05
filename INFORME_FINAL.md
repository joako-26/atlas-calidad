# Informe final de calidad y CI/CD

## Riesgo aceptado de Trivy

- **CVE:** CVE-2026-117610
- **Componente:** `libexpat` detectado en la imagen Docker del frontend.
- **Motivo:** Atlas sirve archivos estaticos mediante Nginx y no utiliza `libexpat` para procesar XML en el frontend. El informe de Trivy consultado no indicaba una version corregida.
- **Decisión:** Aceptación temporal y explícita del riesgo, limitada a esta CVE. Los demás hallazgos continúan sujetos al escaneo y a la política normal del pipeline.
- **Responsable:** joako-26.
- **Revisar antes de:** 2026-12-31.

La excepción se aplica mediante `.trivyignore` en ambos escaneos de imágenes del workflow. En la fecha de revisión se debe comprobar nuevamente la disponibilidad de una versión corregida y reevaluar si la excepción sigue siendo necesaria.
