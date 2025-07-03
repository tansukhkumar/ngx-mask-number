import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NgxNumberMaskDirective } from 'ngx-mask-number'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, NgxNumberMaskDirective],
  template: `
   <div style="max-width: 500px; margin: 2rem auto; font-family: sans-serif;">
      <h2>ngx-mask-number Demo</h2>
      <form [formGroup]="form">
        <label>Enter Amount:</label>
        <input formControlName="amount" ngxNumberMask [locale]="'en-US'" />
        <p>Raw value: {{ form.value.amount }}</p>
      </form>
    </div>
  `
})
export class AppComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    amount: [null]
  });
}
