---
title: SelectOption
description: Defines the structure for a standard select option, including its value, label, and metadata.
---

# SelectOption

> **SelectOption** = `object`

Defined in: [core/types.ts:7](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L7)

Represents a single selectable option in the dropdown.

## Indexable

> \[`key`: `string`\]: `any`

Arbitrary metadata associated with the option.

## Properties

### disabled?

> `optional` **disabled?**: `boolean`

Defined in: [core/types.ts:19](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L19)

Whether the option is disabled and cannot be selected.

***

### label

> **label**: `string`

Defined in: [core/types.ts:15](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L15)

The human-readable label displayed in the UI.

***

### value

> **value**: `string`

Defined in: [core/types.ts:11](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L11)

The machine-readable value stored and emitted by the select.
