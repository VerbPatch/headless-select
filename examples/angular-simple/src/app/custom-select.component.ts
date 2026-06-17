import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit, OnDestroy, OnChanges, SimpleChanges, NgZone, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadlessSelectService } from '@verbpatch/angular-select';
import { SelectState } from '@verbpatch/headless-select';

export interface OptionVM {
  option: any;
  props: any;
  index: number;
}

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule],
  providers: [HeadlessSelectService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="select-container">
      <div class="render-count-badge">Angular Auto-Reactivity</div>
      
      @if (showNative) {
        <div class="native-interface-container" [class.hidden]="hideNative">
          @if (!hideNative) { <label>Native Select Interface</label> }
          <select
            #nativeSelect
            [attr.id]="nativeProps()?.id"
            [attr.name]="nativeProps()?.name"
            [attr.multiple]="nativeProps()?.multiple ? true : null"
            class="native-select"
            [class.hidden]="hideNative"
            [class.visible]="!hideNative"
            [style.height]="hideNative ? '1px' : (multiple || virtualize ? '120px' : 'auto')"
          >
            <ng-content></ng-content>
          </select>
          @if (!hideNative) {
            <div class="native-note">
              ↑ Native &lt;select&gt; element. 2-way sync active.
              @if (virtualize) { <span>(10k items sync might be heavy)</span> }
            </div>
          }
        </div>
      }

      <div class="custom-ui-wrapper">
        <label>Headless Custom UI @if (virtualize) { <span>(Virtualized)</span> }</label>
        @if (!showNative) { <div class="custom-ui-note">(Pure Headless - No Native Sync)</div> }
        
        <button
          [attr.role]="triggerProps()?.role"
          [attr.aria-haspopup]="triggerProps()?.['aria-haspopup']"
          [attr.aria-expanded]="triggerProps()?.['aria-expanded']"
          [attr.aria-controls]="triggerProps()?.['aria-controls']"
          [attr.aria-disabled]="triggerProps()?.['aria-disabled']"
          (click)="triggerProps()?.onClick()"
          (keydown)="triggerProps()?.onKeyDown($event)"
          class="select-trigger"
        >
          @if (state.selectedValues.length) {
            @if (multiple) {
              <div class="selected-values-container">
                @for (val of state.selectedValues; track val) {
                  <span class="selected-value-pill">
                    {{ getOptionLabel(val) }}
                    <span
                      (click)="clearOption(val, $event)"
                      class="selected-value-clear"
                    >
                      ×
                    </span>
                  </span>
                }
              </div>
            } @else {
              {{ getOptionLabel(state.selectedValues[0]) }}
            }
          } @else {
            {{ placeholder }}
          }
        </button>

        @if (state.isOpen) {
          <div class="select-dropdown">
            @if (searchable !== false) {
              <div class="search-container">
                <input
                  [attr.id]="searchProps()?.id"
                  [attr.role]="searchProps()?.role"
                  [attr.aria-autocomplete]="searchProps()?.['aria-autocomplete']"
                  [attr.aria-controls]="searchProps()?.['aria-controls']"
                  [attr.aria-activedescendant]="searchProps()?.['aria-activedescendant']"
                  (input)="searchProps()?.onInput($event)"
                  (keydown)="onSearchKeyDown($event)"
                  class="search-input"
                  [placeholder]="virtualize ? 'Search 10,000 items...' : 'Search options...'"
                  autofocus
                />
              </div>
            }

            <div
              #listbox
              [attr.id]="listboxProps()?.id"
              [attr.role]="listboxProps()?.role"
              [attr.aria-multiselectable]="listboxProps()?.['aria-multiselectable']"
              class="listbox-container"
              [style.max-height]="virtualize ? containerHeight + 'px' : '250px'"
              [style.height]="virtualize ? containerHeight + 'px' : 'auto'"
            >
              @if (state.isLoading) {
                <div class="loading-state">Loading...</div>
              } @else {
                @if (virtualize && state.virtualization) {
                  <div [style.height.px]="state.virtualization.totalHeight" style="width: 100%; position: relative;">
                    @for (vm of optionsVM; track vm.option.value) {
                      <div
                        [attr.id]="vm.props.id"
                        [attr.role]="vm.props.role"
                        [attr.aria-selected]="vm.props['aria-selected']"
                        [attr.data-focused]="vm.props['data-focused']"
                        [attr.data-value]="vm.option.value"
                        (click)="vm.props.onClick($event)"
                        class="option-item"
                        [class.focused]="vm.props['data-focused']"
                        [class.selected]="vm.props['aria-selected']"
                        [class.disabled]="vm.option.disabled"
                        [style.position]="'absolute'"
                        [style.top.px]="vm.index * itemHeight"
                        [style.height.px]="itemHeight"
                        style="width: 100%; box-sizing: border-box;"
                      >
                        <span class="option-icon">{{ vm.props['aria-selected'] ? '●' : '○' }}</span>
                        <div class="option-label-container">
                          <span>{{ vm.option.label }}</span>
                        </div>
                        @if (vm.props['data-focused']) { <span class="option-focus-badge">[FOCUS]</span> }
                      </div>
                    }
                  </div>
                } @else {
                  @for (vm of optionsVM; track vm.option.value) {
                    <div
                      [attr.id]="vm.props.id"
                      [attr.role]="vm.props.role"
                      [attr.aria-selected]="vm.props['aria-selected']"
                      [attr.data-focused]="vm.props['data-focused']"
                      [attr.data-value]="vm.option.value"
                      (click)="vm.props.onClick($event)"
                      class="option-item"
                      [class.focused]="vm.props['data-focused']"
                      [class.selected]="vm.props['aria-selected']"
                      [class.disabled]="vm.option.disabled"
                    >
                      <span class="option-icon">{{ vm.props['aria-selected'] ? '●' : '○' }}</span>
                      <div class="option-label-container">
                        <span>{{ vm.option.label }}</span>
                        @if (vm.option['groupLabel']) { <span class="option-group-label">{{ vm.option['groupLabel'] }}</span> }
                      </div>
                      @if (vm.props['data-focused']) { <span class="option-focus-badge">[FOCUS]</span> }
                    </div>
                  }
                }

                @if (state.canCreate) {
                  <div
                    (click)="createProps()?.onClick($event)"
                    (mouseenter)="createProps()?.onMouseEnter()"
                    class="create-option"
                  >
                    + Create "{{ state.search }}"
                  </div>
                }

                @if (state.visibleOptions.length === 0 && !state.canCreate) {
                  <div class="empty-state">No results found</div>
                }
              }
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class CustomSelectComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() virtualize = false;
  @Input() itemHeight = 35;
  @Input() containerHeight = 300;
  @Input() showNative = true;
  @Input() hideNative = false;
  @Input() options: any[] = [];
  @Input() multiple = false;
  @Input() searchable = true;
  @Input() creatable = false;
  @Input() placeholder = 'Select...';
  @Input() value?: any;
  @Output() valueChange = new EventEmitter<any>();
  @Input() fetchRemoteOptions?: (search: string) => Promise<any[]>;
  @Input() cacheOptions?: boolean;
  @Input() defaultOptions?: boolean | any[];

  @ViewChild('nativeSelect') nativeSelectRef?: ElementRef<HTMLSelectElement>;
  
  private _listboxRef?: ElementRef<HTMLDivElement>;
  @ViewChild('listbox') 
  set listboxRef(ref: ElementRef<HTMLDivElement> | undefined) {
    if (this._listboxRef === ref) return;
    if (this._listboxRef && this.scrollListener) {
      this._listboxRef.nativeElement.removeEventListener('scroll', this.scrollListener);
    }
    this._listboxRef = ref;
    if (ref) {
      this.zone.runOutsideAngular(() => {
        const el = ref.nativeElement;
        
        // When listbox mounts (opens), scroll to the focused item!
        setTimeout(() => {
          const instance = (this.selectSvc as any).instance;
          if (instance && instance.scrollToFocused) {
            instance.scrollToFocused(el);
          }
        });

        this.scrollListener = () => {
          const instance = (this.selectSvc as any).instance;
          if (instance) instance.onScroll(el.scrollTop);
        };
        
        this.hoverListener = (e: MouseEvent) => {
          const target = e.target as HTMLElement;
          const optionItem = target.closest('.option-item');
          if (optionItem) {
            const val = optionItem.getAttribute('data-value');
            if (val) {
              const actions = (this.selectSvc as any).actions;
              if (actions) actions.focusOption(val);
            }
          }
        };

        el.addEventListener('scroll', this.scrollListener, { passive: true });
        el.addEventListener('mouseover', this.hoverListener, { passive: true });
      });
    }
  }

  state!: SelectState;
  optionsVM: OptionVM[] = [];

  constructor(
    public selectSvc: HeadlessSelectService, 
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.selectSvc.init({
      options: this.options,
      multiple: this.multiple,
      searchable: this.searchable,
      creatable: this.creatable,
      placeholder: this.placeholder,
      value: this.value,
      virtualize: this.virtualize,
      itemHeight: this.itemHeight,
      containerHeight: this.containerHeight,
      onChange: (val: any) => {
        this.value = val;
        this.valueChange.emit(val);
      },
      fetchRemoteOptions: this.fetchRemoteOptions,
      cacheOptions: this.cacheOptions,
      defaultOptions: this.defaultOptions
    });

    this.selectSvc.state$.subscribe(state => {
      if (state) {
        this.zone.run(() => {
          const searchChanged = this.state && this.state.search !== state.search;
          this.state = state;
          this.updateOptionsVM();
          if (searchChanged && this._listboxRef) {
            this._listboxRef.nativeElement.scrollTop = 0;
          }
          this.cdr.markForCheck();
        });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.state && (changes['options'] || changes['multiple'] || changes['searchable'] || changes['creatable'] || changes['placeholder'] || changes['value'] || changes['virtualize'] || changes['itemHeight'] || changes['containerHeight'])) {
      this.selectSvc.setConfig({
        options: this.options,
        multiple: this.multiple,
        searchable: this.searchable,
        creatable: this.creatable,
        placeholder: this.placeholder,
        value: this.value,
        virtualize: this.virtualize,
        itemHeight: this.itemHeight,
        containerHeight: this.containerHeight
      });
    }
  }

  private scrollListener?: () => void;
  private hoverListener?: (e: MouseEvent) => void;

  ngAfterViewInit() {
    if (this.showNative && this.nativeSelectRef) {
      setTimeout(() => {
        this.selectSvc.setConfig({ hydrateFrom: this.nativeSelectRef?.nativeElement });
      });
    }
  }

  ngOnDestroy() {
    if (this._listboxRef) {
      if (this.scrollListener) this._listboxRef.nativeElement.removeEventListener('scroll', this.scrollListener);
      if (this.hoverListener) this._listboxRef.nativeElement.removeEventListener('mouseover', this.hoverListener);
    }
    this.selectSvc.destroy();
  }

  triggerProps() { return this.selectSvc.getTriggerProps(); }
  listboxProps() { return this.selectSvc.getListboxProps(); }
  searchProps() { return this.selectSvc.getSearchInputProps(); }
  nativeProps() { return this.selectSvc.getNativeSelectProps(); }
  optProps(val: string) { return this.selectSvc.getOptionProps(val); }
  createProps() { return this.selectSvc.getCreateOptionProps(); }

  onSearchKeyDown(e: KeyboardEvent) {
    const props = this.searchProps();
    if (props && props.onKeyDown) {
      props.onKeyDown(e as any);
      // Wait for state to update, then scroll to the focused item
      setTimeout(() => {
        if (this._listboxRef) {
          const instance = (this.selectSvc as any).instance;
          if (instance && instance.scrollToFocused) {
            instance.scrollToFocused(this._listboxRef.nativeElement);
          }
        }
      });
    }
  }

  clearOption(val: string, e: Event) {
    e.stopPropagation();
    const actions = (this.selectSvc as any).actions;
    if (actions) actions.selectOption(val);
  }

  getOptionLabel(val: string) {
    const instance = (this.selectSvc as any).instance;
    return instance?.getOptionLabel(val) || val;
  }

  updateOptionsVM() {
    if (!this.state || !this.state.visibleOptions) {
      this.optionsVM = [];
      return;
    }

    if (this.virtualize && this.state.virtualization) {
      const start = this.state.virtualization.startIndex;
      const end = this.state.virtualization.endIndex;
      const slice = this.state.visibleOptions.slice(start, end);
      this.optionsVM = slice.map((opt, i) => ({
        option: opt,
        props: this.selectSvc.getOptionProps(opt.value),
        index: start + i
      }));
    } else {
      this.optionsVM = this.state.visibleOptions.map((opt, i) => ({
        option: opt,
        props: this.selectSvc.getOptionProps(opt.value),
        index: i
      }));
    }
  }
}
