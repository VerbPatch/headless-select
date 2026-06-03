---
title: useSelect
description: The core engine of the library. It manages internal state, provides imperative actions, and generates ARIA-compliant props for UI elements.
---

# useSelect()

> **useSelect**(`initialConfig`): [`SelectInstance`](/select/docs/api/types/SelectInstance)

Defined in: [useSelect.ts:43](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/useSelect.ts#L43)

Creates and manages a headless select instance.

## Parameters

### initialConfig

[`SelectConfig`](/select/docs/api/types/SelectConfig)

The initial configuration for the select instance.

## Returns

[`SelectInstance`](/select/docs/api/types/SelectInstance)

- An object containing state accessors, actions, and prop getters.

## Example

```typescript
const select = useSelect({
  options: [{ value: '1', label: 'Option 1' }],
  onChange: (value) => console.log(value),
});

const triggerProps = select.getTriggerProps();
```
