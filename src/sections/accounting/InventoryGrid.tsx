import type { Row, CellChange } from '@silevis/reactgrid';

import React, { useState } from 'react';

import { LoadingButton } from '@mui/lab';

import GridTemplate from './GridTemplate';

interface InventoryItem {
  itemname: string;
  quantity: string;
  quality: string;
  price: string;
}

const getInventoryColumns = (): any[] => [
  { columnId: 'itemname', width: 150 },
  { columnId: 'quantity', width: 100 },
  { columnId: 'quality', width: 100 },
  { columnId: 'price', width: 100 },
];

const inventoryHeaderRow: any = {
  rowId: 'header',
  cells: [
    { type: 'header', text: 'Item Name' },
    { type: 'header', text: 'Quantity' },
    { type: 'header', text: 'Quality' },
    { type: 'header', text: 'Price' },
  ],
};

const getInventoryRows = (items: InventoryItem[]): Row[] => [
  inventoryHeaderRow,
  ...items.map<any>((item, idx) => ({
    rowId: idx,
    cells: [
      { type: 'text', text: item.itemname },
      { type: 'text', text: item.quantity },
      { type: 'text', text: item.quality },
      { type: 'text', text: item.price },
    ],
  })),
];

const applyInventoryChanges = (
  changes: CellChange<any>[],
  prevItems: InventoryItem[]
): InventoryItem[] =>
  changes.reduce(
    (updatedItems, change) => {
      const itemIndex = change.rowId as number; // Make sure this is a valid index
      const fieldName = change.columnId;

      // Ensure the item exists at the specified index before modifying it
      if (updatedItems[itemIndex]) {
        (updatedItems[itemIndex] as InventoryItem)[fieldName as keyof InventoryItem] =
          change.newCell.text;
      }

      return updatedItems;
    },
    [...prevItems]
  ); // Create a copy of the inventory array
const getInitialInventory = (): InventoryItem[] => [
  { itemname: 'Widget A', quantity: '10', quality: 'High', price: '100' },
  { itemname: 'Widget B', quantity: '5', quality: 'Medium', price: '50' },
];

function InventoryGrid() {
  // State for the inventory data
  const [inventory] = useState<InventoryItem[]>(getInitialInventory());

  const handleSave = (data: InventoryItem[]) => {
    console.log('Saved Inventory Data:', data);
  };

  return (
    <div>
      <GridTemplate<InventoryItem>
        data={inventory}
        columns={getInventoryColumns()}
        headerRow={inventoryHeaderRow}
        getRows={getInventoryRows}
        applyChanges={applyInventoryChanges}
        onSave={handleSave}
      />
    </div>
  );
}

export default InventoryGrid;
