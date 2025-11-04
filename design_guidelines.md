# Design Guidelines: ChesPay

## Design Approach

**Selected System**: Linear + Material Design Hybrid
- **Rationale**: This productivity tool requires data density with clarity. Linear's clean typography and spatial efficiency combined with Material Design's structured component system provides the perfect foundation for a shift management application.
- **Key Principles**: 
  - Information hierarchy through typography and spacing, not color
  - Scannable data presentation for quick shift review
  - Touch-friendly targets for mobile (minimum 44px)
  - Consistent feedback for all interactions

## Typography System

**Font Family**: Inter (primary), SF Mono (monospaced for time/numbers)

**Hierarchy**:
- Page Titles: 32px/700 (mobile: 24px)
- Section Headers: 24px/600 (mobile: 20px)
- Card Titles/Labels: 16px/600
- Body Text: 15px/400 (line-height 1.6)
- Secondary Text: 13px/400
- Captions/Metadata: 12px/400
- Numbers/Times: SF Mono 14px/500

**Special Treatments**:
- Shift times always in monospaced font for alignment
- Currency values: tabular numerals, 16px/600
- Date headers: 14px/600, uppercase tracking

## Layout System

**Spacing Primitives**: Tailwind units of 1, 2, 3, 4, 6, 8, 12, 16
- Micro spacing (within components): 1-2 units
- Component padding: 4-6 units  
- Section spacing: 8-12 units
- Page margins: 4 (mobile), 8 (tablet), 12-16 (desktop)

**Container Strategy**:
- App shell: Full viewport with fixed header
- Content areas: max-w-7xl centered
- Form modals: max-w-2xl
- Calendar view: max-w-6xl
- List views: max-w-4xl

**Grid Systems**:
- Calendar: 7-column grid (days of week)
- Shift cards: Single column mobile, 2-column tablet, 3-column desktop
- Stats dashboard: 2x2 grid mobile, 4-column desktop

## Component Library

### Navigation & Shell

**App Header** (fixed, 64px height):
- Left: App logo + title "ChesPay"
- Center: Month/Year picker with arrow navigation (calendar view only)
- Right: User avatar menu (settings, logout)
- Mobile: Hamburger menu, condensed title

**Bottom Navigation** (mobile only, 56px):
- Icons + labels: Calendar | Shifts | Settings
- Active state with indicator

**Desktop Sidebar** (240px, collapsible to 64px):
- Navigation items with icons
- User profile section at bottom
- Collapse/expand toggle

### Calendar Components

**Month View Toggle** (top-right of calendar):
- Segmented control: "Table" | "Cards"
- 40px height, rounded toggle

**Calendar Grid**:
- **Table Mode**: Traditional 7-column grid, equal-width cells
  - Header: Day names (Mon-Sun), 48px height
  - Date cells: minimum 120px height
  - Date number: top-left corner, 20px/600
  - Shift badges: stacked vertically, 4px gap
  
- **Card Mode**: Vertical cards, one per day
  - Card width: 100% mobile, 320px desktop
  - Flexbox wrap for week-based grouping
  - Card height: auto-expanding based on shifts
  - Date header: 56px with large date number

**Shift Badge** (compact summary):
- Height: 32px, rounded-lg, padding 2-3
- Layout: Time range (left) | Type icon | Duration | Amount (right)
- Truncate with ellipsis if needed
- Stack multiple badges with 2px gap

### Forms & Modals

**Add/Edit Shift Modal**:
- Full-screen mobile, centered 640px modal desktop
- Header: Title + close (56px height)
- Body: Scrollable form with 6-unit padding
- Footer: Sticky action buttons (48px height)

**Form Fields**:
- Label: 13px/600, 2-unit margin bottom
- Input height: 44px (touch-friendly)
- Multi-field rows: Grid with 4-unit gap
- Time pickers: Side-by-side hours/minutes
- Toggle switches: 24px height
- Radio groups: 4-unit spacing between options

**Day Kind Selector**:
- Horizontal pill buttons
- Width: auto-fit, minimum 100px
- Height: 40px
- Icons + text for each type
- Grid layout mobile (2 columns), flex desktop

