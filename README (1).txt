CVCraft – CV Maker App

CVCraft is a modern, responsive CV builder web app built with React, Tailwind CSS, and Google Maps API. It allows users to sign up, create and manage multiple CVs, and export them in a clean layout.

-----------------------------
FEATURES
-----------------------------
- User Authentication (Sign In / Sign Up)
- Form-based CV creation with:
  - Google Maps Autocomplete for address
  - Multi-select languages
  - Dynamic work experience list
- Form validation
- Local storage data persistence
- CV listing, editing, viewing, and exporting
- Responsive UI with Tailwind CSS

-----------------------------
PROJECT SETUP
-----------------------------
Prerequisites:
- Node.js v16+
- Google Maps API Key (with Places API enabled)

1. Clone the repository
   git clone https://github.com/yourusername/cv-craft.git
   cd cv-craft

2. Install dependencies
   npm install

3. Configure environment variables
   Create a `.env.local` file in the root directory with the following:
   VITE_GOOGLE_MAPS_API_KEY=********methanata key eka danna******

4. Start the development server
   npm run dev
   App will run at: http://localhost:5173

-----------------------------
HOW TO CREATE A CV
-----------------------------
1. Sign Up or Sign In
2. Go to Dashboard > Create New CV
3. Fill in:
   - Personal Info: Name, Age, Phone, Address
   - Date of Birth
   - Nationality, Employment Status, Preferred Languages
   - Work Experiences
   - Profile Picture (optional)
   - Accept Terms and Conditions
4. Click "Create CV"
5. Go to "My CVs" to View, Edit or Export your CV

