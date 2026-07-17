import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Button from '@/components/common/Button';
import FileUploadField from '@/components/forms/FileUploadField';
import { FormField } from '@/components/forms/FormField';
import RequestSuccess from '@/components/forms/RequestSuccess';
import {
  INSTITUTION_TYPES,
  PREFERRED_CONTACT_METHODS,
  inputClassName,
  selectClassName,
  textareaClassName,
} from '@/constants/forms';
import { useFileUpload } from '@/hooks/useFileUpload';
import { institutionalSchema, toInstitutionalPayload } from '@/schemas/requestSchemas';
import { submitInstitutionalRequest } from '@/services/requests';

export default function InstitutionalForm() {
  const [result, setResult] = useState(null);
  const { files, isUploading, addFiles, removeFile, resetFiles } = useFileUpload('institutional');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(institutionalSchema),
    defaultValues: {
      institutionType: 'SCHOOL',
      preferredContactMethod: 'ANY',
      brandingRequired: false,
      attachments: [],
    },
  });

  const onSubmit = async (values) => {
    try {
      const payload = toInstitutionalPayload({ ...values, attachments: files });
      const data = await submitInstitutionalRequest(payload);
      setResult(data);
      reset();
      resetFiles();
      toast.success('Institutional request submitted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to submit institutional request');
    }
  };

  const handleReset = () => {
    setResult(null);
    reset();
    resetFiles();
  };

  if (result) {
    return (
      <RequestSuccess
        title="Institutional request received"
        referenceNumber={result.referenceNumber}
        description="We will prepare a quotation tailored to your institution and contact you shortly."
        onReset={handleReset}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Contact person" htmlFor="contactPerson" required error={errors.contactPerson?.message}>
          <input id="contactPerson" className={inputClassName} autoComplete="name" {...register('contactPerson')} />
        </FormField>

        <FormField label="Institution name" htmlFor="institutionName" required error={errors.institutionName?.message}>
          <input id="institutionName" className={inputClassName} {...register('institutionName')} />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Institution type" htmlFor="institutionType" required error={errors.institutionType?.message}>
          <select id="institutionType" className={selectClassName} {...register('institutionType')}>
            {INSTITUTION_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Estimated quantity" htmlFor="estimatedQuantity">
          <input id="estimatedQuantity" className={inputClassName} placeholder="e.g. 200 students" {...register('estimatedQuantity')} />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Phone" htmlFor="phone" required error={errors.phone?.message}>
          <input id="phone" type="tel" className={inputClassName} autoComplete="tel" {...register('phone')} />
        </FormField>

        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <input id="email" type="email" className={inputClassName} autoComplete="email" {...register('email')} />
        </FormField>
      </div>

      <FormField label="Location" htmlFor="location">
        <input id="location" className={inputClassName} placeholder="City or district" {...register('location')} />
      </FormField>

      <FormField label="Products required" htmlFor="productsRequired" required error={errors.productsRequired?.message}>
        <textarea
          id="productsRequired"
          className={textareaClassName}
          rows={4}
          placeholder="List kits, equipment, medals or other items needed..."
          {...register('productsRequired')}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Required by" htmlFor="requiredDate">
          <input id="requiredDate" type="date" className={inputClassName} {...register('requiredDate')} />
        </FormField>

        <FormField label="Budget range" htmlFor="budgetRange">
          <input id="budgetRange" className={inputClassName} placeholder="e.g. UGX 5–8 million" {...register('budgetRange')} />
        </FormField>
      </div>

      <FormField label="Preferred contact" htmlFor="preferredContactMethod">
        <select id="preferredContactMethod" className={selectClassName} {...register('preferredContactMethod')}>
          {PREFERRED_CONTACT_METHODS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      <label className="flex items-center gap-3 text-sm font-medium text-brand-black">
        <input type="checkbox" className="h-4 w-4 rounded border-border-light" {...register('brandingRequired')} />
        Branding / crest printing required
      </label>

      <FormField label="Additional notes" htmlFor="additionalNotes">
        <textarea id="additionalNotes" className={textareaClassName} rows={4} {...register('additionalNotes')} />
      </FormField>

      <FileUploadField
        files={files}
        onAddFiles={addFiles}
        onRemoveFile={removeFile}
        isUploading={isUploading}
        helpText="Upload procurement documents, crests or specification sheets (optional)."
      />

      <Button type="submit" isLoading={isSubmitting || isUploading} disabled={isUploading}>
        Submit institutional request
      </Button>
    </form>
  );
}