**Notes Editor**:
- Scope selector: Dropdown, 44px height
- Text area: Minimum 120px height, auto-expand
- Tag input: Chip-based interface, 32px chips
- Preview pane: 200px fixed height, scrollable

### Lists & Data Display

**Shift List View**:
- Tab navigation: Day | Week | Month | Year (48px height)
- Filter bar: Collapsible panel, 56px when collapsed
- List items: Card-based, 12-unit margin bottom

**Shift Card** (list item):
- Padding: 6 units
- Left border: 4px accent for shift type
- Layout: 
  - Top row: Date | Time range (flex-between)
  - Middle: Type badge + duration metrics
  - Bottom: Notes preview (truncated) + amount (bold, right-aligned)
- Mobile: Full width
- Desktop: max-w-3xl centered

**Totals Summary Panel**:
- Sticky at top of list view
- Height: 80px
- Grid: 4 columns (Hours Base | Extra | Night | Total €)
- Each column: Large number (24px) + small label (12px)

### Import Wizard

**Multi-Step Layout**:
- Progress indicator: 56px height, numbered steps
- Step 1 (Upload): Drop zone 240px height, centered
- Step 2 (Presets): Form with preset selector + live preview
- Step 3 (Preview): Table view with conflict highlighting
- Step 4 (Resolve): Side-by-side comparison (conflict | proposed)

**Preview Table**:
- Fixed header: 48px
- Row height: 56px
- Columns: Date | Time | Type | Our € | File € | Status
- Conflict rows: Distinct visual treatment
- Mobile: Horizontal scroll

### Settings

**Settings Form**:
- Section groups with 12-unit spacing
- Section headers: 20px/600, 8-unit margin bottom
- Input groups: Grid layout, 6-unit gap
- Subsections: Inset with 4-unit padding

**Tariff Input Group**:
- 3 columns desktop (Base | Extra | Night)
- Stacked mobile
- Input prefix: € symbol
- Increment buttons: +/- 32px

### Utility Components

**FAB (Floating Action Button)**:
- Position: fixed bottom-right (or bottom-center mobile)
- Size: 56px diameter
- Icon: Plus symbol, 24px
- Shadow: elevation-8
- Bottom offset: 24px (desktop), 80px (mobile with bottom nav)

**Empty States**:
- Icon: 64px, centered
- Title: 20px/600
- Description: 15px/400, max-w-md
- Action button: 44px height
- Vertical spacing: 8-unit between elements

**Toast Notifications**:
- Width: 360px max
- Height: 56px minimum
- Position: Top-center or bottom-center
- Icon + message + optional action
- Auto-dismiss: 4 seconds

## Interactions

**Animations**: Minimal and purposeful only
- Modal enter/exit: 200ms ease
- List item hover: Subtle lift (2px translate-y)
- Button press: Scale 0.98, 100ms
- Tab switching: Slide transition, 250ms
- NO calendar animations, NO loading spinners beyond necessity

**Touch Gestures**:
- Swipe on shift cards: Delete action
- Pull-to-refresh on lists
- Horizontal swipe on calendar: Navigate months

**Responsive Breakpoints**:
- Mobile: < 640px (single column, bottom nav)
- Tablet: 640-1024px (2 columns where applicable)
- Desktop: > 1024px (sidebar, multi-column)

## Accessibility

- Focus indicators: 2px offset outline
- Skip to main content link
- ARIA labels for icon-only buttons
- Keyboard navigation: Tab order, Enter/Space activation
- Screen reader announcements for dynamic updates
- Minimum contrast ratios maintained through structural hierarchy
- Form error messages: Inline below field, 13px

## Images

**Welcome Page Only**:
- Hero image: Illustration of calendar/schedule concept, 600px height desktop
- Style: Modern flat illustration with professional feel
- Placement: Right side (desktop), above content (mobile)
- Background treatment: Subtle gradient or texture behind illustration

**Note**: No images in authenticated app areas - focus is on data clarity and productivity.