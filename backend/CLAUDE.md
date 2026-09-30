# Backend

NestJS application.

## Commands

- `npm run start:dev`: start in watch mode
- `npm run build`: build
- `npm run lint`: lint with oxlint (type-aware)
- `npm run format`: format with prettier

## Module structure

**IMPORTANT:** every new feature module must follow this layout:

```
module-name/
├── module-name.constants.ts           # Module-specific constants and DI tokens (e.g. repository token)
├── module-name.module.ts              # Main module definition
├── domain/                            # Business logic layer
│   ├── entities/                      # Domain entities with class-transformer decorators
│   │   └── entity-name.entity.ts      # @Expose/@Exclude for field visibility
│   ├── interfaces/                    # Interfaces reused across the module
│   │   ├── entity-name-repository.interface.ts # Repository contract the service depends on
│   │   └── paginated-result.interface.ts       # e.g. PaginatedResult<T> for list results
│   ├── queries/                       # Plain data-transfer objects for repository operations (no validation)
│   │   ├── get-entities.query.ts      # List queries with pagination/filtering
│   │   ├── get-one-entity.query.ts    # Single entity queries
│   │   └── delete-entity.query.ts     # Delete operation queries
│   └── services/                      # Domain services implementing business logic
│       └── entity-name.service.ts     # Service implementing domain interfaces
├── infrastructure/                    # Data access layer
│   ├── persistence/                   # TypeORM schemas (@Entity), registered via TypeOrmModule.forFeature
│   │   └── entity-name.orm-entity.ts
│   ├── mappers/                       # ORM entity <-> domain entity conversion
│   │   └── entity-name.mapper.ts
│   └── repositories/                  # Data access repositories
│       └── entity-name.repository.ts  # CRUD over the ORM entity; accepts query objects, returns domain entities
└── resources/                         # API layer
    ├── controllers/                   # HTTP controllers
    │   ├── entity-name.controller.ts  # REST API endpoints
    │   └── entity-name.controller.http # HTTP test files
    ├── requests/                      # Request DTOs (class-validator lives here only)
    │   ├── create-entity.request.payload.ts  # @Body(); toEntity()
    │   ├── update-entity.request.payload.ts  # @Body(); toEntity()
    │   └── get-entities.request.query.ts     # @Query(); toQuery()
    └── responses/                     # Response DTOs
        ├── create-entity.response.ts
        ├── get-one-entity.response.ts
        ├── get-entities.response.ts
        └── update-entity.response.ts
```

Domain rules:
- Domain entities have no separate props interface: the constructor is typed with the entity itself (`constructor(props: Partial<EntityName> = {}) { Object.assign(this, props); }`). `Partial` allows not-yet-persisted entities (no id/timestamps) and partial changes for updates.
- `domain/queries/` classes are plain data carriers between layers: fields plus an `Object.assign` constructor typed with the class itself. No class-validator/class-transformer decorators, no computed logic (e.g. skip/offset is computed in the repository).
- Every interface reused within the module (repository contract, paginated result, etc.) goes in `domain/interfaces/<name>.interface.ts`, not in services, constants or repositories. `module-name.constants.ts` holds only constants and DI tokens.
- Don't spread class instances (`{ ...entity }`, which oxlint flags with `no-misused-spread`). Copy with `new EntityName(entity)` and then assign fields.

Resources rules:
- Validation (class-validator / class-transformer `@Type`/`@Transform`) lives only in `resources/requests/`. Body DTOs are `*.request.payload.ts`; query-string DTOs are `*.request.query.ts`.
- Controllers never pass request DTOs to the domain. Each payload has a `toEntity()` that returns a domain entity, and each request query has a `toQuery()` that returns a domain query. Values that don't belong on the entity (e.g. a plain-text `password`) are passed to the service as separate arguments.
- Request DTOs are written out explicitly. Don't use `PartialType`/`@nestjs/mapped-types`, because it copies properties but not methods like `toEntity()`.
- Each response class declares every field it returns with `@Expose()` and doesn't extend another response class, even when the fields are identical. Each has a static `fromEntity()` (or `fromResult()` for lists) built with `plainToInstance(..., { excludeExtraneousValues: true })`. List responses may compose item response classes (`@Type(() => GetOneEntityResponse)`).
- The global `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`, `transform`) and `ClassSerializerInterceptor` (`excludeExtraneousValues`) are registered as `APP_PIPE`/`APP_INTERCEPTOR` in `AppModule`, so request DTOs arrive as class instances with their methods intact. Don't re-register them per controller.


Infrastructure rules:
- TypeORM decorators live only in `infrastructure/persistence/`; domain entities stay free of ORM concerns.
- Repositories never leak ORM entities — they map to domain entities through `infrastructure/mappers/`.
- Services depend on the repository through the token in `module-name.constants.ts` (`@Inject(TOKEN)`), typed by the interface in `domain/interfaces/` and bound in `module-name.module.ts`, so the implementation can be swapped or mocked in unit tests.
