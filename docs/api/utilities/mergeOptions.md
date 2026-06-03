---
title: mergeOptions
description: Combines two sets of options, ensuring that values already present in the existing set are not duplicated.
---

# mergeOptions()

> **mergeOptions**(`existing`, `incoming`): [`SelectOption`](/select/docs/api/types/SelectOption)[]

Defined in: [utils/options.ts:77](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/utils/options.ts#L77)

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
