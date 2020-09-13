import React, { lazy, Fragment } from "react";
import { formatDistance,format } from "date-fns";
import { Send } from "react-feather";
import { UPDATES_COUNT } from "../constants";
import {capitalize} from '../utils/commonFunctions'
const newDate = new Date();
let currentDate = newDate;

const Updates = function ({ updates }) {
  return (
    <div className="updates">
      <div className="updates-header">
        <h2>{format(currentDate, "d MMM")}</h2>
      </div>
      {updates
        .slice(-UPDATES_COUNT)
        .reverse()
        .map(function (activity, index) {
          activity.update = activity.update.replace(/\n/g, "<br />");
          const activityDate = new Date(activity.timestamp * 1000);
          return (
            <React.Fragment key={index}>
              <div className="update">
                <h5>
                  {capitalize(
                    formatDistance(
                      new Date(activity.timestamp * 1000),
                      new Date()
                    )
                  ) + " ago"}
                </h5>
                <h4
                  dangerouslySetInnerHTML={{
                    __html: activity.update,
                  }}
                ></h4>
              </div>
            </React.Fragment>
          );
        })}
      <div className="updates-footer">
        <a
          href="https://t.me/covid19indiaorg_updates"
          target="_blank"
          className="telegram"
          rel="noopener noreferrer"
        >
          <h4>
            <Send />
            Join Instant Updates channel
          </h4>
        </a>
      </div>
    </div>
  );
};

export default Updates;
