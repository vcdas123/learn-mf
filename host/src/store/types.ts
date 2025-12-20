/**
 * Redux Store Types
 * 
 * Export types so remotes can use them with useSelector
 */

export type RootState = {
  // Add your state slices here
  // Example:
  // counter: { value: number };
};

export type AppDispatch = typeof import("./index").store.dispatch;

