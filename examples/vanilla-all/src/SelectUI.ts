import {
  useSelect,
  SelectInstance,
  SelectConfig,
  SelectState,
  calculateVirtualization,
} from '@verbpatch/headless-select';

export function setupSelectUI(
  anchorId: string,
  config: SelectConfig,
  customRender?: (select: SelectInstance, container: HTMLElement) => void,
) {
  const anchor = document.getElementById(anchorId)!;
  const nativeSelectId = anchorId.replace('anchor', 'native');
  const nativeSelect = document.getElementById(nativeSelectId) as HTMLSelectElement;

  const select = useSelect({
    ...config,
    hydrateFrom: nativeSelect || config.hydrateFrom,
  });

  // If we have a native select but it was empty, populate it
  if (nativeSelect && nativeSelect.options.length === 0 && config.options) {
    const fragment = document.createDocumentFragment();
    config.options.forEach((item) => {
      if ('options' in item) {
        const group = document.createElement('optgroup');
        group.label = item.label;
        item.options.forEach((o) => group.appendChild(new Option(o.label, o.value)));
        fragment.appendChild(group);
      } else {
        fragment.appendChild(new Option(item.label, item.value));
      }
    });
    nativeSelect.appendChild(fragment);
  }

  // Set up static shell
  anchor.innerHTML = `
    <div class="select-wrapper" style="position: relative; width: 100%;">
      <button type="button" class="trigger" id="${anchorId}-trigger" style="width: 100%; text-align: left; padding: 4px;">
        <span class="trigger-label">Select...</span>
        <span class="trigger-arrow"> [Open v]</span>
      </button>
      <div class="dropdown hidden" id="${anchorId}-dropdown" style="border: 1px solid #999; margin-top: 2px; position: absolute; background: white; z-index: 100; width: 100%; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
        <div class="search-container" style="padding: 4px; border-bottom: 1px solid #ccc;">
          <input type="text" class="search-input" id="${anchorId}-input" placeholder="Search..." style="width: 100%; box-sizing: border-box;">
        </div>
        <div class="options-container" id="${anchorId}-list" style="max-height: 200px; overflow-y: auto; position: relative;"></div>
      </div>
    </div>
  `;

  const trigger = document.getElementById(`${anchorId}-trigger`)!;
  const dropdown = document.getElementById(`${anchorId}-dropdown`)!;
  const input = document.getElementById(`${anchorId}-input`) as HTMLInputElement;
  const list = document.getElementById(`${anchorId}-list`)!;
  const labelEl = trigger.querySelector('.trigger-label')!;
  const arrowEl = trigger.querySelector('.trigger-arrow')!;

  // ── Virtualization State ──────────────────────────────────────────────────
  const isVirtualized = anchorId === 'anchor-virtual';
  const ITEM_HEIGHT = 28;
  const CONTAINER_HEIGHT = 200;
  let scrollTop = 0;

  list.onscroll = () => {
    if (isVirtualized) {
      scrollTop = list.scrollTop;
      render();
    }
  };

  // ── Stable Event Bindings ──────────────────────────────────────────────────

  trigger.onclick = (e) => {
    e.preventDefault();
    select.toggle();
  };

  trigger.onkeydown = (e) => select.getTriggerProps().onKeyDown(e);

  input.oninput = (e) => select.getSearchInputProps().onInput(e as any);
  input.onkeydown = (e) => select.getSearchInputProps().onKeyDown(e as any);

  list.onclick = (e) => {
    const target = (e.target as HTMLElement).closest('.option');
    if (target && (target as HTMLElement).dataset.value) {
      e.preventDefault();
      select.toggleOption((target as HTMLElement).dataset.value!);
    }
    const createBtn = (e.target as HTMLElement).closest('[id$="-create"]');
    if (createBtn) {
      select.createOption(select.getState().search);
    }
  };

  list.onmouseover = (e) => {
    const target = (e.target as HTMLElement).closest('.option');
    if (target && (target as HTMLElement).dataset.value) {
      const val = (target as HTMLElement).dataset.value!;
      if (select.getState().focusedOptionValue !== val) {
        select.focusOption(val);
      }
    }
  };

  anchor.onclick = (e) => {
    const removeBtn = (e.target as HTMLElement).closest('.chip-remove');
    if (removeBtn) {
      e.stopPropagation();
      select.deselectOption((removeBtn as HTMLElement).dataset.value!);
    }
  };

  // ── Surgical Renderer ─────────────────────────────────────────────────────

  let lastState: SelectState | null = null;
  let lastScrollTop = -1;

  function render() {
    const state = select.getState();
    const config = select.getConfig();

    // 1. Update Dropdown Visibility
    if (!lastState || state.isOpen !== lastState.isOpen) {
      dropdown.classList.toggle('hidden', !state.isOpen);
      arrowEl.textContent = state.isOpen ? ' [Close ^]' : ' [Open v]';
      if (state.isOpen) {
        if (document.activeElement !== input && document.activeElement !== trigger) {
          input.focus();
        }
      }
    }

    // 2. Update Search Input
    if (state.isOpen && (!lastState || state.search !== lastState.search)) {
      if (input.value !== state.search) {
        input.value = state.search;
      }
    }

    // 3. Update Trigger Label
    if (!lastState || state.selectedValues !== lastState.selectedValues) {
      if (state.selectedValues.length === 0) {
        labelEl.textContent = config.placeholder || 'Select...';
      } else {
        if (config.multiple) {
          labelEl.innerHTML = state.selectedValues
            .map(
              (v) => `
            <span style="border: 1px solid #000; padding: 2px; margin-right: 4px; display: inline-block; font-size: 0.8rem;">
              ${select.getOptionLabel(v)}
              <button type="button" class="chip-remove" data-value="${v}" style="border:none; background:none; cursor:pointer; padding:0 2px;">[X]</button>
            </span>
          `,
            )
            .join('');
        } else {
          labelEl.textContent = select.getOptionLabel(state.selectedValues[0]);
        }
      }
    }

    // 4. Update Options List
    const listNeedsUpdate =
      !lastState ||
      state.isOpen !== lastState.isOpen ||
      state.visibleOptions !== lastState.visibleOptions ||
      state.selectedValues !== lastState.selectedValues ||
      state.focusedOptionValue !== lastState.focusedOptionValue ||
      state.isLoading !== lastState.isLoading ||
      state.canCreate !== lastState.canCreate ||
      (isVirtualized && scrollTop !== lastScrollTop);

    if (state.isOpen && listNeedsUpdate) {
      if (state.isLoading) {
        list.innerHTML = '<div style="padding: 4px;">Loading...</div>';
      } else {
        let optionsToRender = state.visibleOptions;
        let offsetY = 0;
        let totalHeight = state.visibleOptions.length * ITEM_HEIGHT;

        if (isVirtualized) {
          const v = calculateVirtualization(
            state.visibleOptions.length,
            ITEM_HEIGHT,
            CONTAINER_HEIGHT,
            scrollTop,
          );
          optionsToRender = v.items.map((item) => state.visibleOptions[item.index]);
          offsetY = v.offsetY;
          totalHeight = v.totalHeight;
        }

        const optionsHtml = optionsToRender
          .map((opt) => {
            if (!opt) return '';
            const isSelected = state.selectedValues.includes(opt.value);
            const isFocused = state.focusedOptionValue === opt.value;

            return `
            <div class="option" data-value="${opt.value}" role="option" 
                style="height: ${ITEM_HEIGHT}px; padding: 4px; cursor: pointer; border: ${isFocused ? '1px dashed red' : 'none'}; background: ${isSelected ? '#ddd' : 'transparent'}; font-size: 0.9rem; box-sizing: border-box;">
              ${isSelected ? '[X] ' : '[ ] '}
              ${opt.label}
              ${opt.disabled ? ' (disabled)' : ''}
              ${isFocused ? ' <-- focus' : ''}
            </div>
          `;
          })
          .join('');

        if (isVirtualized) {
          list.innerHTML = `<div style="height: ${totalHeight}px; position: relative;">
             <div style="position: absolute; top: 0; left: 0; right: 0; transform: translateY(${offsetY}px);">
               ${optionsHtml}
             </div>
           </div>`;
        } else {
          let finalHtml = optionsHtml;
          if (state.canCreate) {
            finalHtml += `<div id="${anchorId}-create" style="padding: 4px; cursor: pointer; color: blue; font-size: 0.9rem;">+ Create "${state.search}"</div>`;
          } else if (state.visibleOptions.length === 0) {
            finalHtml += '<div style="padding: 4px; font-size: 0.9rem;">No results</div>';
          }
          list.innerHTML = finalHtml;
        }
      }
      lastScrollTop = scrollTop;
    }

    lastState = state;
    if (customRender) customRender(select, anchor);
  }

  select.subscribe(() => render());
  render();
  return select;
}
