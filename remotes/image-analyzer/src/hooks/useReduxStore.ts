// Hook to safely use Redux store that works in both host and standalone modes
import { 
  useDispatch as useReduxDispatch, 
  useSelector as useReduxSelector
} from "react-redux";

/**
 * Custom hooks that work in both host and standalone modes
 * 
 * IMPORTANT: React hooks cannot be wrapped in try-catch!
 * These hooks directly use react-redux hooks, which will work because:
 * - When loaded by host: Components are rendered inside host's <Provider>, so hooks work
 * - When standalone: dev.tsx wraps App with <Provider> using standaloneStore, so hooks work
 */

/**
 * Hook to get dispatch function
 * When loaded by host: Uses host's Redux store dispatch
 * When running standalone: Uses standalone store dispatch (via Provider in dev.tsx)
 */
export const useDispatch = () => {
  // Directly use react-redux's useDispatch
  return useReduxDispatch();
};

/**
 * Hook to select from Redux state
 * When loaded by host: Selects from host's Redux store
 * When running standalone: Selects from standalone store (via Provider in dev.tsx)
 */
export const useSelector = <TSelected>(
  selector: (state: any) => TSelected
): TSelected => {
  // Directly use react-redux's useSelector
  return useReduxSelector(selector);
};
