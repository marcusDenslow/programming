# Mobile Menu Enhancement Instructions

## Current Status

The portfolio site now has:
- ✅ Basic responsive mobile menu (hamburger button + full-screen overlay)
- ✅ Fixed TerminalLock keyboard input bug (required wrapping `handleUnlock` in `useCallback`)
- ✅ Mobile menu button positioned at `right: 6rem` to avoid overlapping with theme toggle
- ✅ Responsive layouts for all sections (Experience, Contact, Forms, etc.)

## Problem

The current mobile menu is **NOT** award-winning or revolutionary - it's just a basic overlay version of the sidebar. The user wants something truly creative and modern.

## Design Philosophy to Match

The site uses:
- **Staggered multi-directional animations** (elements slide in from left/right/top/bottom)
- **Fast, snappy transitions** (0.3-0.5s duration)
- **Monospace typography** (JetBrains Mono)
- **Underline hover effects** that grow/shrink from left/right
- **Purple accent colors** (#7c3aed dark, #8b5cf6 light)
- **Minimalist, bold aesthetic**

## Task: Create Award-Winning Mobile Menu

### Inspirations to Research
1. **Awwwards mobile menu collections** - https://www.awwwards.com/awwwards/collections/menu/
2. Look for patterns like:
   - Staggered reveal with mask animations
   - Magnetic cursor/touch effects on menu items
   - 3D rotation/perspective transforms
   - Elastic/spring-based animations (use CSS cubic-bezier or springs)
   - Morphing geometric shapes
   - Gradient shifts and animated backgrounds
   - Text scramble/glitch effects on reveal
   - Particle or fragment effects

### Requirements

1. **Keep the existing design philosophy** - animations should feel cohesive with the rest of the site
2. **Mobile-first** - optimize for touch interactions
3. **Creative but not gimmicky** - should enhance UX, not hinder it
4. **Performant** - use CSS transforms/opacity, avoid layout thrashing
5. **Accessible** - maintain keyboard navigation and focus management

### Files to Modify

- `/home/marcus/programming/portfolio/AXIOM/src/components/MobileMenu.tsx`
- `/home/marcus/programming/portfolio/AXIOM/src/components/MobileMenu.css`

### Current Mobile Menu Structure

```tsx
// MobileMenu.tsx
- Hamburger button (3 lines that morph to X)
- Full-screen overlay with backdrop blur
- Menu content with:
  - Name section (Marcus, Systems Developer, Norway * 19)
  - Navigation (Projects, Experiences, Contact)
  - GitHub link
- Entrance animations: staggered left/right/bottom slides
- Exit animations: fade out
```

### Suggested Enhancements (Pick One or Combine)

#### Option 1: Magnetic + Spring Physics
- Menu items "attract" to finger/cursor position on hover
- Use spring-based easing (cubic-bezier or CSS springs)
- Items bounce/settle into position
- Background with animated gradient blob that follows cursor

#### Option 2: Fragment/Shatter Effect
- Menu items appear as if shattering in from pieces
- Use clip-path or SVG masks for reveal
- Staggered timing for each fragment
- Particles that settle into text

#### Option 3: 3D Perspective Reveal
- Menu rotates in from side with 3D transform
- Items have depth and parallax
- Use CSS `perspective` and `transform-style: preserve-3d`
- Smooth easing with `transform3d` for GPU acceleration

#### Option 4: Morphing Geometry
- Hamburger morphs into geometric shapes
- Background has animated SVG paths that morph
- Menu items slide in along curves
- Bezier curve animations

### Implementation Tips

1. **Use CSS custom properties** for dynamic values (e.g., cursor position)
2. **Leverage `will-change`** for animations but remove after animation completes
3. **Use `transform3d` and `translateZ(0)`** to force GPU acceleration
4. **Implement with RequestAnimationFrame** for smooth 60fps animations
5. **Add touch event listeners** for mobile-specific interactions
6. **Test on actual mobile devices** - Chrome DevTools mobile emulation isn't perfect

### Browser Compatibility

- Modern browsers only (Chrome, Firefox, Safari, Edge)
- Use CSS `@supports` for progressive enhancement
- Provide fallback for reduced-motion preference

### Example Pattern (Magnetic Menu Items)

```tsx
const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

const handleMouseMove = (e: MouseEvent) => {
  setMousePos({ x: e.clientX, y: e.clientY });
};

// For each menu item, calculate distance and apply transform
const calculateMagneticEffect = (element: DOMRect, mouse: {x: number, y: number}) => {
  const centerX = element.left + element.width / 2;
  const centerY = element.top + element.height / 2;
  const deltaX = mouse.x - centerX;
  const deltaY = mouse.y - centerY;
  const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
  const maxDistance = 150;

  if (distance < maxDistance) {
    const force = (maxDistance - distance) / maxDistance;
    return {
      x: deltaX * force * 0.3,
      y: deltaY * force * 0.3
    };
  }
  return { x: 0, y: 0 };
};
```

### CSS Animation Examples

```css
/* Spring-like easing */
.menu-item {
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Staggered with custom delays */
.menu-item:nth-child(1) { animation-delay: 0.1s; }
.menu-item:nth-child(2) { animation-delay: 0.2s; }
.menu-item:nth-child(3) { animation-delay: 0.3s; }

/* GPU-accelerated transforms */
.menu-overlay {
  transform: translate3d(0, 0, 0);
  will-change: transform, opacity;
}
```

## Critical Bug Fix (Already Implemented)

**If keyboard input stops working on TerminalLock page:**

In `/home/marcus/programming/portfolio/AXIOM/src/App.tsx`, ensure `handleUnlock` is wrapped in `useCallback`:

```tsx
const handleUnlock = useCallback(() => {
  setIsLocked(false)
}, [])
```

This prevents the callback from being recreated on every App render, which was causing TerminalLock's keyboard listener to detach/reattach constantly.

## Build Commands

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run lint       # Run linter
```

## Good Luck!

The goal is to make a menu that would genuinely win an award or be featured on Awwwards. Think: "Wow, that's creative!" not "Oh, it's just a sidebar overlay."
