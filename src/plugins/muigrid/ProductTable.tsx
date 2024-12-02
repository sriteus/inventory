/* eslint-disable react/no-unescaped-entities */
// ProductTable.tsx
import React from 'react';
import DataGrid from 'react-data-grid';

interface ProductRow {
  quantity: number;
  quality: string;
  price: number;
}

interface ProductTableProps {
  userName: string;
}

const ProductTable: React.FC<ProductTableProps> = ({ userName }) => (
  <div style={{ marginTop: '20px' }}>
    <h3>{userName}'s Product Table</h3>
    <DataGrid
      columns={[
        { key: 'justname', name: userName },
        { key: 'quantity', name: 'Quantity' },
        { key: 'quality', name: 'Quality' },
        { key: 'price', name: 'Price' },
      ]}
      rows={[
        { quantity: 10, quality: 'Good', price: 100 },
        { quantity: 5, quality: 'Medium', price: 50 },
        { quantity: 2, quality: 'Bad', price: 20 },
      ]}
      rowKeyGetter={(row) => `${row.quantity}-${row.quality}`}
      className="rdg-light"
      rowHeight={25}
      summaryRowHeight={25}
    />
  </div>
);

export default ProductTable;
