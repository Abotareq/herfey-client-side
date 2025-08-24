'use client';
import React, { useState } from 'react';
import { useCreateProduct } from '../../../hooks/useProductMutations.js'; 
import { Icons } from './ReusableComponents/SVG-Icons/SVG-Icons.jsx';

const CreateProductForm = ({ storeId, categoryId }) => {

    const { mutate: createProduct, isPending, isError, error, isSuccess } = useCreateProduct();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [images, setImages] = useState([]);
    const [variants, setVariants] = useState([{ name: 'Color', options: [{ value: '', priceModifier: 0, stock: 10, sku: '' }] }]);
    const handleVariantChange = (index, event) => { const newVariants = [...variants]; newVariants[index][event.target.name] = event.target.value; setVariants(newVariants); };
    const handleOptionChange = (vIndex, oIndex, event) => { const newVariants = [...variants]; newVariants[vIndex].options[oIndex][event.target.name] = event.target.value; setVariants(newVariants); };
    const addVariant = () => { setVariants([...variants, { name: '', options: [{ value: '', priceModifier: 0, stock: 1, sku: '' }] }]); };
    const removeVariant = (index) => setVariants(variants.filter((_, i) => i !== index));
    const addOption = (vIndex) => { const newVariants = [...variants]; newVariants[vIndex].options.push({ value: '', priceModifier: 0, stock: 1, sku: '' }); setVariants(newVariants); };
    const removeOption = (vIndex, oIndex) => { const newVariants = [...variants]; newVariants[vIndex].options = newVariants[vIndex].options.filter((_, i) => i !== oIndex); setVariants(newVariants); };
    const handleSubmit = (event) => { event.preventDefault(); const productData = new FormData(); productData.append('store', storeId); productData.append('category', categoryId); productData.append('name', name); productData.append('description', description); productData.append('basePrice', basePrice); for (let i = 0; i < images.length; i++) { productData.append('images', images[i]); } productData.append('variants', JSON.stringify(variants)); createProduct(productData); };
    

    const inputStyles = "block w-full bg-white/80 backdrop-blur-sm border border-slate-300/70 rounded-lg py-2 px-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors";

    return (
        <div className="w-full">
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-900">Create New Product</h1>
                <p className="text-slate-600 mt-2">Add a new item to your inventory by filling out the form below.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* --- LEFT COLUMN --- */}
                    <div className="space-y-6">
                        <section className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-md">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-orange-500">{Icons.package}</span>
                                <h2 className="text-lg font-semibold text-slate-800">Product Details</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium mb-1.5 text-slate-700">Product Name</label>
                                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Premium Cotton T-Shirt" required className={inputStyles} />
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium mb-1.5 text-slate-700">Description</label>
                                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the product..." required rows={4} className={inputStyles} />
                                </div>
                                <div>
                                    <label htmlFor="basePrice" className="block text-sm font-medium mb-1.5 text-slate-700">Base Price ($)</label>
                                    <input id="basePrice" type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} placeholder="24.99" required min="0" className={inputStyles} />
                                </div>
                            </div>
                        </section>

                        <section className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-md">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-orange-500">{Icons.image}</span>
                                <h2 className="text-lg font-semibold text-slate-800">Product Images</h2>
                            </div>
                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-300/80 px-6 py-10 hover:border-orange-400 transition-colors">
                                <div className="text-center">
                                    <span className="text-slate-400">{Icons.upload}</span>
                                    <div className="mt-4 flex text-sm text-slate-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-orange-600 hover:text-orange-500">
                                            <span>Upload files</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={(e) => setImages(e.target.files)} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-slate-500">{images.length > 0 ? `${images.length} file(s) selected` : "PNG, JPG up to 10MB"}</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* --- RIGHT COLUMN --- */}
                    <div className="space-y-6">
                        <section className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-md">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-orange-500">{Icons.layers}</span>
                                <h2 className="text-lg font-semibold text-slate-800">Product Variants</h2>
                            </div>
                            <div className="space-y-4">
                                {variants.map((variant, vIndex) => (
                                    <div key={vIndex} className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-4">
                                        <div className="flex items-center gap-2">
                                            <input type="text" name="name" placeholder="Variant Name (e.g., Color)" value={variant.name} onChange={(e) => handleVariantChange(vIndex, e)} className={`${inputStyles} flex-grow`} />
                                            <button type="button" onClick={() => removeVariant(vIndex)} className="p-2 text-slate-500 hover:text-red-600 rounded-lg hover:bg-slate-200/60 transition-colors">{Icons.trash}</button>
                                        </div>
                                        <div className="space-y-3 pl-3 border-l-2 border-slate-200/80">
                                            {variant.options.map((option, oIndex) => (
                                                <div key={oIndex} className="grid grid-cols-2 gap-2">
                                                    <input type="text" name="value" placeholder="Value (Red)" value={option.value} onChange={(e) => handleOptionChange(vIndex, oIndex, e)} className={inputStyles} />
                                                    <input type="text" name="sku" placeholder="SKU" value={option.sku} onChange={(e) => handleOptionChange(vIndex, oIndex, e)} required className={inputStyles} />
                                                    <input type="number" name="priceModifier" placeholder="+/- Price" value={option.priceModifier} onChange={(e) => handleOptionChange(vIndex, oIndex, e)} className={inputStyles} />
                                                    <div className="flex items-center gap-2">
                                                        <input type="number" name="stock" placeholder="Stock" value={option.stock} onChange={(e) => handleOptionChange(vIndex, oIndex, e)} className={inputStyles} />
                                                        <button type="button" onClick={() => removeOption(vIndex, oIndex)} className="p-2 text-slate-500 hover:text-red-600 rounded-lg hover:bg-slate-200/60 transition-colors">{Icons.trash}</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button type="button" onClick={() => addOption(vIndex)} className="w-full flex items-center justify-center gap-1.5 text-sm text-orange-600 hover:text-orange-700 font-semibold py-2 rounded-lg hover:bg-orange-500/10 transition-colors">
                                            <span className="h-4 w-4">{Icons.plus}</span> Add Option
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={addVariant} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-center hover:bg-slate-100 transition-colors font-semibold">
                                    <span className="h-4 w-4">{Icons.plus}</span> Add Variant Type
                                </button>
                            </div>
                        </section>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-200/80 flex flex-col items-center">
                    <button type="submit" disabled={isPending} className="w-full max-w-xs bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed py-3 px-4">
                        {isPending ? 'Creating Product...' : 'Create Product'}
                    </button>
                    {isSuccess && <p className="mt-4 text-center text-green-600">Product created successfully!</p>}
                    {isError && <p className="mt-4 text-center text-red-600">Error: {error.message}</p>}
                </div>
            </form>
        </div>
    );
};

export default CreateProductForm;



// "use client"

// import React,{ useState }  from "react";

// // Enhanced SVG Icons Component
// const Icons = {
//   package: (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//     </svg>
//   ),
//   image: (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//     </svg>
//   ),
//   upload: (
//     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//     </svg>
//   ),
//   layers: (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12l-2.25-2.25L4.5 7.5m0 4.5l2.25-2.25M4.5 12L12 4.5m0 0L19.5 12M12 4.5v15" />
//     </svg>
//   ),
//   plus: (
//     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//     </svg>
//   ),
//   trash: (
//     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//     </svg>
//   ),
//   sparkles: (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
//     </svg>
//   ),
//   tag: (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
//     </svg>
//   ),
//   check: (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//     </svg>
//   ),
//   x: (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//     </svg>
//   )
// };

// const EnhancedCreateProductForm = ({ storeId = "1", categoryId = "1" }) => {
//   // Mock hook for demonstration
//   const useCreateProduct = () => ({
//     mutate: (data) => {
//       console.log('Creating product:', data);
//       setIsSuccess(true);
//       setTimeout(() => setIsSuccess(false), 3000);
//     },
//     isPending: false,
//     isError: false,
//     error: null,
//     isSuccess: false
//   });

//   const { mutate: createProduct, isPending, isError, error, isSuccess: hookSuccess } = useCreateProduct();
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [basePrice, setBasePrice] = useState('');
//   const [images, setImages] = useState([]);
//   const [imagePreviews, setImagePreviews] = useState([]);
//   const [variants, setVariants] = useState([
//     { 
//       name: 'Color', 
//       options: [{ value: 'Red', priceModifier: 0, stock: 10, sku: 'PRODUCT-RED-001' }] 
//     }
//   ]);
//   const [isSuccess, setIsSuccess] = useState(hookSuccess);

//   // Enhanced styling with orange color palette
//   const inputStyles = "block w-full bg-white/90 backdrop-blur-sm border border-orange-200/60 rounded-xl py-3 px-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-400 transition-all duration-200 hover:bg-white hover:border-orange-300/80";

//   const sectionStyles = "bg-gradient-to-br from-white/80 to-orange-50/30 backdrop-blur-xl rounded-2xl p-8 border border-orange-200/40 shadow-lg shadow-orange-500/5 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300";

//   const buttonStyles = "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

//   // Handle image upload with preview
//   const handleImageUpload = (event) => {
//     const files = Array.from(event.target.files);
//     setImages(files);
    
//     // Generate previews
//     const previews = files.map(file => {
//       return new Promise((resolve) => {
//         const reader = new FileReader();
//         reader.onload = (e) => resolve({
//           file,
//           url: e.target.result,
//           name: file.name,
//           size: file.size
//         });
//         reader.readAsDataURL(file);
//       });
//     });
    
//     Promise.all(previews).then(setImagePreviews);
//   };

//   // Remove image from preview and files
//   const removeImage = (index) => {
//     const newImages = images.filter((_, i) => i !== index);
//     const newPreviews = imagePreviews.filter((_, i) => i !== index);
//     setImages(newImages);
//     setImagePreviews(newPreviews);
//   };

//   // Event handlers
//   const handleVariantChange = (index, event) => {
//     const newVariants = [...variants];
//     newVariants[index][event.target.name] = event.target.value;
//     setVariants(newVariants);
//   };

//   const handleOptionChange = (vIndex, oIndex, event) => {
//     const newVariants = [...variants];
//     newVariants[vIndex].options[oIndex][event.target.name] = event.target.value;
//     setVariants(newVariants);
//   };

//   const addVariant = () => {
//     setVariants([...variants, { 
//       name: '', 
//       options: [{ value: '', priceModifier: 0, stock: 1, sku: '' }] 
//     }]);
//   };

//   const removeVariant = (index) => {
//     setVariants(variants.filter((_, i) => i !== index));
//   };

//   const addOption = (vIndex) => {
//     const newVariants = [...variants];
//     newVariants[vIndex].options.push({ value: '', priceModifier: 0, stock: 1, sku: '' });
//     setVariants(newVariants);
//   };

//   const removeOption = (vIndex, oIndex) => {
//     const newVariants = [...variants];
//     newVariants[vIndex].options = newVariants[vIndex].options.filter((_, i) => i !== oIndex);
//     setVariants(newVariants);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const productData = new FormData();
//     productData.append('store', storeId);
//     productData.append('category', categoryId);
//     productData.append('name', name);
//     productData.append('description', description);
//     productData.append('basePrice', basePrice);
    
//     for (let i = 0; i < images.length; i++) {
//       productData.append('images', images[i]);
//     }
    
//     productData.append('variants', JSON.stringify(variants));
//     createProduct(productData);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100/30 py-12 px-4">
//       <div className="max-w-6xl mx-auto">
//         {/* Enhanced Header */}
//         <header className="text-center mb-12">
//           <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg shadow-orange-500/30 mb-6">
//             <span className="text-white text-2xl">{Icons.sparkles}</span>
//           </div>
//           <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-orange-700 bg-clip-text text-transparent mb-4">
//             Create New Product
//           </h1>
//           <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
//             Transform your ideas into products. Fill out the details below to add a new item to your store inventory.
//           </p>
//         </header>

//         <div className="space-y-12">
//           <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
//             {/* LEFT COLUMN */}
//             <div className="space-y-8">
//               {/* Product Details Section */}
//               <section className={sectionStyles}>
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="p-2 bg-orange-500/10 rounded-lg text-orange-600">
//                     {Icons.package}
//                   </div>
//                   <h2 className="text-xl font-semibold text-slate-800">Product Details</h2>
//                 </div>
                
//                 <div className="space-y-6">
//                   <div className="space-y-2">
//                     <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
//                       <span className="text-orange-500">{Icons.tag}</span>
//                       Product Name
//                     </label>
//                     <input 
//                       id="name" 
//                       type="text" 
//                       value={name} 
//                       onChange={(e) => setName(e.target.value)} 
//                       placeholder="e.g., Premium Cotton T-Shirt" 
//                       required 
//                       className={inputStyles}
//                     />
//                   </div>
                  
//                   <div className="space-y-2">
//                     <label htmlFor="description" className="block text-sm font-semibold text-slate-700">
//                       Description
//                     </label>
//                     <textarea 
//                       id="description" 
//                       value={description} 
//                       onChange={(e) => setDescription(e.target.value)} 
//                       placeholder="Describe your product's features, benefits, and what makes it special..." 
//                       required 
//                       rows={4} 
//                       className={`${inputStyles} resize-none`}
//                     />
//                   </div>
                  
//                   <div className="space-y-2">
//                     <label htmlFor="basePrice" className="block text-sm font-semibold text-slate-700">
//                       Base Price (USD)
//                     </label>
//                     <div className="relative">
//                       <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">$</span>
//                       <input 
//                         id="basePrice" 
//                         type="number" 
//                         value={basePrice} 
//                         onChange={(e) => setBasePrice(e.target.value)} 
//                         placeholder="24.99" 
//                         required 
//                         min="0" 
//                         step="0.01"
//                         className={`${inputStyles} pl-8`}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </section>

//               {/* Product Images Section */}
//               <section className={sectionStyles}>
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="p-2 bg-orange-500/10 rounded-lg text-orange-600">
//                     {Icons.image}
//                   </div>
//                   <h2 className="text-xl font-semibold text-slate-800">Product Images</h2>
//                   {imagePreviews.length > 0 && (
//                     <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
//                       {imagePreviews.length} image{imagePreviews.length !== 1 ? 's' : ''}
//                     </span>
//                   )}
//                 </div>
                
//                 {/* Image Upload Area */}
//                 <div className="relative mb-6">
//                   <div className="flex justify-center rounded-2xl border-2 border-dashed border-orange-300/60 bg-gradient-to-br from-orange-50/50 to-white/50 px-6 py-12 hover:border-orange-400/80 hover:bg-orange-50/80 transition-all duration-300 group cursor-pointer">
//                     <div className="text-center">
//                       <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-600 group-hover:bg-orange-500/20 transition-colors duration-300 mb-4">
//                         {Icons.upload}
//                       </div>
//                       <div className="flex text-sm text-slate-600">
//                         <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-orange-600 hover:text-orange-500 transition-colors">
//                           <span>Choose files</span>
//                           <input 
//                             id="file-upload" 
//                             name="file-upload" 
//                             type="file" 
//                             className="sr-only" 
//                             multiple 
//                             accept="image/*"
//                             onChange={handleImageUpload} 
//                           />
//                         </label>
//                         <p className="pl-1">or drag and drop</p>
//                       </div>
//                       <p className="text-xs text-slate-500 mt-2">
//                         PNG, JPG, WEBP up to 10MB each
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Image Previews */}
//                 {imagePreviews.length > 0 && (
//                   <div className="space-y-4">
//                     <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
//                       <span className="text-orange-500">{Icons.gallery}</span>
//                       Image Preview{imagePreviews.length !== 1 ? 's' : ''}
//                     </h3>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                       {imagePreviews.map((preview, index) => (
//                         <div key={index} className="relative group">
//                           <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 border-2 border-orange-200/60 shadow-sm">
//                             <img 
//                               src={preview.url} 
//                               alt={preview.name}
//                               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
//                             />
//                           </div>
                          
//                           {/* Image Info Overlay */}
//                           <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-b-xl p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                             <p className="text-white text-xs font-medium truncate mb-1">
//                               {preview.name}
//                             </p>
//                             <p className="text-white/80 text-xs">
//                               {(preview.size / 1024 / 1024).toFixed(1)} MB
//                             </p>
//                           </div>

//                           {/* Remove Button */}
//                           <button
//                             type="button"
//                             onClick={() => removeImage(index)}
//                             className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
//                           >
//                             {Icons.x}
//                           </button>

//                           {/* Primary Image Badge */}
//                           {index === 0 && (
//                             <div className="absolute top-2 left-2 px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded-md shadow-md">
//                               Primary
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
                    
//                     {/* Upload More Button */}
//                     <button
//                       type="button"
//                       onClick={() => document.getElementById('file-upload').click()}
//                       className={`${buttonStyles} w-full bg-white/60 text-orange-600 border border-orange-200 hover:bg-orange-50 hover:border-orange-300 focus:ring-orange-500/60 mt-4`}
//                     >
//                       {Icons.plus}
//                       Add More Images
//                     </button>
//                   </div>
//                 )}
//               </section>
//             </div>

//             {/* RIGHT COLUMN */}
//             <div className="space-y-8">
//               {/* Product Variants Section */}
//               <section className={sectionStyles}>
//                 <div className="flex items-center justify-between mb-6">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 bg-orange-500/10 rounded-lg text-orange-600">
//                       {Icons.layers}
//                     </div>
//                     <h2 className="text-xl font-semibold text-slate-800">Product Variants</h2>
//                   </div>
//                   <button 
//                     type="button" 
//                     onClick={addVariant} 
//                     className={`${buttonStyles} bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 focus:ring-orange-500/60 text-sm`}
//                   >
//                     {Icons.plus}
//                     Add Variant
//                   </button>
//                 </div>
                
//                 <div className="space-y-6">
//                   {variants.map((variant, vIndex) => (
//                     <div key={vIndex} className="p-6 bg-white/60 rounded-2xl border border-orange-100 shadow-sm">
//                       <div className="flex items-center gap-3 mb-4">
//                         <input 
//                           type="text" 
//                           name="name" 
//                           placeholder="Variant Name (e.g., Color, Size)" 
//                           value={variant.name} 
//                           onChange={(e) => handleVariantChange(vIndex, e)} 
//                           className={`${inputStyles} flex-grow`}
//                         />
//                         <button 
//                           type="button" 
//                           onClick={() => removeVariant(vIndex)} 
//                           className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
//                         >
//                           {Icons.trash}
//                         </button>
//                       </div>
                      
//                       <div className="space-y-4 pl-4 border-l-2 border-orange-200">
//                         {variant.options.map((option, oIndex) => (
//                           <div key={oIndex} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-orange-50/50 rounded-xl border border-orange-100/60">
//                             <div className="space-y-3 sm:col-span-2">
//                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                                 <div>
//                                   <label className="block text-xs font-medium text-slate-600 mb-1">Option Value</label>
//                                   <input 
//                                     type="text" 
//                                     name="value" 
//                                     placeholder="e.g., Red, Large" 
//                                     value={option.value} 
//                                     onChange={(e) => handleOptionChange(vIndex, oIndex, e)} 
//                                     className={inputStyles}
//                                   />
//                                 </div>
//                                 <div>
//                                   <label className="block text-xs font-medium text-slate-600 mb-1">SKU</label>
//                                   <input 
//                                     type="text" 
//                                     name="sku" 
//                                     placeholder="PROD-RED-001" 
//                                     value={option.sku} 
//                                     onChange={(e) => handleOptionChange(vIndex, oIndex, e)} 
//                                     required 
//                                     className={inputStyles}
//                                   />
//                                 </div>
//                               </div>
//                               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                                 <div>
//                                   <label className="block text-xs font-medium text-slate-600 mb-1">Price Modifier ($)</label>
//                                   <input 
//                                     type="number" 
//                                     name="priceModifier" 
//                                     placeholder="+5.00" 
//                                     value={option.priceModifier} 
//                                     onChange={(e) => handleOptionChange(vIndex, oIndex, e)} 
//                                     className={inputStyles}
//                                     step="0.01"
//                                   />
//                                 </div>
//                                 <div>
//                                   <label className="block text-xs font-medium text-slate-600 mb-1">Stock</label>
//                                   <input 
//                                     type="number" 
//                                     name="stock" 
//                                     placeholder="100" 
//                                     value={option.stock} 
//                                     onChange={(e) => handleOptionChange(vIndex, oIndex, e)} 
//                                     className={inputStyles}
//                                     min="0"
//                                   />
//                                 </div>
//                                 <div className="flex items-end">
//                                   <button 
//                                     type="button" 
//                                     onClick={() => removeOption(vIndex, oIndex)} 
//                                     className="w-full p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
//                                   >
//                                     {Icons.trash}
//                                   </button>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
                        
//                         <button 
//                           type="button" 
//                           onClick={() => addOption(vIndex)} 
//                           className={`${buttonStyles} w-full bg-white/60 text-orange-600 border border-orange-200 hover:bg-orange-50 hover:border-orange-300 focus:ring-orange-500/60`}
//                         >
//                           {Icons.plus}
//                           Add Option
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </section>
//             </div>
//           </div>

//           {/* Submit Section */}
//           <div className="pt-8 border-t-2 border-orange-100">
//             <div className="flex flex-col items-center space-y-6">
//               <button 
//                 type="button"
//                 onClick={handleSubmit} 
//                 disabled={isPending} 
//                 className={`${buttonStyles} w-full max-w-md bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-lg py-4 px-8 rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:from-orange-600 hover:to-orange-700 focus:ring-orange-500/60 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200`}
//               >
//                 {isPending ? (
//                   <>
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                     Creating Product...
//                   </>
//                 ) : (
//                   <>
//                     {Icons.sparkles}
//                     Create Product
//                   </>
//                 )}
//               </button>
              
//               {(isSuccess || hookSuccess) && (
//                 <div className="flex items-center gap-2 px-6 py-3 bg-green-50 text-green-700 rounded-xl border border-green-200">
//                   <span className="text-green-600">{Icons.check}</span>
//                   <p className="font-medium">Product created successfully!</p>
//                 </div>
//               )}
              
//               {isError && (
//                 <div className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-700 rounded-xl border border-red-200">
//                   <span className="text-red-600">{Icons.x}</span>
//                   <p className="font-medium">Error: {error?.message || 'Something went wrong'}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EnhancedCreateProductForm;