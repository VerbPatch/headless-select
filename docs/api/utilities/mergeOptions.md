---
title: mergeOptions
description: Combines two sets of options, ensuring that values already present in the existing set are not duplicated.
---

# mergeOptions()

> **mergeOptions**(`existing`, `incoming`): [`SelectOption`](/select/docs/api/types/SelectOption)[]

Defined in: [utils/options.ts:75](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/utils/options.ts#L75)

Merges new options into an existing array while preventing duplicate values.

## Parameters

### existing

[`SelectOption`](/select/docs/api/types/SelectOption)[]

The current set of options.

### incoming

[`SelectOption`](/select/docs/api/types/SelectOption)[]

The new options to be merged.

## Returns

[`SelectOption`](/select/docs/api/types/SelectOption)[]

- The combined unique set of options.
