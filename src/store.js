import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import designationReducer from "../src/features/Slices/DesignationSlice";
import statusReducer from "../src/features/Slices/StatusSlice";
import organisationReducer from "../src/features/Slices/OrganisationSlice";
import currencyReducer from "../src/features/Slices/CurrencySlice";
import departmentReducer from "../src/features/Slices/DepartmentSlice";
import scopesReducer from "../src/features/Slices/ScopeSlice";
import sectoralReducer from "../src/features/Slices/SectoralScopeSlice";
import countryReducer from "../src/features/Slices/CountrySlice";
import regionReducer from "../src/features/Slices/RegionSlice";
import LeadReducer from "../src/features/Slices/LeadsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    designation: designationReducer,
    department: departmentReducer,
    status: statusReducer,
    organisation: organisationReducer,
    currency: currencyReducer,
    scope: scopesReducer,
    sectoralScope: sectoralReducer,
    country: countryReducer,
    region: regionReducer,
    leads: LeadReducer,
  },
});
