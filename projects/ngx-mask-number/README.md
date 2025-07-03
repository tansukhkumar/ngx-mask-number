# ngx-mask-number

> A lightweight Angular directive that formats number inputs **for display** using `Intl.NumberFormat` — while binding raw numeric values to your forms.  
> Just add the directive, and you're good to go!

---

## ✨ Features

- 💡 Shows formatted numbers in the input (e.g. `1,234.56`)
- 💎 Emits **raw numeric value** to your form (e.g. `1234.56`)
- 🌍 Locale-aware formatting using `Intl.NumberFormat`
- ✅ Works with both **Reactive** and **Template-driven** forms
- 🔥 Compatible with Angular 15–18 (standalone + module support)

---

## 📦 Installation

```bash
npm install ngx-mask-number

```
## 💡 Live Demo
[![Live Demo](https://img.shields.io/badge/demo-online-brightgreen)](https://tansukhkumar.github.io/ngx-mask-number/)


## 🚀 Usage

✅ 1. Import in Standalone Component (Angular 15+)

import { NgxNumberMaskDirective } from 'ngx-mask-number';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [ReactiveFormsModule, NgxNumberMaskDirective],
  template: `
    <form [formGroup]="form">
      <label>Price:</label>
      <input formControlName="price" ngxNumberMask [locale]="'en-US'" />
      <p>Raw Value: {{ form.value.price }}</p>
    </form>
  `
})
export class AppComponent {
  form = inject(FormBuilder).nonNullable.group({
    price: [null]
  });
}


✅ 2. Or Import in NgModule (Angular 14+)
import { NgxNumberMaskDirective } from 'ngx-mask-number';

@NgModule({
  declarations: [...],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NgxNumberMaskDirective
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

---


## 🧪 Reactive Forms Example

form = this.fb.group({
  price: [null]
});

<form [formGroup]="form">
  <label>Price:</label>
  <input formControlName="price" ngxNumberMask [locale]="'en-US'" />
  <p>Raw Value: {{ form.value.price }}</p>
</form>

---

## 💡 Template-driven Forms Example

<input type="text" [(ngModel)]="amount" name="amount" ngxNumberMask [locale]="'en-US'" />
<p>Raw: {{ amount }}</p>

---

✅ Supports any BCP-47 locale string (like 'de-DE', 'fr-FR', 'hi-IN', etc.)


## 💬 How It Works

🧠 While typing: formats input using the given locale

💾 Emits raw number to the form control (FormControl or ngModel)

🖱 On blur: final formatting is applied

🔢 Keeps cursor in the right place after formatting

🔒 Blocks multiple decimals, invalid characters, and ensures clean numeric entry

Because formatting numbers in Angular inputs is surprisingly tricky:

Built-in number inputs don’t support formatting

🧩 Libraries like ngx-mask can format inputs and emit raw values, but they often suffer from cursor jumping and inconsistent behavior with decimals — especially in dynamic forms.

This directive formats the input but gives you a clean raw value, ready for API use

---

## 💻 Compatibility
| Feature          | Supported? |
| ---------------- | ---------- |
| Angular 15–18    | ✅ Yes      |
| Standalone apps  | ✅ Yes      |
| Module-based     | ✅ Yes      |
| SSR/Universal    | ✅ Yes      |
| No external deps | ✅ Yes      |

---


Made with ❤️ by TK