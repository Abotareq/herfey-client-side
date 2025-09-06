"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateProduct } from '../../../hooks/useProductMutations.js';
import { useGetAllCategories } from '../../../service/category'; 
import { useStoreContext } from '../../context/StoreContext'; 
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

// --- Zod Schema Factory ---
const getProductSchema = (t) => {
    const optionSchema = z.object({
        value: z.string().min(1, t('option')),
        priceModifier: z.preprocess((a) => parseFloat(String(a) || '0'), z.number().min(0).optional().default(0)),
        stock: z.preprocess((a) => parseInt(String(a), 10), z.number().min(0, t('stock'))),
        sku: z.string().min(1, t('sku')),
    });

    const variantSchema = z.object({
        name: z.string().min(1, t('variantname')),
        options: z.array(optionSchema).min(1, t('desc')),
    });

    const productSchema = z.object({
        name: z.string().min(3, t('namew')),
        description: z.string().min(10, t('desw')),
        basePrice: z.preprocess((a) => parseFloat(String(a)), z.number().min(0.01, t('pricew'))),
        category: z.string().min(1, t('categoryw')),
        images: z.any().refine((files) => files?.length > 0, t('imagew')),
        variants: z.array(variantSchema).min(1, t('variantw')),
    });

    return productSchema;
};


