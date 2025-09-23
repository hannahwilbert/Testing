# L3 Networks Website

A modern, responsive website for L3 Networks Inc. built with Eleventy (11ty) and Tailwind CSS.

## About L3 Networks

L3 Networks Inc. provides comprehensive IT services including Cyber Security, User & Device Management, Managed Networks, Cloud & Systems Services, and Professional Services. Since 2000, we've been helping businesses stay secure, reliable, and future-proof.

## Repository Purpose

This repository serves as **code storage and version control** for the L3 Networks website. The site is deployed to a private Plesk server, not through GitHub Pages.

## Tech Stack

- **Static Site Generator**: [Eleventy (11ty)](https://www.11ty.dev/)
- **CSS Framework**: [Tailwind CSS](https://tailwindcss.com/)
- **JavaScript**: Alpine.js for interactive components
- **Build Tools**: npm scripts with npm-run-all
- **Icons**: Lucide Icons

## Project Structure

```
├── src/                    # Source files
│   ├── _data/             # Data files (JSON)
│   ├── _includes/         # Templates and partials
│   │   ├── layouts/       # Page layouts
│   │   └── partials/      # Reusable components
│   ├── images/            # Image assets
│   ├── products/          # Product pages
│   ├── your-challenges/   # Challenge pages
│   └── *.md              # Content pages
├── dist/                  # Built site (generated)
├── css/                   # CSS source files
└── package.json          # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd l3-bento
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

This will:
- Start Eleventy in watch mode
- Compile Tailwind CSS
- Serve the site at `http://localhost:8080`

### Build for Production

```bash
npm run build
```

This will generate the static site in the `dist/` directory.

## Development

### Adding New Pages

1. Create a new `.md` file in the `src/` directory
2. Add front matter with the appropriate layout
3. The page will be automatically built and available

### Styling

- Main styles are in `css/tailwind.css`
- Custom styles can be added to `css/kit.css`
- Tailwind configuration is in `css/tailwind.config.js`

### Data Management

- Site-wide data is stored in `src/_data/`
- Navigation data is in `navMain.json` and `navSolutions.json`
- Product information is in `products.json`

## Deployment

This site is deployed to a Plesk server. The build process creates a static site in the `dist/` directory that can be uploaded to your Plesk hosting environment.

### Plesk Deployment Process:
1. Run `npm run build` to generate the static site
2. Upload the contents of the `dist/` directory to your Plesk server
3. Configure your domain to point to the uploaded files

The `dist/` directory contains the complete static site ready for deployment to Plesk.

## Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Fast Performance**: Static site generation with Eleventy
- **SEO Optimized**: Meta tags and structured data
- **Accessibility**: WCAG compliant components
- **Modern UI**: Clean, professional design
- **Interactive Elements**: Alpine.js powered components

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary to L3 Networks Inc.

## Contact

For questions about this website or L3 Networks services, please visit [our website](https://l3networks.com) or contact us directly.
