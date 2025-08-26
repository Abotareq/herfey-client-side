// // "use client";

// // import { useState, useMemo } from "react";
// // import { useAddItemToCart } from "@/service/cart";
// // import { Button } from "@/components/ui/button";
// // import {
// //   AlertDialog,
// //   AlertDialogAction,
// //   AlertDialogCancel,
// //   AlertDialogContent,
// //   AlertDialogDescription,
// //   AlertDialogFooter,
// //   AlertDialogHeader,
// //   AlertDialogTitle,
// //   AlertDialogTrigger,
// // } from "@/components/ui/alert-dialog";

// // export default function ProductCard() {
// //   const product = {
// //   _id: "689cf90b7ca2eb630ef984fa",
// //   store: "689b23632dc0fef270cdcf33",
// //   name: "diamond 001",
// //   status: "pending",
// //   slug: "diamond-001",
// //   description: "High quality ",
// //   basePrice: 50,
// //   discountPrice: 0,
// //   category: "68895bd225e59a1915813ce4",
// //   images: [
// //     "https://res.cloudinary.com/dfg4uwokf/image/upload/v1755117835/herfy/d1jg3as97shxpap7kpmb.png"
// //   ],
// //   variants: [
// //     {
// //       name: "Color",
// //       isDeleted: false,
// //       options: [
// //         {
// //           value: "Red",
// //           priceModifier: 0,
// //           stock: 230,
// //           sku: "TSHIRT-RED-001",
// //           _id: "689cf90b7ca2eb630ef984fc"
// //         },
// //         {
// //           value: "Blue",
// //           priceModifier: 2.5,
// //           stock: 100,
// //           sku: "TSHIRT-BLU-002",
// //           _id: "689cf90b7ca2eb630ef984fd"
// //         }
// //       ],
// //       _id: "689cf90b7ca2eb630ef984fb"
// //     },
// //     {
// //       name: "Size",
// //       isDeleted: false,
// //       options: [
// //         {
// //           value: "Small",
// //           priceModifier: 0,
// //           stock: 8,
// //           sku: "TSHIRT-SML-003",
// //           _id: "689cf90b7ca2eb630ef984ff"
// //         },
// //         {
// //           value: "Large",
// //           priceModifier: 3,
// //           stock: 6,
// //           sku: "TSHIRT-LRG-004",
// //           _id: "689cf90b7ca2eb630ef98500"
// //         }
// //       ],
// //       _id: "689cf90b7ca2eb630ef984fe"
// //     }
// //   ],
// //   averageRating: 0,
// //   reviewCount: 0,
// //   createdBy: "68977a32da64448f47935fa2",
// //   isDeleted: false,
// //   createdAt: "2025-08-13T20:43:55.069Z",
// //   updatedAt: "2025-08-20T11:12:35.609Z",
// //   __v: 0
// // };
// //   const [quantity, setQuantity] = useState(1);
// //   const [selectedVariants, setSelectedVariants] = useState({});
// //   const addToCartMutation = useAddItemToCart();

// //   //  Calculate final price
// //   const finalPrice = useMemo(() => {
// //     let modifiers = 0;
// //     product.variants?.forEach((variant) => {
// //       const selected = selectedVariants[variant.name];
// //       const opt = variant.options.find((o) => o.value === selected);
// //       if (opt) modifiers += opt.priceModifier;
// //     });
// //     return (product.basePrice + modifiers) * quantity;
// //   }, [product, selectedVariants, quantity]);

// //   const handleVariantChange = (variantName, value) => {
// //     setSelectedVariants((prev) => ({
// //       ...prev,
// //       [variantName]: value,
// //     }));
// //   };

// //   const handleAddToCart = () => {
// //     const formattedVariants = Object.entries(selectedVariants).map(
// //       ([name, value]) => ({ name, value })
// //     );

// //     addToCartMutation.mutate({
// //       product: product._id,
// //       quantity,
// //       variant: formattedVariants,
// //     });
// //   };

// //   return (
// //     <div className="border rounded-2xl shadow-md p-4 flex flex-col space-y-4">
// //       {/* Product Image */}
// //       <img
// //         src={product.images?.[0]}
// //         alt={product.name}
// //         className="w-full h-48 object-cover rounded-xl"
// //       />

// //       {/* Product Info */}
// //       <div>
// //         <h3 className="text-lg font-semibold">{product.name}</h3>
// //         <p className="text-gray-500 text-sm">{product.description}</p>

// //         {/* Dynamic Price */}
// //         <span className="text-xl font-bold mt-2 block">
// //           ${finalPrice.toFixed(2)}
// //         </span>
// //       </div>

