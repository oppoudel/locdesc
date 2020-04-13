import React from 'react';
import { Table, Header } from 'semantic-ui-react';

function AttributeList({ attr }) {
  let features = {};
  attr.forEach((result) => {
    if (result.layerId === 0) {
      features = {
        ...features,
        'Police District': result.attributes.District,
        Sector: result.attributes.Sector,
        Post: result.attributes.Area,
      };
    }
    if (result.layerId === 1) {
      features = { ...features, Neighborhood: result.value };
    }
    if (result.layerId === 2) {
      features = { ...features, 'Micro Zone Patrol': result.value };
    }
    if (result.layerId === 3) {
      features = { ...features, 'Micro Zone DAT': result.value };
    }
  });

  return (
    <Table celled striped>
      <Table.Body>
        {Object.keys(features)?.map((item, i) => (
          <Table.Row key={i}>
            <Table.Cell>
              <Header as="h4">{item}</Header>
            </Table.Cell>
            <Table.Cell>{features[item]}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

export default AttributeList;
