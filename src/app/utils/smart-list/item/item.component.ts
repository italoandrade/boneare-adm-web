import {Component, ElementRef, Inject, AfterViewInit} from '@angular/core';
import {SmartListComponent} from '../smart-list.component';
import {elementClosest} from '../../element/closest.function';

@Component({
  selector: 'smart-list-item',
  templateUrl: '../smart-list.component.html'
})

export class SmartListItemComponent implements AfterViewInit {
  constructor(@Inject(SmartListComponent) private parent: SmartListComponent, private element: ElementRef) {
  }

  ngAfterViewInit() {
    const self = this;
    const inputs = this.element.nativeElement.querySelectorAll('input');
    for (let i = 0; i < inputs.length; i++) {
      const el = inputs[i];
      el.addEventListener('focus', e => {
        this.onFocus(e, self);
      });

      el.addEventListener('blur', e => {
        this.onBlur(e, self);
      });
    }
  }

  onFocus(event, self) {
    const el = event.target;

    const elItem = elementClosest(el, 'smart-list-item');
    const newIndex = Array.prototype.indexOf.call(self.parent.element.nativeElement.children, elItem);
    self.parent.currentFocusedElementIndex = newIndex > -1 ? newIndex : self.parent.currentFocusedElementIndex;
  }

  onBlur(event, self) {
    setTimeout(() => {
      const target = event.target;
      if (!elementClosest(target, 'body')) {
        setTimeout(() => {
          const item = self.parent.element.nativeElement.children[self.parent.currentFocusedElementIndex];
          if (item) {
            item.querySelector('input').focus();
          }
        }, 100);
      }
    });
  }
}
