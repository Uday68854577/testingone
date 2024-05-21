import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { CompanyReducer } from "./reducer";
import {thunk} from "redux-thunk";
import logger from "redux-logger";

const rootReducer = combineReducers({
  company: CompanyReducer
});

const middleware = [thunk, logger];

const compstore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware)
});

export default compstore;