// --- Icon Set  ---
const Icons = {
    Document: (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    Back: (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
    Image: (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    Variant: (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
    Plus: (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
    X: (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    Alert: (p) => <svg {...p} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>,
    Loader: (p) => <svg {...p} className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>,
    Upload: (p) => <svg {...p} className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
    Check: (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path></svg>,
};


// --- Reusable Class Strings & Helper Components  ---
const getErrorClass = (hasError) => hasError ? 'border-red-500 ring-red-500/50' : 'border-slate-200 focus:border-orange-500 focus:ring-orange-500';
const inputClass = (hasError) => `block w-full px-4 py-3 text-base bg-white/80 border text-slate-900 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 placeholder:text-slate-400 ${getErrorClass(hasError)}`;
const labelClass = "block text-sm font-semibold text-slate-700 mb-2";
const requiredStar = <span className="text-red-500 ml-1">*</span>;
const FormError = ({ message }) => <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5"><Icons.Alert className="w-4 h-4" />{message}</p>;


// --- FieldArrayOptions Sub-component  ---
const FieldArrayOptions = ({ control, register, variantIndex, errors, t }) => { // ✅ Takes `t` as a prop
    const { fields, append, remove } = useFieldArray({ control, name: `variants.${variantIndex}.options` });
    const getOptionError = (index, field) => errors.variants?.[variantIndex]?.options?.[index]?.[field]?.message;
    
    return (
        <div className="space-y-4">
            {fields.map((option, optionIndex) => (
                <div key={option.id} className="relative bg-slate-50/50 rounded-lg border border-slate-200/80 p-4 group">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>{t('value')}{requiredStar}</label>
                            <input {...register(`variants.${variantIndex}.options.${optionIndex}.value`)} placeholder={t('valueplaceholder')} className={inputClass(getOptionError(optionIndex, 'value'))} />
                            {getOptionError(optionIndex, 'value') && <FormError message={getOptionError(optionIndex, 'value')} />}
                        </div>
                        <div>
                            <label className={labelClass}>{t('SKU')}{requiredStar}</label>
                            <input {...register(`variants.${variantIndex}.options.${optionIndex}.sku`)} placeholder={t('skuplaceholder')} className={inputClass(getOptionError(optionIndex, 'sku'))} />
                            {getOptionError(optionIndex, 'sku') && <FormError message={getOptionError(optionIndex, 'sku')} />}
                        </div>
                        <div>
                            <label className={labelClass}>{t('pricemodifier')} ({t('egp')})</label>
                            <input {...register(`variants.${variantIndex}.options.${optionIndex}.priceModifier`)} type="number" min="0" step="0.01" placeholder="0.00" className={inputClass(getOptionError(optionIndex, 'priceModifier'))} />
                        </div>
                        <div>
                            <label className={labelClass}>{t('stockf')}{requiredStar}</label>
                            <input {...register(`variants.${variantIndex}.options.${optionIndex}.stock`)} type="number" min="0" placeholder="0" className={inputClass(getOptionError(optionIndex, 'stock'))} />
                            {getOptionError(optionIndex, 'stock') && <FormError message={getOptionError(optionIndex, 'stock')} />}
                        </div>
                    </div>
                     {fields.length > 1 && (
                        <button type="button" onClick={() => remove(optionIndex)} className="absolute -top-2 -right-2 p-1.5 text-slate-500 bg-white/80 border border-slate-200 rounded-full transition-all opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 hover:scale-110"><Icons.X className="w-4 h-4" /></button>
                     )}
                </div>
            ))}
            <button type="button" onClick={() => append({ value: '', priceModifier: 0, stock: 10, sku: '' })} className="group w-full text-center px-4 py-2.5 rounded-lg bg-orange-100 border border-orange-200 text-orange-700 transition-all duration-300 hover:bg-orange-200 hover:border-orange-300 active:scale-[0.98]">
                <span className="relative flex items-center justify-center space-x-2 font-semibold text-sm">
                    <Icons.Plus className="w-4 h-4" />
                    <span>{t('add')}</span>
                </span>
            </button>
        </div>
    );
};


// --- Main Component  ---
export default function CreateProductForm() {
    const t = useTranslations('createproduct'); 
    const { storeId } = useStoreContext();
    const { mutate: createProduct, isPending: submitting } = useCreateProduct();
    const { data: categories = [], isLoading: loading } = useGetAllCategories();
    const [imagePreviews, setImagePreviews] = useState([]);
    const fileInputRef = useRef(null);
    const router = useRouter();

    
    const productSchema = useMemo(() => getProductSchema(t), [t]);

    const { register, handleSubmit, control, formState: { errors, isValid }, watch, reset, setValue } = useForm({
        resolver: zodResolver(productSchema), // ✅ Use the memoized schema
        defaultValues: {
            name: '', description: '', basePrice: '', category: '', images: [],
            variants: [{ name: 'Color', options: [{ value: '', priceModifier: 0, stock: 10, sku: '' }] }],
        },
        mode: 'onTouched',
    });

    const { fields: variants, append: addVariant, remove: removeVariant } = useFieldArray({ control, name: 'variants' });
    const watchImages = watch('images');

    useEffect(() => {
        if (watchImages && watchImages.length > 0) {
            const newPreviews = Array.from(watchImages).map(file => URL.createObjectURL(file));
            setImagePreviews(newPreviews);
            return () => newPreviews.forEach(URL.revokeObjectURL);
        } else {
            setImagePreviews([]);
        }
    }, [watchImages]);

    const onCancel = () => {
        reset();
        router.back();
    };
    
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length) {
            const currentFiles = Array.from(watch('images') || []);
            setValue('images', [...currentFiles, ...files], { shouldValidate: true });
        }
    };
    
    const handleRemoveImage = (index) => {
        const updatedFiles = Array.from(watch('images') || []).filter((_, i) => i !== index);
        setValue('images', updatedFiles, { shouldValidate: true });
    };

    const onSubmit = (data) => {
        if (!storeId) {
            console.error('Store ID is missing!');
            return;
        }
        const formData = new FormData();
        formData.append('store', storeId);
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'images') {
                value.forEach(file => formData.append('images', file));
            } else if (key === 'variants') {
                formData.append('variants', JSON.stringify(value));
            } else {
                formData.append(key, String(value));
            }
        });
        createProduct(formData);
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-slate-100 z-50 flex items-center justify-center">
                <div className="flex items-center space-x-4">
                    <Icons.Loader className="w-10 h-10 text-orange-500" />
                    <span className="text-slate-600 font-medium">{t('loading')}</span>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                <header className="sticky top-4 z-40 bg-white/25 backdrop-blur-md rounded-2xl shadow-lg mb-8 border border-white/30">
                    <div className="flex items-center justify-between p-4 md:p-6">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20">
                                <Icons.Document className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-slate-800">{t('newproduct')}</h1>
                        </div>
                        <button onClick={onCancel} className="group px-4 py-2 rounded-lg bg-white text-slate-700 transition-all duration-300 hover:bg-slate-100 active:scale-95 border border-slate-300">
                            <span className="relative flex items-center space-x-2 text-sm font-medium">
                                <Icons.Back className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                <span>{t('back')}</span>
                            </span>
                        </button>
                    </div>
                </header>

                <main>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Basic Information Card */}
                        <div className="bg-white/25 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/30">
                            <div className="p-6 md:p-8">
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="p-3 rounded-xl bg-orange-100">
                                        <Icons.Document className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-slate-800">{t('basicinfo')}</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className={labelClass}>{t('pname')}{requiredStar}</label>
                                        <input {...register('name')} placeholder={t('pnamelcaeholder')} className={inputClass(errors.name)} />
                                        {errors.name && <FormError message={errors.name.message} />}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className={labelClass}>{t('pdesc')}{requiredStar}</label>
                                        <textarea {...register('description')} rows="4" placeholder={t('descplaceholder')} className={`${inputClass(errors.description)} min-h-[100px]`} />
                                        {errors.description && <FormError message={errors.description.message} />}
                                    </div>
                                    <div>
                                        <label className={labelClass}>{t('pprice')} ({t('egp')}){requiredStar}</label>
                                        <input {...register('basePrice')} type="number" min="0.01" step="0.01" placeholder="0.00" className={inputClass(errors.basePrice)} />
                                        {errors.basePrice && <FormError message={errors.basePrice.message} />}
                                    </div>
                                    <div>
                                        <label className={labelClass}>{t('category')}{requiredStar}</label>
                                        <select {...register('category')} className={inputClass(errors.category)} defaultValue="">
                                            <option value="" disabled>{t('selectcategory')}</option>
                                            {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                        </select>
                                        {errors.category && <FormError message={errors.category.message} />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Images Card */}
                        <div className="bg-white/25 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/30">
                            <div className="p-6 md:p-8">
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="p-3 rounded-xl bg-orange-100">
                                        <Icons.Image className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-slate-800">{t('productimage')}</h2>
                                </div>
                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center transition-colors hover:border-orange-500 hover:bg-slate-50/50 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <Icons.Upload className="mx-auto" />
                                    <p className="mt-2 text-sm text-slate-600">
                                        <span className="font-semibold text-orange-600">{t('upload')}</span> {t('dragdrop')}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP up to 10MB</p>
                                    <input ref={fileInputRef} type="file" multiple onChange={handleFileChange} accept="image/*" className="sr-only" />
                                </div>
                                {errors.images && <div className="text-center pt-2"><FormError message={errors.images.message} /></div>}
                                {imagePreviews.length > 0 && (
                                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {imagePreviews.map((src, index) => (
                                            <div key={src} className="relative group aspect-square">
                                                <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-lg border border-slate-200" />
                                                <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:scale-110"><Icons.X className="w-4 h-4" /></button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Variants Card */}
                        <div className="bg-white/25 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/30">
                            <div className="p-6 md:p-8">
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="p-3 rounded-xl bg-orange-100">
                                        <Icons.Variant className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-slate-800">{t('product')}</h2>
                                </div>
                                <div className="space-y-6">
                                    {variants.map((variant, index) => (
                                        <div key={variant.id} className="bg-white/50 rounded-xl border border-slate-200 p-5">
                                            <div className="flex justify-between items-center mb-4">
                                                <label className={labelClass}>{t('varianttype')}{requiredStar} <span className="text-xs font-normal text-slate-500">({t('ex')})</span></label>
                                                {variants.length > 1 && (
                                                    <button type="button" onClick={() => removeVariant(index)} className="text-slate-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"><Icons.X className="w-5 h-5" /></button>
                                                )}
                                            </div>
                                            <input {...register(`variants.${index}.name`)} placeholder={t('variantplaceholder')} className={inputClass(errors.variants?.[index]?.name)} />
                                            {errors.variants?.[index]?.name && <FormError message={errors.variants[index].name.message} />}
                                            <hr className="my-5 border-slate-200" />
                                            <FieldArrayOptions 
                                                control={control} 
                                                register={register} 
                                                variantIndex={index} 
                                                errors={errors} 
                                                t={t} 
                                            />
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addVariant({ name: '', options: [{ value: '', priceModifier: '', stock: '', sku: '' }] })} className="w-full border-2 border-dashed border-slate-300 text-slate-600 rounded-lg py-3 font-semibold text-sm hover:border-orange-500 hover:text-orange-600 transition-colors flex items-center justify-center gap-2">
                                        <Icons.Plus className="w-4 h-4" /> {t('addvariant')}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-6 flex flex-col sm:flex-row justify-end items-center gap-4">
                            <button type="button" onClick={onCancel} className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-all">
                               {t('cancel')} 
                           </button>
                           <button type="submit" disabled={submitting} className="w-full sm:w-auto px-6 py-3.5 text-white rounded-lg transition-all duration-300 shadow-lg shadow-orange-500/30 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center space-x-2 font-semibold">
                               {submitting ? <><Icons.Loader className="w-5 h-5" /><span>{t('creating')}</span></> : <><Icons.Check className="w-5 h-5" /><span>{t('createproduct')}</span></>}
                           </button>
                        </div>
                    </form>
                </main>

                {/* Loading State Overlay */}
                {submitting && (
                    <div className="fixed inset-0  backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 flex items-center space-x-4">
                            <Icons.Loader className="w-8 h-8 text-orange-500" />
                            <span className="text-orange-500 font-medium">{t('creatingproduct')}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}