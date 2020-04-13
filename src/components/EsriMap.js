import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'semantic-ui-react';
import { loadMap, addPoint } from '../utils/map';

const styles = {
  mapDiv: {
    height: '500px',
    width: '100',
    position: 'relative',
    outline: 'none',
  },
};
function EsriMap({ center, updateXY }) {
  const viewdivRef = useRef();
  const [view, setView] = useState(null);
  useEffect(() => {
    loadMap(viewdivRef.current, updateXY).then((view) => {
      setView(view);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (view && center) {
      addPoint(view, center);
    }
  }, [view, center]);
  return (
    <Card fluid>
      <div style={styles.mapDiv} ref={viewdivRef} />
    </Card>
  );
}

export default EsriMap;
