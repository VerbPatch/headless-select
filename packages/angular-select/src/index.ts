import { Injectable } from '@angular/core';
import { useSelect, SelectConfig, SelectState, SelectInstance } from '@verbpatch/headless-select';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * HeadlessSelectService manages the headless select instance in Angular.
 *
 * IMPORTANT: To avoid singleton conflicts when using multiple select components,
 * do NOT provide this service in the root injector. Instead, configure it locally in the
 * component's `providers` array:
 *
 * ```typescript
 * @Component({
 *   selector: 'app-custom-select',
 *   templateUrl: './custom-select.component.html',
 *   providers: [HeadlessSelectService]
 * })
 * export class CustomSelectComponent { ... }
 * ```
 */
@Injectable()
export class HeadlessSelectService {
  private instance?: SelectInstance;
  private stateSubject = new BehaviorSubject<SelectState | null>(null);

  init(config: SelectConfig) {
    this.instance = useSelect(config);
    this.stateSubject.next(this.instance.getState());
    this.instance.subscribe((state) => {
      this.stateSubject.next(state);
    });
  }

  setConfig(config: Partial<SelectConfig>) {
    this.instance?.setConfig(config);
  }

  get state$(): Observable<SelectState | null> {
    return this.stateSubject.asObservable();
  }

  getState() {
    return this.instance?.getState();
  }

  open() {
    this.instance?.open();
  }

  close() {
    this.instance?.close();
  }

  toggle() {
    this.instance?.toggle();
  }

  setSearch(search: string) {
    this.instance?.setSearch(search);
  }

  selectOption(value: string) {
    this.instance?.selectOption(value);
  }

  deselectOption(value: string) {
    this.instance?.deselectOption(value);
  }

  clearAll() {
    this.instance?.clearAll();
  }

  getTriggerProps() {
    return this.instance?.getTriggerProps();
  }

  getListboxProps() {
    return this.instance?.getListboxProps();
  }

  getOptionProps(value: string) {
    return this.instance?.getOptionProps(value);
  }

  getSearchInputProps() {
    return this.instance?.getSearchInputProps();
  }

  getNativeSelectProps() {
    return this.instance?.getNativeSelectProps();
  }

  getCreateOptionProps() {
    return this.instance?.getCreateOptionProps();
  }

  getClearOptionProps(value: string) {
    return this.instance?.getClearOptionProps(value);
  }

  destroy() {
    this.instance?.destroy();
  }
}
