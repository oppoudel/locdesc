import { suggest } from "@esri/arcgis-rest-geocoder";
import debounce from "lodash.debounce";
import { useEffect, useReducer } from "react";

const initialState = {
  data: undefined,
  loading: true,
  error: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return {
        data: action.payload,
        loading: false,
        error: "",
      };

    case "FETCH_ERROR":
      return {
        data: undefined,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

function Geocode({ address, children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchData = debounce(async () => {
      try {
        const res = await suggest(address, {
          endpoint:
            "https://arcgisportal.baltimorepolice.org/gis/rest/services/BPD_Cloud_Locator/GeocodeServer",
          params: {
            maxSuggestions: 5,
            outSR: 4326,
            location: {
              x: -8521378.876202783,
              y: 4762668.342192003,
              spatialReference: { wkid: 102100, latestWkid: 3857 },
            },
          },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: res.suggestions });
      } catch (e) {
        dispatch({ type: "FETCH_ERROR", payload: e.message });
        console.error(e);
      }
    });
    fetchData();
  }, [address]);

  const { data, loading, error } = state;

  return children({
    data,
    loading,
    error,
  });
}

export default Geocode;
