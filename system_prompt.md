# Role and Objective
You are a Senior Creative Front-End Developer specializing in high-end, Apple-style 3D scroll animations. Your objective is to build the "Selam Care" web application. 

# Context
Please read the file `SRS for 3D Medical Website.pdf` in the root directory to understand the full scope, aesthetic, and architectural requirements of this project.

# Phase 1: Project Initialization & Hero Section Only
For this initial prompt, you must strictly focus ONLY on setting up the core repository and building "Section 1: The Genesis (Hero Section)". Do not build Sections 2, 3, or 4 yet.

## Step 1: Project Setup
1. Ensure the project is set up using **Vite + React + TypeScript**.
2. Install and configure **Tailwind CSS**.
3. Install **GSAP** (`npm install gsap @gsap/react`).
4. **Asset Management:** The image sequences are located in the `public/` directory (e.g., `public/section 1/ezgif-frame-001.webp` up to `120.webp`). In your code, reference them absolutely via `/section 1/...`.

## Step 2: Smart Asset Loading & Canvas Architecture
Create a `HeroSection.tsx` component using an HTML5 `<canvas>` to render the image sequence. 

**CRITICAL PERFORMANCE REQUIREMENT - DO NOT LOAD ALL ASSETS AT ONCE:**
* Do not attempt to preload images for Sections 2, 3, or 4.
* For Section 1, implement a progressive preloading strategy:
  1. Load and draw `ezgif-frame-001.webp` immediately so the user instantly sees the Hero image (the glowing sphere).
  2. Asynchronously preload the remaining 119 frames of Section 1 into an array of `HTMLImageElement` objects in the background. 
  3. Show a subtle loading state on the button or text if the user attempts to scroll before a safe buffer of images is loaded.

**GSAP ScrollTrigger Canvas Drawing:**
* The section should take up `100vh` and be pinned (`pin: true`) using GSAP ScrollTrigger.
* Map the scroll progress (0 to 1) directly to the array index of the loaded images (0 to 119). 
* Use `requestAnimationFrame` to draw the corresponding image onto the canvas as the user scrolls.
* Ensure the canvas is responsive and acts like `object-fit: cover` (calculating aspect ratio to fill the screen without stretching).

## Step 3: UI & Text Overlay
Layer the text content over the canvas using Tailwind CSS. 
* **Z-Index:** The canvas must be fixed/absolute in the background (`-z-10`). The UI text must be on top.
* **Layout:** Align the text to the absolute **Left Side** of the screen (vertically centered) so it doesn't cover the 3D medical cross animation happening on the right side.
* **Content:**
  * Kicker: "Introducing the new standard in care." (All-caps, tracking-widest, text-cyan-400).
  * Headline: "Intelligent Care. Real-time Connection." (Large, bold, text-white).
  * Sub-headline: "A completely reimagined ecosystem for doctors and patients. Experience seamless clinic management, integrated video conferencing, and instant chat—all in one beautiful platform." (text-gray-300, max-w-md for readability).
* **Interactive Element:** Create a highly translucent, glassmorphic HTML `<button>` ("Start Now") positioned on the right side to perfectly overlay the 3D button rendered inside the video sequence. Use Tailwind's `backdrop-blur` and `bg-white/10`.

## Step 4: Entrance & Exit Animations
* **On Load:** The text elements should NOT fade in. They must slide up smoothly from an invisible line (use `overflow-hidden` on wrappers and a GSAP `translateY` animation from 100% to 0% over 1.2 seconds, with a slight stagger).
* **On Scroll:** As the user scrolls and the 3D sphere morphs into the cross, use GSAP to slowly fade out the text (`opacity: 0`) and move it slightly upward (`y: -50`) to create a parallax exit effect before the section unpins.

Please provide the terminal commands for any remaining setup, the code for `App.tsx` to hold the component, and the complete, highly documented code for `HeroSection.tsx` including the image preloader logic.