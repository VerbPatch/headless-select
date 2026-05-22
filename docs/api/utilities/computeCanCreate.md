---
title: computeCanCreate
description: Validates the search term against existing options and configuration rules to decide if creation is allowed.
---

# computeCanCreate()

> **computeCanCreate**(`config`, `search`, `resolved`): `boolean`

Defined in: [utils/options.ts:113](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/utils/options.ts#L113)

Determines if a new custom option can be created based on the current search input.

## Parameters

### config

[`SelectConfig`](/select/docs/api/types/SelectConfig)

The select configuration.

### search

`string`

The current search term.

### resolved

[`SelectOption`](/select/docs/api/types/SelectOption)[]

The current set of resolved options.

## Returns

`boolean`

- True if a new option can be created.
