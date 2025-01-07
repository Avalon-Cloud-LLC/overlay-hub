export enum PopupAction {
    OPEN = 'OPEN',
    CLOSE = 'CLOSE',
    TOGGLE = 'TOGGLE',
    HOVER_IN = 'HOVER_IN',
    HOVER_OUT = 'HOVER_OUT',
    OUTSIDE = 'OUTSIDE',
    SCROLL = 'SCROLL',
    ESC = 'ESC'
  }
  
  export enum PopupState {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED'
  }
  
  export enum PopupMode {
    TOOLTIP = 'TOOLTIP',
    MODAL = 'MODAL',
    MENU = 'MENU'
  }
  
  export interface OverlayConfig {
    popupId?: string;
    mode?: PopupMode;
    triggerEl?: HTMLElement;
    containerEl?: HTMLElement;
    extraContainerClasses?: string;
    closeOnOutside?: boolean;
    closeOnScroll?: boolean;
    closeOnEsc?: boolean;
    disableBackgroundScroll?: boolean;
    backdrop?: boolean;
    hoverDelay?: number;
    preferred?: 'top'|'bottom'|'left'|'right'|'center';
    offset?: number;
    boundaryEl?: HTMLElement;
    ariaRole?: string;
    ariaLabel?: string;
    ariaDescribedby?: string;
    draggable?: boolean;
  }