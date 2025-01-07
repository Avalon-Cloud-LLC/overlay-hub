// base-overlay.directive.ts

import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OverlayService } from './overlay.service';
import { OverlayConfig, PopupState } from './popup.model';

@Directive()
export abstract class BaseOverlayDirective implements OnInit, OnDestroy {
  @Input() popupId = 'defaultOverlay';
  @Input() containerEl?: HTMLElement;
  @Input() triggerEl?: HTMLElement;
  @Input() extraContainerClasses?: string;

  protected subs: Subscription[] = [];

  constructor(protected overlaySvc: OverlayService) {}

  ngOnInit() {
    this.overlaySvc.registerPopup(this.popupId, this.getConfig());
    const state$ = this.overlaySvc.getState$(this.popupId);
    if (state$) {
      const sub = state$.subscribe((state: PopupState) => {
        this.onStateChange(state);
      });
      this.subs.push(sub);
    }
  }

  protected abstract getConfig(): OverlayConfig;

  protected onStateChange(state: PopupState) {
    if (!this.containerEl) {
      this.createContainer();
    }

    if (state === PopupState.OPEN) {
      this.showContainer();
    } else {
      this.hideContainer();
    }
  }

  /** 動態創建容器 */
  private createContainer() {
    if (!this.containerEl) {
      this.containerEl = document.createElement('div');
      document.body.appendChild(this.containerEl);
    }
    if (this.extraContainerClasses) {
      this.applyExtraClasses();
    }
  }

  /** 顯示容器 + 套用動畫 */
  protected showContainer() {
    if (!this.containerEl) return;

    this.containerEl.style.display = 'block';
    this.containerEl.style.position = 'absolute';
    this.containerEl.style.zIndex = '1000'; // 設定zIndex為1000
    this.overlaySvc.updatePosition(this.getConfig());
  }

  /** 隱藏容器 + 套用動畫 */
  protected hideContainer() {
    if (!this.containerEl) return;

    // 直接隱藏容器
    this.containerEl!.style.display = 'none';
  }

  /** 套用自訂 class */
  protected applyExtraClasses() {
    if (!this.containerEl) return;

    const classes = this.extraContainerClasses?.split(' ') ?? [];
    classes.forEach(cls => {
      if (cls.trim()) this.containerEl!.classList.add(cls.trim());
    });
  }

  ngOnDestroy() {
    this.overlaySvc.unregisterPopup(this.popupId);
    this.subs.forEach(s => s.unsubscribe());
    if (this.containerEl && this.containerEl.parentNode) {
      this.containerEl.parentNode.removeChild(this.containerEl);
    }
  }
}
