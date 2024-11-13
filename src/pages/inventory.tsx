import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import Inventory from 'src/sections/inventory/view/inventory-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Inventory - ${CONFIG.appName}`}</title>
      </Helmet>

      <Inventory />
    </>
  );
}
