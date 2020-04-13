import React, { useState } from 'react';
import Geocoder from './components/Geocoder/Geocoder';
import EsriMap from './components/EsriMap';
import LocationDetails from './components/LocationDetails/LocationDetails';
import { Container, Message, Grid } from 'semantic-ui-react';

function App() {
  const [mapCenter, setMapCenter] = useState(null);
  const onXYupdate = (x, y) => {
    setMapCenter({ x, y });
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
        <img
          src="https://arcgisportal.baltimorepolice.org/bpdgis/sharing/rest/content/items/b6d54cd3249b4452a420914af38c5d7e/data"
          alt="logo"
          width="40px"
        />
        <h1 style={{ paddingLeft: '2rem', margin: 0 }}>Location Description</h1>
      </header>
      <Container>
        <Grid columns={2} container stackable style={{ marginTop: '2rem' }}>
          <Grid.Row>
            <Grid.Column>
              <Geocoder updateXY={onXYupdate} />
              <div style={{ marginTop: '3rem' }}>
                {mapCenter ? (
                  <LocationDetails center={mapCenter} />
                ) : (
                  <Message error>
                    Please search for Baltimore City address above or click on
                    the map.
                  </Message>
                )}
              </div>
            </Grid.Column>
            <Grid.Column>
              <EsriMap center={mapCenter} updateXY={onXYupdate} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
}

export default App;
