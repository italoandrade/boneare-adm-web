import {
  AfterViewInit, Directive, ElementRef, EventEmitter, forwardRef, HostListener, Input,
  Output, OnChanges
} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator} from '@angular/forms';
import {PhonePipe} from './phone.pipe';
import {getCaretPosition, setCaretPosition} from '../../functions/caret-position.functions';

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
