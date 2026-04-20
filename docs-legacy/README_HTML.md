# Tu Casa - Standalone HTML Version

## File: tcmc-webapp.html

A fully self-contained HTML file that runs the Tu Casa credit simulator application in any modern browser without requiring a build step.

### Features

- **No Build Required**: Open the HTML file directly in any modern browser
- **CDN Dependencies**: All libraries loaded from CDN:
  - React 18 (unpkg)
  - ReactDOM 18 (unpkg)
  - Babel Standalone (unpkg) - for JSX transformation
  - Tailwind CSS (cdn.tailwindcss.com) - Play CDN
  - Google Fonts (Inter, Poppins)
  - Lucide Icons (unpkg)

### What's Included

The HTML file contains the exact same React application as the original JSX with:

1. **SIMULATOR LOGIC**
   - CONFIG_DEFAULTS with interest rate tables
   - calcularBruto() - Loan amount calculations
   - calcularCuota() - Monthly payment calculations
   - calcularTIR() - IRR calculations

2. **COMPONENTS**
   - Logo component
   - ClienteDashboard
   - BrokerDashboard
   - BackofficeDashboard
   - Multiple UI components for simulation, management, and analytics

3. **MOCK DATA**
   - MOCK_LOANS - Sample loan data
   - MOCK_USERS - Sample user data
   - MOCK_DOCUMENTS - Sample document data
   - MOCK_STATS - Sample statistics data

4. **ICON COMPONENTS**
   - All 27 Lucide icons are defined as React components:
     - ChevronDown, Menu, X, LogOut, Settings
     - Users, FileText, BarChart3, Home, DollarSign
     - Clock, CheckCircle, AlertCircle, Phone, Search
     - Plus, Upload, Eye, EyeOff, Mail, MapPin
     - Smartphone, Lock, User, ArrowRight, TrendingUp, Zap

### Usage

1. Open `tcmc-webapp.html` in any modern browser (Chrome, Firefox, Safari, Edge)
2. The app will load all dependencies from CDN
3. No local server required (though a local server is recommended for best results)

### Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### File Size

- ~90.6 KB (uncompressed)
- ~2,185 lines of code
- Includes all components and logic from the original JSX

### Notes

- All icon components are created using SVG paths for maximum compatibility
- Font families are loaded from Google Fonts CDN
- Tailwind CSS is dynamically loaded and can be customized via the play CDN
- React hooks (useState, useMemo, useEffect) are destructured from the global React object
