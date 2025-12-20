import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Snackbar, Alert, AlertColor } from "@mui/material";
import type { RootState } from "../store";
import { removeNotification } from "../store/slices/appSlice";

const NotificationSystem: React.FC = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state: RootState) => state.app.notifications
  );

  const handleClose = (id: string) => {
    dispatch(removeNotification(id));
  };

  const latestNotification = notifications[notifications.length - 1];

  return (
    <>
      {latestNotification && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={() => handleClose(latestNotification.id)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => handleClose(latestNotification.id)}
            severity={latestNotification.type as AlertColor}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {latestNotification.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default NotificationSystem;

