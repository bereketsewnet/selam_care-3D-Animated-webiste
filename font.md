# Typography & Spacing Style Guide: Selam Care

## 1. The Font Families
To achieve that expensive, Apple/Stripe aesthetic without paying for enterprise font licenses, we will use two specific, high-end Google Fonts.

* **Primary Display Font (Headings):** `Plus Jakarta Sans` or `Clash Display`
    * *Why:* These fonts have perfectly geometric curves and look incredibly sharp at massive sizes.
* **Secondary Font (Body & UI):** `Inter` or `Manrope`
    * *Why:* Highly readable, neutral, and looks highly technical for subtitles and buttons.

*(To import via Google Fonts, use Plus Jakarta Sans and Inter).*

---

## 2. Typography Scale & Properties

### The Kicker (Small text above headlines)
* **Font Style:** Secondary Font (`Inter`), All-Caps.
* **Font Size:** 0.875rem (`14px`)
* **Font Weight:** 600 (Semibold) or 700 (Bold)
* **Letter Spacing (Tracking):** +0.15em to +0.2em (Very wide, breathable)
* **Line Height:** 1.5
* **Tailwind Classes:** `text-sm font-bold uppercase tracking-[0.2em] text-cyan-400`

### Heading 1 (H1) - The Hero Title
* **Font Style:** Primary Font (`Plus Jakarta Sans`).
* **Font Size:** 4.5rem to 5.5rem (`72px` to `88px` on desktop).
* **Font Weight:** 800 (ExtraBold).
* **Letter Spacing (Tracking):** -0.04em (Negative spacing is the secret to expensive-looking large text; it tightly packs the letters together).
* **Line Height:** 1.05 (Very tight, almost touching).
* **Tailwind Classes:** `text-7xl md:text-8xl font-extrabold tracking-tighter leading-tight text-white`

### Heading 2 (H2) - Section Titles (e.g., "Command your clinic.")
* **Font Style:** Primary Font (`Plus Jakarta Sans`).
* **Font Size:** 3.5rem to 4rem (`56px` to `64px`).
* **Font Weight:** 700 (Bold).
* **Letter Spacing (Tracking):** -0.02em (Slightly tight).
* **Line Height:** 1.1
* **Tailwind Classes:** `text-5xl md:text-6xl font-bold tracking-tight leading-none text-white`

### Subtitle / Paragraph Text
* **Font Style:** Secondary Font (`Inter`).
* **Font Size:** 1.125rem to 1.25rem (`18px` to `20px`).
* **Font Weight:** 400 (Regular) or 500 (Medium).
* **Letter Spacing (Tracking):** 0em (Normal).
* **Line Height:** 1.6 to 1.7 (Very relaxed and readable).
* **Tailwind Classes:** `text-lg md:text-xl font-normal leading-relaxed text-gray-300 max-w-xl`

---

## 3. Element Spacing Guide (Vertical Rhythm)
In high-end design, the empty space between elements is just as important as the text itself. Here is the exact spacing (margin-bottom) you should use to separate your text blocks.

* **Kicker to Main Headline (H1/H2):**
    * **Space:** `1rem` (16px)
    * **Tailwind:** `mb-4`
* **Main Headline to Subtitle/Paragraph:**
    * **Space:** `1.5rem` to `2rem` (24px to 32px)
    * **Tailwind:** `mb-6` or `mb-8`
* **Subtitle to Call-to-Action (Button):**
    * **Space:** `2.5rem` to `3rem` (40px to 48px)
    * **Tailwind:** `mb-10` or `mb-12`

### Total Hero Text Block Construction Example:
```html
<div class="flex flex-col items-start justify-center h-full pl-20">
    <span class="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400 mb-4">
        Introducing the new standard in care.
    </span>
    <h1 class="text-8xl font-extrabold tracking-tighter leading-tight text-white mb-8">
        Intelligent Care.<br/>
        <span class="text-cyan-400">Real-time</span><br/>
        Connection.
    </h1>
    <p class="text-xl font-normal leading-relaxed text-gray-300 max-w-xl mb-12">
        A completely reimagined ecosystem for doctors and patients. Experience seamless clinic management, integrated video conferencing, and instant chat—all in one beautiful platform.
    </p>
    <button class="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-semibold hover:bg-white/20 transition-all">
        Get Started →
    </button>
</div>