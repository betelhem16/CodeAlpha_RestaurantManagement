# ADR 0004: Sequential Test File Execution

**Status:** Accepted

## Context
Vitest runs test files in parallel by default. Multiple test files share one physical SQLite test database, each resetting all tables in `beforeEach`. Running in parallel caused intermittent foreign key violations, as one file's reset could delete data another file was actively using.

## Decision
Set `fileParallelism: false` in `vitest.config.ts`.

## Reasoning
Correctness matters more than the negligible speed cost at this project's scale. This is a known tradeoff when multiple test files share physical database state rather than fully isolated databases per file.