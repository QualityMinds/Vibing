# Vibing

A modern ticket management application built with Angular 21, featuring drag-and-drop functionality and persistent storage using IndexedDB.

## Features

- 🎯 **Drag & Drop Ticket Management**: Organize tickets across three lists (To Do, In Progress, Done)
- 💾 **Persistent Storage**: All data is saved locally using IndexedDB via Dexie.js
- 🚀 **Modern Angular**: Built with Angular 21 using standalone components and signals
- 📱 **Responsive Design**: Clean, modern UI that works on all devices
- ⚡ **Real-time Updates**: State automatically syncs with IndexedDB
- 🔄 **Auto-deployment**: Automatically deploys to GitHub Pages on every commit to main

## Live Demo

Visit the live application at: `https://qualityminds.github.io/Vibing/`

## Getting Started

### Prerequisites

- Node.js 20.x or later
- npm 10.x or later

### Installation

1. Clone the repository:
```bash
git clone https://github.com/QualityMinds/Vibing.git
cd Vibing
```

2. Install dependencies:
```bash
npm install
```

### Development server

To start a local development server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Usage

### Creating a Ticket
1. Click the "+ Add Ticket" button in any list
2. Enter a title (required) and description (optional)
3. Click "Save" or press Enter

### Moving Tickets
- Drag tickets between lists to change their status
- Drag within a list to reorder tickets

### Deleting Tickets
- Click the "×" button on any ticket to delete it

All changes are automatically saved to IndexedDB and persist across browser sessions.

## Building

To build the project for production:

```bash
npm run build
```

This will compile your project and store the build artifacts in the `dist/` directory.

For GitHub Pages deployment with proper base href:

```bash
npm run build -- --base-href=/Vibing/
```

## Technology Stack

- **Angular 21**: Modern web framework with standalone components
- **Angular CDK**: For drag-and-drop functionality
- **Dexie.js**: IndexedDB wrapper for persistent storage
- **TypeScript**: Type-safe development
- **GitHub Actions**: Automated CI/CD pipeline

## Deployment

The application automatically deploys to GitHub Pages when changes are pushed to the `main` branch. The deployment workflow:

1. Builds the Angular application
2. Uploads artifacts to GitHub Pages
3. Deploys to the live site

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── ticket-board/      # Main ticket board component
│   ├── models/
│   │   └── ticket.model.ts    # Ticket data models
│   ├── services/
│   │   └── database.service.ts # Dexie.js database service
│   └── app.ts                  # Root component
└── styles.css                  # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
