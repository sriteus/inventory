import { useEffect, useState } from 'react';
import Spreadsheet from 'react-spreadsheet';

const MySheets = () => {
  const [data, setData] = useState<any>([
    [{ value: 'Vanilla' }, { value: 'Chocolate' }, { value: '' }],
    [{ value: 'Strawberry' }, { value: 'Cookies' }, { value: '' }],
    [{ value: 'Strawberry' }, { value: 'Cookies' }, { value: '' }],
  ]);
  // const rowLabels = ['Item 1', 'Item 2'];

  // Helper function to compare arrays deeply
  const areEqual = (arr1: any[], arr2: any[]): boolean =>
    JSON.stringify(arr1) === JSON.stringify(arr2);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <Spreadsheet
      data={data}
      // rowLabels={rowLabels}
      onChange={(newData) => {
        // Only update state if the data has changed
        if (!areEqual(newData, data)) {
          setData(newData);
        }
      }}
    />
  );
};

export default MySheets;
