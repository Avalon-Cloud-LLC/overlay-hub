import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { BaseOverlayDirective } from './base-overlay.directive';
import { OverlayService } from './overlay.service';
import { OverlayConfig, PopupAction, PopupMode } from './popup.model';

@Directive({
  selector: '[appMenuTrigger]',
  standalone: true
})
export class MenuDirective extends BaseOverlayDirective implements OnInit {
  @Input() closeOnOutside = true;
  @Input() closeOnScroll = false;
  @Input() closeOnEsc = false;
  @Input() preferred: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  @Input() offset = 8;

  constructor(
    overlaySvc: OverlayService,
    private host: ElementRef<HTMLElement>
  ) {
    super(overlaySvc);
  }

  protected getConfig(): OverlayConfig {
    return {
      popupId: this.popupId,
      mode: PopupMode.MENU,
      closeOnOutside: this.closeOnOutside,
      closeOnScroll: this.closeOnScroll,
      closeOnEsc: this.closeOnEsc,
      preferred: this.preferred,
      offset: this.offset,
      triggerEl: this.host.nativeElement,
      containerEl: this.containerEl,
    };
  }

  override ngOnInit() {
    super.ngOnInit();
    this.overlaySvc.registerPopup(this.popupId, this.getConfig());

    const clickSub = fromEvent(this.host.nativeElement, 'click')
      .subscribe(() => {
        this.overlaySvc.action$.next({ popupId: this.popupId, action: PopupAction.TOGGLE });
      });
    this.subs.push(clickSub);

    const outsideClickSub = fromEvent<MouseEvent>(document, 'click')
      .subscribe(evt => {
        if (!this.containerEl?.contains(evt.target as Node) && !this.host.nativeElement.contains(evt.target as Node)) {
          this.overlaySvc.action$.next({ popupId: this.popupId, action: PopupAction.OUTSIDE });
        }
      });
    this.subs.push(outsideClickSub);
  }
}