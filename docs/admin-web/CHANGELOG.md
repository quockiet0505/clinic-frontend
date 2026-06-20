# Admin Web Changelog

## [Unreleased]
### UI & UX Improvements
- **Table Formatting**: Standardized all tables across the application to have left-aligned table headers for better readability.
- **Action Buttons**: Updated the hover styling for generic ActionButtons (Edit, Delete, View, etc.) to use solid background colors (`hover:bg-blue-500 hover:text-white`), resolving conflicts with `shadcn` default outline button styles.
- **Toast Notifications**: Integrated `react-hot-toast` across all modules (Staff, Leave Requests, Pharmacy, Service Catalog, Patient List, etc.) to provide immediate feedback on Create/Update/Delete operations and error handling.
