import React, { useState, useEffect } from 'react';
import Geocoder from './components/Geocoder/Geocoder';
import EsriMap from './components/EsriMap';
import AttributeList from './components/LocationDetails/AttributeList';
import { Container, Message, Grid } from 'semantic-ui-react';
import { getConfig } from './utils/request';

function App() {
  const [mapCenter, setMapCenter] = useState(null);
  const [config, setConfig] = useState({ title: 'Location Description' });
  useEffect(() => {
    const fetchConfig = async () => {
      const config = await getConfig();
      document.title = config.title;
      setConfig(config);
    };
    fetchConfig();
  }, []);
  const onXYupdate = (location) => {
    if (location) {
      const { x, y } = location;
      setMapCenter({ x, y });
    } else {
      setMapCenter(null);
    }
  };

  return (
    <div>
      <header
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          backgroundColor: '#161e2e',
          color: '#fff',
          padding: '1rem',
          borderBottom: '1px solid #ccc',
        }}
      >
        <img src="/logo.png" alt="logo" width="40px" />
        <h1 style={{ paddingLeft: '2rem', margin: 0 }}>{config?.title}</h1>
      </header>
      <Container>
        <Grid stackable style={{ marginTop: '1rem' }}>
          <Grid.Row>
            <Grid.Column
              mobile={16}
              tablet={16}
              computer={5}
              widescreen={4}
              style={{ marginTop: '2rem' }}
            >
              <Geocoder updateXY={onXYupdate} />
              <div style={{ marginTop: '2rem' }}>
                {mapCenter ? (
                  <AttributeList center={mapCenter} config={config} />
                ) : (
                  <Message error>
                    Please search for Baltimore City address above or click on
                    the map.
                  </Message>
                )}
              </div>
            </Grid.Column>
            <Grid.Column
              mobile={16}
              tablet={16}
              computer={11}
              widescreen={12}
              style={{ marginTop: '2rem' }}
            >
              <EsriMap center={mapCenter} updateXY={onXYupdate} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
}

export default App;
