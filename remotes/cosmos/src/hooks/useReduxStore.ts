import { useDispatch as useReduxDispatch, useSelector as useReduxSelector } from "react-redux";

export const useDispatch = () => useReduxDispatch();
export const useSelector = <TSelected>(selector: (state: any) => TSelected): TSelected =>
  useReduxSelector(selector);
