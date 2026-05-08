import { Injectable } from '@angular/core';
import {
  useSelect,
  SelectConfig,
  SelectState,
  SelectInstance,
} from '@verbpatch/headless-select';
import { BehaviorSubject, Observable } from 'rxjs';

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

  destroy() {
    this.instance?.destroy();
  }
}
