/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as adminBootstrap from "../adminBootstrap.js";
import type * as adminTasks from "../adminTasks.js";
import type * as adminUploads from "../adminUploads.js";
import type * as adminValidators from "../adminValidators.js";
import type * as exams from "../exams.js";
import type * as examsCatalog from "../examsCatalog.js";
import type * as http from "../http.js";
import type * as suggestedExams from "../suggestedExams.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  adminBootstrap: typeof adminBootstrap;
  adminTasks: typeof adminTasks;
  adminUploads: typeof adminUploads;
  adminValidators: typeof adminValidators;
  exams: typeof exams;
  examsCatalog: typeof examsCatalog;
  http: typeof http;
  suggestedExams: typeof suggestedExams;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