// //       {/* Variant Selectors */}
// //       <div className="space-y-3">
// //         {product.variants?.map((variant) => (
// //           <div key={variant._id.$oid} className="flex flex-col">
// //             <label className="text-sm font-semibold mb-1">{variant.name}</label>
// //             <select
// //               className="border rounded-lg px-3 py-2"
// //               onChange={(e) =>
// //                 handleVariantChange(variant.name, e.target.value)
// //               }
// //               value={selectedVariants[variant.name] || ""}
// //             >
// //               <option value="">Select {variant.name}</option>
// //               {variant.options.map((opt) => (
// //                 <option key={opt._id.$oid} value={opt.value}>
// //                   {opt.value}{" "}
// //                   {opt.priceModifier > 0 ? `(+${opt.priceModifier}$)` : ""}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Quantity Control */}
// //       <div className="flex items-center gap-2">
// //         <Button
// //           variant="outline"
// //           size="sm"
// //           onClick={() => setQuantity((q) => Math.max(1, q - 1))}
// //         >
// //           -
// //         </Button>
// //         <span className="px-4">{quantity}</span>
// //         <Button
// //           variant="outline"
// //           size="sm"
// //           onClick={() => setQuantity((q) => q + 1)}
// //         >
// //           +
// //         </Button>
// //       </div>

// //       {/* Add to Cart with Confirmation */}
// //       <AlertDialog>
// //         <AlertDialogTrigger asChild>
// //           <Button
// //             className="w-full"
// //             disabled={
// //               addToCartMutation.isPending ||
// //               Object.keys(selectedVariants).length < product.variants.length
// //             }
// //           >
// //             {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
// //           </Button>
// //         </AlertDialogTrigger>
// //         <AlertDialogContent>
// //           <AlertDialogHeader>
// //             <AlertDialogTitle>Add to Cart</AlertDialogTitle>
// //             <AlertDialogDescription>
// //               Do you want to add <b>{product.name}</b> (x{quantity}) with:{" "}
// //               {Object.entries(selectedVariants)
// //                 .map(([name, value]) => `${name}: ${value}`)
// //                 .join(", ")}{" "}
// //               for <b>${finalPrice.toFixed(2)}</b>?
// //             </AlertDialogDescription>
// //           </AlertDialogHeader>
// //           <AlertDialogFooter>
// //             <AlertDialogCancel>Cancel</AlertDialogCancel>
// //             <AlertDialogAction onClick={handleAddToCart}>
// //               Confirm
// //             </AlertDialogAction>
// //           </AlertDialogFooter>
// //         </AlertDialogContent>
// //       </AlertDialog>
// //     </div>
// //   );
// // }

// "use client";

// import { useState, useMemo } from "react";
// import { useAddItemToCart } from "@/service/cart";
// import { addToGuestCart } from "@/service/cart"; // import guest cart util
// import { useAuth } from "../../context/AuthContext"; // import auth context
// import { Button } from "@/components/ui/button";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";

// export default function ProductCard() {
//   const { user } = useAuth(); // ✅ check if user logged in
//   const product = {
//     _id: "689cf90b7ca2eb630ef984fa",
//     name: "diamond 001",
//     description: "High quality ",
//     basePrice: 50,
//     images: [
//       "https://res.cloudinary.com/dfg4uwokf/image/upload/v1755117835/herfy/d1jg3as97shxpap7kpmb.png",
//     ],
//     variants: [
//       {
//         name: "Color",
//         options: [
//           {
//             value: "Red",
//             priceModifier: 0,
//             stock: 230,
//             _id: "689cf90b7ca2eb630ef984fc",
//           },
//           {
//             value: "Blue",
//             priceModifier: 2.5,
//             stock: 100,
//             _id: "689cf90b7ca2eb630ef984fd",
//           },
//         ],
//         _id: "689cf90b7ca2eb630ef984fb",
//       },
//       {
//         name: "Size",
//         options: [
//           {
//             value: "Small",
//             priceModifier: 0,
//             stock: 8,
//             _id: "689cf90b7ca2eb630ef984ff",
//           },
//           {
//             value: "Large",
//             priceModifier: 3,
//             stock: 6,
//             _id: "689cf90b7ca2eb630ef98500",
//           },
//         ],
//         _id: "689cf90b7ca2eb630ef984fe",
//       },
//     ],
//   };

//   const [quantity, setQuantity] = useState(1);
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const addToCartMutation = useAddItemToCart();

//   // Calculate final price
//   const finalPrice = useMemo(() => {
//     let modifiers = 0;
//     product.variants?.forEach((variant) => {
//       const selected = selectedVariants[variant.name];
//       const opt = variant.options.find((o) => o.value === selected);
//       if (opt) modifiers += opt.priceModifier;
//     });
//     return (product.basePrice + modifiers) * quantity;
//   }, [product, selectedVariants, quantity]);

