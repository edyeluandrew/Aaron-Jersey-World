import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Button from '@/components/common/Button';
import FileUploadField from '@/components/forms/FileUploadField';
import QuoteProductOptions from '@/components/forms/QuoteProductOptions';
import { FormField } from '@/components/forms/FormField';
import RequestSuccess from '@/components/forms/RequestSuccess';
import {
  PREFERRED_CONTACT_METHODS,
  inputClassName,
  selectClassName,
  textareaClassName,
} from '@/constants/forms';
import { filterMainCategories } from '@/constants/catalogue';
import { useCategories } from '@/hooks/useCatalogue';
import { useFileUpload } from '@/hooks/useFileUpload';
import { quoteSchema, toQuotePayload } from '@/schemas/requestSchemas';
import { parseSizeQuantities } from '@/utils/product';
import { submitQuoteRequest } from '@/services/requests';

export default function QuoteForm({
  product = null,
  initialSize = '',
  initialColour = '',
  initialQuantity = '',
  initialSizeQuantities = [],
}) {
  const [result, setResult] = useState(null);
  const { data: categories = [] } = useCategories();
  const mainCategories = filterMainCategories(categories);
  const { files, isUploading, addFiles, removeFile, resetFiles } = useFileUpload('quote');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      preferredContactMethod: 'ANY',
      brandingRequired: false,
      productSlug: product?.slug || '',
      categorySlug: product?.category?.slug || '',
      selectedSize: initialSize,
      selectedColour: initialColour,
      quantity: initialQuantity,
      sizeQuantities: initialSizeQuantities.length ? JSON.stringify(initialSizeQuantities) : '',
      attachments: [],
    },
  });

  useEffect(() => {
    if (product?.slug) setValue('productSlug', product.slug);
    if (product?.category?.slug) setValue('categorySlug', product.category.slug);
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
      {product ? (
        <QuoteProductOptions
          product={product}
          register={register}
          setValue={setValue}
          watch={watch}
          errors={errors}
          initialSize={initialSize}
          initialColour={initialColour}
          initialQuantity={initialQuantity}
          initialSizeQuantities={initialSizeQuantities}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Category" htmlFor="categorySlug">
            <select id="categorySlug" className={selectClassName} {...register('categorySlug')}>
              <option value="">Select category (optional)</option>
              {mainCategories.map((category) => (
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

      <input type="hidden" {...register('productSlug')} />
      <input type="hidden" {...register('categorySlug')} />
      <input type="hidden" {...register('sizeQuantities')} />

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
          placeholder="Player names, delivery details, special requests..."
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
