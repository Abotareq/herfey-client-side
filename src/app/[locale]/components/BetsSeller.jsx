"use client";

import { useState, useMemo } from "react";
import { useAddItemToCart } from "@/service/cart";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProductCard() {
  const product = {
  _id: "689cf90b7ca2eb630ef984fa",
  store: "689b23632dc0fef270cdcf33",
  name: "diamond 001",
  status: "pending",
  slug: "diamond-001",
  description: "High quality ",
  basePrice: 50,
  discountPrice: 0,
  category: "68895bd225e59a1915813ce4",
  images: [
    "https://res.cloudinary.com/dfg4uwokf/image/upload/v1755117835/herfy/d1jg3as97shxpap7kpmb.png"
  ],
  variants: [
    {
      name: "Color",
      isDeleted: false,
      options: [
        {
          value: "Red",
          priceModifier: 0,
          stock: 230,
          sku: "TSHIRT-RED-001",
          _id: "689cf90b7ca2eb630ef984fc"
        },
        {
          value: "Blue",
          priceModifier: 2.5,
          stock: 100,
          sku: "TSHIRT-BLU-002",
          _id: "689cf90b7ca2eb630ef984fd"
        }
      ],
      _id: "689cf90b7ca2eb630ef984fb"
    },
    {
      name: "Size",
      isDeleted: false,
      options: [
        {
          value: "Small",
          priceModifier: 0,
          stock: 8,
          sku: "TSHIRT-SML-003",
          _id: "689cf90b7ca2eb630ef984ff"
        },
        {
          value: "Large",
          priceModifier: 3,
          stock: 6,
          sku: "TSHIRT-LRG-004",
          _id: "689cf90b7ca2eb630ef98500"
        }
      ],
      _id: "689cf90b7ca2eb630ef984fe"
    }
  ],
  averageRating: 0,
  reviewCount: 0,
  createdBy: "68977a32da64448f47935fa2",
  isDeleted: false,
  createdAt: "2025-08-13T20:43:55.069Z",
  updatedAt: "2025-08-20T11:12:35.609Z",
  __v: 0
};
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const addToCartMutation = useAddItemToCart();

  //  Calculate final price
  const finalPrice = useMemo(() => {
    let modifiers = 0;
    product.variants?.forEach((variant) => {
      const selected = selectedVariants[variant.name];
      const opt = variant.options.find((o) => o.value === selected);
      if (opt) modifiers += opt.priceModifier;
    });
    return (product.basePrice + modifiers) * quantity;
  }, [product, selectedVariants, quantity]);

  const handleVariantChange = (variantName, value) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantName]: value,
    }));
  };

  const handleAddToCart = () => {
    const formattedVariants = Object.entries(selectedVariants).map(
      ([name, value]) => ({ name, value })
    );

    addToCartMutation.mutate({
      product: product._id,
      quantity,
      variant: formattedVariants,
    });
  };

  return (
    <div className="border rounded-2xl shadow-md p-4 flex flex-col space-y-4">
      {/* Product Image */}
      <img
        src={product.images?.[0]}
        alt={product.name}
        className="w-full h-48 object-cover rounded-xl"
      />

      {/* Product Info */}
      <div>
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-500 text-sm">{product.description}</p>

        {/* Dynamic Price */}
        <span className="text-xl font-bold mt-2 block">
          ${finalPrice.toFixed(2)}
        </span>
      </div>

      {/* Variant Selectors */}
      <div className="space-y-3">
        {product.variants?.map((variant) => (
          <div key={variant._id.$oid} className="flex flex-col">
            <label className="text-sm font-semibold mb-1">{variant.name}</label>
            <select
              className="border rounded-lg px-3 py-2"
              onChange={(e) =>
                handleVariantChange(variant.name, e.target.value)
              }
              value={selectedVariants[variant.name] || ""}
            >
              <option value="">Select {variant.name}</option>
              {variant.options.map((opt) => (
                <option key={opt._id.$oid} value={opt.value}>
                  {opt.value}{" "}
                  {opt.priceModifier > 0 ? `(+${opt.priceModifier}$)` : ""}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Quantity Control */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
        >
          -
        </Button>
        <span className="px-4">{quantity}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setQuantity((q) => q + 1)}
        >
          +
        </Button>
      </div>

      {/* Add to Cart with Confirmation */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            className="w-full"
            disabled={
              addToCartMutation.isPending ||
              Object.keys(selectedVariants).length < product.variants.length
            }
          >
            {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add to Cart</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to add <b>{product.name}</b> (x{quantity}) with:{" "}
              {Object.entries(selectedVariants)
                .map(([name, value]) => `${name}: ${value}`)
                .join(", ")}{" "}
              for <b>${finalPrice.toFixed(2)}</b>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddToCart}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { useAddItemToCart } from "@/service/cart";
import { addToGuestCart } from "@/service/cart"; // import guest cart util
import { useAuth } from "../../context/AuthContext"; // import auth context
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProductCard() {
  const { user } = useAuth(); // ✅ check if user logged in
  const product = {
    _id: "689cf90b7ca2eb630ef984fa",
    name: "diamond 001",
    description: "High quality ",
    basePrice: 50,
    images: [
      "https://res.cloudinary.com/dfg4uwokf/image/upload/v1755117835/herfy/d1jg3as97shxpap7kpmb.png",
    ],
    variants: [
      {
        name: "Color",
        options: [
          {
            value: "Red",
            priceModifier: 0,
            stock: 230,
            _id: "689cf90b7ca2eb630ef984fc",
          },
          {
            value: "Blue",
            priceModifier: 2.5,
            stock: 100,
            _id: "689cf90b7ca2eb630ef984fd",
          },
        ],
        _id: "689cf90b7ca2eb630ef984fb",
      },
      {
        name: "Size",
        options: [
          {
            value: "Small",
            priceModifier: 0,
            stock: 8,
            _id: "689cf90b7ca2eb630ef984ff",
          },
          {
            value: "Large",
            priceModifier: 3,
            stock: 6,
            _id: "689cf90b7ca2eb630ef98500",
          },
        ],
        _id: "689cf90b7ca2eb630ef984fe",
      },
    ],
  };

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
//         price: product.basePrice, // useful for guest cart
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
