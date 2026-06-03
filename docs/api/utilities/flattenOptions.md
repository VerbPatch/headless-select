---
title: flattenOptions
description: Processes a mixed array of options and groups, injecting group metadata and inheriting disabled states.
---

# flattenOptions()

> **flattenOptions**(`items`): [`SelectOption`](/select/docs/api/types/SelectOption)[]

Defined in: [utils/options.ts:11](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/utils/options.ts#L11)

Flattens a list of options that may contain groups into a single flat array.

## Parameters

### items

[`DataItem`](/select/docs/api/types/DataItem)[]

The array of options or groups to flatten.

## Returns

[`SelectOption`](/select/docs/api/types/SelectOption)[]

- A flat array of SelectOption objects.
