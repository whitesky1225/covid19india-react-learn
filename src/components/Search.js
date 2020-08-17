import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { useTranslation } from "react-i18next";
import * as Icon from "react-feather";
import {
  STATE_CODES_ARRAY,
  STATE_CODES,
  UNASSIGNED_STATE_CODE,
  UNKNOWN_DISTRICT_KEY,
} from "../constants";
import { useDebounce, useUpdateEffect } from "react-use";
import produce from 'immer'
const suggestions = [
  "Madurai",
  "Karnataka",
  "Ladakh",
  "Mumbai",
  "Andhra Pradesh",
  "Alappuzha",
];
const districtSuggestions = [
  "Madurai",
  "Ganjam",
  "Alappuzha",
  "Mumbai",
  "Chennai",
];
const stateSuggestions = [
  "Andhra Pradesh",
  "Karnataka",
  "Gujarat",
  "West Bengal",
  "Ladakh",
];
function Search() {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");
  const [expand, setExpand] = useState(false);
  const [engine, setEngine] = useState(null);
  const [districtEngine, setDistrictEngine] = useState(null);
  const [results, setResults] = useState([]);
  const searchInput = useRef(null);
  const trail = useMemo(() => {
    const styles = [];

    [0, 0, 0].map((element, index) => {
      styles.push({
        animationDelay: `${index * 250}ms`,
      });
      return null;
    });
    return styles;
  }, []);
  function setNativeValue(element, value) {
    const valueSetter = Object.getOwnPropertyDescriptor(element, "value").set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(
      prototype,
      "value"
    ).set;

    if (valueSetter && valueSetter !== prototypeValueSetter) {
      prototypeValueSetter.call(element, value);
    } else {
      valueSetter.call(element, value);
    }
  }
  const handleChange = useCallback((event) => {
    setSearchValue(event.target.value);
  }, []);
  const handleClose = useCallback(() => {
    setSearchValue("");
    setResults([]);
  }, []);
  const clearPlaceholder = useCallback((target, callback) => {
    const placeholder = target.textContent;
    target.classList.add("disappear");
    if (placeholder.length > 0) {
      setTimeout(function () {
        target.textContent = "";
        clearPlaceholder(target, callback);
      }, 1000);
      return true;
    }
    callback();
  }, []);

  const fillPlaceholder = useCallback(
    (target, index, cursorPosition, callback) => {
      if (expand) {
        target.textContent = "";
        return true;
      }
      const text = t(suggestions[index]);
      const placeholder = target.textContent;
      target.classList.remove("disappear");
      target.textContent = placeholder + text[cursorPosition];
      if (cursorPosition < text.length - 1) {
        setTimeout(function () {
          fillPlaceholder(target, index, cursorPosition + 1, callback);
        }, 200);
        return true;
      }
      callback();
    },
    [expand, t]
  );
  const loopThroughSuggestions = useCallback(
    (target, index) => {
      if (expand) {
        target.textContent = "";
        return true;
      }
      fillPlaceholder(target, index, 0, function () {
        setTimeout(() => {
          clearPlaceholder(target, function () {
            loopThroughSuggestions(target, (index + 1) % suggestions.length);
          });
        }, 2000);
      });
    },
    [clearPlaceholder, expand, fillPlaceholder]
  );
  const handleSearch = useCallback(
    (searchInput) => {
      if (!engine) return null;
      const results = [];

      const sync = (datums) => {
        datums.map((result, index) => {
          const stateObj = {
            name: result.name,
            type: "state",
            route: result.code,
          };
          results.push(stateObj);
          return null;
        });
      };

      const districtSync = (datums) => {
        datums.slice(0, 3).map((result, index) => {
          const districtObj = {
            name: result.district,
            type: "district",
            route: STATE_CODES[result.state],
          };
          results.push(districtObj);
          return null;
        });

        setResults([...results]);
      };

      engine.search(searchInput, sync);
      districtEngine.search(searchInput, districtSync);
    },
    [districtEngine, engine]
  );

  useEffect(() => {
    if (!expand) {
      const targetInput = document.getElementsByClassName(
        "search-placeholder"
      )[0];
      if (targetInput) {
        loopThroughSuggestions(targetInput, 0);
      }
    }
  }, [expand, loopThroughSuggestions]);

  useUpdateEffect(() => {
    import("corejs-typeahead").then((Bloodhound) => {
      setEngine(
        // eslint-disable-next-line
        new Bloodhound.default({
          initialize: true,
          local: STATE_CODES_ARRAY.filter(
            ({ code }) => code !== UNASSIGNED_STATE_CODE
          ),
          queryTokenizer: Bloodhound.default.tokenizers.whitespace,
          datumTokenizer: Bloodhound.default.tokenizers.obj.whitespace("name"),
        })
      );

      setDistrictEngine(
        // eslint-disable-next-line
        new Bloodhound.default({
          initialize: true,
          limit: 5,
          queryTokenizer: Bloodhound.default.tokenizers.whitespace,
          datumTokenizer: Bloodhound.default.tokenizers.obj.whitespace(
            "district"
          ),
          indexRemote: true,
          remote: {
            url: "https://api.covid19india.org/state_district_wise.json",
            transform: function (response) {
              const districts = [];
              Object.keys(response)
                .filter((stateName) => stateName !== "State Unassigned")
                .map((stateName) => {
                  const districtData = response[stateName].districtData;
                  Object.keys(districtData)
                    .filter(
                      (districtName) => districtName !== UNKNOWN_DISTRICT_KEY
                    )
                    .map((districtName) => {
                      return districts.push({
                        district: districtName,
                        state: stateName,
                      });
                    });
                  return null;
                });
              return districts;
            },
          },
        })
      );
    });
  }, [expand]);
  useDebounce(
    () => {
      if (searchValue) {
        handleSearch(searchValue);
      } else {
        setResults(
          produce(results, (draftResults) => {
            draftResults.splice(0);
          })
        );
      }
    },
    100,
    [searchValue]
  );
  return (
    <div className="Search">
      <label className="fadeInUp" style={trail[0]}>
        {t("Search your district or state")}
      </label>
      <div className="line fadeInUp" style={trail[1]}></div>
      <div className="search-input-wrapper fadeInUp" style={trail[2]}>
        <input
          type="text"
          value={searchValue}
          ref={searchInput}
          onFocus={setExpand.bind(this, true)}
          onBlur={setExpand.bind(this, false)}
          onChange={handleChange}
        ></input>
        {!expand && searchValue === "" && (
          <span className="search-placeholder"></span>
        )}
        <div className="search-button">
          <Icon.Search />
        </div>
        {searchValue.length > 0 && (
          <div className="close-button" onClick={handleClose}>
            <Icon.X />
          </div>
        )}
      </div>
      {expand && (
        <React.Fragment>
          <div className="expanded">
            <div className="expanded-left">
              <h3>{t("District")}</h3>
              <div className="suggestions">
                {districtSuggestions.map((suggestion, index) => (
                  <div className="suggestion" key={index}>
                    <div>-</div>
                    <h4
                      onMouseDown={(event) => {
                        event.preventDefault();
                        setNativeValue(searchInput.current, suggestion);
                        searchInput.current.dispatchEvent(
                          new Event("input", { bubbles: true })
                        );
                      }}
                    >
                      {t(suggestion)}
                    </h4>
                  </div>
                ))}
              </div>
            </div>

            <div className="expanded-right">
              <h3>{t("State/UT")}</h3>
              <div className="suggestions">
                {stateSuggestions.map((suggestion, index) => (
                  <div className="suggestion" key={index}>
                    <div>-</div>
                    <h4
                      onMouseDown={(event) => {
                        event.preventDefault();
                        setNativeValue(searchInput.current, suggestion);
                        searchInput.current.dispatchEvent(
                          new Event("input", { bubbles: true })
                        );
                      }}
                    >
                      {t(suggestion)}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default Search;
