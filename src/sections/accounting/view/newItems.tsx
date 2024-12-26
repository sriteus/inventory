import { useRef } from 'react';
import { KyroBuilderRef } from '../../../plugins/formBuilder/main/KyroBuilder';
import KyroBuilder from '../../../plugins/formBuilder/main/KyroBuilder';
import FilterFormBuilder from 'src/plugins/formBuilder/main/FilterBuilder';

const MyPage = () => {
  const kyroBuilderRef = useRef<KyroBuilderRef>(null);

  const handleGetFormData = () => {
    const data = kyroBuilderRef.current?.getFormData();
    console.log('Form Data:', data);
  };

  const handleBlur = (fieldName: string, event: any) => {
    const value = event.target.value;
    const currentErrors = kyroBuilderRef.current?.getFormErrors() || {};
    const updatedErrors = { ...currentErrors };
    if (fieldName === 'model') {
      const model = value;
      if (model === '1') {
        updatedErrors[fieldName] = 'You cant set the model to 1';
      } else {
        delete updatedErrors[fieldName]; // Remove error if valid
      }
    }
    kyroBuilderRef.current?.setFormErrors(updatedErrors);
  };
  const handleFocus = (fieldName: string, event: any) => {
    console.log(`Field "${fieldName}" focused with value: ${event.target.value}`);
  };

  return (
    <div>
      {/* <div style={{ maxWidth: '600px' }}> */}
      <KyroBuilder ref={kyroBuilderRef} formId="items" />{' '}
      <KyroBuilder
        ref={kyroBuilderRef}
        formId="products_data"
        onBlur={handleBlur}
        onFocus={handleFocus}
        filterInitData={{ company: 'apple' }}
      />
      {/* </div> */}
      {/* <KyroBuilder
        ref={kyroBuilderRef}
        formId="items"
        onBlur={handleBlur}
        onFocus={handleFocus}
        render_type="just_table"
      />
      <KyroBuilder
        ref={kyroBuilderRef}
        formId="per_details"
        onBlur={handleBlur}
        onFocus={handleFocus}
        render_type="just_form"
      /> */}
      {/* <button onClick={handleGetFormData}>Get Form Data</button> */}
    </div>
  );
};

export default MyPage;
