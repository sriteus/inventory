import { useRef } from 'react';
import { KyroBuilderRef } from '../../../plugins/formBuilder/main/KyroBuilder';
import KyroBuilder from '../../../plugins/formBuilder/main/KyroBuilder';

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
    if (fieldName === 'person_age') {
      const age = parseInt(value, 10);
      if (isNaN(age) || age < 0) {
        updatedErrors[fieldName] = 'Please enter a valid age Yo';
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
      <KyroBuilder
        ref={kyroBuilderRef}
        formId="per_details"
        onBlur={handleBlur}
        onFocus={handleFocus}
        render_type="table_with_form"
      />

      <KyroBuilder
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
        style={{ width: '100px', maxWidth: '20%' }}
      />
      {/* <button onClick={handleGetFormData}>Get Form Data</button> */}
    </div>
  );
};

export default MyPage;
