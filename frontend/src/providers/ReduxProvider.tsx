"use client";

import { Provider } from "react-redux";
import { store } from "../store";
import { PropsWithChildren, useEffect } from "react";
import { authApi } from "../store/services/authApi";
import { tokenUtils } from "../utils/tokenUtils";

export default function ReduxProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    if (!tokenUtils.getToken()) return;
    store.dispatch(authApi.endpoints.getCurrentUser.initiate());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
