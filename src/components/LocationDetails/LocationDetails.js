import React, { useState, useEffect } from 'react';
import NProgress from 'nprogress';
import { request } from '@esri/arcgis-rest-request';
import AttributeList from './AttributeList';

function LocationDetails({ center }) {
  const { x, y } = center;

  const [attributes, setAttributes] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      NProgress.start();
      try {
        const params = {
          geometry: { x, y },
          geometryType: 'esriGeometryPoint',
          layers: 'visible',
          sr: 4326,
          tolerance: 0,
          mapExtent: '-75,+37,+-79,+39',
          imageDisplay: '600,550,96',
          returnGeometry: false,
          f: 'json',
        };
        const res = await request(
          `https://arcgisportal.baltimorepolice.org/gis/rest/services/Applications/LocationDescription/MapServer/identify`,
          { params },
        );
        setAttributes(res.results);
      } catch (error) {
        console.log(error);
      }
      NProgress.done();
    };
    fetchData();
  }, [x, y]);
  return <AttributeList attr={attributes} />;
}

export default LocationDetails;
