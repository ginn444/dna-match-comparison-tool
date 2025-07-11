# DNA Match Comparison Tool

A modern web app for comparing and analyzing DNA match data. Upload your DNA match CSV, select matches, and view an interactive comparison matrix. Export your results as a single-page PDF for easy sharing and review.

## Features

- **CSV Upload**: Import DNA match data from CSV files
- **Match Selection**: Choose which matches to compare
- **Metric Selection**: Analyze by relationship, total shared cM, or longest segment
- **Interactive Matrix**: Visualize pairwise relationships and shared DNA
- **PDF Export**: Download the matrix as a one-page PDF
- **Responsive UI**: Works on desktop and mobile

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### Installation
```bash
# Clone the repository
git clone https://github.com/ginn444/dna-match-comparison-tool.git
cd dna-match-comparison-tool

# Install dependencies
npm install
```

### Running Locally
```bash
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

### Building for Production
```bash
npm run build
```
The production-ready files will be in the `dist` folder.

### Preview Production Build
```bash
npm run preview
```

## Deployment
You can deploy the contents of the `dist` folder to any static hosting service, such as:
- [Netlify](https://netlify.com)
- [Vercel](https://vercel.com)
- [GitHub Pages](https://pages.github.com)

## CSV Format
Your CSV file should include the following headers:
- `Match Name`
- `Chromosome`
- `Start Location`
- `End Location`
- `Centimorgans`
- `Matching SNPs`

## License
MIT License

---

**Created by [ginn444](https://github.com/ginn444)** 