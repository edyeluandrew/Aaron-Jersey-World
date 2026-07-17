import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Button from '@/components/common/Button';
import FileUploadField from '@/components/forms/FileUploadField';
import { FormField } from '@/components/forms/FormField';
import RequestSuccess from '@/components/forms/RequestSuccess';
import {
  BRANDING_SERVICE_TYPES,
  PREFERRED_CONTACT_METHODS,
  inputClassName,
  selectClassName,
  textareaClassName,
} from '@/constants/forms';
import { useFileUpload } from '@/hooks/useFileUpload';
import { brandingSchema, toBrandingPayload } from '@/schemas/requestSchemas';
import { submitBrandingRequest } from '@/services/requests';

export default function BrandingForm() {
  const [result, setResult] = useState(null);
  const { files, isUploading, addFiles, removeFile, resetFiles } = useFileUpload('branding');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      preferredContactMethod: 'ANY',
      attachments: [],
    },
  });

  const onSubmit = async (values) => {
    try {
      const payload = toBrandingPayload({ ...values, attachments: files });
      const data = await submitBrandingRequest(payload);
      setResult(data);
      reset();
      resetFiles();
      toast.success('Branding request submitted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to submit branding request');
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
        title="Branding request received"
        referenceNumber={result.referenceNumber}
        description="We will review your artwork and requirements, then contact you with options and pricing."
        onReset={handleReset}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Your name" htmlFor="customerName" required error={errors.customerName?.message}>
          <input id="customerName" className={inputClassName} autoComplete="name" {...register('customerName')} />
        </FormField>

        <FormField label="Organisation" htmlFor="organisationName">
          <input id="organisationName" className={inputClassName} {...register('organisationName')} />
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

      <FormField label="Service type" htmlFor="serviceType" required error={errors.serviceType?.message}>
        <select id="serviceType" className={selectClassName} {...register('serviceType')}>
          <option value="">Select service</option>
          {BRANDING_SERVICE_TYPES.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Product type" htmlFor="productType">
          <input id="productType" className={inputClassName} placeholder="e.g. Football jerseys" {...register('productType')} />
        </FormField>

        <FormField label="Quantity" htmlFor="quantity" error={errors.quantity?.message}>
          <input id="quantity" type="number" min="1" className={inputClassName} {...register('quantity')} />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Preferred colours" htmlFor="preferredColour">
          <input id="preferredColour" className={inputClassName} {...register('preferredColour')} />
        </FormField>

        <FormField label="Sizes" htmlFor="sizes">
          <input id="sizes" className={inputClassName} placeholder="e.g. S–XL mixed" {...register('sizes')} />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Required by" htmlFor="requiredDate">
          <input id="requiredDate" type="date" className={inputClassName} {...register('requiredDate')} />
        </FormField>

        <FormField label="Preferred contact" htmlFor="preferredContactMethod">
          <select id="preferredContactMethod" className={selectClassName} {...register('preferredContactMethod')}>
            {PREFERRED_CONTACT_METHODS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label="Project description" htmlFor="description" required error={errors.description?.message}>
        <textarea
          id="description"
          className={textareaClassName}
          rows={5}
          placeholder="Describe logo placement, quantities, deadlines and any special instructions..."
          {...register('description')}
        />
      </FormField>

      <FileUploadField
        files={files}
        onAddFiles={addFiles}
        onRemoveFile={removeFile}
        isUploading={isUploading}
        helpText="Upload your logo or artwork files. PDF, PNG, JPG or WEBP up to 10 MB each."
      />

      <Button type="submit" isLoading={isSubmitting || isUploading} disabled={isUploading}>
        Submit branding request
      </Button>
    </form>
  );
}
