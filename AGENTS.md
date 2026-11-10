## Development

This project uses **pnpm** (`packageManager: pnpm@12.18.0`). Do not add `package-lock.json` or npm scripts.

```sh
pnpm install
pnpm dev
```

When starting the dev server in the background:

```sh
pnpm dev:background
```

Manage it with `pnpm dev:status`, `pnpm dev:logs`, and `pnpm dev:stop`.

If pnpm is not available globally, use `corepack pnpm <command>`.

Before finishing a change, run:

```sh
pnpm check
pnpm build
```

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
