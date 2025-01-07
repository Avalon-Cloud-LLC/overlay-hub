import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { OverlayService } from './overlay.service';
import { PopupAction } from './popup.model';
import { fromEvent } from 'rxjs';

@Directive({
  selector: '[appModalClose]',
  standalone: true
})
export class ModalCloseDirective implements OnInit {
  @Input() popupId!: string; // 指定要關閉的彈出層 ID

  constructor(private overlaySvc: OverlayService, private host: ElementRef<HTMLElement>) {}

  ngOnInit() {
    const clickSub = fromEvent(this.host.nativeElement, 'click')
      .subscribe(() => {
        if (this.popupId) {
          this.overlaySvc.action$.next({ popupId: this.popupId, action: PopupAction.CLOSE });
        }
      });
  }
} 