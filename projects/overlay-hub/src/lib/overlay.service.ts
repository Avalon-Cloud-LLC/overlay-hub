import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, timer } from 'rxjs';
import { PopupAction, PopupState, OverlayConfig } from './popup.model';

interface PopupInfo {
  state$: BehaviorSubject<PopupState>;
  config: OverlayConfig;
  hoverTimerSub?: any;
}

@Injectable({ providedIn: 'root' })
export class OverlayService {
  getState$(popupId: string) {
    if (!this.popups.has(popupId)) {
      throw new Error(`Popup with id ${popupId} does not exist.`);
    }
    return this.popups.get(popupId)?.state$;
  }
  action$ = new Subject<{ popupId: string; action: PopupAction }>();
  private popups = new Map<string, PopupInfo>();

  constructor() {
    this.action$.subscribe(({ popupId, action }) => {
      if (!this.popups.has(popupId)) return;
      this.handleAction(popupId, action);
    });
  }
  // overlay.service.ts

  updatePosition(cfg: OverlayConfig) {
    const trigger = cfg.triggerEl as HTMLElement;
    const container = cfg.containerEl as HTMLElement;

    container.style.position = 'absolute';
    container.style.display = 'block'; // 顯示才能量測
    container.style.visibility = 'hidden'; // 避免閃爍

    const triggerRect = trigger.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    let boundaryRect = new DOMRect(0, 0, window.innerWidth, window.innerHeight);
    if (cfg.boundaryEl) {
      boundaryRect = cfg.boundaryEl.getBoundingClientRect();
    }

    const offset = cfg.offset ?? 8;
    let finalTop = 0, finalLeft = 0;

    switch (cfg.preferred) {
      case 'top':
        finalTop = triggerRect.top - containerRect.height - offset;
        finalLeft = triggerRect.left + (triggerRect.width / 2) - (containerRect.width / 2);
        break;
      case 'bottom':
        finalTop = triggerRect.bottom + offset;
        finalLeft = triggerRect.left + (triggerRect.width / 2) - (containerRect.width / 2);
        break;
      case 'left':
        finalLeft = triggerRect.left - containerRect.width - offset;
        finalTop = triggerRect.top + (triggerRect.height / 2) - (containerRect.height / 2);
        break;
      case 'right':
        finalLeft = triggerRect.right + offset;
        finalTop = triggerRect.top + (triggerRect.height / 2) - (containerRect.height / 2);
        break;
      case 'center':
        finalLeft = boundaryRect.left + (boundaryRect.width / 2) - (containerRect.width / 2);
        finalTop = boundaryRect.top + (boundaryRect.height / 2) - (containerRect.height / 2);
        break;
    }

    // Clamp to boundary
    finalLeft = Math.max(boundaryRect.left, Math.min(finalLeft, boundaryRect.right - containerRect.width));
    finalTop = Math.max(boundaryRect.top, Math.min(finalTop, boundaryRect.bottom - containerRect.height));

    container.style.left = `${finalLeft}px`;
    container.style.top = `${finalTop}px`;
    container.style.visibility = '';
  }

  registerPopup(popupId: string, config: OverlayConfig) {
    if (!this.popups.has(popupId)) {
      const info: PopupInfo = {
        state$: new BehaviorSubject<PopupState>(PopupState.CLOSED),
        config
      };
      this.popups.set(popupId, info);
    } else {
      const info = this.popups.get(popupId)!;
      info.config = { ...info.config, ...config };
    }
  }

  unregisterPopup(popupId: string) {
    this.popups.delete(popupId);
  }

  private handleAction(popupId: string, action: PopupAction) {
    const info = this.popups.get(popupId)!;
    const state$ = info.state$;
    const current = state$.value;

    switch (action) {
      case PopupAction.OPEN:
        if (current === PopupState.CLOSED) this.doOpen(popupId);
        break;
      case PopupAction.CLOSE:
        if (current === PopupState.OPEN) this.doClose(popupId);
        break;
      case PopupAction.TOGGLE:
        (current === PopupState.CLOSED) ? this.doOpen(popupId) : this.doClose(popupId);
        break;
      case PopupAction.OUTSIDE:
        if (info.config.closeOnOutside !== false && current === PopupState.OPEN) {
          this.doClose(popupId);
        }
        break;
      case PopupAction.ESC:
        if (info.config.closeOnEsc && current === PopupState.OPEN) {
          this.doClose(popupId);
        }
        break;
    }
  }

  private doOpen(popupId: string) {
    const info = this.popups.get(popupId)!;
    const cfg = info.config;
    info.state$.next(PopupState.OPEN);
    if (cfg.mode === 'MODAL' && cfg.disableBackgroundScroll) {
      document.body.style.overflow = 'hidden';
    }
  }

  private doClose(popupId: string) {
    const info = this.popups.get(popupId)!;
    info.state$.next(PopupState.CLOSED);
    if (info.config.mode === 'MODAL' && info.config.disableBackgroundScroll) {
      document.body.style.overflow = '';
    }
  }
  showPopup(popupId: string) {
    const info = this.popups.get(popupId);
    if (info) {
      this.doOpen(popupId);
    }
  }

  hidePopup(popupId: string) {
    const info = this.popups.get(popupId);
    if (info) {
      this.doClose(popupId);
    }
  }
}