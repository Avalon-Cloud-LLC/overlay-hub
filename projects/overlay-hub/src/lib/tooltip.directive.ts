import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { BaseOverlayDirective } from './base-overlay.directive';
import { OverlayService } from './overlay.service';
import { OverlayConfig, PopupAction, PopupMode } from './popup.model';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective extends BaseOverlayDirective implements OnInit {
  @Input() override extraContainerClasses = '';
  private hoverTimerSub?: Subscription;

  constructor(overlaySvc: OverlayService, private host: ElementRef<HTMLElement>) {
    super(overlaySvc);
  }

  protected getConfig(): OverlayConfig {
    return {
      popupId: this.popupId,
      mode: PopupMode.TOOLTIP,
      triggerEl: this.host.nativeElement,
      containerEl: this.containerEl,
      extraContainerClasses: this.extraContainerClasses,
    };
  }

  override ngOnInit() {
    super.ngOnInit();
    // 監聽 mouseenter/mouseleave => OPEN / CLOSE
    const enter$ = fromEvent<MouseEvent>(this.host.nativeElement, 'mouseenter')
      .subscribe(() => {
        if (this.hoverTimerSub) this.hoverTimerSub.unsubscribe();
        this.overlaySvc.action$.next({ popupId: this.popupId, action: PopupAction.OPEN });
      });

    const leave$ = fromEvent<MouseEvent>(document, 'mousemove')
      .subscribe(evt => {
        const target = evt.target as Node;
        if (!this.host.nativeElement.contains(target) && !this.containerEl?.contains(target)) {
          if (this.hoverTimerSub) this.hoverTimerSub.unsubscribe();
          this.overlaySvc.action$.next({ popupId: this.popupId, action: PopupAction.CLOSE });
        }
      });

    this.subs.push(enter$, leave$);
  }
}