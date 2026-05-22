---
title: SelectInstance
description: Provides direct access to state, configuration, and imperative actions.
---

# SelectInstance

Defined in: [core/types.ts:370](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L370)

The main instance object for managing a select component.

## Properties

### clearAll

> **clearAll**: () => `void`

Defined in: [core/types.ts:410](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L410)

Deselects all currently selected values.

#### Returns

`void`

***

### close

> **close**: () => `void`

Defined in: [core/types.ts:390](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L390)

Closes the dropdown menu.

#### Returns

`void`

***

### createOption

> **createOption**: (`input`) => `void`

Defined in: [core/types.ts:438](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L438)

Creates a new option from the provided input string.

#### Parameters

##### input

`string`

#### Returns

`void`

***

### deselectOption

> **deselectOption**: (`value`) => `void`

Defined in: [core/types.ts:402](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L402)

Deselects an option by its value.

#### Parameters

##### value

`string`

#### Returns

`void`

***

### destroy

> **destroy**: () => `void`

Defined in: [core/types.ts:458](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L458)

Cleans up the instance and destroys all internal subscriptions.

#### Returns

`void`

***

### focusFirst

> **focusFirst**: () => `void`

Defined in: [core/types.ts:430](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L430)

Moves focus to the first visible option.

#### Returns

`void`

***

### focusLast

> **focusLast**: () => `void`

Defined in: [core/types.ts:434](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L434)

Moves focus to the last visible option.

#### Returns

`void`

***

### focusNext

> **focusNext**: () => `void`

Defined in: [core/types.ts:422](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L422)

Moves focus to the next visible option.

#### Returns

`void`

***

### focusOption

> **focusOption**: (`value`) => `void`

Defined in: [core/types.ts:418](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L418)

Manually sets the focus to an option by value.

#### Parameters

##### value

`string` \| `null`

#### Returns

`void`

***

### focusPrev

> **focusPrev**: () => `void`

Defined in: [core/types.ts:426](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L426)

Moves focus to the previous visible option.

#### Returns

`void`

***

### getClearOptionProps

> **getClearOptionProps**: (`value`) => `any`

Defined in: [core/types.ts:486](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L486)

Generates props for a clear button specific to an option (multi-select tags).

#### Parameters

##### value

`string`

#### Returns

`any`

***

### getConfig

> **getConfig**: () => [`SelectConfig`](/select/docs/api/types/SelectConfig)

Defined in: [core/types.ts:378](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L378)

Returns the current configuration options.

#### Returns

[`SelectConfig`](/select/docs/api/types/SelectConfig)

***

### getCreateOptionProps

> **getCreateOptionProps**: () => `any`

Defined in: [core/types.ts:482](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L482)

Generates props for the "Create" option row.

#### Returns

`any`

***

### getListboxProps

> **getListboxProps**: () => [`ListboxProps`](/select/docs/api/getters/ListboxProps)

Defined in: [core/types.ts:466](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L466)

Generates props for the listbox element.

#### Returns

[`ListboxProps`](/select/docs/api/getters/ListboxProps)

***

### getNativeSelectProps

> **getNativeSelectProps**: () => `any`

Defined in: [core/types.ts:478](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L478)

Generates props for a native select element (progressive enhancement).

#### Returns

`any`

***

### getOptionLabel

> **getOptionLabel**: (`value`) => `string`

Defined in: [core/types.ts:490](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L490)

Helper to retrieve the label for a given option value.

#### Parameters

##### value

`string`

#### Returns

`string`

***

### getOptionProps

> **getOptionProps**: (`value`) => [`OptionProps`](/select/docs/api/getters/OptionProps)

Defined in: [core/types.ts:470](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L470)

Generates props for a specific option element.

#### Parameters

##### value

`string`

#### Returns

[`OptionProps`](/select/docs/api/getters/OptionProps)

***

### getSearchInputProps

> **getSearchInputProps**: () => [`SearchInputProps`](/select/docs/api/getters/SearchInputProps)

Defined in: [core/types.ts:474](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L474)

Generates props for the search input element.

#### Returns

[`SearchInputProps`](/select/docs/api/getters/SearchInputProps)

***

### getSelectedOptions

> **getSelectedOptions**: () => [`SelectOption`](/select/docs/api/types/SelectOption)[]

Defined in: [core/types.ts:494](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L494)

Returns the list of currently selected SelectOption objects.

#### Returns

[`SelectOption`](/select/docs/api/types/SelectOption)[]

***

### getState

> **getState**: () => [`SelectState`](/select/docs/api/types/SelectState)

Defined in: [core/types.ts:374](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L374)

Returns the current internal state.

#### Returns

[`SelectState`](/select/docs/api/types/SelectState)

***

### getTriggerProps

> **getTriggerProps**: () => [`TriggerProps`](/select/docs/api/getters/TriggerProps)

Defined in: [core/types.ts:462](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L462)

Generates props for the trigger element.

#### Returns

[`TriggerProps`](/select/docs/api/getters/TriggerProps)

***

### onScroll

> **onScroll**: (`scrollTop`) => `void`

Defined in: [core/types.ts:450](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L450)

Updates virtualization calculations based on scroll position.

#### Parameters

##### scrollTop

`number`

#### Returns

`void`

***

### open

> **open**: () => `void`

Defined in: [core/types.ts:386](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L386)

Opens the dropdown menu.

#### Returns

`void`

***

### scrollToFocused

> **scrollToFocused**: (`container`) => `void`

Defined in: [core/types.ts:442](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L442)

Ensures the currently focused option is visible within its container.

#### Parameters

##### container

`HTMLElement`

#### Returns

`void`

***

### selectOption

> **selectOption**: (`value`) => `void`

Defined in: [core/types.ts:398](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L398)

Selects an option by its value.

#### Parameters

##### value

`string`

#### Returns

`void`

***

### setConfig

> **setConfig**: (`patch`) => `void`

Defined in: [core/types.ts:454](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L454)

Patches the current configuration with new values.

#### Parameters

##### patch

`Partial`\<[`SelectConfig`](/select/docs/api/types/SelectConfig)\>

#### Returns

`void`

***

### setSearch

> **setSearch**: (`term`) => `void`

Defined in: [core/types.ts:414](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L414)

Sets the current search term and filters options.

#### Parameters

##### term

`string`

#### Returns

`void`

***

### subscribe

> **subscribe**: (`listener`) => [`Unsubscribe`](/select/docs/api/types/Unsubscribe)

Defined in: [core/types.ts:382](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L382)

Subscribes to state changes and returns an unsubscribe function.

#### Parameters

##### listener

(`s`) => `void`

#### Returns

[`Unsubscribe`](/select/docs/api/types/Unsubscribe)

***

### sync

> **sync**: () => `void`

Defined in: [core/types.ts:446](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L446)

Forces a synchronization of internal state (useful for manual configuration changes).

#### Returns

`void`

***

### toggle

> **toggle**: () => `void`

Defined in: [core/types.ts:394](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L394)

Toggles the open/closed state of the dropdown menu.

#### Returns

`void`

***

### toggleOption

> **toggleOption**: (`value`) => `void`

Defined in: [core/types.ts:406](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L406)

Toggles the selection state of an option by its value.

#### Parameters

##### value

`string`

#### Returns

`void`
