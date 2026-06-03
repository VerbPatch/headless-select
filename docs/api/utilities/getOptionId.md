---
title: getOptionId
description: Creates an ID string based on the instance ID and option value, sanitizing special characters.
---

# getOptionId()

> **getOptionId**(`instanceId`, `value`): `string`

Defined in: [utils/common.ts:22](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/utils/common.ts#L22)

Generates a stable and valid DOM ID for an option.

## Parameters

### instanceId

`string`

The ID of the select instance.

### value

`string`

The value of the option.

## Returns

`string`

- A sanitized DOM ID string.
