import { Directive, ElementRef, HostListener, Input, Renderer2, forwardRef } from '@angular/core';
import {
    ControlValueAccessor, NG_VALUE_ACCESSOR
} from '@angular/forms';

@Directive({
    selector: '[ngxNumberMask]',
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NgxNumberMaskDirective),
            multi: true
        }
    ]
})
export class NgxNumberMaskDirective implements ControlValueAccessor {
    @Input() locale: string = 'en-US';
    private onChange = (value: number | null) => { };
    private onTouched = () => { };

    private allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];

    constructor(private el: ElementRef<HTMLInputElement>,  private renderer: Renderer2) { }

    ngOnInit() {
        this.renderer.setAttribute(this.el.nativeElement, 'inputmode', 'decimal');
    }

  private getDecimalSeparator(): string {
    return (1.1).toLocaleString(this.locale).replace(/\d/g, '')[0];
  }

    /**
     * Called by Angular when the form control's value is set programmatically like using setValue().
     * It updates the input element's displayed value accordingly.
     */
    writeValue(value: number): void {
        if (value != null && !isNaN(value)) {
            this.el.nativeElement.value = this.formatValue(value, value.toString(), true);
        } else {
            this.el.nativeElement.value = '';
        }
    }

    /**
     * Registers a callback function that Angular will call when the input's value changes.
     * This allows Angular forms to receive updates when the user types into the input.
     */
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * Registers a callback function that Angular will call when the input is blurred (touched).
     * This is used to mark the form control as "touched" for validation purposes.
     */
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * HostListener for keydown:
     * Prevents invalid keys such as alphabets and multiple decimals.
     * Called every time a key is pressed down in the input field.
     */
    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        const input = this.el.nativeElement;
        const value = input.value;
        const key = event.key;

        if (this.allowedKeys.includes(key)) return;

        // Allow only one decimal point
        const selectionStart = input.selectionStart != null ? input.selectionStart : 0;
        const selectionEnd = input.selectionEnd  != null ? input.selectionEnd : 0;

        // Check if the key pressed is a decimal point
        const decimalSeparator = this.getDecimalSeparator(); 
        if (key === decimalSeparator) {
            // Step 1: Determine if the current input value already has a decimal
            const alreadyHasDecimal = value.includes(decimalSeparator);

            // Step 2: Get the currently selected text in the input field
            const selectedText = value.substring(selectionStart, selectionEnd);

            // Step 3: Check if the user is replacing the existing decimal
                // This allows:
                //   - Full selection replacement (select all → type ".")
                //   - Selection that includes the existing decimal
            const isReplacingDecimal = selectedText.includes(decimalSeparator) || selectionStart === 0 && selectionEnd === value.length;

            //  Step 4: Block the key press **only** if:
                //   - There's already a decimal in the current value
                //   - AND the user is not replacing it via selection
            if (alreadyHasDecimal && !isReplacingDecimal) {
                event.preventDefault();
                return;
            }
        }


        // Block anything that's not a digit or a decimal
        if (!/\d|\./.test(key)) {
            event.preventDefault();
            return;
        }
    }

    /**
     * HostListener for blur:
     * Applies final formatting when input loses focus.
     */
    @HostListener('blur')
    onBlur() {
        const currentValue = this.el.nativeElement.value;

        // If nothing was typed, do not format or inject "0"
        if (!currentValue.trim()) {
            this.el.nativeElement.value = '';
            this.onTouched();
            return;
        }

        const raw = this.extractNumeric(currentValue);
        this.el.nativeElement.value = this.formatValue(raw, currentValue, true);
        this.onTouched();
    }

    /**
     * HostListener for focus:
     * Shows raw numeric input when input gains focus to allow natural editing.
     */
    // @HostListener('focus')
    // onFocus() {
    //     const raw = this.extractNumeric(this.el.nativeElement.value);
    //     this.el.nativeElement.value = raw.toString();
    // }

    /**
     * HostListener for input:
     * Live updates formatting and emits raw numeric value to the form control.
     */
    @HostListener('input', ['$event'])
    onInput(event: Event) {
        const inputEl = event.target as HTMLInputElement;;
        const rawBefore = inputEl.value;

        // If user cleared everything, don't format or emit 0
        if (!rawBefore.trim()) {
            inputEl.value = '';
            this.onChange(null); // or 0 if you prefer
            return;
        }
        const cursorStart = inputEl.selectionStart !== null ? inputEl.selectionStart : 0;


        const numeric = this.extractNumeric(rawBefore);

        // Emit raw numeric value to form control
        this.onChange(numeric);

        // Format and set value
        const formatted = this.formatValue(numeric, rawBefore);
        inputEl.value = formatted;

        // Maintain cursor position
        const newCursorPos = this.calculateCursorPosition(rawBefore, formatted, cursorStart);
        setTimeout(() => inputEl.setSelectionRange(newCursorPos, newCursorPos));
    }

    /**
     * Format a number for display.
     * Handles both live typing and final formatting (blur).
     */
    private formatValue(value: number | string, userInput: string = '', isBlur: boolean = false): string {
        const number = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(number)) return '';

        const decimalSep = this.getDecimalSeparator();
        const hasDecimal = userInput.includes(decimalSep);

        // Extract user-typed decimal part
        let decimalPart = '';
        if (hasDecimal) {
            decimalPart = userInput.split(decimalSep)[1] || '';
            decimalPart = decimalPart.substring(0, 2); // Limit to 2 digits
        }

        const integerPartFormatted = new Intl.NumberFormat(this.locale, {
            maximumFractionDigits: 0
        }).format(Math.floor(number));

        if (!hasDecimal) {
            return integerPartFormatted;
        } else {
            if (isBlur) {
                // Add up to 2 decimal digits, padding as needed
                const fractionDigits = decimalPart.length;
                return new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: fractionDigits > 0 ? fractionDigits : 0,
                    maximumFractionDigits: 2
                }).format(number);
            } else {
                // While typing, retain user's decimal part manually
                if (userInput.endsWith(decimalSep)) {
                    return integerPartFormatted + decimalSep;
                }
                return integerPartFormatted + decimalSep + decimalPart;
            }
        }
    }

    /**
     * Extract clean numeric value from input string.
     * Returns rounded float up to 2 decimal places.
     */
    private extractNumeric(value: string): number {
        if (!value) return 0;
        let cleaned = value
            .replace(/[^0-9.]/g, '')          // Remove non-numeric chars
            .replace(/^0+(?=\d)/, '')         // Remove leading zeroes
            .replace(/(\..*?)\..*/g, '$1');   // Keep only first dot

        // If there's a decimal part, truncate it to 2 digits
        const parts = cleaned.split('.');
        if (parts.length === 2) {
            parts[1] = parts[1].slice(0, 2); // Keep only first 2 digits after the decimal
            cleaned = parts[0] + '.' + parts[1];
        }

        const num = parseFloat(cleaned);
        return isNaN(num) ? 0 : num;
    }

    /**
     * Calculate updated cursor position after reformatting.
     * Ensures natural typing flow especially around the decimal point.
     */
    private calculateCursorPosition(raw: string, formatted: string, cursorPos: number): number {
        const rawLeft = raw.substring(0, cursorPos);
        const rawDigits = rawLeft.replace(/[^0-9.]/g, '');

        let digitsSeen = 0;
        let index = 0;

        while (digitsSeen < rawDigits.length && index < formatted.length) {
            if (/[0-9.]/.test(formatted[index])) {
                digitsSeen++;
            }
            index++;
        }

        // Special case: cursor is after 0 and before . (e.g., 0|.75)
        if (rawDigits.length === 2 && rawDigits.startsWith('0') && raw.length > rawDigits.length) {
            return index - 1;
        }

        // Special case: only a dot was typed
        if (rawDigits === '.' && raw.length === 1) {
            return index + 1;
        }

        return index;
    }
}

