# Architecture Decisions

One row per decision worth not relitigating. Newest first.

| Date | Decision | Why | Alternatives considered |
| --- | --- | --- | --- |
| 2026-09-18 | Implement heartbeat types (PERIODIC, ON_DEMAND, STARTUP) in backend health state | Provides visibility into the type of health check being performed, enabling better monitoring and diagnostics. Different heartbeat types serve different purposes: PERIODIC for scheduled checks, ON_DEMAND for triggered checks, and STARTUP for initialization checks. | Single generic heartbeat without type classification; separate endpoints for each type |
| | | | |
