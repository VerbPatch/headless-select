---
title: SelectGroup
description: Defines a group of options with a shared label and optional group-level disabled state.
---

# SelectGroup

> **SelectGroup** = `object`

Defined in: [core/types.ts:33](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L33)

Represents a group of options in the dropdown.

## Properties

### disabled?

> `optional` **disabled?**: `boolean`

Defined in: [core/types.ts:45](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L45)

Whether the entire group and its options are disabled.

***

### label

> **label**: `string`

Defined in: [core/types.ts:37](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L37)

The heading label for the group.

***

### options

> **options**: [`SelectOption`](/select/docs/api/types/SelectOption)[]

Defined in: [core/types.ts:41](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L41)

The list of options belonging to this group.
