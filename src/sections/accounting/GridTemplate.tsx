/* eslint-disable react/button-has-type */
import '@silevis/reactgrid/styles.css';

import type {
  Id,
  Row,
  Column,
  TextCell,
  CellChange,
  MenuOption,
  CellLocation,
  SelectionMode,
} from '@silevis/reactgrid';

import * as React from 'react';
import { ReactGrid } from '@silevis/reactgrid';
import { LoadingButton } from '@mui/lab';

interface GridTemplateProps<T> {
  data: T[];
  columns: Column[];
  headerRow: Row;
  getRows: (data: T[]) => Row[];
  applyChanges: (changes: CellChange<TextCell>[], data: T[]) => T[];
  onSave: (data: T[]) => void; // Save button callback
}

function GridTemplate<T>({
  data,
  columns,
  headerRow,
  getRows,
  applyChanges,
  onSave,
}: GridTemplateProps<T>) {
  const [items, setItems] = React.useState<T[]>(data);

  const rows = getRows(items);

  const handleChanges = (changes: CellChange<any>[]) => {
    setItems((prevItems) => applyChanges(changes, prevItems));
  };

  const saveData = () => {
    onSave(items);
  };
  const simpleHandleContextMenu = (
    selectedRowIds: Id[],
    selectedColIds: Id[],
    selectionMode: SelectionMode,
    menuOptions: MenuOption[],
    selectedRanges: Array<CellLocation[]>
  ): MenuOption[] => menuOptions;

  return (
    <>
      <ReactGrid
        rows={rows}
        columns={columns}
        onCellsChanged={handleChanges}
        onContextMenu={simpleHandleContextMenu}
      />
      <LoadingButton onClick={saveData}>Save</LoadingButton>
    </>
  );
}

export default GridTemplate;
