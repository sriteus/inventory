import React from 'react';
import DataGrid, { textEditor } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';

interface Row {
  id: number;
  name: string;
  age: number | null;
  dateOfBirth: string;
  grade: string;
  isActive: string;
  salary: number | null;
  department: string;
  experience: number | null;
  country: string;
}

const columns = [
  { key: 'id', name: 'ID', editable: false, width: 50, renderEditCell: textEditor },
  { key: 'name', name: 'Name', editable: true },
  { key: 'age', name: 'Age', editable: true, editor: textEditor },
  { key: 'dateOfBirth', name: 'Date of Birth', editable: true, editor: textEditor },
  { key: 'grade', name: 'Grade', editable: true, editor: textEditor },
  { key: 'isActive', name: 'Active', editable: true, editor: textEditor },
  { key: 'salary', name: 'Salary', editable: true, editor: textEditor },
  { key: 'department', name: 'Department', editable: true, editor: textEditor },
  { key: 'experience', name: 'Experience (Years)', editable: true, editor: textEditor },
  { key: 'country', name: 'Country', editable: true, editor: textEditor },
];

const rows: Row[] = [
  {
    id: 1,
    name: 'John Doe',
    age: 29,
    dateOfBirth: '1994-05-15',
    grade: 'A',
    isActive: 'Yes',
    salary: 75000,
    department: 'Engineering',
    experience: 7,
    country: 'USA',
  },
  {
    id: 2,
    name: 'Jane Smith',
    age: 34,
    dateOfBirth: '1989-02-20',
    grade: 'B',
    isActive: 'No',
    salary: 67000,
    department: 'Marketing',
    experience: 12,
    country: 'Canada',
  },
  {
    id: 3,
    name: 'Alice Johnson',
    age: 41,
    dateOfBirth: '1982-08-12',
    grade: 'A',
    isActive: 'Yes',
    salary: 82000,
    department: 'Finance',
    experience: 18,
    country: 'UK',
  },
  {
    id: 4,
    name: 'Bob Brown',
    age: 25,
    dateOfBirth: '1998-09-10',
    grade: 'C',
    isActive: 'No',
    salary: 55000,
    department: 'Support',
    experience: 3,
    country: 'India',
  },
  {
    id: 5,
    name: 'Charlie White',
    age: 38,
    dateOfBirth: '1985-01-25',
    grade: 'B',
    isActive: 'Yes',
    salary: 90000,
    department: 'Sales',
    experience: 15,
    country: 'Germany',
  },
  {
    id: 6,
    name: 'Diana Prince',
    age: 31,
    dateOfBirth: '1992-06-30',
    grade: 'A',
    isActive: 'Yes',
    salary: 71000,
    department: 'HR',
    experience: 9,
    country: 'France',
  },
  {
    id: 7,
    name: 'Eve Black',
    age: 28,
    dateOfBirth: '1995-03-22',
    grade: 'C',
    isActive: 'No',
    salary: 61000,
    department: 'Engineering',
    experience: 5,
    country: 'Australia',
  },
  {
    id: 8,
    name: 'Frank Green',
    age: 50,
    dateOfBirth: '1973-07-19',
    grade: 'D',
    isActive: 'No',
    salary: 52000,
    department: 'Legal',
    experience: 25,
    country: 'Italy',
  },
  {
    id: 9,
    name: 'Grace Adams',
    age: 45,
    dateOfBirth: '1978-12-05',
    grade: 'A',
    isActive: 'Yes',
    salary: 98000,
    department: 'Management',
    experience: 22,
    country: 'Japan',
  },
  {
    id: 10,
    name: 'Henry Miller',
    age: 33,
    dateOfBirth: '1990-11-01',
    grade: 'B',
    isActive: 'No',
    salary: 64000,
    department: 'IT',
    experience: 10,
    country: 'Brazil',
  },
];

function rowKeyGetter(row: Row) {
  return row.id;
}

function calculateAggregation(rows: Row[], columnKey: keyof Row) {
  if (typeof rows[0][columnKey] === 'number') {
    return rows.reduce((sum, row) => sum + (row[columnKey] as number), 0);
  }
  return null;
}

export default function TestGrid() {
  const bottomSummaryRows = [
    {
      id: 'total',
      name: 'Totals',
      age: calculateAggregation(rows, 'age'),
      salary: calculateAggregation(rows, 'salary'),
      experience: calculateAggregation(rows, 'experience'),
    },
  ];

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      rowKeyGetter={rowKeyGetter}
      bottomSummaryRows={bottomSummaryRows}
      className="rdg-light"
    />
  );
}
