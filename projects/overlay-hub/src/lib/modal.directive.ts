import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { BaseOverlayDirective } from './base-overlay.directive';
import { OverlayService } from './overlay.service';
import { OverlayConfig, PopupAction, PopupMode, PopupState } from './popup.model';

@Directive({
  selector: '[appModalTrigger]',
  standalone: true
})
export class ModalDirective extends BaseOverlayDirective implements OnInit {
  @Input() closeOnOutside = true;
  @Input() closeOnEsc = true;
  @Input() backdrop = true;
  @Input() disableBackgroundScroll = true;
  @Input() draggable = false;
  @Input() override extraContainerClasses = '';
  @Input() preferred: 'top' | 'bottom' | 'left' | 'right' | 'center' = 'center';

  private isDragging = false;
  private dragOffsetX = 0;
  private dragOffsetY = 0;
  private moveSub?: Subscription;
  private upSub?: Subscription;
  private backdropEl?: HTMLElement;

  constructor(
    overlaySvc: OverlayService,
    private host: ElementRef<HTMLElement>
  ) {
    super(overlaySvc);
  }

  protected getConfig(): OverlayConfig {
    return {
      popupId: this.popupId,
      mode: PopupMode.MODAL,
      closeOnOutside: this.closeOnOutside,
      closeOnEsc: this.closeOnEsc,
      backdrop: this.backdrop,
      disableBackgroundScroll: this.disableBackgroundScroll,
      triggerEl: this.host.nativeElement,
      containerEl: this.containerEl,
      extraContainerClasses: this.extraContainerClasses,
      draggable: this.draggable,
      preferred: this.preferred,
    };
  }

  override ngOnInit() {
    super.ngOnInit();

    const clickSub = fromEvent(this.host.nativeElement, 'click')
      .subscribe(() => {
        this.overlaySvc.action$.next({ popupId: this.popupId, action: PopupAction.TOGGLE });
      });
    this.subs.push(clickSub);
  }

  protected override onStateChange(state: PopupState) {
    super.onStateChange(state);
    if (state === PopupState.OPEN) {
      this.showBackdrop();
      this.showContainer();
      if (this.draggable && this.containerEl) {
        const downSub = fromEvent<PointerEvent>(this.containerEl, 'pointerdown')
          .subscribe(evt => this.onPointerDown(evt));
        this.subs.push(downSub);
      }
      const outsideClickSub = fromEvent<MouseEvent>(document, 'click')
        .subscribe(evt => {
          if (!this.containerEl?.contains(evt.target as Node) && !this.host.nativeElement.contains(evt.target as Node)) {
            this.overlaySvc.action$.next({ popupId: this.popupId, action: PopupAction.OUTSIDE });
          }
        });
      this.subs.push(outsideClickSub);
    } else {
      this.hideBackdrop();
      this.hideContainer();
      this.cleanDragSubs();
    }
  }

  private showBackdrop() {
    if (this.backdrop && !this.backdropEl) {
      this.backdropEl = document.createElement('div');
      this.backdropEl.style.position = 'fixed';
      this.backdropEl.style.top = '0';
      this.backdropEl.style.left = '0';
      this.backdropEl.style.width = '100%';
      this.backdropEl.style.height = '100%';
      this.backdropEl.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      this.backdropEl.style.zIndex = '999'; // 修改zIndex以確保不超過popup容器
      document.body.appendChild(this.backdropEl);

      if (this.closeOnOutside) {
        this.backdropEl.addEventListener('click', () => {
          this.overlaySvc.action$.next({ popupId: this.popupId, action: PopupAction.CLOSE });
        });
      }
    }
  }

  private hideBackdrop() {
    if (this.backdropEl) {
      document.body.removeChild(this.backdropEl);
      this.backdropEl = undefined;
    }
  }

  private onPointerDown(evt: PointerEvent) {
    if (evt.offsetY > 40) return; // e.g. 只在標題列可拖曳
    this.isDragging = true;
    this.dragOffsetX = evt.clientX - this.containerEl!.offsetLeft;
    this.dragOffsetY = evt.clientY - this.containerEl!.offsetTop;

    this.moveSub = fromEvent<PointerEvent>(document, 'pointermove')
      .subscribe(mv => this.onPointerMove(mv));
    this.upSub = fromEvent<PointerEvent>(document, 'pointerup')
      .subscribe(() => this.onPointerUp());
  }

  private onPointerMove(evt: PointerEvent) {
    if (!this.isDragging) return;
    evt.preventDefault();
    const left = evt.clientX - this.dragOffsetX;
    const top = evt.clientY - this.dragOffsetY;
    this.containerEl!.style.left = left + 'px';
    this.containerEl!.style.top = top + 'px';
  }

  private onPointerUp() {
    this.isDragging = false;
    this.cleanDragSubs();
  }

  private cleanDragSubs() {
    this.moveSub?.unsubscribe();
    this.upSub?.unsubscribe();
    this.moveSub = undefined;
    this.upSub = undefined;
  }

}