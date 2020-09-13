import React, { useState, Suspense, useCallback, lazy, useEffect } from "react";
import { fetcher } from "../utils/commonFunctions";
import useSWR from "swr";
import { useLocalStorage } from "react-use";
import ActionPanel from "./ActionsPanel";

const Updates = lazy(() => import("./Updates"));

function Actions({setDate,dates}) {
  const [showUpdates, setShowUpdates] = useState(false);
  const [newUpdate, setNewUpdate] = useLocalStorage("newUpdate", false);
  const [lastViewedLog, setLastViewedLog] = useLocalStorage("lastViewedLog", 0);
  const [isTimelineMode, setIsTimelineMode] = useState(false);

  const { data: updates } = useSWR(
    "https://api.covid19india.org/updatelog/log.json",
    fetcher,
    {
      revalidateOnFocus: true,
    }
  );

  useEffect(() => {
    console.log("dffgssd", updates);
    if (updates !== undefined) {
      const lastTimestamp = updates.slice().reverse()[0].timestamp * 1000;
      console.log("////", lastTimestamp, lastViewedLog);
      if (lastTimestamp !== lastViewedLog) {
        setNewUpdate(true);
        setLastViewedLog(lastTimestamp);
      }
    }
  }, [lastViewedLog, updates, setLastViewedLog, setNewUpdate]);
  return (
    <React.Fragment>
      <ActionPanel
        {...{
          lastViewedLog,
          showUpdates,
          setShowUpdates,
          isTimelineMode,
          setIsTimelineMode,
          setNewUpdate,
          newUpdate,
          setDate,
          dates
        }}
      ></ActionPanel>
      {showUpdates && (
        <Suspense fallback={<div />}>
          <Updates {...{ updates }}></Updates>
        </Suspense>
      )}
    </React.Fragment>
  );
}

export default Actions;
