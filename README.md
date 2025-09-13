# Country Neighbors Game 🌍

A fun geography guessing game where you identify countries by their neighboring countries and flags.

## How to Play

1. Look at the flags and names of neighboring countries
2. Type the name of the country that has these neighbors
3. Get instant feedback with the correct answer and flag
4. Track your score as you play!

## Features

- **Interactive Geography Learning**: Learn about country borders in a fun way
- **Flag Recognition**: See flags of neighboring countries to help with identification
- **Smart Answer Matching**: Flexible input handling for country name variations
- **Modern UI**: Clean, responsive design with Shadcn UI components
- **Score Tracking**: Keep track of your correct answers

## Tech Stack

- **React 18** - Frontend framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Modern UI component library
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd neighbours
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Data Sources & Attributions

### Country Flags
Flags are sourced from the excellent collection by **hampusborgos**:
- **Repository**: [country-flags](https://github.com/hampusborgos/country-flags/tree/main)
- **License**: Public Domain
- **Format**: SVG flags for all countries

### Country Borders Data
Border information is sourced from **GeoDataSource**:
- **Repository**: [country-borders](https://github.com/geodatasource/country-borders/tree/master)
- **License**: Open Data
- **Format**: CSV data containing country border relationships

## Project Structure

```
neighbours/
├── src/
│   ├── components/ui/     # Shadcn UI components
│   ├── lib/              # Utility functions
│   ├── App.jsx           # Main game component
│   ├── main.jsx          # React entry point
│   └── index.css         # Global styles and theme
├── flags/                # Country flag SVG files
├── countries_with_borders.json  # Processed country data
├── convert_csv_to_json.js       # Data conversion script
└── public/               # Static assets
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- **Flag Images**: [hampusborgos/country-flags](https://github.com/hampusborgos/country-flags/tree/main)
- **Border Data**: [geodatasource/country-borders](https://github.com/geodatasource/country-borders/tree/master)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)