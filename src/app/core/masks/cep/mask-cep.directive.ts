import {Directive, ElementRef, EventEmitter, forwardRef, HostListener, Input, Output, AfterViewInit, OnChanges} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator} from '@angular/forms';
import {CepPipe} from './cep.pipe';
import {getCaretPosition, setCaretPosition} from '../../functions/caret-position.functions';

@Directive({
  selector: '[maskCep][ngModel]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MaskCepDirective),
    multi: true
  }, {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MaskCepDirective),
    multi: true
  }, CepPipe]
})
export class MaskCepDirective implements ControlValueAccessor, Validator, AfterViewInit, OnChanges {

  loaded: boolean;
  input: boolean;
  beforeSelIndex;
  onChange: Function;
  onTouched: Function;
  control: FormControl;
  symbolsPositions: number[] = [5, 9];
  @Input() ngModel: any;
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();

  constructor(public elementRef: ElementRef, public cepPipe: CepPipe) {
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
      this.elementRef.nativeElement.value = this.cepPipe.transform(this.ngModel);
    }
    this.input = false;
  }

  renderViaInput(rawValue: any): void {
    if (rawValue) {
      this.control.markAsDirty();
    }
    this.ngModel = this.format(rawValue);
    this.ngModelChange.emit(this.ngModel);
    this.elementRef.nativeElement.value = this.cepPipe.transform(this.elementRef.nativeElement.value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  format(value) {
    value = value.toString().replace(/[^0-9]+/g, '');
    return value.substring(0, 8);
  }

  validate(control: FormControl): { [key: string]: any } {

    this.control = control;

    if (control.value && this.format(control.value).length < 8) {
      return {parse: true};
    }

    return null;
  }

  setDisabledState(isDisabled: boolean) {
    const method = isDisabled ? 'setAttribute' : 'removeAttribute';
    this.elementRef.nativeElement[method]('disabled', 'disabled');
  }

  @HostListener('keydown') onKeydown() {
    this.beforeSelIndex = getCaretPosition(this.elementRef.nativeElement);
  }

  @HostListener('input', ['$event']) onInput($event): void {
    const afterSelIndex = getCaretPosition(this.elementRef.nativeElement);
    const rawValue: string = this.elementRef.nativeElement.value;
    this.input = true;
    this.renderViaInput(rawValue);
    setCaretPosition(this.elementRef.nativeElement, this.beforeSelIndex, afterSelIndex, this.symbolsPositions);
  }

}
