import React from 'react';
import { isEmpty } from 'lodash';
import { Table, Header, Message } from 'semantic-ui-react';
import useData from './useData';

function AttributeList({ center, config }) {
  const { mapServiceUrl, layers } = config;
  const { attributes } = useData(center, mapServiceUrl);

  const combineAttributes = (result, layer) => {
    const fields = layer.fields;
    return Object.keys(fields).reduce(
      (acc, attr) => ({
        ...acc,
        [attr]: result.attributes[fields[attr]],
      }),
      {},
    );
  };

  let features = {};

  attributes.forEach((result) => {
    layers.forEach((layer) => {
      if (result.layerId === layer.layerId) {
        features = { ...features, ...combineAttributes(result, layer) };
      }
    });
  });

  return !isEmpty(features) ? (
    <Table striped>
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
  ) : (
    <Message error>
      Please search for Baltimore City address above or click on the map within
      Baltimore City.
    </Message>
  );
}

export default AttributeList;
