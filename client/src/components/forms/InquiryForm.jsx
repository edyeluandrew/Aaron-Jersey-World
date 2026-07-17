import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Button from '@/components/common/Button';
import FileUploadField from '@/components/forms/FileUploadField';
import { FormField } from '@/components/forms/FormField';
import RequestSuccess from '@/components/forms/RequestSuccess';
import {
  INQUIRY_TYPES,
  PREFERRED_CONTACT_METHODS,
  inputClassName,
  selectClassName,
  textareaClassName,
} from '@/constants/forms';
import { useFileUpload } from '@/hooks/useFileUpload';
import { inquirySchema, toInquiryPayload } from '@/schemas/requestSchemas';
import { submitInquiry } from '@/services/requests';

export default function InquiryForm() {
  const [result, setResult] = useState(null);
  const { files, isUploading, addFiles, removeFile, resetFiles } = useFileUpload('inquiry');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      type: 'GENERAL',
      preferredContactMethod: 'ANY',
      attachments: [],
    },
  });

  const onSubmit = async (values) => {
    try {
      const payload = toInquiryPayload({ ...values, attachments: files });
      const data = await submitInquiry(payload);
      setResult(data);
      reset();
      resetFiles();
      toast.success('Enquiry submitted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to submit enquiry');
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
        title="Enquiry received"
        referenceNumber={result.referenceNumber}
        onReset={handleReset}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <FormField label="Enquiry type" htmlFor="type" error={errors.type?.message}>
        <select id="type" className={selectClassName} {...register('type')}>
          {INQUIRY_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Full name" htmlFor="fullName" required error={errors.fullName?.message}>
          <input id="fullName" className={inputClassName} autoComplete="name" {...register('fullName')} />
        </FormField>

        <FormField label="Phone" htmlFor="phone" required error={errors.phone?.message}>
          <input id="phone" type="tel" className={inputClassName} autoComplete="tel" {...register('phone')} />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <input id="email" type="email" className={inputClassName} autoComplete="email" {...register('email')} />
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

      <FormField label="Subject" htmlFor="subject" error={errors.subject?.message}>
        <input id="subject" className={inputClassName} {...register('subject')} />
      </FormField>

      <FormField label="Message" htmlFor="message" required error={errors.message?.message}>
        <textarea id="message" className={textareaClassName} rows={5} {...register('message')} />
      </FormField>

      <FileUploadField
        files={files}
        onAddFiles={addFiles}
        onRemoveFile={removeFile}
        isUploading={isUploading}
      />

      <Button type="submit" isLoading={isSubmitting || isUploading} disabled={isUploading}>
        Send enquiry
      </Button>
    </form>
  );
}
