/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Typography } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import TableBuilder from 'src/plugins/formBuilder/main/TableBuilder';
import Personal from './personal';
import ItemsForm from './items';
import KyroBuilder from 'src/plugins/formBuilder/main/KyroBuilder';
import { jsonTest } from './test';
import Items from './newItems';

const Accounting = () => {
  return (
    <div>
      <DashboardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Test Page
        </Typography>
        <div style={{ width: '100%', marginBottom: '30px' }}>
          <TableBuilder formId="items" typer="just_form" DetailsComponent={ItemsForm} />
          {/* <TableBuilder formId="per_details" typer="table_with_form" DetailsComponent={Personal} /> */}
          {/* <TableBuilder formId="per_details" typer="just_table" /> */}
          {/* <KyroBuilder config={jsonTest} typer="form" /> */}
          <Items />
        </div>
      </DashboardContent>
    </div>
  );
};

export default Accounting;
