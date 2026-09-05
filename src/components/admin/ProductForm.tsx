'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Image as ImageIcon, ChevronUp, ChevronDown, Loader2, Edit } from 'lucide-react';
import Button from '@/components/ui/CustomButton';
import CustomInput from '@/components/ui/CustomInput';
import { createAdminProduct, updateAdminProduct, uploadProductImages, updateProductVariant, createProductVariant, deleteProductVariant, deleteProductImage } from '@/app/actions/admin/products';
import type { ProductImage, ProductVariant } from '@/types';

interface VariantFormData {
  waist_size: number;
  inseam_length?: number;
  stock_quantity: number;
  price?: number;
}

interface ImageFormData {
  id?: string;
  file?: File;
  preview?: string;
  image_type: 'flat' | 'on_model' | 'detail';
  sort_order: number;
  alt_text?: string;
  is_new?: boolean;
}

export default function ProductForm({ product }: { 
  product?: { 
    id: string; 
    title: string; 
    slug: string; 
    description?: string; 
    price: number; 
    sale_price?: number | null; 
    colour?: string; 
    gender: string; 
    fit_type: string; 
    status: string; 
    bestseller: boolean; 
    new_arrival: boolean; 
    featured: boolean;
    images?: ProductImage[];
    variants?: ProductVariant[];
  } 
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'images' | 'variants'>('basic');
  
  // Images state
  const [images, setImages] = useState<ImageFormData[]>([]);
  
  // Variants state
  const [variants, setVariants] = useState<VariantFormData[]>([]);
  const [editingVariantId, setEditingVariantId] = useState<number | null>(null);
  const [variantForm, setVariantForm] = useState<VariantFormData>({
    waist_size: 28,
    inseam_length: 32,
    stock_quantity: 0,
    price: undefined,
  });

  // Initialize from product data
  useEffect(() => {
    if (product?.images) {
      setImages(product.images.map((img, index) => ({
        id: img.id,
        preview: img.image_url,
        image_type: img.image_type as 'flat' | 'on_model' | 'detail',
        sort_order: img.sort_order ?? index,
        alt_text: img.alt_text || '',
        is_new: false,
      })));
    } else {
      setImages([{ image_type: 'flat', sort_order: 0, alt_text: '', is_new: true }]);
    }

    if (product?.variants) {
      setVariants(product.variants.map(v => ({
        waist_size: v.waist_size,
        inseam_length: v.inseam_length ?? undefined,
        stock_quantity: v.stock_quantity,
        price: v.price ?? undefined,
      })));
    } else {
      setVariants([{ waist_size: 28, inseam_length: 32, stock_quantity: 0, price: undefined }]);
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    
    // Check checkboxes
    ['bestseller', 'new_arrival', 'featured'].forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, 'false');
      } else if (formData.get(key) === 'on') {
        formData.set(key, 'true');
      }
    });

    try {
      if (product) {
        const res = await updateAdminProduct(product.id, formData);
        if (res?.error) throw new Error(res.error);
      } else {
        const res = await createAdminProduct(formData);
        if (res?.error) throw new Error(res.error);
        router.push(`/admin/products/${res.id}/edit`);
        return;
      }

      // Upload new images
      const newImages = images.filter(img => img.is_new && img.file);
      if (newImages.length > 0) {
        const imageFormData = new FormData();
        newImages.forEach((img, index) => {
          if (img.file) {
            imageFormData.append('images', img.file);
            imageFormData.append(`image_type_${index}`, img.image_type);
            imageFormData.append(`sort_order_${index}`, String(img.sort_order));
            imageFormData.append(`alt_text_${index}`, img.alt_text || '');
          }
        });
        if (product?.id) {
          imageFormData.append('product_id', product.id);
          const uploadRes = await uploadProductImages(imageFormData);
          if (uploadRes?.error) throw new Error(uploadRes.error);
        }
      }

      // Handle variants
      if (product?.id) {
        for (let i = 0; i < variants.length; i++) {
          const v = variants[i];
          const existingVariant = product.variants?.[i];
          const variantData = {
            product_id: product.id,
            waist_size: v.waist_size,
            inseam_length: v.inseam_length ?? null,
            stock_quantity: v.stock_quantity,
            price: v.price ?? null,
          };
          
          if (existingVariant?.id) {
            const res = await updateProductVariant(existingVariant.id, variantData);
            if (res?.error) throw new Error(res.error);
          } else {
            const res = await createProductVariant(variantData);
            if (res?.error) throw new Error(res.error);
          }
        }
      }

      setLoading(false);
      router.push('/admin/products');
      router.refresh();
    } catch (err: unknown) {
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Failed to save product');
    }
  };

  // Image handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    const preview = URL.createObjectURL(file);
    setImages(prev => prev.map((img, i) => 
      i === index ? { ...img, file, preview, is_new: true } : img
    ));
  };

  const addImage = () => {
    setImages(prev => [...prev, { image_type: 'flat' as const, sort_order: prev.length, alt_text: '', is_new: true }]);
  };

  const removeImage = (index: number) => {
    const img = images[index];
    if (img.id && !img.is_new) {
      deleteProductImage(img.id).then(res => {
        if (res?.error) setError(res.error);
        else setImages(prev => prev.filter((_, i) => i !== index));
      });
    } else {
      setImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    setImages(prev => {
      const newImages = [...prev];
      const [moved] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, moved);
      return newImages.map((img, i) => ({ ...img, sort_order: i }));
    });
  };

  // Variant handlers
  const addVariant = () => {
    setVariants(prev => [...prev, { waist_size: 28, inseam_length: 32, stock_quantity: 0, price: undefined }]);
  };

  const removeVariant = (index: number) => {
    if (product?.variants?.[index]?.id) {
      deleteProductVariant(product.variants[index].id).then(res => {
        if (res?.error) setError(res.error);
        else setVariants(prev => prev.filter((_, i) => i !== index));
      });
    } else {
      setVariants(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleVariantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVariantId !== null) {
      setVariants(prev => prev.map((v, i) => 
        i === editingVariantId ? variantForm : v
      ));
      setEditingVariantId(null);
      setVariantForm({ waist_size: 28, inseam_length: 32, stock_quantity: 0, price: undefined });
    } else {
      addVariant();
    }
  };

  // Delete handlers
  const handleDeleteProduct = async () => {
    if (!product?.id) return;
    if (!window.confirm('Are you sure you want to delete this product? This cannot be undone.')) return;
    
    setLoading(true);
    // We'll need a delete action - for now just redirect
    // TODO: Add delete action
    setLoading(false);
    router.push('/admin/products');
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex gap-6" aria-label="Product form tabs">
          {(['basic', 'images', 'variants'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab 
                  ? 'border-black text-black' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl bg-white p-6 rounded-xl border border-gray-200">
        {error && <div className="text-red-500 bg-red-50 p-3 rounded-md">{error}</div>}

        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <CustomInput name="title" defaultValue={product?.title} required />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Slug *</label>
                <CustomInput name="slug" defaultValue={product?.slug} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea 
                name="description" 
                defaultValue={product?.description}
                rows={4}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Price (₹) *</label>
                <CustomInput type="number" name="price" defaultValue={product?.price} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sale Price (₹)</label>
                <CustomInput type="number" name="sale_price" defaultValue={product?.sale_price || ''} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Colour</label>
                <CustomInput name="colour" defaultValue={product?.colour} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select name="gender" defaultValue={product?.gender || 'men'} className="w-full border-gray-300 rounded-md">
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fit Type</label>
                <select name="fit_type" defaultValue={product?.fit_type || 'straight'} className="w-full border-gray-300 rounded-md">
                  <option value="straight">Straight</option>
                  <option value="skinny">Skinny</option>
                  <option value="bootcut">Bootcut</option>
                  <option value="baggy">Baggy</option>
                  <option value="wide_leg">Wide Leg</option>
                  <option value="mom">Mom</option>
                  <option value="flare">Flare</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select name="status" defaultValue={product?.status || 'draft'} className="w-full border-gray-300 rounded-md">
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Colour</label>
              <CustomInput name="colour" defaultValue={product?.colour} />
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="bestseller" defaultChecked={product?.bestseller} className="rounded border-gray-300 text-black focus:ring-black" />
                <span className="text-sm font-medium">Bestseller</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="new_arrival" defaultChecked={product?.new_arrival} className="rounded border-gray-300 text-black focus:ring-black" />
                <span className="text-sm font-medium">New Arrival</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="featured" defaultChecked={product?.featured} className="rounded border-gray-300 text-black focus:ring-black" />
                <span className="text-sm font-medium">Featured</span>
              </label>
            </div>
          </>
        )}

        {/* Images Tab */}
        {activeTab === 'images' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Product Images</h3>
              <Button type="button" variant="outline" onClick={addImage} className="gap-1">
                <Plus className="w-4 h-4" /> Add Image
              </Button>
            </div>
            
            <p className="text-sm text-gray-500">
              Upload multiple images. First image is used as thumbnail. 
              <strong>flat</strong> = product only, <strong>on_model</strong> = worn, <strong>detail</strong> = close-up.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative group border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                  <div className="aspect-square relative overflow-hidden">
                    {img.preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img.preview} alt="" className="w-full h-40 object-cover" />
                    ) : (
                      <div className="w-full h-40 flex items-center justify-center text-gray-400">
                        <ImageIcon className="w-10 h-10" />
                      </div>
                    )}
                    {img.is_new && (
                      <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">New</div>
                    )}
                  </div>
                  
                  <div className="p-3 space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                      <select
                        value={img.image_type}
                        onChange={(e) => setImages(prev => prev.map((i, idx) => idx === index ? { ...i, image_type: e.target.value as 'flat' | 'on_model' | 'detail' } : i))}
                        className="w-full text-sm border-gray-300 rounded-md"
                      >
                        <option value="flat">Flat (Product)</option>
                        <option value="on_model">On Model</option>
                        <option value="detail">Detail</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Alt Text</label>
                      <input
                        type="text"
                        value={img.alt_text || ''}
                        onChange={(e) => setImages(prev => prev.map((i, idx) => idx === index ? { ...i, alt_text: e.target.value } : i))}
                        placeholder="Accessibility description"
                        className="w-full text-sm border-gray-300 rounded-md px-2 py-1"
                      />
                    </div>
                    
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e, index)}
                      className="w-full text-sm"
                    />
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => moveImage(index, index - 1)}
                        disabled={index === 0}
                        className="flex-1 gap-1"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => moveImage(index, index + 1)}
                        disabled={index === images.length - 1}
                        className="flex-1 gap-1"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeImage(index)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {images.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No images added yet</p>
                <Button type="button" variant="outline" onClick={addImage} className="mt-2">
                  <Plus className="w-4 h-4 mr-1" /> Add First Image
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Variants Tab */}
        {activeTab === 'variants' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Product Variants (Sizes)</h3>
              <Button type="button" variant="outline" onClick={() => setEditingVariantId(variants.length)} className="gap-1">
                <Plus className="w-4 h-4" /> Add Variant
              </Button>
            </div>

            <p className="text-sm text-gray-500">
              Define size variants for this product. Each combination of waist size and inseam length is a separate variant with its own stock.
            </p>

            {/* Variant Form */}
            {editingVariantId !== null && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-medium mb-3">{
                  editingVariantId < variants.length ? 'Edit Variant' : 'Add New Variant'
                }</h4>
                <form onSubmit={handleVariantSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Waist Size *</label>
                    <input
                      type="number"
                      min="24"
                      max="50"
                      value={variantForm.waist_size}
                      onChange={(e) => setVariantForm(prev => ({ ...prev, waist_size: Number(e.target.value) }))}
                      className="w-full border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Inseam Length</label>
                    <input
                      type="number"
                      min="26"
                      max="40"
                      value={variantForm.inseam_length || ''}
                      onChange={(e) => setVariantForm(prev => ({ 
                        ...prev, 
                        inseam_length: e.target.value === '' ? undefined : Number(e.target.value) 
                      }))}
                      className="w-full border-gray-300 rounded-md px-3 py-2"
                      placeholder="e.g., 32"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Stock Quantity *</label>
                    <input
                      type="number"
                      min="0"
                      max="999"
                      value={variantForm.stock_quantity}
                      onChange={(e) => setVariantForm(prev => ({ ...prev, stock_quantity: Number(e.target.value) }))}
                      className="w-full border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Override Price (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={variantForm.price || ''}
                      onChange={(e) => setVariantForm(prev => ({ 
                        ...prev, 
                        price: e.target.value === '' ? undefined : Number(e.target.value) 
                      }))}
                      className="w-full border-gray-300 rounded-md px-3 py-2"
                      placeholder="Optional"
                    />
                  </div>
                  <div className="md:col-span-4 flex gap-2">
                    <Button type="submit">
                      {editingVariantId < variants.length ? 'Update' : 'Add'} Variant
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => {
                        setEditingVariantId(null);
                        setVariantForm({ waist_size: 28, inseam_length: 32, stock_quantity: 0, price: undefined });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Variants List */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm">
                    <th className="px-4 py-3 font-medium">Waist</th>
                    <th className="px-4 py-3 font-medium">Inseam</th>
                    <th className="px-4 py-3 font-medium">Stock</th>
                    <th className="px-4 py-3 font-medium">Override Price</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {variants.map((variant, index) => (
                    <tr key={index} className={editingVariantId === index ? 'bg-blue-50' : ''}>
                      <td className="px-4 py-3 font-medium">{variant.waist_size}</td>
                      <td className="px-4 py-3 text-gray-500">{variant.inseam_length || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={variant.stock_quantity === 0 ? 'text-red-500' : variant.stock_quantity <= 3 ? 'text-yellow-600' : ''}>
                          {variant.stock_quantity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {variant.price ? `₹${variant.price.toLocaleString()}` : 'Use product price'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setVariantForm({
                                waist_size: variant.waist_size,
                                inseam_length: variant.inseam_length,
                                stock_quantity: variant.stock_quantity,
                                price: variant.price,
                              });
                              setEditingVariantId(index);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeVariant(index)}
                            className="text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {variants.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-500">
                        <p>No variants defined yet</p>
                        <Button type="button" variant="outline" onClick={() => setEditingVariantId(0)} className="mt-2">
                          <Plus className="w-4 h-4 mr-1" /> Add First Variant
                        </Button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-6 border-t">
          {product && (
            <Button type="button" variant="destructive" onClick={handleDeleteProduct} className="gap-1">
              <Trash2 className="w-4 h-4" />
              Delete Product
            </Button>
          )}
          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Save Product'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}