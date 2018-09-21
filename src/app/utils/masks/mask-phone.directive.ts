import {
  AfterViewInit, Directive, ElementRef, EventEmitter, forwardRef, HostListener, Input,
  Output, OnChanges
} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator} from '@angular/forms';
import {PhonePipe} from './phone.pipe';

@Directive({
  selector: '[maskPhone][ngModel]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MaskPhoneDirective),
    multi: true
  }, {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MaskPhoneDirective),
    multi: true
  }, PhonePipe]
})
export class MaskPhoneDirective implements ControlValueAccessor, Validator, AfterViewInit, OnChanges {

  loaded: boolean;
  input: boolean;
  beforeSelIndex;
  onChange: Function;
  onTouched: Function;
  control: FormControl;
  symbolsPositions: number[] = [0, 9, 11, 14];
  @Input() ngModel: any;
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();

  constructor(public elementRef: ElementRef, public phonePipe: PhonePipe) {
  }

  ngOnChanges(changes): void {
    if (!changes.ngModel.firstChange && (changes.ngModel.currentValue === null || changes.ngModel.currentValue === undefined)) {
      this.elementRef.nativeElement.value = '';
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loaded = true;
    });
  }

  writeValue(rawValue: any): void {
    if (this.control && this.loaded && rawValue) {
      this.control.markAsDirty();
    }
    if (!this.input) {
      this.elementRef.nativeElement.value = this.phonePipe.transform(this.ngModel);
    }
    this.input = false;
  }

  renderViaInput(rawValue: any): void {
    if (rawValue) {
      this.control.markAsDirty();
    }
    this.ngModel = this.format(rawValue);
    this.ngModelChange.emit(this.ngModel);
    this.elementRef.nativeElement.value = this.phonePipe.transform(this.elementRef.nativeElement.value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  format(value) {
    value = value.toString().replace(/[^0-9]+/g, '');
    return value.substring(0, 11);
  }

  validate(control: FormControl): { [key: string]: any } {

    this.control = control;

    if (control.value && this.format(control.value).length < 10) {
      return {parse: true};
    }

    return null;
  }

  @HostListener('keydown') onKeydown() {
    this.beforeSelIndex = getCaretPosition(this.elementRef.nativeElement);
  }

  @HostListener('input', ['$event']) onInput($event): void {
    let afterSelIndex = getCaretPosition(this.elementRef.nativeElement);
    const rawValue: string = this.elementRef.nativeElement.value;
    this.input = true;
    this.renderViaInput(rawValue);

    if (afterSelIndex === 4) {
      this.beforeSelIndex = 5;
      afterSelIndex = 6;
    }

    setCaretPosition(this.elementRef.nativeElement, this.beforeSelIndex, afterSelIndex, this.symbolsPositions);
  }

}

function getCaretPosition(el) {
  const documentt: any = {
    selection: undefined
  };
  Object.assign(documentt, document);

  let caretPos = 0;
  if (documentt.selection) { // IE Support
    el.focus();
    const select = documentt.selection.createRange();
    select.moveStart('character', -el.value.length);
    caretPos = select.text.length;
  } else if (el.selectionStart || el.selectionStart === '0') { // Firefox support
    caretPos = el.selectionStart;
  }

  return caretPos;
}

function setCaretPosition(el, beforeSelIndex, afterSelIndex, symbolsPositions?) {
  // https://javascriptexamples.info/snippet/getset-cursor-in-html-textarea
  let futureSelIndex;
  symbolsPositions = symbolsPositions ? symbolsPositions : [];
  if (el.selectionStart || el.selectionStart === '0') {

    futureSelIndex = afterSelIndex;

    for (let i = 0; i < symbolsPositions.length; i++) {
      if (beforeSelIndex === symbolsPositions[i] && afterSelIndex === symbolsPositions[i] + 1) {
        futureSelIndex = symbolsPositions[i] + 2;

        break;
      }
    }

    setTimeout(() => {
      setCaret();
    });
  }

  function setCaret() {
    if (el.setSelectionRange) {
      if (el.selectionStart) {
        el.focus();
        el.setSelectionRange(futureSelIndex, futureSelIndex);
      } else {
        el.focus();
      }
    } else if (el.createTextRange) {
      const range = el.createTextRange();
      range.collapse(true);
      range.move('character', futureSelIndex);
      range.moveEnd('character', futureSelIndex);
      range.moveStart('character', futureSelIndex);
      range.select();
    }
  }
}
