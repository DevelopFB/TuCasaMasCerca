# Pull Request / Merge Request

## Resumen

Una línea: qué cambia este PR.

## Issue / ticket relacionado

Referencia al issue (`#NN`) si existe.

## Cambios incluidos

- [ ] Cambio 1
- [ ] Cambio 2
- [ ] Cambio 3

## Tipo de cambio

- [ ] Bug fix (no rompe funcionalidad existente)
- [ ] Nueva funcionalidad
- [ ] Breaking change (afecta API pública o contrato Web ↔ App)
- [ ] Refactor / mejora interna
- [ ] Documentación
- [ ] Infra / DevOps

## Cómo testearlo

Pasos para que el reviewer reproduzca el cambio.

## Checklist técnico

- [ ] Migrations de DB incluidas y testeadas (si aplica)
- [ ] RLS policies actualizadas (si aplica)
- [ ] Validación Zod / equivalente en endpoints nuevos
- [ ] Tests unitarios / e2e agregados o actualizados
- [ ] Lint y typecheck pasan
- [ ] Mocks o datos seed actualizados
- [ ] Documentación actualizada (`/docs/` o README)
- [ ] No introduce credenciales en el repo
- [ ] Verificado en staging

## Screenshots / videos

Para cambios visuales (antes / después).

## Riesgos / consideraciones de deploy

- Requiere migración de DB
- Requiere cambio de variables de entorno
- Afecta el contrato Web ↔ App (avisar al otro equipo)
- Rollback plan:

## Reviewers sugeridos
