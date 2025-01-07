
# **Overlay Hub**

**`@avalon-cloud/overlay-hub`** 是一個簡易使用且高度可擴充的 **Angular Overlay Library**，支援 **Tooltip**、**Modal**、**Menu** 等多種彈窗場景。  
內建 RxJS 狀態管理、翻轉定位、高級動畫（Fade/Slide）與拖曳功能，並且支援無障礙設計（ARIA）。

---

## **功能特色**

- **多場景模式**：支援 Tooltip、Modal、Dropdown、Menu 等多種情境  
- **拖曳 Modal**：Modal 支援自訂可拖曳區域  
- **翻轉定位**：自動偵測可視區域，根據空間不足進行方向翻轉  
- **動畫支持**：淡入淡出 (fade)、滑入滑出 (slide) 或自訂動畫類型  
- **RxJS 狀態管理**：以 `BehaviorSubject` 管理開關狀態，避免事件衝突  
- **Tooltip 延遲**：滑鼠移入/移出可設定延遲時間  
- **無障礙設計 (ARIA)**：支援 `role="tooltip"`, `aria-label`, `aria-describedby` 等  
- **傳統 CSS 整合**：使用內建樣式，無需外部框架，如 Tailwind 或 Bootstrap  

---

## **安裝**

請先確認您的專案使用 Angular 19+，並已安裝 RxJS。

```bash
npm install @avalon-cloud/overlay-hub
```

---

## **快速使用**

### **1. Tooltip**

```html
<!-- Tooltip 示例 -->
<button [appTooltip]="tooltipBox" popupId="myTooltip">
  Hover me
</button>
<div #tooltipBox style="display: none;">
  This is a Tooltip
</div>
```

### **2. Modal**

```html
<!-- Modal 示例 -->
<button [appModalTrigger]="modalBox" popupId="myModal" [draggable]="true">
  Open Modal
</button>
<div #modalBox style="display: none; width: 300px;">
  <h3>Draggable Modal</h3>
  <p>Click and drag the top area to move this modal.</p>
</div>
```

### **3. Menu**

```html
<!-- Menu 示例 -->
<button [appMenuTrigger]="menuBox" popupId="myMenu">
  Open Menu
</button>
<div #menuBox style="display: none; background: white; border: 1px solid #ccc;">
  <ul>
    <li>Menu Item 1</li>
    <li>Menu Item 2</li>
  </ul>
</div>
```

---

## **API 列舉表**

以下是各指令的 **Input** 屬性與可用設定：

### **通用 API**

| Input                      | 類型                       | 預設值       | 說明                                          |
|----------------------------|----------------------------|--------------|-----------------------------------------------|
| `popupId`                  | `string`                  | `'defaultPopup'` | 用於區分不同的彈窗                                |
| `containerEl`              | `HTMLElement`             | `undefined`  | 指定彈窗容器元素                                  |
| `triggerEl`                | `HTMLElement`             | `undefined`  | 指定觸發元素 (若未指定，預設為綁定指令的元素)         |
| `extraContainerClasses`    | `string`                  | `undefined`  | 可為容器加入額外的 CSS class                   |
| `animationType`            | `'fade' | 'slide' | 'none'` | `'fade'`  | 指定動畫類型                                    |
| `closeOnOutside`           | `boolean`                 | `true`       | 點擊外部是否關閉                                |
| `closeOnScroll`            | `boolean`                 | `false`      | 滾動是否關閉                                    |
| `closeOnEsc`               | `boolean`                 | `false`      | 按下 `ESC` 是否關閉                              |
| `preferred`                | `'top' | 'bottom' | 'left' | 'right'` | `'bottom'` | 預設顯示方向                                    |
| `offset`                   | `number`                  | `8`          | 與觸發元素的距離 (px)                            |
| `ariaRole`                 | `string`                  | `undefined`  | 設定 ARIA `role` (如 `dialog`, `tooltip`)      |
| `ariaLabel`                | `string`                  | `undefined`  | ARIA `aria-label`                              |
| `ariaDescribedby`          | `string`                  | `undefined`  | ARIA `aria-describedby`                        |

---

### **Tooltip 專屬**

| Input           | 類型      | 預設值 | 說明                        |
|-----------------|-----------|--------|-----------------------------|
| `hoverDelay`    | `number`  | `200`  | 滑鼠移入延遲 (ms)，避免快速切換頻繁顯示  |

---

### **Modal 專屬**

| Input                      | 類型       | 預設值       | 說明                                         |
|----------------------------|------------|--------------|----------------------------------------------|
| `disableBackgroundScroll`  | `boolean`  | `false`      | 是否禁用背景滾動                             |
| `backdrop`                 | `boolean`  | `false`      | 是否顯示幕布                                 |
| `draggable`                | `boolean`  | `false`      | Modal 是否可拖曳                             |

---

## **拖曳行為**

- 若 `draggable=true`，Modal 將支援拖曳，預設僅限於「標題列」內（前 40px）。  
- 拖曳時，會使用 `pointerdown` / `pointermove` / `pointerup`，並自動更新位置。  

---

## **樣式**

內建樣式會自動注入到 `<head>`，無需額外設定。若需自訂，覆蓋以下 class：

- **動畫類型**：
  - `.popup-fade-in` / `.popup-fade-out`  
  - `.popup-slide-in` / `.popup-slide-out`  

```css
.popup-fade-in {
  opacity: 0;
  animation: popupFadeIn 0.2s forwards ease-in-out;
}
.popup-slide-in {
  transform: translateY(-10px);
  opacity: 0;
  animation: popupSlideIn 0.2s forwards ease-out;
}
```

---

## **無障礙 (ARIA)**

- Tooltip: 自動加入 `role="tooltip"`, `aria-label` 或 `aria-describedby`。  
- Modal: 自動加入 `role="dialog"`, 並在開啟時設定 `aria-hidden=false`，關閉後設回 `aria-hidden=true`。

---

## **開發計劃**

- [ ] 提供更多內建動畫類型  
- [ ] 加入智能拖曳範圍限制  
- [ ] 提供多層 Modal 支援  

---

## **授權**

此套件使用 **MIT License** 授權，歡迎自由修改與擴展。 
