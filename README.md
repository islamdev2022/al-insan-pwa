# Next.js PWA Template (Next.js 15, TailwindCSS v4.0, Serwist)

This is a minimal template for creating a Progressive Web App (PWA) using Next.js. The template includes only the essential configurations to make PWA work. Feel free to clone this repository and use it for your personal projects.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdamnitjoshua%2Fnextjs-pwa)

## Features

- **Next.js 15**: The latest version of NextJS for building modern web applications.
- **TailwindCSS v4.0**: Utility-first CSS framework for rapid UI development.
- **Serwist**: A Swiss Army knife for service workers.

## Getting Started

### Prerequisites

Make sure you have Node.js and npm (or yarn) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/nextjs-pwa-template.git
   ```

2. Navigate to the project directory:
   ```bash
   cd nextjs-pwa-template
   ```

3. Install the dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Development

To start the development server, run:
```bash
next dev --experimental-https
```

Open [https://localhost:3000](http://localhost:3000) in your browser to see the result.

### Building for Production

To build the project for production, run:
```bash
npm run build
# or
yarn build
```

To start the production server, run:
```bash
npm start
# or
yarn start
```

## PWA Features

This template includes the necessary configurations to enable PWA features such as:

- Service Worker for offline support
- Web App Manifest for adding to home screen
- Basic caching strategies

## Contributing

If you encounter any issues or have suggestions for improvement, please report them in the [issues tab](https://github.com/damnitjoshua/nextjs-pwa/issues). Your support is appreciated!

## License

This project is licensed under the MIT License.

## Acknowledgments

- Thanks to the Next.js, Serwist and TailwindCSS communities for their awesome tools and documentation.