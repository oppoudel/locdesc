import React from 'react';
import Downshift from 'downshift';
import { geocode } from '@esri/arcgis-rest-geocoder';
import matchSorter from 'match-sorter';
import {
  Menu,
  ControllerButton,
  Input,
  Item,
  ArrowIcon,
  XIcon,
  css,
} from './Styles';
import Geocode from './Geocode';

export default function Search({ updateXY }) {
  const handleStateChange = ({ selectedItem }) => {
    if (selectedItem) {
      const { magicKey } = selectedItem;
      geocode({ magicKey, maxLocations: 1 }).then((res) => {
        const location = res.candidates[0].location;
        updateXY(location);
      });
    } else {
      updateXY(null);
    }
  };
  const getItems = (allItems, filter) => {
    return filter
      ? matchSorter(allItems, filter, {
          keys: ['text'],
        })
      : allItems;
  };

  return (
    <Downshift
      itemToString={(item) => (item ? item.text : '')}
      onStateChange={handleStateChange}
    >
      {({
        selectedItem,
        getInputProps,
        getItemProps,
        highlightedIndex,
        isOpen,
        inputValue,
        clearSelection,
        getToggleButtonProps,
        getMenuProps,
      }) => (
        <div {...css({ width: '100%', margin: 'auto' })}>
          <div {...css({ position: 'relative' })}>
            <Input
              {...getInputProps({
                placeholder: 'Search Address',
              })}
            />
            {selectedItem ? (
              <ControllerButton
                onClick={clearSelection}
                aria-label="clear selection"
              >
                <XIcon />
              </ControllerButton>
            ) : (
              <ControllerButton {...getToggleButtonProps()}>
                <ArrowIcon isOpen={isOpen} />
              </ControllerButton>
            )}
          </div>
          <div {...css({ position: 'relative', zIndex: 1000 })}>
            <Menu {...getMenuProps({ isOpen })}>
              {(() => {
                if (!isOpen) {
                  return null;
                }

                if (!inputValue) {
                  return <Item disabled>You have to enter a search query</Item>;
                }

                return (
                  <Geocode address={`${inputValue}`}>
                    {({ loading, error, data = [] }) => {
                      if (loading) {
                        return <Item disabled>Loading...</Item>;
                      }

                      if (error) {
                        return <Item disabled>Error! {error}</Item>;
                      }

                      if (!data.length) {
                        return <Item disabled>No Addresses found</Item>;
                      }

                      return getItems(data, inputValue).map((item, index) => (
                        <Item
                          key={index}
                          {...getItemProps({
                            item,
                            index,
                            isActive: highlightedIndex === index,
                            isSelected: selectedItem === item,
                          })}
                        >
                          {item.text}
                        </Item>
                      ));
                    }}
                  </Geocode>
                );
              })()}
            </Menu>
          </div>
        </div>
      )}
    </Downshift>
  );
}
