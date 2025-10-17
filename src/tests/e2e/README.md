# E2E Test Documentation

## Overview

This directory contains comprehensive end-to-end tests for the WellClinic Health Analysis application. The tests cover the complete user journey from data input to health analysis results.

## Test Files

### 1. `example.test.ts` (Existing)
- Basic application startup test
- Verifies the app launches and displays the home page

### 2. `health-analysis-flow.test.ts`
**Complete User Journey Testing**
- Tests the full workflow from input to results
- Covers all input tabs (Basic, Measures, Biological Age, Diabetes)
- Verifies navigation between pages
- Tests result generation and display
- Includes print functionality testing

### 3. `navigation-ui.test.ts`
**UI and Navigation Testing**
- Tests navigation between all pages (Home, Input, Output)
- Theme switching functionality (Light/Dark mode)
- Language switching (i18n testing)
- Tab navigation within the input page
- UI component responsiveness

### 4. `health-calculations.test.ts`
**Health Metrics and Calculations**
- BMI calculation and categorization
- SCORE2 cardiovascular risk assessment
- Diabetes risk calculation
- Biological age comparison
- Input validation and error handling
- Edge case testing (boundary values)

### 5. `data-persistence.test.ts`
**State Management and Data Persistence**
- Data persistence across page navigation
- Theme and language preference persistence
- Calculated values maintenance
- Data clearing/reset functionality
- Invalid data handling

### 6. `results-printing.test.ts`
**Results Display and Printing**
- Complete results page testing
- Chart color accuracy (especially biological age colors)
- Logo display in print layout
- Risk level indicators and recommendations
- Print functionality testing
- Multi-language result display
- High-risk value warnings

## Test Data Scenarios

### Low Risk Profile
```typescript
const lowRiskPatient = {
  name: "John Healthy",
  age: 30,
  gender: "male",
  weight: 70,
  height: 175,
  waist: 80,
  systolic: 120,
  nonhdl: 3.5,
  biologicAge: 28,
  smoking: false,
  // No diabetes risk factors
};
```

### High Risk Profile
```typescript
const highRiskPatient = {
  name: "Jane HighRisk",
  age: 65,
  gender: "female",
  weight: 90,
  height: 160,
  waist: 110,
  systolic: 170,
  nonhdl: 6.5,
  biologicAge: 70,
  smoking: true,
  diabeticMother: true,
  hypertension: true,
  glucose: 6.5
};
```

## Required Test IDs

To make these tests work, you'll need to add `data-testid` attributes to your components:

### Navigation
- `data-testid="nav-home"` - Home page link
- `data-testid="nav-input"` - Input page link  
- `data-testid="nav-output"` - Output page link

### UI Controls
- `data-testid="theme-toggle"` - Theme switcher button
- `data-testid="lang-toggle"` - Language switcher button

### Input Fields (Basic Tab)
- `data-testid="name-input"` - Patient name field
- `data-testid="age-input"` - Age input field
- `data-testid="gender-male"` - Male radio button
- `data-testid="gender-female"` - Female radio button
- `data-testid="smoking-checkbox"` - Smoking checkbox
- `data-testid="comorbidity-checkbox"` - Comorbidity checkbox

### Input Fields (Measures Tab)
- `data-testid="weight-input"` - Weight input
- `data-testid="height-input"` - Height input
- `data-testid="waist-input"` - Waist circumference input
- `data-testid="systolic-input"` - Systolic BP input
- `data-testid="nonhdl-input"` - Non-HDL cholesterol input

### Tab Navigation
- `data-testid="tab-basic"` - Basic information tab
- `data-testid="tab-measures"` - Measures tab
- `data-testid="tab-biologicAge"` - Biological age tab
- `data-testid="tab-diabetes"` - Diabetes risk tab
- `data-testid="tab-additionalTexts"` - Additional texts tab

### Cards/Containers
- `data-testid="basic-input-card"` - Basic input form container
- `data-testid="measures-input-card"` - Measures input container
- `data-testid="biological-age-input-card"` - Biological age container
- `data-testid="diabetes-input-card"` - Diabetes assessment container
- `data-testid="text-input-card"` - Text input container

### Results Display
- `data-testid="overall-results"` - Main results container
- `data-testid="well-clinic-logo"` - Logo in results
- `data-testid="patient-name"` - Patient name display
- `data-testid="patient-age"` - Patient age display
- `data-testid="patient-gender"` - Patient gender display
- `data-testid="report-date"` - Report date

### Health Metrics Results
- `data-testid="bmi-result"` - BMI value
- `data-testid="bmi-category"` - BMI category
- `data-testid="bmi-section"` - BMI results section
- `data-testid="score2-result"` - SCORE2 result
- `data-testid="diabetes-result"` - Diabetes risk result

### Charts
- `data-testid="bmi-chart"` - BMI chart component
- `data-testid="biological-age-chart"` - Biological age chart
- `data-testid="biological-age-box"` - Biological age colored box
- `data-testid="chronological-age-display"` - Chronological age number
- `data-testid="biological-age-display"` - Biological age number
- `data-testid="score2-chart"` - SCORE2 chart
- `data-testid="diabetes-chart"` - Diabetes chart
- `data-testid="ggr-chart"` - GGR chart
- `data-testid="waist-chart"` - Waist measurement chart

### Print Functionality
- `data-testid="print-button"` - Print button

## Running the Tests

### Run all e2e tests:
```bash
npm run test:e2e
```

### Run specific test file:
```bash
npx playwright test health-analysis-flow.test.ts
```

### Run tests in headed mode (see browser):
```bash
npx playwright test --headed
```

### Generate test report:
```bash
npx playwright show-report
```

## CI/CD Integration

The tests are configured to run in CI with:
- 2 retries on failure
- Single worker (no parallel execution)
- HTML reporter with artifacts
- Automatic browser installation

## Test Strategy

1. **Smoke Tests**: Basic app functionality (example.test.ts)
2. **User Journey**: Complete workflow testing (health-analysis-flow.test.ts)
3. **Component Tests**: Individual UI components (navigation-ui.test.ts)
4. **Logic Tests**: Health calculations (health-calculations.test.ts)
5. **State Tests**: Data persistence (data-persistence.test.ts)
6. **Output Tests**: Results and printing (results-printing.test.ts)

## Notes

- Tests assume a built Electron app (`npm run make`)
- Mock implementations are used for print functionality
- Language switching tests depend on i18n configuration
- Color testing relies on CSS class naming conventions
- All tests use realistic health data within normal ranges