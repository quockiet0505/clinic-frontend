# Mobile App Changelog

## [Unreleased]
### UI & UX Improvements
- **Profile Redesign**: Refactored `ProfileScreen` to show a compact "Thông tin cá nhân" section (Address, Phone, Gender), removing redundant edit options from the account list. Separated "Hồ sơ sức khoẻ" and restricted it to only show Allergies. Replaced traditional dropdowns with modern Bottom Sheets for editing profiles (`EditMedicalProfileScreen`).
- **Service Listings**: Renamed test services to "Dịch vụ nổi bật" on Home screen. Added comprehensive price formatting with strikethrough for discounts in `AllServicesScreen`. Implemented Service Type Tabs and a price sorting feature.
- **Appointments & Records**: Added border styling for unselected tabs and integrated a date filter icon in the search bar. Enhanced review UI by toggling "Đánh giá dịch vụ" to "Xem đánh giá" automatically after submission. Updated star rating colors to amber.
