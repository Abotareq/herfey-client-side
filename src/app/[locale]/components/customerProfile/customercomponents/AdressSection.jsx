"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useUpdateUser, useGetUserById } from "@/service/user";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocale, useTranslations } from "use-intl";

function AddressesSection() {
  const t = useTranslations("address");
  const t1 = useTranslations("defaultaddress");
  const locale =useLocale();
  const isArabic = locale === "ar";
  const { user, loading: authLoading } = useAuth();

  // Fix 1: Only enable query when user ID is available
  const {
    data,
    isLoading: userLoading,
    error,
  } = useGetUserById(user?.id, {
    enabled: !!user?.id, // Only run query when user ID exists
    keepPreviousData: true,
    placeholderData: { data: { user: { addresses: [] } } }, // Fix placeholder structure
  });

  console.log("Data response:", data);
  const updateUser = useUpdateUser();

  // Fix 2: Better fallback handling
  const addresses = data?.data?.user?.addresses || [];
  console.log("Addresses:", addresses);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    buildingNo: "",
    street: "",
    nearestLandMark: "",
    city: "",
    governorate: "",
    country: "Egypt",
    addressType: "home",
    isDefault: false,
  });

  const resetForm = () => {
    setNewAddress({
      buildingNo: "",
      street: "",
      nearestLandMark: "",
      city: "",
      governorate: "",
      country: "Egypt",
      addressType: "home",
      isDefault: false,
    });
    setEditingAddress(null);
    setShowAddressForm(false);
  };

  const handleAddOrUpdate = () => {
    // Validation
    if (!newAddress.buildingNo || !newAddress.street || !newAddress.city) {
      toast.error(t('errorf'));
      return;
    }

    let updatedAddresses;
    if (editingAddress) {
      // Update existing address
      updatedAddresses = addresses.map((addr) =>
        addr._id === editingAddress._id
          ? { ...newAddress, _id: editingAddress._id }
          : addr
      );
    } else {
      // Add new address - handle default logic
      const addressToAdd = { ...newAddress, _id: Date.now().toString() };

      // If this is set as default, make sure all others are not default
      if (addressToAdd.isDefault) {
        updatedAddresses = [
          ...addresses.map((addr) => ({ ...addr, isDefault: false })),
          addressToAdd,
        ];
      } else {
        // If no addresses exist, make this one default
        if (addresses.length === 0) {
          addressToAdd.isDefault = true;
        }
        updatedAddresses = [...addresses, addressToAdd];
      }
    }

    // Use the correct user ID and clean the addresses data
    const cleanedAddresses = updatedAddresses.map((addr) => {
      // Remove temporary IDs for new addresses
      if (typeof addr._id === "string" && addr._id.length > 12) {
        const { _id, ...addressWithoutId } = addr;
        return addressWithoutId;
      }
      return addr;
    });

    updateUser.mutate(
      { userId: user.id || user._id, addresses: cleanedAddresses },
      {
        onSuccess: () => {
          toast.success(t("success"));
          resetForm();
        },
        onError: (error) => {
          toast.error(t('erroru'), error);
        },
      }
    );
  };

  const handleDeleteAddress = (addressId) => {
    // Destructure and clean up remaining addresses
    const updatedAddresses = addresses
      .filter((addr) => addr._id !== addressId)
      .map((address) => {
        const {
          buildingNo,
          street,
          nearestLandMark,
          city,
          governorate,
          country,
          addressType,
          isDefault,
          _id,
        } = address;

        const cleanAddress = {
          buildingNo,
          street,
          nearestLandMark,
          city,
          governorate,
          country,
          addressType,
          isDefault,
        };

        // Include _id only if it's a valid MongoDB ObjectId
        if (
          _id &&
          typeof _id === "string" &&
          _id.length === 24 &&
          /^[0-9a-fA-F]{24}$/.test(_id)
        ) {
          cleanAddress._id = _id;
        }

        return cleanAddress;
      });

    updateUser.mutate(
      { userId: user.id || user._id, addresses: updatedAddresses },
      {
        onSuccess: () => {
          toast.success(t('deletesucess'));
        },
        onError: (error) => {
          toast.error(t('deletef'), error);
        },
      }
    );
  };

  const handleSetDefaultAddress = (addressId) => {
    // Destructure and clean up addresses while setting default
    const updatedAddresses = addresses.map((address) => {
      const {
        buildingNo,
        street,
        nearestLandMark,
        city,
        governorate,
        country,
        addressType,
        _id,
      } = address;

      const cleanAddress = {
        buildingNo,
        street,
        nearestLandMark,
        city,
        governorate,
        country,
        addressType,
        isDefault: _id === addressId, // Set as default only if this is the selected address
      };

      // Include _id only if it's a valid MongoDB ObjectId
      if (
        _id &&
        typeof _id === "string" &&
        _id.length === 24 &&
        /^[0-9a-fA-F]{24}$/.test(_id)
      ) {
        cleanAddress._id = _id;
      }

      return cleanAddress;
    });

    updateUser.mutate(
      { userId: user.id || user._id, addresses: updatedAddresses },
      {
        onSuccess: () => {
          toast.success("Default address updated successfully");
        },
        onError: (error) => {
          toast.error("Failed to set default address:", error);
        },
      }
    );
  };

  // Fix 3: Better loading state handling
  if (authLoading) {
    return (
      <>
        {" "}
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-8 w-40 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Address Form Skeleton */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array(6)
                .fill()
                .map((_, index) => (
                  <div
                    key={index}
                    className="h-12 w-full bg-slate-200 rounded-lg animate-pulse"
                  ></div>
                ))}
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <div className="h-4 w-4 bg-slate-200 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <div className="h-10 w-20 bg-slate-200 rounded-lg animate-pulse"></div>
              <div className="h-10 w-20 bg-slate-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Address List Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array(2)
              .fill()
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative"
                >
                  <div className="absolute top-4 right-4 h-5 w-16 bg-slate-200 rounded-full animate-pulse"></div>
                  <div className="space-y-2">
                    {Array(5)
                      .fill()
                      .map((_, i) => (
                        <div
                          key={i}
                          className="h-4 w-3/4 bg-slate-200 rounded animate-pulse"
                        ></div>
                      ))}
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                    <div className="flex space-x-2">
                      <div className="h-4 w-12 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-4 w-12 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* No Addresses Skeleton (optional, shown when no addresses) */}
          <div className="col-span-full text-center py-8">
            <div className="h-4 w-64 mx-auto bg-slate-200 rounded animate-pulse"></div>
          </div>
        </div>
      </>
    );
  }

  if (!user?.id) {
    return (
      <>
        {" "}
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-8 w-40 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Address Form Skeleton */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array(6)
                .fill()
                .map((_, index) => (
                  <div
                    key={index}
                    className="h-12 w-full bg-slate-200 rounded-lg animate-pulse"
                  ></div>
                ))}
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <div className="h-4 w-4 bg-slate-200 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <div className="h-10 w-20 bg-slate-200 rounded-lg animate-pulse"></div>
              <div className="h-10 w-20 bg-slate-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Address List Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array(2)
              .fill()
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative"
                >
                  <div className="absolute top-4 right-4 h-5 w-16 bg-slate-200 rounded-full animate-pulse"></div>
                  <div className="space-y-2">
                    {Array(5)
                      .fill()
                      .map((_, i) => (
                        <div
                          key={i}
                          className="h-4 w-3/4 bg-slate-200 rounded animate-pulse"
                        ></div>
                      ))}
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                    <div className="flex space-x-2">
                      <div className="h-4 w-12 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-4 w-12 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* No Addresses Skeleton (optional, shown when no addresses) */}
          <div className="col-span-full text-center py-8">
            <div className="h-4 w-64 mx-auto bg-slate-200 rounded animate-pulse"></div>
          </div>
        </div>
      </>
    );
  }

  if (userLoading) {
    return (
      <>
        {" "}
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-8 w-40 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Address Form Skeleton */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array(6)
                .fill()
                .map((_, index) => (
                  <div
                    key={index}
                    className="h-12 w-full bg-slate-200 rounded-lg animate-pulse"
                  ></div>
                ))}
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <div className="h-4 w-4 bg-slate-200 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <div className="h-10 w-20 bg-slate-200 rounded-lg animate-pulse"></div>
              <div className="h-10 w-20 bg-slate-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Address List Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array(2)
              .fill()
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative"
                >
                  <div className="absolute top-4 right-4 h-5 w-16 bg-slate-200 rounded-full animate-pulse"></div>
                  <div className="space-y-2">
                    {Array(5)
                      .fill()
                      .map((_, i) => (
                        <div
                          key={i}
                          className="h-4 w-3/4 bg-slate-200 rounded animate-pulse"
                        ></div>
                      ))}
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                    <div className="flex space-x-2">
                      <div className="h-4 w-12 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-4 w-12 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* No Addresses Skeleton (optional, shown when no addresses) */}
          <div className="col-span-full text-center py-8">
            <div className="h-4 w-64 mx-auto bg-slate-200 rounded animate-pulse"></div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <p>
        {t("error")}: {error.message}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-slate-900">{t("delivery")}</h3>
        <button
          onClick={() => setShowAddressForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>{t("newaddress")}</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAddressForm || editingAddress) && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold mb-4">
            {editingAddress ? "Edit Address" : "Add New Address"}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              value={newAddress.buildingNo}
              onChange={(e) =>
                setNewAddress((prev) => ({
                  ...prev,
                  buildingNo: e.target.value,
                }))
              }
              placeholder={t("building")}
              className="px-4 py-3 border rounded-lg"
            />
            <input
              type="text"
              value={newAddress.street}
              onChange={(e) =>
                setNewAddress((prev) => ({ ...prev, street: e.target.value }))
              }
              placeholder={t("street")}
              className="px-4 py-3 border rounded-lg"
            />
            <input
              type="text"
              value={newAddress.nearestLandMark}
              onChange={(e) =>
                setNewAddress((prev) => ({
                  ...prev,
                  nearestLandMark: e.target.value,
                }))
              }
              placeholder={t("landmark")}
              className="px-4 py-3 border rounded-lg"
            />
            <input
              type="text"
              value={newAddress.city}
              onChange={(e) =>
                setNewAddress((prev) => ({ ...prev, city: e.target.value }))
              }
              placeholder={t("city")}
              className="px-4 py-3 border rounded-lg"
            />
            <input
              type="text"
              value={newAddress.governorate}
              onChange={(e) =>
                setNewAddress((prev) => ({
                  ...prev,
                  governorate: e.target.value,
                }))
              }
              placeholder={t("government")}
              className="px-4 py-3 border rounded-lg"
            />
            <select
              value={newAddress.addressType}
              onChange={(e) =>
                setNewAddress((prev) => ({
                  ...prev,
                  addressType: e.target.value,
                }))
              }
              className="px-4 py-3 border rounded-lg"
            >
              <option value="home">{t("home")}</option>
              <option value="work">{t("work")}</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newAddress.isDefault}
                onChange={(e) =>
                  setNewAddress((prev) => ({
                    ...prev,
                    isDefault: e.target.checked,
                  }))
                }
              />
              <span>{t("defaultaddress")}</span>
            </label>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button onClick={resetForm} className="px-6 py-2 border rounded-lg">
              {t("cancel")}
            </button>
            <button
              onClick={handleAddOrUpdate}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              {editingAddress ? t("Update") : t("Add")}
            </button>
          </div>
        </div>
      )}

      {/* Address List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-lg">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {t("noAddressesFound")}
            </h3>
            <p className="text-slate-600">{t("noAddressesSubtext")}</p>
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address._id}
              className="bg-white rounded-2xl p-6 border shadow-sm relative"
            >
              {address.isDefault && (
                <div className={`absolute top-4 ${
                          isArabic ? "left-4" : "right-4"
                        } bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium`}>
                  {t1("default")}
                </div>
              )}
              <div className="space-y-2 text-slate-600">
                <p>
                  {t1("building")}: {address.buildingNo}
                </p>
                <p>
                  {t1("street")}: {address.street}
                </p>
                {address.nearestLandMark && (
                  <p>
                    {t("landmark")}: {address.nearestLandMark}
                  </p>
                )}
                <p>
                  {t1("city")}: {address.city}
                </p>
                <p>
                  {t("government")}: {address.governorate}
                </p>
                <p>
                  {t("type")}: {address.addressType}
                </p>
              </div>
              <div className="mt-4 flex justify-between">
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefaultAddress(address._id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {t("defaultaddress")}
                  </button>
                )}
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingAddress(address);
                      setNewAddress(address);
                      setShowAddressForm(true);
                    }}
                    className="text-slate-600 hover:text-slate-800"
                  >
                    {t("Edit")}
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    {t("Delete")}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        <Toaster position={`${isArabic ? "top-right" : "top-left"}`} />
      </div>
    </div>
  );
}

export default AddressesSection;
