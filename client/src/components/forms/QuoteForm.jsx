import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Button from '@/components/common/Button';
import FileUploadField from '@/components/forms/FileUploadField';
import { FormField } from '@/components/forms/FormField';
import RequestSuccess from '@/components/forms/RequestSuccess';
import {
  PREFERRED_CONTACT_METHODS,
  inputClassName,
  selectClassName,
  textareaClassName,
} from '@/constants/forms';
import { useCategories } from '@/hooks/useCatalogue';
import { useFileUpload } from '@/hooks/useFileUpload';
import { quoteSchema, toQuotePayload } from '@/schemas/requestSchemas';
import { submitQuoteRequest } from '@/services/requests';

export default function QuoteForm({ product = null }) {
  const [result, setResult] = useState(null);
  const { data: categories = [] } = useCategories();
  const { files, isUploading, addFiles, removeFile, resetFiles } = useFileUpload('quote');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      preferredContactMethod: 'ANY',
      brandingRequired: false,
      productSlug: product?.slug || '',
      categorySlug: product?.category?.slug || '',
      attachments: [],
    },
  });

  useEffect(() => {
    if (product?.slug) {
      setValue('productSlug', product.slug);
    }
    if (product?.category?.slug) {
      setValue('categorySlug', product.category.slug);
    }
  }, [product, setValue]);

  const onSubmit = async (values) => {
    try {
      const payload = toQuotePayload({ ...values, attachments: files });
      const data = await submitQuoteRequest(payload);
      setResult(data);
      reset();
      resetFiles();
      toast.success('Quote request submitted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to submit quote request');
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
        title="Quote request received"
        referenceNumber={result.referenceNumber}
        description="We will review your requirements and contact you with pricing and availability."
        onReset={handleReset}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {product && (
        <div className="rounded-button border border-border-light bg-surface-light p-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-red">Selected product</p>
          <p className="mt-1 font-semibold text-brand-black">{product.name}</p>
          {product.category && <p className="text-sm text-text-muted">{product.category.name}</p>}
        </div>
      )}

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

      <FormField label="Location" htmlFor="location">
        <input id="location" className={inputClassName} placeholder="City or district" {...register('location')} />
      </FormField>

      {!product && (
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Category" htmlFor="categorySlug">
            <select id="categorySlug" className={selectClassName} {...register('categorySlug')}>
              <option value="">Select category (optional)</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Quantity" htmlFor="quantity" error={errors.quantity?.message}>
            <input id="quantity" type="number" min="1" className={inputClassName} {...register('quantity')} />
          </FormField>
        </div>
      )}

      {product && (
        <FormField label="Quantity" htmlFor="quantity" error={errors.quantity?.message}>
          <input id="quantity" type="number" min="1" className={inputClassName} {...register('quantity')} />
        </FormField>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Required by" htmlFor="requiredDate">
          <input id="requiredDate" type="date" className={inputClassName} {...register('requiredDate')} />
        </FormField>

        <FormField label="Budget range" htmlFor="budgetRange">
          <input id="budgetRange" className={inputClassName} placeholder="e.g. UGX 1–2 million" {...register('budgetRange')} />
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
        Branding / custom printing required
      </label>

      <FormField label="Additional notes" htmlFor="notes">
        <textarea
          id="notes"
          className={textareaClassName}
          rows={5}
          placeholder="Sizes, colours, player names, delivery details..."
          {...register('notes')}
        />
      </FormField>

      <FileUploadField
        files={files}
        onAddFiles={addFiles}
        onRemoveFile={removeFile}
        isUploading={isUploading}
        helpText="Upload reference images, logos or specification documents (optional)."
      />

      <Button type="submit" isLoading={isSubmitting || isUploading} disabled={isUploading}>
        Submit quote request
      </Button>
    </form>
  );
}
