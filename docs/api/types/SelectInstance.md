---
title: SelectInstance
description: Provides direct access to state, configuration, and imperative actions.
---

# SelectInstance

Defined in: [core/types.ts:377](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L377)

The main instance object for managing a select component.

## Properties

### clearAll

> **clearAll**: () => `void`

Defined in: [core/types.ts:417](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L417)

Deselects all currently selected values.

#### Returns

`void`

***

### close

> **close**: () => `void`

Defined in: [core/types.ts:397](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L397)

Closes the dropdown menu.

#### Returns

`void`

***

### createOption

> **createOption**: (`input`) => `void`

Defined in: [core/types.ts:445](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L445)

Creates a new option from the provided input string.

#### Parameters

##### input

`string`

#### Returns

`void`

***

### deselectOption

> **deselectOption**: (`value`) => `void`

Defined in: [core/types.ts:409](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L409)

Deselects an option by its value.

#### Parameters

##### value

`string`

#### Returns

`void`

***

### destroy

> **destroy**: () => `void`

Defined in: [core/types.ts:465](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L465)

Cleans up the instance and destroys all internal subscriptions.

#### Returns

`void`

***

### focusFirst

> **focusFirst**: () => `void`

Defined in: [core/types.ts:437](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L437)

Moves focus to the first visible option.

#### Returns

`void`

***

### focusLast

> **focusLast**: () => `void`

Defined in: [core/types.ts:441](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L441)

Moves focus to the last visible option.

#### Returns

`void`

***

### focusNext

> **focusNext**: () => `void`

Defined in: [core/types.ts:429](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L429)

Moves focus to the next visible option.

#### Returns

`void`

***

### focusOption

> **focusOption**: (`value`) => `void`

Defined in: [core/types.ts:425](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L425)

Manually sets the focus to an option by value.

#### Parameters

##### value

`string` \| `null`

#### Returns

`void`

***

### focusPrev

> **focusPrev**: () => `void`

Defined in: [core/types.ts:433](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L433)

Moves focus to the previous visible option.

#### Returns

`void`

***

### getClearOptionProps

> **getClearOptionProps**: (`value`) => `any`

Defined in: [core/types.ts:493](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L493)

Generates props for a clear button specific to an option (multi-select tags).

#### Parameters

##### value

`string`

#### Returns

`any`

***

### getConfig

> **getConfig**: () => [`SelectConfig`](/select/docs/api/types/SelectConfig)

Defined in: [core/types.ts:385](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L385)

Returns the current configuration options.

#### Returns

[`SelectConfig`](/select/docs/api/types/SelectConfig)

***

### getCreateOptionProps

> **getCreateOptionProps**: () => `any`

Defined in: [core/types.ts:489](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L489)

Generates props for the "Create" option row.

#### Returns

`any`

***

### getListboxProps

> **getListboxProps**: () => [`ListboxProps`](/select/docs/api/getters/ListboxProps)

Defined in: [core/types.ts:473](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L473)

Generates props for the listbox element.

#### Returns

[`ListboxProps`](/select/docs/api/getters/ListboxProps)

***

### getNativeSelectProps

> **getNativeSelectProps**: () => `any`

Defined in: [core/types.ts:485](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L485)

Generates props for a native select element (progressive enhancement).

#### Returns

`any`

***

### getOptionLabel

> **getOptionLabel**: (`value`) => `string`

Defined in: [core/types.ts:497](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L497)

Helper to retrieve the label for a given option value.

#### Parameters

##### value

`string`

#### Returns

`string`

***

### getOptionProps

> **getOptionProps**: (`value`) => [`OptionProps`](/select/docs/api/getters/OptionProps)

Defined in: [core/types.ts:477](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L477)

Generates props for a specific option element.

#### Parameters

##### value

`string`

#### Returns

[`OptionProps`](/select/docs/api/getters/OptionProps)

***

### getSearchInputProps

> **getSearchInputProps**: () => [`SearchInputProps`](/select/docs/api/getters/SearchInputProps)

Defined in: [core/types.ts:481](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L481)

Generates props for the search input element.

#### Returns

[`SearchInputProps`](/select/docs/api/getters/SearchInputProps)

***

### getSelectedOptions

> **getSelectedOptions**: () => [`SelectOption`](/select/docs/api/types/SelectOption)[]

Defined in: [core/types.ts:501](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L501)

Returns the list of currently selected SelectOption objects.

#### Returns

[`SelectOption`](/select/docs/api/types/SelectOption)[]

***

### getState

> **getState**: () => [`SelectState`](/select/docs/api/types/SelectState)

Defined in: [core/types.ts:381](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L381)

Returns the current internal state.

#### Returns

[`SelectState`](/select/docs/api/types/SelectState)

***

### getTriggerProps

> **getTriggerProps**: () => [`TriggerProps`](/select/docs/api/getters/TriggerProps)

Defined in: [core/types.ts:469](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L469)

Generates props for the trigger element.

#### Returns

[`TriggerProps`](/select/docs/api/getters/TriggerProps)

***

### onScroll

> **onScroll**: (`scrollTop`) => `void`

Defined in: [core/types.ts:457](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L457)

Updates virtualization calculations based on scroll position.

#### Parameters

##### scrollTop

`number`

#### Returns

`void`

***

### open

> **open**: () => `void`

Defined in: [core/types.ts:393](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L393)

Opens the dropdown menu.

#### Returns

`void`

***

### scrollToFocused

> **scrollToFocused**: (`container`) => `void`

Defined in: [core/types.ts:449](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L449)

Ensures the currently focused option is visible within its container.

#### Parameters

##### container

`HTMLElement`

#### Returns

`void`

***

### selectOption

> **selectOption**: (`value`) => `void`

Defined in: [core/types.ts:405](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L405)

Selects an option by its value.

#### Parameters

##### value

`string`

#### Returns

`void`

***

### setConfig

> **setConfig**: (`patch`) => `void`

Defined in: [core/types.ts:461](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L461)

Patches the current configuration with new values.

#### Parameters

##### patch

`Partial`\<[`SelectConfig`](/select/docs/api/types/SelectConfig)\>

#### Returns

`void`

***

### setSearch

> **setSearch**: (`term`) => `void`

Defined in: [core/types.ts:421](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L421)

Sets the current search term and filters options.

#### Parameters

##### term

`string`

#### Returns

`void`

***

### subscribe

> **subscribe**: (`listener`) => [`Unsubscribe`](/select/docs/api/types/Unsubscribe)

Defined in: [core/types.ts:389](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L389)

Subscribes to state changes and returns an unsubscribe function.

#### Parameters

##### listener

(`s`) => `void`

#### Returns

[`Unsubscribe`](/select/docs/api/types/Unsubscribe)

***

### sync

> **sync**: () => `void`

Defined in: [core/types.ts:453](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L453)

Forces a synchronization of internal state (useful for manual configuration changes).

#### Returns

`void`

***

### toggle

> **toggle**: () => `void`

Defined in: [core/types.ts:401](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L401)

Toggles the open/closed state of the dropdown menu.

#### Returns

`void`

***

### toggleOption

> **toggleOption**: (`value`) => `void`

Defined in: [core/types.ts:413](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L413)

Toggles the selection state of an option by its value.

#### Parameters

##### value

`string`

#### Returns

`void`
