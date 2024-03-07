import React from "react";
import { isEmpty } from "lodash";
import { Table, Header, Message } from "semantic-ui-react";

function AttributeList(attributes) {
  const { RespondingDistrict, RespondingPost, NeighborhoodsName } =
    attributes.attributes;
  return !isEmpty(attributes.attributes) ? (
    <Table striped>
      <Table.Body>
        <Table.Row>
          <Table.Cell>
            <Header as="h4">District</Header>
          </Table.Cell>
          <Table.Cell>
            <a
              href={`https://www.baltimorepolice.org/find-my-district/${RespondingDistrict.toLowerCase()}-district`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {RespondingDistrict}
            </a>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <Header as="h4">Post</Header>
          </Table.Cell>
          <Table.Cell>{RespondingPost}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <Header as="h4">Neighborhood</Header>
          </Table.Cell>
          <Table.Cell>{NeighborhoodsName}</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ) : (
    <Message error>Please search for Baltimore City address above.</Message>
  );
}

export default AttributeList;
