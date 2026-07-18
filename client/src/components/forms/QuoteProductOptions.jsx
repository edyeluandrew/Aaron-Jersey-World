import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Button from '@/components/common/Button';
import { FormField } from '@/components/forms/FormField';
import { inputClassName, selectClassName } from '@/constants/forms';
import { formatProductPrice, getUniqueVariantValues } from '@/utils/product';

function buildInitialLines(initialSizeQuantities, defaultSize = '') {
  const parsed = initialSizeQuantities?.length ? initialSizeQuantities : [];
  if (parsed.length) {
    return parsed.map((line) => ({ size: line.size, quantity: String(line.quantity) }));
  }

  return [{ size: defaultSize, quantity: '' }];
}

export default function QuoteProductOptions({
  product,
  register,
  setValue,
  watch,
  errors,
  initialSize = '',
  initialColour = '',
  initialQuantity = '',
  initialSizeQuantities = [],
}) {
  const sizes = getUniqueVariantValues(product?.variants, 'size');
  const colours = getUniqueVariantValues(product?.variants, 'colour');
  const selectedSize = watch('selectedSize');
  const selectedColour = watch('selectedColour');
  const [lines, setLines] = useState(() =>
    buildInitialLines(initialSizeQuantities, initialSize),
  );

  const activeVariant = useMemo(
    () =>
      product?.variants?.find(
        (variant) =>
          (!selectedSize || variant.size === selectedSize) &&
          (!selectedColour || variant.colour === selectedColour),
      ) || null,
    [product?.variants, selectedColour, selectedSize],
  );

  const priceLabel = formatProductPrice(product, activeVariant);

  useEffect(() => {
    if (initialSize) setValue('selectedSize', initialSize);
    if (initialColour) setValue('selectedColour', initialColour);
    if (initialQuantity) setValue('quantity', initialQuantity);
  }, [initialColour, initialQuantity, initialSize, setValue]);

  useEffect(() => {
    const payload = lines
      .filter((line) => line.size && Number(line.quantity) > 0)
      .map((line) => ({ size: line.size, quantity: Number(line.quantity) }));

    setValue('sizeQuantities', payload.length ? JSON.stringify(payload) : '');

    if (payload.length === 1 && !watch('quantity')) {
      setValue('quantity', payload[0].quantity);
      setValue('selectedSize', payload[0].size);
    }
  }, [lines, setValue, watch]);

  const updateLine = (index, field, value) => {
    setLines((current) =>
      current.map((line, lineIndex) => (lineIndex === index ? { ...line, [field]: value } : line)),
    );
  };

  const addLine = () => {
    setLines((current) => [...current, { size: selectedSize || sizes[0] || '', quantity: '' }]);
  };

  const removeLine = (index) => {
    setLines((current) => current.filter((_, lineIndex) => lineIndex !== index));
  };

  return (
    <div className="space-y-5 rounded-card border border-border-light bg-surface-light p-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-red">Product details</p>
        <p className="mt-1 font-semibold text-brand-black">{product.name}</p>
        {product.category && <p className="text-sm text-text-muted">{product.category.name}</p>}
        {priceLabel && <p className="mt-2 text-lg font-bold text-brand-black">{priceLabel}</p>}
      </div>

      {sizes.length > 0 && (
        <FormField label="Preferred size" htmlFor="selectedSize" error={errors.selectedSize?.message}>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <label
                key={size}
                className={`cursor-pointer rounded-button border px-3 py-2 text-sm font-semibold ${
                  selectedSize === size
                    ? 'border-brand-red bg-brand-red text-white'
                    : 'border-border-light bg-white text-brand-black'
                }`}
              >
                <input type="radio" value={size} className="sr-only" {...register('selectedSize')} />
                {size}
              </label>
            ))}
          </div>
        </FormField>
      )}

      {colours.length > 0 && (
        <FormField label="Colour" htmlFor="selectedColour">
          <select id="selectedColour" className={selectClassName} {...register('selectedColour')}>
            <option value="">Select colour (optional)</option>
            {colours.map((colour) => (
              <option key={colour} value={colour}>
                {colour}
              </option>
            ))}
          </select>
        </FormField>
      )}

      <FormField label="Total quantity" htmlFor="quantity" error={errors.quantity?.message}>
        <input id="quantity" type="number" min="1" className={inputClassName} {...register('quantity')} />
      </FormField>

      {sizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-brand-black">Need multiple sizes?</p>
            <Button type="button" variant="secondary" size="sm" onClick={addLine}>
              <Plus className="h-4 w-4" />
              Add size line
            </Button>
          </div>

          {lines.map((line, index) => (
            <div key={`${index}-${line.size}`} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <select
                className={selectClassName}
                value={line.size}
                onChange={(event) => updateLine(index, 'size', event.target.value)}
              >
                <option value="">Size</option>
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                className={inputClassName}
                value={line.quantity}
                onChange={(event) => updateLine(index, 'quantity', event.target.value)}
                placeholder="Qty"
              />
              {lines.length > 1 && (
                <Button type="button" variant="secondary" size="sm" onClick={() => removeLine(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <p className="text-xs text-text-muted">Example: 5 × M, 10 × L, 8 × XL for team orders.</p>
        </div>
      )}
    </div>
  );
}
