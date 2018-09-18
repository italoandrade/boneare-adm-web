import {AfterViewInit, Component, Directive, OnDestroy, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {TemplatePortal} from '@angular/cdk/portal';
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';

@Directive({ selector: '[displacerPortal]' })
export class DisplacerPortalDirective extends TemplatePortal<any> {
  constructor(templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef) {
    super(templateRef, viewContainerRef);
  }
}

@Component({
  selector: 'app-fnls-displacer',
  template: `
    <ng-template displacerPortal>
      <ng-content></ng-content>
    </ng-template>
  `
})
export class DisplacerComponent implements OnDestroy, AfterViewInit {

  private _config = new OverlayConfig();

  @ViewChild(DisplacerPortalDirective)
  private _portal: DisplacerPortalDirective;

  private _overlayRef: OverlayRef = undefined;

  constructor(private _overlay: Overlay) {}

  public ngOnDestroy() {
    this._overlayRef.detach();
  }

  public ngAfterViewInit() {
    this._overlayRef = this._overlay.create(this._config);
    this._overlayRef.attach(this._portal);
  }
}
