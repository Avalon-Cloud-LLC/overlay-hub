import { Provider } from '@angular/core';
import { OverlayService } from './overlay.service';

export function provideOverlay(): Provider {
  return {
    provide: OverlayService,
    useClass: OverlayService,
  };
}
