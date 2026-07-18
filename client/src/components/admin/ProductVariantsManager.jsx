import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Button from '@/components/common/Button';
import { FormField } from '@/components/forms/FormField';
import { inputClassName, selectClassName } from '@/constants/forms';
import { ADMIN_QUERY_KEYS } from '@/constants/adminNavigation';
import { QUERY_KEYS } from '@/constants/navigation';
import { STANDARD_APPAREL_SIZES } from '@/constants/catalogue';
import { STOCK_STATUSES } from '@/constants';
import {
  addAdminProductVariant,
  deleteAdminProductVariant,
  updateAdminProductVariant,
} from '@/services/adminProducts';

const EMPTY_VARIANT = {
  size: 'M',
  colour: '',
  version: '',
  sku: '',
  priceAdjustment: '',
  stockStatus: 'CONTACT_FOR_AVAILABILITY',
};

export default function ProductVariantsManager({ productId, variants = [] }) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState({ ...EMPTY_VARIANT });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.product(productId) });
    queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.productFilters });
  };

  const addMutation = useMutation({
    mutationFn: () =>
      addAdminProductVariant(productId, {
        size: draft.size || undefined,
        colour: draft.colour || undefined,
        version: draft.version || undefined,
        sku: draft.sku || undefined,
        priceAdjustment: draft.priceAdjustment === '' ? undefined : Number(draft.priceAdjustment),
        stockStatus: draft.stockStatus,
      }),
    onSuccess: () => {
      toast.success('Size option added');
      setDraft({ ...EMPTY_VARIANT });
      invalidate();
    },
    onError: (error) => toast.error(error.message || 'Failed to add size option'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ variantId, payload }) => updateAdminProductVariant(productId, variantId, payload),
    onSuccess: () => {
      toast.success('Size option updated');
      invalidate();
    },
    onError: (error) => toast.error(error.message || 'Failed to update size option'),
  });

  const deleteMutation = useMutation({
    mutationFn: (variantId) => deleteAdminProductVariant(productId, variantId),
    onSuccess: () => {
      toast.success('Size option removed');
      invalidate();
    },
    onError: (error) => toast.error(error.message || 'Failed to remove size option'),
  });

  return (
    <div className="max-w-3xl space-y-5 rounded-card border border-border-light bg-white p-6 shadow-card">
      <div>
        <h2 className="text-xl font-semibold text-brand-black">Sizes &amp; options</h2>
        <p className="mt-1 text-sm text-text-muted">
          Add sizes like M, L, XL with optional colour and price adjustments. Customers choose these when requesting a quote.
        </p>
      </div>

      <div className="grid gap-4 rounded-card border border-border-light bg-surface-light/60 p-4 sm:grid-cols-2">
        <FormField label="Size" htmlFor="variant-size">
          <input
            id="variant-size"
            list="standard-size-options"
            className={inputClassName}
            value={draft.size}
            onChange={(event) => setDraft((current) => ({ ...current, size: event.target.value }))}
            placeholder="M"
          />
          <datalist id="standard-size-options">
            {STANDARD_APPAREL_SIZES.map((size) => (
              <option key={size} value={size} />
            ))}
          </datalist>
        </FormField>

        <FormField label="Colour" htmlFor="variant-colour">
          <input
            id="variant-colour"
            className={inputClassName}
            value={draft.colour}
            onChange={(event) => setDraft((current) => ({ ...current, colour: event.target.value }))}
            placeholder="Red / Navy"
          />
        </FormField>

        <FormField label="Version / style" htmlFor="variant-version">
          <input
            id="variant-version"
            className={inputClassName}
            value={draft.version}
            onChange={(event) => setDraft((current) => ({ ...current, version: event.target.value }))}
            placeholder="Home / Full kit"
          />
        </FormField>

        <FormField label="Extra price (UGX)" htmlFor="variant-price-adjustment">
          <input
            id="variant-price-adjustment"
            type="number"
            className={inputClassName}
            value={draft.priceAdjustment}
            onChange={(event) => setDraft((current) => ({ ...current, priceAdjustment: event.target.value }))}
            placeholder="0"
          />
        </FormField>

        <FormField label="Stock status" htmlFor="variant-stock">
          <select
            id="variant-stock"
            className={selectClassName}
            value={draft.stockStatus}
            onChange={(event) => setDraft((current) => ({ ...current, stockStatus: event.target.value }))}
          >
            {Object.values(STOCK_STATUSES).map((status) => (
              <option key={status} value={status}>
                {status.replaceAll('_', ' ').toLowerCase()}
              </option>
            ))}
          </select>
        </FormField>

        <div className="flex items-end">
          <Button type="button" onClick={() => addMutation.mutate()} isLoading={addMutation.isPending}>
            <Plus className="h-4 w-4" />
            Add size option
          </Button>
        </div>
      </div>

      {variants.length === 0 ? (
        <p className="text-sm text-text-muted">No size options yet. Add M, L, XL so customers can pick a size on the quote form.</p>
      ) : (
        <div className="space-y-3">
          {variants.map((variant) => (
            <div
              key={variant.id}
              className="grid gap-3 rounded-card border border-border-light p-4 sm:grid-cols-[repeat(5,minmax(0,1fr))_auto]"
            >
              <input
                className={inputClassName}
                defaultValue={variant.size || ''}
                placeholder="Size"
                onBlur={(event) => {
                  if (event.target.value !== (variant.size || '')) {
                    updateMutation.mutate({ variantId: variant.id, payload: { size: event.target.value } });
                  }
                }}
              />
              <input
                className={inputClassName}
                defaultValue={variant.colour || ''}
                placeholder="Colour"
                onBlur={(event) => {
                  if (event.target.value !== (variant.colour || '')) {
                    updateMutation.mutate({ variantId: variant.id, payload: { colour: event.target.value } });
                  }
                }}
              />
              <input
                className={inputClassName}
                defaultValue={variant.version || ''}
                placeholder="Version"
                onBlur={(event) => {
                  if (event.target.value !== (variant.version || '')) {
                    updateMutation.mutate({ variantId: variant.id, payload: { version: event.target.value } });
                  }
                }}
              />
              <input
                className={inputClassName}
                type="number"
                defaultValue={variant.priceAdjustment ?? ''}
                placeholder="Extra UGX"
                onBlur={(event) => {
                  const next = event.target.value === '' ? null : Number(event.target.value);
                  const current = variant.priceAdjustment == null ? null : Number(variant.priceAdjustment);
                  if (next !== current) {
                    updateMutation.mutate({ variantId: variant.id, payload: { priceAdjustment: next } });
                  }
                }}
              />
              <select
                className={selectClassName}
                defaultValue={variant.stockStatus}
                onChange={(event) =>
                  updateMutation.mutate({
                    variantId: variant.id,
                    payload: { stockStatus: event.target.value },
                  })
                }
              >
                {Object.values(STOCK_STATUSES).map((status) => (
                  <option key={status} value={status}>
                    {status.replaceAll('_', ' ').toLowerCase()}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => deleteMutation.mutate(variant.id)}
                isLoading={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
