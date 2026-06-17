import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomSelectComponent } from './custom-select.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CustomSelectComponent],
  template: `
    <div style="padding: 2rem; max-width: 1000px; margin: 0 auto;">
      <h1>Angular Headless Select Showcase</h1>
      <p>Demonstrating various configurations of the Angular adapter.</p>

      <section style="margin-bottom: 3rem;">
        <h2>Progressive Enhancement</h2>
        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">
            Native Hydration (Pre-filled via HTML)
          </label>
          <app-custom-select [multiple]="true" placeholder="Select colors..." [hideNative]="false">
            <optgroup label="Colors">
              <option value="red" selected>Red</option>
              <option value="green">Green</option>
              <option value="blue" selected>Blue</option>
            </optgroup>
          </app-custom-select>
          <div style="font-size: 11px; color: #666; margin-top: 8px;">
            Notice: The Headless UI above is automatically populated and synchronized from the
            standard <code>&lt;option&gt;</code> tags defined in the source code.
          </div>
        </div>
      </section>

      <section style="margin-bottom: 3rem;">
        <h2>Standard Selects</h2>

        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">
            Basic Single Select
          </label>
          <app-custom-select
            [options]="fruitOptions"
            [(value)]="singleValue"
            placeholder="Pick a fruit"
          ></app-custom-select>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">
            Multiple Select with Groups
          </label>
          <app-custom-select
            [multiple]="true"
            [options]="groupedOptions"
            placeholder="Select food..."
            [(value)]="multiValue"
          ></app-custom-select>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">
            Searchable & Creatable (Native Hidden)
          </label>
          <app-custom-select
            [searchable]="true"
            [creatable]="true"
            [hideNative]="true"
            [options]="frameworkOptions"
            placeholder="Framework..."
          ></app-custom-select>
        </div>

      </section>

      <section style="margin-bottom: 3rem;">
        <h2>Performance</h2>
        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">
            Virtualized Select (10,000 items)
          </label>
          <app-custom-select [virtualize]="true" [options]="largeList" placeholder="Scroll 10,000 items..."></app-custom-select>
        </div>
      </section>

      <section style="margin-bottom: 3rem;">
        <h2>Core Engine</h2>
        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">
            Pure Headless (No Native Element)
          </label>
          <app-custom-select
            [showNative]="false"
            [options]="engineOptions"
            placeholder="Select engine mode..."
          ></app-custom-select>
        </div>
      </section>
    </div>
  `
})
export class AppComponent {
  fruitOptions = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'date', label: 'Date' },
    { value: 'elderberry', label: 'Elderberry' },
  ];

  groupedOptions = [
    {
      label: 'Fruits',
      options: [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
      ],
    },
    {
      label: 'Vegetables',
      options: [
        { value: 'carrot', label: 'Carrot' },
        { value: 'broccoli', label: 'Broccoli' },
      ],
    },
  ];

  frameworkOptions = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'svelte', label: 'Svelte' },
  ];

  engineOptions = [
    { value: 'logic', label: 'Logic Only' },
    { value: 'state', label: 'State Management' },
    { value: 'headless', label: 'No DOM Sync' },
  ];

  largeList = Array.from({ length: 10000 }, (_, i) => ({
    value: `option-${i}`,
    label: `Option ${i}`,
  }));

  multiValue = ['apple', 'banana'];
  singleValue = 'banana';
}
