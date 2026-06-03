---
title: SelectConfig
description: Defines all behavior, data source, and visual options for the select component.
---

# SelectConfig

Defined in: [core/types.ts:149](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L149)

Configuration options for initializing a select instance.

## Properties

### ariaLabel?

> `optional` **ariaLabel?**: `string`

Defined in: [core/types.ts:257](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L257)

Accessibility label for the select component.

***

### ariaLabelledBy?

> `optional` **ariaLabelledBy?**: `string`

Defined in: [core/types.ts:261](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L261)

ID of the element that labels the select component.

***

### cacheOptions?

> `optional` **cacheOptions?**: `boolean`

Defined in: [core/types.ts:173](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L173)

Whether to cache results from fetchRemoteOptions based on the search term.

***

### clearable?

> `optional` **clearable?**: `boolean`

Defined in: [core/types.ts:189](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L189)

Whether to show a clear button to deselect all items.

***

### closeOnSelect?

> `optional` **closeOnSelect?**: `boolean`

Defined in: [core/types.ts:201](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L201)

Whether to close the dropdown immediately after a selection is made.

***

### containerHeight?

> `optional` **containerHeight?**: `number`

Defined in: [core/types.ts:249](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L249)

Total height of the scrollable list container (required for virtualization).

***

### creatable?

> `optional` **creatable?**: `boolean`

Defined in: [core/types.ts:197](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L197)

Whether users can create new options from the search input.

***

### createOptionLabel?

> `optional` **createOptionLabel?**: (`input`) => `string`

Defined in: [core/types.ts:237](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L237)

Factory function for the label of the "Create" option.

#### Parameters

##### input

`string`

#### Returns

`string`

***

### defaultOptions?

> `optional` **defaultOptions?**: `boolean` \| [`SelectOption`](/select/docs/api/types/SelectOption)[]

Defined in: [core/types.ts:169](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L169)

Initial options to show, or true to trigger an immediate load on open.

***

### defaultValue?

> `optional` **defaultValue?**: `string` \| `string`[]

Defined in: [core/types.ts:157](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L157)

The initial selected value(s) for uncontrolled mode.

***

### disabled?

> `optional` **disabled?**: `boolean`

Defined in: [core/types.ts:193](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L193)

Whether the select component is disabled.

***

### fetchRemoteOptions?

> `optional` **fetchRemoteOptions?**: (`search`) => `Promise`\<[`SelectOption`](/select/docs/api/types/SelectOption)[]\>

Defined in: [core/types.ts:165](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L165)

Function to load options asynchronously based on search input.

#### Parameters

##### search

`string`

#### Returns

`Promise`\<[`SelectOption`](/select/docs/api/types/SelectOption)[]\>

***

### filterOption?

> `optional` **filterOption?**: (`option`, `search`) => `boolean`

Defined in: [core/types.ts:205](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L205)

Custom filter function for client-side search.

#### Parameters

##### option

[`SelectOption`](/select/docs/api/types/SelectOption)

##### search

`string`

#### Returns

`boolean`

***

### hydrateFrom?

> `optional` **hydrateFrom?**: `HTMLSelectElement`

Defined in: [core/types.ts:177](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L177)

An existing HTMLSelectElement to hydrate initial state from.

***

### inputId?

> `optional` **inputId?**: `string`

Defined in: [core/types.ts:253](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L253)

ID for the internal search input element.

***

### isValidNewOption?

> `optional` **isValidNewOption?**: (`input`, `currentOptions`) => `boolean`

Defined in: [core/types.ts:229](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L229)

Validation function for new options in creatable mode.

#### Parameters

##### input

`string`

##### currentOptions

[`SelectOption`](/select/docs/api/types/SelectOption)[]

#### Returns

`boolean`

***

### itemHeight?

> `optional` **itemHeight?**: `number`

Defined in: [core/types.ts:245](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L245)

Fixed height for each list item in pixels (required for virtualization).

***

### loadingMessage?

> `optional` **loadingMessage?**: `string`

Defined in: [core/types.ts:221](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L221)

Message shown while loading options.

***

### minSearchLength?

> `optional` **minSearchLength?**: `number`

Defined in: [core/types.ts:213](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L213)

Minimum search string length required to trigger a search.

***

### multiple?

> `optional` **multiple?**: `boolean`

Defined in: [core/types.ts:181](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L181)

Whether multiple options can be selected simultaneously.

***

### noOptionsMessage?

> `optional` **noOptionsMessage?**: `string` \| ((`search`) => `string`)

Defined in: [core/types.ts:225](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L225)

Message shown when no matching options are found.

***

### onChange?

> `optional` **onChange?**: (`value`, `change`) => `void`

Defined in: [core/types.ts:265](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L265)

Callback triggered when the selected value(s) change.

#### Parameters

##### value

`string` \| `string`[]

##### change

[`SelectChange`](/select/docs/api/types/SelectChange)

#### Returns

`void`

***

### onClose?

> `optional` **onClose?**: () => `void`

Defined in: [core/types.ts:273](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L273)

Callback triggered when the dropdown is closed.

#### Returns

`void`

***

### onCreate?

> `optional` **onCreate?**: (`input`) => `void` \| [`SelectOption`](/select/docs/api/types/SelectOption)

Defined in: [core/types.ts:233](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L233)

Callback triggered when a new option is created.

#### Parameters

##### input

`string`

#### Returns

`void` \| [`SelectOption`](/select/docs/api/types/SelectOption)

***

### onFetchError?

> `optional` **onFetchError?**: (`error`) => `void`

Defined in: [core/types.ts:289](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L289)

Callback triggered when an asynchronous load fails.

#### Parameters

##### error

`Error`

#### Returns

`void`

***

### onFetchStart?

> `optional` **onFetchStart?**: () => `void`

Defined in: [core/types.ts:281](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L281)

Callback triggered when an asynchronous load starts.

#### Returns

`void`

***

### onFetchSuccess?

> `optional` **onFetchSuccess?**: (`options`) => `void`

Defined in: [core/types.ts:285](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L285)

Callback triggered when an asynchronous load completes.

#### Parameters

##### options

[`SelectOption`](/select/docs/api/types/SelectOption)[]

#### Returns

`void`

***

### onOpen?

> `optional` **onOpen?**: () => `void`

Defined in: [core/types.ts:269](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L269)

Callback triggered when the dropdown is opened.

#### Returns

`void`

***

### onSearch?

> `optional` **onSearch?**: (`term`) => `void`

Defined in: [core/types.ts:277](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L277)

Callback triggered on every search input change.

#### Parameters

##### term

`string`

#### Returns

`void`

***

### options?

> `optional` **options?**: [`DataItem`](/select/docs/api/types/DataItem)[]

Defined in: [core/types.ts:161](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L161)

Static list of options or groups.

***

### placeholder?

> `optional` **placeholder?**: `string`

Defined in: [core/types.ts:217](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L217)

Placeholder text shown when no value is selected.

***

### searchable?

> `optional` **searchable?**: `boolean`

Defined in: [core/types.ts:185](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L185)

Whether to display a search input for filtering options.

***

### searchDelay?

> `optional` **searchDelay?**: `number`

Defined in: [core/types.ts:209](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L209)

Delay in milliseconds before executing asynchronous searches.

***

### value?

> `optional` **value?**: `string` \| `string`[]

Defined in: [core/types.ts:153](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L153)

The currently selected value(s) for controlled mode.

***

### virtualize?

> `optional` **virtualize?**: `boolean`

Defined in: [core/types.ts:241](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L241)

Whether to enable list virtualization for high-performance rendering.
