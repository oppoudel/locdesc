import React, { useState, useEffect } from 'react';
import AttributeList from './AttributeList';

function LocationDetails({ center }) {
  const { x, y } = center;
  const [attributes, setAttributes] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://arcgisportal.baltimorepolice.org/gis/rest/services/Applications/LocationDescription/MapServer/identify?geometry=x%3A+${x}%2C+y%3A+${y}&geometryType=esriGeometryPoint&sr=4326&layers=visible&tolerance=0&mapExtent=-75%2C+37%2C+-79%2C+39&imageDisplay=600%2C550%2C96&returnGeometry=false&f=pjson`,
        );
        const attr = await res.json();
        setAttributes(attr.results);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [x, y]);
  return <AttributeList attr={attributes} />;
}

export default LocationDetails;
