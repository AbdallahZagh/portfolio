# 🚀 Abdallah Zaghloul - Portfolio Website

A modern, high-performance portfolio website showcasing my work as a Frontend Developer and Team Lead. Built with cutting-edge technologies including Next.js 16, React 19, Three.js, and Tailwind CSS v4.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎨 Design & User Experience
- **Dual Theme System**: Dark mode (default) and Light mode with smooth transitions
- **Interactive 3D Backgrounds**: Custom Three.js interactive sphere and starry night sky
- **Smooth Animations**: Framer Motion powered scroll reveals, layout transitions, and micro-interactions
- **Responsive Design**: Fully responsive from mobile phones (320px) to 4K displays (3840px+)
- **Glass Morphism**: Modern glass effect UI components with backdrop blur
- **Mobile-First Navigation**: Hamburger menu for mobile devices with smooth slide-in animations

### 🎯 Performance & Optimization
- **Next.js 16 App Router**: Server Components for optimal performance
- **Code Splitting**: Lazy loading for below-the-fold sections
- **Font Optimization**: Next.js font optimization with JetBrains Mono & Inter
- **Zero Layout Shift**: Optimized for perfect Core Web Vitals
- **SEO Optimized**: Comprehensive metadata, structured data (JSON-LD), and semantic HTML
- **Accessibility**: WCAG compliant with keyboard navigation and reduced motion support

### 🎭 Animations & Interactions
- **Framer Motion**: Smooth scroll-triggered animations and staggered reveals
- **Interactive Elements**: Hover effects, transitions, and micro-interactions
- **3D Graphics**: Three.js powered interactive visuals with theme-aware colors
- **Parallax Effects**: Scroll-based parallax on hero section

### 📱 Responsive Features
- **Mobile-First Design**: Optimized for all screen sizes
- **Touch Interactions**: Mobile-friendly navigation and interactions
- **Adaptive Layouts**: Flexible grid systems that adapt to screen size
- **Progressive Enhancement**: Works on all devices with graceful degradation

## 🛠️ Tech Stack

### Core
- **Next.js 16.1.1** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS v4** - Utility-first CSS framework

### Animation & Visuals
- **Framer Motion 12.27.5** - Animation library
- **Three.js 0.182.0** - 3D graphics
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for react-three-fiber

### UI & Styling
- **Lucide React** - Icon system
- **next-themes** - Theme management
- **tailwindcss-animate** - Animation utilities

### Utilities
- **clsx** - Conditional class names
- **tailwind-merge** - Merge Tailwind classes

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AbdallahZagh/portfolio-next-v1.git
   cd portfolio-next-v1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
   ```
   See [EMAILJS_SETUP.md](./EMAILJS_SETUP.md) for detailed EmailJS setup instructions.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📂 Project Structure

```
portfolio-next-v1/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── contact/          # Contact form API route
│   │   ├── globals.css           # Global styles and theme variables
│   │   ├── layout.tsx            # Root layout with metadata and SEO
│   │   └── page.tsx              # Main page with lazy-loaded sections
│   ├── components/
│   │   ├── layout/
│   │   │   ├── navbar.tsx        # Navigation with mobile menu
│   │   │   └── footer.tsx        # Footer component
│   │   ├── three/
│   │   │   ├── interactive-sphere.tsx    # 3D sphere background
│   │   │   └── starry-night-sky.tsx      # Starry background
│   │   ├── ui/
│   │   │   ├── button.tsx        # Button component
│   │   │   ├── card.tsx          # Card component
│   │   │   ├── badge.tsx         # Badge component
│   │   │   ├── input.tsx         # Input component
│   │   │   ├── textarea.tsx      # Textarea component
│   │   │   └── theme-toggle.tsx  # Theme switcher
│   │   └── theme-provider.tsx    # Theme provider wrapper
│   ├── features/
│   │   ├── hero/
│   │   │   └── hero-section.tsx  # Hero section with 3D background
│   │   ├── experience/
│   │   │   └── experience-section.tsx    # Work experience timeline
│   │   ├── projects/
│   │   │   ├── projects-section.tsx      # Projects grid
│   │   │   └── project-card.tsx          # Individual project card
│   │   ├── skills/
│   │   │   └── skills-section.tsx        # Skills showcase
│   │   └── contact/
│   │       ├── contact-section.tsx       # Contact section
│   │       └── contact-form.tsx          # Contact form with EmailJS
│   └── lib/
│       ├── utils.ts              # Utility functions
│       └── animation-variants.ts # Framer Motion variants
├── public/
│   ├── logo.png                  # Favicon and logo
│   └── ABDALLAH_ZAGHLOUL_RESUME.pdf  # Resume PDF
├── .env.local                    # Environment variables (not in git)
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

The site will be automatically deployed on every push to the main branch.

## 🎨 Customization

### Updating Personal Information

Edit the data in the component files:
- **Hero Section**: `src/features/hero/hero-section.tsx`
- **Experience**: `src/features/experience/experience-section.tsx`
- **Projects**: `src/features/projects/projects-section.tsx`
- **Skills**: `src/features/skills/skills-section.tsx`
- **Contact**: `src/features/contact/contact-section.tsx`

### Changing Colors

Edit the theme variables in `src/app/globals.css`:
- Light mode colors are in `:root`
- Dark mode colors are in `.dark`

### Updating Metadata & SEO

Edit the metadata in `src/app/layout.tsx` to update:
- Page title and description
- Open Graph tags
- Twitter Card metadata
- Structured data (JSON-LD)

## 📧 Contact Form Setup

The contact form uses EmailJS for sending emails. Follow these steps:

1. Sign up at [EmailJS](https://www.emailjs.com)
2. Create an email service
3. Create an email template
4. Add your credentials to `.env.local`

See [EMAILJS_SETUP.md](./EMAILJS_SETUP.md) for detailed instructions.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Abdallah Zaghloul**

- Email: f2002.a.z@gmail.com
- GitHub: [@AbdallahZagh](https://github.com/AbdallahZagh)
- LinkedIn: [Abdallah Zaghloul](https://linkedin.com/in/abdallah-zaghloul)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- 3D Graphics with [Three.js](https://threejs.org/)
- Animations with [Framer Motion](https://www.framer.com/motion/)
- Icons by [Lucide](https://lucide.dev/)

---

⭐ If you find this project helpful, please consider giving it a star!
