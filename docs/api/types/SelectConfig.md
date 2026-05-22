---
title: SelectConfig
description: Defines all behavior, data source, and visual options for the select component.
---

# SelectConfig

Defined in: [core/types.ts:146](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L146)

Configuration options for initializing a select instance.

## Properties

### ariaLabel?

> `optional` **ariaLabel?**: `string`

Defined in: [core/types.ts:254](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L254)

Accessibility label for the select component.

***

### ariaLabelledBy?

> `optional` **ariaLabelledBy?**: `string`

Defined in: [core/types.ts:258](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L258)

ID of the element that labels the select component.

***

### cacheOptions?

> `optional` **cacheOptions?**: `boolean`

Defined in: [core/types.ts:170](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L170)

Whether to cache results from loadOptions based on the search term.

***

### clearable?

> `optional` **clearable?**: `boolean`

Defined in: [core/types.ts:186](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L186)

Whether to show a clear button to deselect all items.

***

### closeOnSelect?

> `optional` **closeOnSelect?**: `boolean`

Defined in: [core/types.ts:198](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L198)

Whether to close the dropdown immediately after a selection is made.

***

### containerHeight?

> `optional` **containerHeight?**: `number`

Defined in: [core/types.ts:246](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L246)

Total height of the scrollable list container (required for virtualization).

***

### creatable?

> `optional` **creatable?**: `boolean`

Defined in: [core/types.ts:194](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L194)

Whether users can create new options from the search input.

***

### createOptionLabel?

> `optional` **createOptionLabel?**: (`input`) => `string`

Defined in: [core/types.ts:234](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L234)

Factory function for the label of the "Create" option.

#### Parameters

##### input

`string`

#### Returns

`string`

***

### defaultOptions?

> `optional` **defaultOptions?**: `boolean` \| [`SelectOption`](/select/docs/api/types/SelectOption)[]

Defined in: [core/types.ts:166](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L166)

Initial options to show, or true to trigger an immediate load on open.

***

### defaultValue?

> `optional` **defaultValue?**: `string` \| `string`[]

Defined in: [core/types.ts:154](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L154)

The initial selected value(s) for uncontrolled mode.

***

### disabled?

> `optional` **disabled?**: `boolean`

Defined in: [core/types.ts:190](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L190)

Whether the select component is disabled.

***

### filterOption?

> `optional` **filterOption?**: (`option`, `search`) => `boolean`

Defined in: [core/types.ts:202](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L202)

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

Defined in: [core/types.ts:174](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L174)

An existing HTMLSelectElement to hydrate initial state from.

***

### inputId?

> `optional` **inputId?**: `string`

Defined in: [core/types.ts:250](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L250)

ID for the internal search input element.

***

### isValidNewOption?

> `optional` **isValidNewOption?**: (`input`, `currentOptions`) => `boolean`

Defined in: [core/types.ts:226](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L226)

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

Defined in: [core/types.ts:242](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L242)

Fixed height for each list item in pixels (required for virtualization).

***

### loadingMessage?

> `optional` **loadingMessage?**: `string`

Defined in: [core/types.ts:218](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L218)

Message shown while loading options.

***

### loadOptions?

> `optional` **loadOptions?**: (`search`) => `Promise`\<[`SelectOption`](/select/docs/api/types/SelectOption)[]\>

Defined in: [core/types.ts:162](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L162)

Function to load options asynchronously based on search input.

#### Parameters

##### search

`string`

#### Returns

`Promise`\<[`SelectOption`](/select/docs/api/types/SelectOption)[]\>

***

### minSearchLength?

> `optional` **minSearchLength?**: `number`

Defined in: [core/types.ts:210](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L210)

Minimum search string length required to trigger a search.

***

### multiple?

> `optional` **multiple?**: `boolean`

Defined in: [core/types.ts:178](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L178)

Whether multiple options can be selected simultaneously.

***

### noOptionsMessage?

> `optional` **noOptionsMessage?**: `string` \| ((`search`) => `string`)

Defined in: [core/types.ts:222](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L222)

Message shown when no matching options are found.

***

### onChange?

> `optional` **onChange?**: (`value`, `change`) => `void`

Defined in: [core/types.ts:262](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L262)

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

Defined in: [core/types.ts:270](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L270)

Callback triggered when the dropdown is closed.

#### Returns

`void`

***

### onCreate?

> `optional` **onCreate?**: (`input`) => `void` \| [`SelectOption`](/select/docs/api/types/SelectOption)

Defined in: [core/types.ts:230](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L230)

Callback triggered when a new option is created.

#### Parameters

##### input

`string`

#### Returns

`void` \| [`SelectOption`](/select/docs/api/types/SelectOption)

***

### onLoadEnd?

> `optional` **onLoadEnd?**: (`options`) => `void`

Defined in: [core/types.ts:282](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L282)

Callback triggered when an asynchronous load completes.

#### Parameters

##### options

[`SelectOption`](/select/docs/api/types/SelectOption)[]

#### Returns

`void`

***

### onLoadStart?

> `optional` **onLoadStart?**: () => `void`

Defined in: [core/types.ts:278](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L278)

Callback triggered when an asynchronous load starts.

#### Returns

`void`

***

### onOpen?

> `optional` **onOpen?**: () => `void`

Defined in: [core/types.ts:266](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L266)

Callback triggered when the dropdown is opened.

#### Returns

`void`

***

### onSearch?

> `optional` **onSearch?**: (`term`) => `void`

Defined in: [core/types.ts:274](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L274)

Callback triggered on every search input change.

#### Parameters

##### term

`string`

#### Returns

`void`

***

### options?

> `optional` **options?**: [`DataItem`](/select/docs/api/types/DataItem)[]

Defined in: [core/types.ts:158](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L158)

Static list of options or groups.

***

### placeholder?

> `optional` **placeholder?**: `string`

Defined in: [core/types.ts:214](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L214)

Placeholder text shown when no value is selected.

***

### searchable?

> `optional` **searchable?**: `boolean`

Defined in: [core/types.ts:182](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L182)

Whether to display a search input for filtering options.

***

### searchDelay?

> `optional` **searchDelay?**: `number`

Defined in: [core/types.ts:206](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L206)

Delay in milliseconds before executing asynchronous searches.

***

### value?

> `optional` **value?**: `string` \| `string`[]

Defined in: [core/types.ts:150](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L150)

The currently selected value(s) for controlled mode.

***

### virtualize?

> `optional` **virtualize?**: `boolean`

Defined in: [core/types.ts:238](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L238)

Whether to enable list virtualization for high-performance rendering.
