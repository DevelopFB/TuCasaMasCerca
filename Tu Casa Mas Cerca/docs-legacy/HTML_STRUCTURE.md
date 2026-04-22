# tcmc-webapp.html - Technical Structure

## File Overview
- **Location**: `/sessions/upbeat-bold-bardeen/mnt/TCMC/APP/tcmc-webapp.html`
- **Size**: 91 KB
- **Lines**: 2,185
- **Format**: Standalone HTML with embedded React/Babel

## HTML Structure

### 1. Document Head
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tu Casa - Simulador de Crédito</title>
    
    <!-- Google Fonts: Inter and Poppins -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Tailwind CSS from CDN (Play CDN) -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- React 18 & ReactDOM 18 from unpkg -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    
    <!-- Babel Standalone for JSX transformation -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    
    <!-- Lucide icons library -->
    <script src="https://unpkg.com/lucide@latest"></script>
    
    <style>
        * { font-family: 'Inter', sans-serif; }
        .font-poppins { font-family: 'Poppins', sans-serif; }
    </style>
</head>
```

### 2. Body & Root Element
```html
<body>
    <div id="root"></div>
    
    <script type="text/babel">
        // All React code goes here
    </script>
</body>
```

### 3. React Initialization
```javascript
// Destructure React hooks
const { useState, useMemo, useEffect } = React;

// Create icon factory
const createIconComponent = (svgPath) => {
    return (props) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={props.size || 24}
            height={props.size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={props.strokeWidth || 2}
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
            dangerouslySetInnerHTML={{ __html: svgPath }}
        />
    );
};

// Define all 27 icon components
const ChevronDown = createIconComponent('<polyline points="6 9 12 15 18 9"></polyline>');
const Menu = createIconComponent('<line x1="3" y1="6" x2="21" y2="6">...</line>');
// ... (25 more icons)
```

### 4. Core Components

#### Logo Component
```javascript
const Logo = ({ className = '', size = 32 }) => (
  <svg viewBox="0 0 120 40" className={className} style={{ width: size, height: 'auto' }} fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="32" fontSize="28" fontFamily="Poppins" fontWeight="600" fill="#0052CC">
      Tu Casa
    </text>
    <circle cx="115" cy="12" r="8" fill="#FF6B35" />
    <path d="M105 8 L115 8 L115 18 L105 18 Z" fill="none" stroke="#0052CC" strokeWidth="1.5" />
  </svg>
);
```

#### Financial Calculations
```javascript
const CONFIG_DEFAULTS = {
  tasasBase: { 12: 0.105, 24: 0.115, 36: 0.125, 48: 0.135, 60: 0.145 },
  maxLTV: 0.35,
  maxLoan: 50000,
};

const calcularBruto = (loan) => {
  const upfront = loan * 0.05;
  const iva = upfront * 0.21;
  return loan + upfront + iva;
};

const calcularCuota = (tasaAnual, meses, montoBruto) => {
  const tm = tasaAnual / 12;
  if (tm === 0) return montoBruto / meses;
  return (montoBruto * (tm * Math.pow(1 + tm, meses))) / (Math.pow(1 + tm, meses) - 1);
};

const calcularTIR = (cuota, meses, prestamo) => {
  const td = (cuota * meses) / prestamo - 1;
  return Math.pow(1 + td, 12 / meses) - 1;
};
```

#### Dashboard Components
```javascript
const ClienteDashboard = ({ view, onViewChange, config, loans, onUpdateConfig }) => {
  // Client-facing dashboard with simulators and loan management
};

const BrokerDashboard = ({ view, onViewChange, loans }) => {
  // Broker interface for managing loans and clients
};

const BackofficeDashboard = ({ view, onViewChange, loans, config, onUpdateConfig }) => {
  // Admin interface for system configuration and monitoring
};
```

#### Main App Component
```javascript
function App() {
  const [role, setRole] = useState(null);
  const [view, setView] = useState('home');
  const [config, setConfig] = useState(CONFIG_DEFAULTS);
  const [loans, setLoans] = useState(MOCK_LOANS);

  const handleUpdateConfig = (newConfig) => {
    setConfig(newConfig);
  };

  if (!role) {
    // Login/role selection interface
  }

  // Render appropriate dashboard based on role
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Navigation sidebar */}
      {/* Content area with appropriate dashboard */}
    </div>
  );
}
```

### 5. React Rendering
```javascript
// At the end of script block
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```

## Key Features

### 1. No Build Step Required
- Babel runs JSX transformation in the browser
- All code is inline within HTML file
- Open directly in browser: `file:///path/to/tcmc-webapp.html`

### 2. CDN-Based Dependencies
- All libraries auto-load from CDN
- Works offline after initial CDN cache
- Development builds for React (smaller than production)

### 3. Complete Functionality
- Client simulation interface
- Broker loan management
- Admin configuration controls
- Financial calculations
- Loan tracking and status management

### 4. Responsive Design
- Tailwind CSS for styling
- Mobile-friendly layout
- Dark mode support (via Tailwind)
- Inter font for body, Poppins for headings

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Notes
- First load may take 2-3 seconds (CDN loading)
- Subsequent loads are faster (cached scripts)
- Babel transpilation happens in browser (negligible impact)
- File uses development React builds (not minified, for debugging)

## Customization
To customize:
1. Edit SVG paths in icon definitions
2. Modify CSS via Tailwind classes
3. Change colors in style block
4. Adjust component logic directly

## Deployment
1. Copy `tcmc-webapp.html` to web server
2. No build or compilation needed
3. Serve via HTTP/HTTPS (recommended for security)
4. Or open locally in browser (limited functionality)