//   const handleVariantChange = (variantName, value) => {
//     setSelectedVariants((prev) => ({
//       ...prev,
//       [variantName]: value,
//     }));
//   };

//   const handleAddToCart = () => {
//     const formattedVariants = Object.entries(selectedVariants).map(
//       ([name, value]) => ({ name, value })
//     );

//     if (user) {
//       // ✅ Authenticated: send to backend
//       const item = {
//         product: product._id,
//         quantity,
//         variant: formattedVariants,
//         // price: product.basePrice, // useful for guest cart
//       };
//       addToCartMutation.mutate(item);
//     } else {
//       const item = {
//         product: product,
//         quantity,
//         variant: formattedVariants,
//         price: product.basePrice, // useful for guest cart
//       };
//       // 🚀 Guest: save to localStorage
//       addToGuestCart(item);
//       alert("Item added to guest cart!");
//     }
//   };

//   return (
//     <div className="border rounded-2xl shadow-md p-4 flex flex-col space-y-4">
//       {/* Product Image */}
//       <img
//         src={product.images?.[0]}
//         alt={product.name}
//         className="w-full h-48 object-cover rounded-xl"
//       />

//       {/* Product Info */}
//       <div>
//         <h3 className="text-lg font-semibold">{product.name}</h3>
//         <p className="text-gray-500 text-sm">{product.description}</p>
//         <span className="text-xl font-bold mt-2 block">
//           ${finalPrice.toFixed(2)}
//         </span>
//       </div>

//       {/* Variant Selectors */}
//       <div className="space-y-3">
//         {product.variants?.map((variant) => (
//           <div key={variant._id} className="flex flex-col">
//             <label className="text-sm font-semibold mb-1">{variant.name}</label>
//             <select
//               className="border rounded-lg px-3 py-2"
//               onChange={(e) =>
//                 handleVariantChange(variant.name, e.target.value)
//               }
//               value={selectedVariants[variant.name] || ""}
//             >
//               <option value="">Select {variant.name}</option>
//               {variant.options.map((opt) => (
//                 <option key={opt._id} value={opt.value}>
//                   {opt.value}{" "}
//                   {opt.priceModifier > 0 ? `(+${opt.priceModifier}$)` : ""}
//                 </option>
//               ))}
//             </select>
//           </div>
//         ))}
//       </div>

//       {/* Quantity Control */}
//       <div className="flex items-center gap-2">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => setQuantity((q) => Math.max(1, q - 1))}
//         >
//           -
//         </Button>
//         <span className="px-4">{quantity}</span>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => setQuantity((q) => q + 1)}
//         >
//           +
//         </Button>
//       </div>

//       {/* Add to Cart with Confirmation */}
//       <AlertDialog>
//         <AlertDialogTrigger asChild>
//           <Button
//             className="w-full"
//             disabled={
//               addToCartMutation.isPending ||
//               Object.keys(selectedVariants).length < product.variants.length
//             }
//           >
//             {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
//           </Button>
//         </AlertDialogTrigger>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Add to Cart</AlertDialogTitle>
//             <AlertDialogDescription>
//               Do you want to add <b>{product.name}</b> (x{quantity}) with:{" "}
//               {Object.entries(selectedVariants)
//                 .map(([name, value]) => `${name}: ${value}`)
//                 .join(", ")}{" "}
//               for <b>${finalPrice.toFixed(2)}</b>?
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={handleAddToCart}>
//               Confirm
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }
'use client';
import DiscountedProducts from './DiscountedProducts';
import TopRatedProducts from './TopRatedProducts';
import MostRecentProducts from './MostRecentProducts';
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';

// Main BestSeller Component
export default function BestSeller() {
  const router = useRouter();
  const t = useTranslations('BestSeller')
  return (
    <div className="w-full bg-gray-50 py-12 px-4">
      {/* Title Section */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-4 text-center text-gray-900">
          {t('bestseller')}
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          {t('desc')}
        </p>

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <DiscountedProducts />
          <TopRatedProducts />
          <MostRecentProducts />
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 text-center">


          <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-3xl p-8 lg:p-12 text-white shadow-2xl shadow-orange-200">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

            {/* Content */}
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6 backdrop-blur-sm">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>

              <h3 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                {t('explore')}
              </h3>

              <p className="text-orange-100 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                {t('exploredesc')}
              </p>

              <button
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 hover:scale-105"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/products`);
                }}
              >
                <span className="relative z-10">{t('browseall')}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}