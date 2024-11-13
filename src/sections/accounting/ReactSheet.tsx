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

interface Person {
  name: string;
  surname: string;
}

const getPeople = (): Person[] => [
  { name: 'Thomas', surname: 'Goldman' },
  { name: 'Susie', surname: 'Quattro' },
  { name: '', surname: '' },
];

const getColumns = (): Column[] => [
  { columnId: 'name', width: 150, resizable: true },
  { columnId: 'surname', width: 150, resizable: true },
];
const headerRow: Row = {
  rowId: 'header',
  cells: [
    { type: 'header', text: 'Name' },
    { type: 'header', text: 'Surname' },
  ],
};

const getRows = (people: Person[]): Row[] => [
  headerRow,
  ...people.map<Row>((person, idx) => ({
    rowId: idx,
    cells: [
      { type: 'text', text: person.name },
      { type: 'text', text: person.surname },
    ],
  })),
];

const applyChangesToPeople = (changes: CellChange<TextCell>[], prevPeople: Person[]): Person[] => {
  changes.forEach((change) => {
    const personIndex = change.rowId;
    const fieldName = change.columnId;
    (prevPeople[personIndex as number] as Person)[fieldName as keyof Person] = change.newCell.text;
  });
  return [...prevPeople];
};

function MySheets() {
  const [people, setPeople] = React.useState<Person[]>(getPeople());

  const rows = getRows(people);
  const [columns, setColumns] = React.useState<Column[]>(getColumns());
  const handleColumnResize = (ci: Id, width: number) => {
    setColumns((prevColumns) => {
      const columnIndex = prevColumns.findIndex((el) => el.columnId === ci);
      const resizedColumn = prevColumns[columnIndex];
      const updatedColumn = { ...resizedColumn, width };
      prevColumns[columnIndex] = updatedColumn;
      return [...prevColumns];
    });
  };

  const handleChanges = (changes: CellChange<any>[]) => {
    setPeople((prevPeople) => applyChangesToPeople(changes, prevPeople));
    console.log(people);
  };
  const simpleHandleContextMenu = (
    selectedRowIds: Id[],
    selectedColIds: Id[],
    selectionMode: SelectionMode,
    menuOptions: MenuOption[],
    selectedRanges: Array<CellLocation[]>
  ): MenuOption[] => menuOptions;

  return (
    <ReactGrid
      rows={rows}
      columns={columns}
      onCellsChanged={handleChanges}
      onColumnResized={handleColumnResize}
      onContextMenu={simpleHandleContextMenu}
    />
  );
}

export default MySheets;
