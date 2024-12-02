import React, { useRef } from 'react';
import Section from '../components/Section';
import TextInput from '../components/TextInput';

interface FormBuilderProps {
  json: any;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ json }) => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleFieldChange = (field: string, value: string) => {
    console.log(`Field Changed: ${field}, Value: ${value}`);
  };

  const handleFieldFocus = (field: string) => {
    console.log(`Field Focused: ${field}`);
  };

  return (
    <form ref={formRef} className="dynamic-form">
      {json.data.map((form: any) =>
        form.sections.map((section: any) => (
          <Section key={section.sectionid} title={section.title} hint={section.hint} bordered>
            {section.columns.map(
              (field: any) =>
                field.component === 'input' && (
                  <TextInput
                    key={field.field}
                    field={field.field}
                    title={field.title}
                    placeholder={field.placeholder}
                    hint={field.hint}
                    colSize={field.colsize}
                    required={field.required === 1}
                    onChange={handleFieldChange}
                    onFocus={handleFieldFocus}
                  />
                )
            )}
          </Section>
        ))
      )}
    </form>
  );
};

export default FormBuilder;
