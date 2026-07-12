# SaaS para Restaurantes — Contexto del Proyecto

## Stack
- **Backend**: Python 3.14+ / FastAPI / SQLAlchemy 2.0+ / asyncpg
- **Frontend**: Next.js 16 + React 19 / TypeScript 5 / Tailwind + shadcn/ui
- **DB/Auth/Realtime**: Supabase (PostgreSQL, Auth, Realtime)
- **Pagos**: Pago Móvil (Venezuela) con HITL (Human-in-the-Loop)
- **Comisiones**: $0.10 por orden confirmada

## Grafo de conocimiento
Este proyecto tiene un grafo de conocimiento pre-construido en `graphify-out/graph.json`.
- Para preguntas sobre arquitectura, relaciones entre módulos, flujos de datos o impacto de cambios: usa `/graphify query "<pregunta>"`
- El grafo se actualiza automáticamente tras cada commit via post-commit hook
- Si el grafo está desactualizado, corre `/graphify --update`

## Documentación autoritativa
- `specs/specs.md` — Especificación técnica (SSoT). Léelo antes de hacer cambios arquitectónicos.
- `README.md` — Vista general del proyecto
