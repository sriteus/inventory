import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import Accounting from 'src/sections/accounting/view/accounting';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Inventory - ${CONFIG.appName}`}</title>
      </Helmet>

      <Accounting />
    </>
  );
}
