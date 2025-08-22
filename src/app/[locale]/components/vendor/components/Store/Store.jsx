"use client";
import { useState } from "react";
import { StoreManagement } from "./StoreMangement";
import StoreDetailsView from "./StoreView";
import {
  useVendorStores,
  useCreateStore,
  useUpdateStore,
  useDeleteStore,
} from "@/service/store";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"; // shadcn/ui
import { useTranslations } from "use-intl";

export default function StoresSection() {
  const [showStoreForm, setShowStoreForm] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [modal, setModal] = useState(null); // 'details' or 'manage'
  const [selectedStore, setSelectedStore] = useState(null);
  const [newStore, setNewStore] = useState({
    status: "pending",
    categorieCount: 0,
    couponsUsed: 0,
    productCount: 0,
    ordersCount: 0,
    name: "",
    description: "",
    logoUrl: null,
    address: {
      city: "",
      postalCode: "",
      street: "",
    },
    location: {
      type: "Point",
      coordinates: [0, 0],
    },
    policies: {
      shipping: "",
      returns: "",
    },
  });

  // React Query hooks
  const {
    data: vendorStoresData,
    isLoading: loading,
    error: fetchError,
  } = useVendorStores();

  const createStoreMutation = useCreateStore();
  const updateStoreMutation = useUpdateStore();
  const deleteStoreMutation = useDeleteStore();

  // Extract stores from response
  const userStores = vendorStoresData?.stores || vendorStoresData?.data?.stores || [];

  // Combined error handling
  const error = fetchError?.response?.data?.message || 
                fetchError?.message || 
                createStoreMutation.error?.response?.data?.message ||
                createStoreMutation.error?.message ||
                updateStoreMutation.error?.response?.data?.message ||
                updateStoreMutation.error?.message ||
                deleteStoreMutation.error?.response?.data?.message ||
                deleteStoreMutation.error?.message ||
                null;

  const submitting = createStoreMutation.isPending || updateStoreMutation.isPending;

  const handleAddStore = async () => {
    if (!newStore.name || !newStore.description) {
      return;
    }

    try {
      // Create FormData for file upload support
      const formData = new FormData();

      formData.append("name", newStore.name);
      formData.append("description", newStore.description);

      // logoUrl can be file or string
      if (newStore.logoUrl instanceof File) {
        formData.append("logoUrl", newStore.logoUrl);
      } else if (typeof newStore.logoUrl === "string") {
        formData.append("logoUrl", newStore.logoUrl);
      }

      formData.append("address", JSON.stringify(newStore.address));
      formData.append("location", JSON.stringify(newStore.location));
      formData.append("policies", JSON.stringify(newStore.policies));

      await createStoreMutation.mutateAsync(formData);

      // Reset form on success
      setNewStore({
        name: "",
        description: "",
        logoUrl: null,
        address: { city: "", postalCode: "", street: "" },
        location: { type: "Point", coordinates: [0, 0] },
        policies: { shipping: "", returns: "" },
      });
      setShowStoreForm(false);
    } catch (err) {
      console.error("Error creating store:", err);
    }
  };

  const handleEditStore = (store) => {
    setEditingStore(store);
    setNewStore({
      ...store,
      address: store.address || { city: "", postalCode: "", street: "" },
      policies: store.policies || { shipping: "", returns: "" },
    });
  };

  const handleUpdateStore = async () => {
    if (!newStore.name || !newStore.description) {
      return;
    }

    try {
      // Create FormData for file upload support
      const formData = new FormData();

      formData.append("name", newStore.name);
      formData.append("description", newStore.description);

      // logoUrl can be file or string
      if (newStore.logoUrl instanceof File) {
        formData.append("logoUrl", newStore.logoUrl);
      } else if (typeof newStore.logoUrl === "string") {
        formData.append("logoUrl", newStore.logoUrl);
      }

      formData.append("address", JSON.stringify(newStore.address));
      formData.append("location", JSON.stringify(newStore.location));
      formData.append("policies", JSON.stringify(newStore.policies));

      await updateStoreMutation.mutateAsync({
        storeId: editingStore._id,
        formData,
      });

      // Reset form on success
      setNewStore({
        name: "",
        description: "",
        logoUrl: null,
        address: { city: "", postalCode: "", street: "" },
        location: { coordinates: [0, 0] },
        policies: { shipping: "", returns: "" },
      });
      setEditingStore(null);
    } catch (err) {
      console.error("Error updating store:", err);
    }
  };

  const handleCancelEdit = () => {
    setEditingStore(null);
    setNewStore({
      name: "",
      description: "",
      logoUrl: null,
      address: { city: "", postalCode: "", street: "" },
      location: { type: "Point", coordinates: [0, 0] },
      policies: { shipping: "", returns: "" },
    });
    setShowStoreForm(false);
  };

  const handleDeleteStore = async (storeId) => {
    try {
      await deleteStoreMutation.mutateAsync(storeId);
    } catch (err) {
      console.error("Error deleting store:", err);
    }
  };

  const handleUpdate = (updatedStore) => {
    // This will be handled automatically by React Query cache invalidation
    console.log("Store updated:", updatedStore);
  };

  const setEditMode = (store) => {
    setEditingStore(store);
    setNewStore({ ...store });
    setModal(null);
  };

  const handleViewDetails = (store) => {
    setSelectedStore(store);
    setModal("details");
  };

  const handleManageStore = (store) => {
    setSelectedStore(store);
    setModal("manage");
  };
  const t = useTranslations('vendorstore')
  // Loading state
  if (loading) {
    return (
      <div className="space-y-8 animate-fadeIn">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <div className="space-y-1">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {t('title')}
            </h3>
            <p className="text-gray-600 text-lg">{t('loading')}</p>
          </div>
        </div>
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 shadow-sm">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div className="space-y-1">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {t('title')}
          </h3>
          <p className="text-gray-600 text-lg">
            {t('desc')}
          </p>
        </div>
        <button
          onClick={() => setShowStoreForm(true)}
          className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:ring-4 focus:ring-blue-300 focus:outline-none"
        >
          <svg
            className="w-5 h-5 transition-transform group-hover:rotate-90"
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
          <span className="font-semibold">{t('addstore')}</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
          <svg
            className="w-5 h-5 text-red-500 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Add/Edit Store Form */}
      {(showStoreForm || editingStore) && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden animate-slideDown">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
            <h4 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H7m5 0v-9a3 3 0 00-6 0v9"
                  />
                </svg>
              </div>
              {editingStore ? "Edit Store" : "Create New Store"}
            </h4>
            <p className="text-gray-600 mt-2">
              {editingStore
                ? "Update your store information"
                : "Fill in the details to create your new store"}
            </p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    {t('name')}
                  </label>
                  <input
                    type="text"
                    value={newStore.name}
                    onChange={(e) =>
                      setNewStore((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                    placeholder={t('storename')}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    {t('sdesc')}
                  </label>
                  <textarea
                    value={newStore.description}
                    onChange={(e) =>
                      setNewStore((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={4}
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400 resize-none"
                    placeholder="Describe your store and what makes it special"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    {t('Logo')}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setNewStore((prev) => ({
                        ...prev,
                        logoUrl: e.target.files[0], // ✅ store the File object
                      }))
                    }
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    {t('storelocation')}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-600">
                        {t('Longitude')}
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={newStore.location?.coordinates[0] || ""}
                        onChange={(e) =>
                          setNewStore((prev) => ({
                            ...prev,
                            location: {
                              ...prev.location,
                              coordinates: [
                                parseFloat(e.target.value) || 0,
                                prev.location?.coordinates[1] || 0,
                              ],
                            },
                          }))
                        }
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                        placeholder="e.g., -74.0060"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-600">
                        {t('Latitude')}
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={newStore.location?.coordinates[1] || ""}
                        onChange={(e) =>
                          setNewStore((prev) => ({
                            ...prev,
                            location: {
                              ...prev.location,
                              coordinates: [
                                prev.location?.coordinates[0] || 0,
                                parseFloat(e.target.value) || 0,
                              ],
                            },
                          }))
                        }
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                        placeholder="e.g., 40.7128"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">
                      {t('location')}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              setNewStore((prev) => ({
                                ...prev,
                                location: {
                                  ...prev.location,
                                  coordinates: [
                                    position.coords.longitude,
                                    position.coords.latitude,
                                  ],
                                },
                              }));
                            },
                            (error) => {
                              console.error("Error getting location:", error);
                            }
                          );
                        }
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors duration-200"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                      </svg>
                      Use My Location
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Address & Policies */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <h5 className="font-semibold text-gray-900 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                    {t('Store Address')}
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-600">
                        {t('city')}
                      </label>
                      <input
                        type="text"
                        value={newStore.address?.city || ""}
                        onChange={(e) =>
                          setNewStore((prev) => ({
                            ...prev,
                            address: { ...prev.address, city: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder={t('city')}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-600">
                        {t('postal')}
                      </label>
                      <input
                        type="text"
                        value={newStore.address?.postalCode || ""}
                        onChange={(e) =>
                          setNewStore((prev) => ({
                            ...prev,
                            address: {
                              ...prev.address,
                              postalCode: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="12345"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">
                      {t('street')}
                    </label>
                    <input
                      type="text"
                      value={newStore.address?.street || ""}
                      onChange={(e) =>
                        setNewStore((prev) => ({
                          ...prev,
                          address: { ...prev.address, street: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="123 Main Street"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <h5 className="font-semibold text-gray-900 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    {t('storepolicy')}
                  </h5>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-600">
                        {t('policy')}
                      </label>
                      <input
                        type="text"
                        value={newStore.policies?.shipping || ""}
                        onChange={(e) =>
                          setNewStore((prev) => ({
                            ...prev,
                            policies: {
                              ...prev.policies,
                              shipping: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder={t('policyp')}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-600">
                        {t('return')}
                      </label>
                      <input
                        type="text"
                        value={newStore.policies?.returns || ""}
                        onChange={(e) =>
                          setNewStore((prev) => ({
                            ...prev,
                            policies: {
                              ...prev.policies,
                              returns: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder={t('retrunp')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
              <button
                onClick={handleCancelEdit}
                disabled={submitting}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('cancel')}
              </button>
              <button
                onClick={editingStore ? handleUpdateStore : handleAddStore}
                disabled={!newStore.name || !newStore.description || submitting}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {editingStore ? t('Updating') : t('creating')}
                  </>
                ) : editingStore ? (
                  t('updates')
                ) : (
                  t("creates")
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stores Grid */}
      <div className="space-y-6">
        {userStores.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 shadow-sm">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-2m-2 0H7m5 0v-9a3 3 0 00-6 0v9"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('nostore')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('getstarted')}
            </p>
            <button
              onClick={() => setShowStoreForm(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
            >
              <svg
                className="w-4 h-4 mr-2"
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
              {t('firststore')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {userStores.map((store, index) => (
              <div
                key={store._id}
                className="group bg-white rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden animate-slideUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Store Header */}
                <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={
                            store.logoUrl ||
                            "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop&crop=center"
                          }
                          alt={store.name}
                          className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop&crop=center";
                          }}
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                      </div>
                      <div className="text-white">
                        <h4 className="font-bold text-xl mb-1">{store.name}</h4>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            store.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : store.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : store.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          } backdrop-blur-sm`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              store.status === "approved"
                                ? "bg-green-500"
                                : store.status === "pending"
                                ? "bg-yellow-500 animate-pulse"
                                : store.status === "rejected"
                                ? "bg-red-500"
                                : "bg-gray-500"
                            }`}
                          ></div>
                          {store.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditStore(store)}
                        className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
                        title="Edit store"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-red-500/80 transition-all duration-300 transform hover:scale-110"
                            title="Delete store"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('sure')}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('refuseaction')}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={loading}>
                              {t('Cancel')}
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteStore(store._id)}
                              disabled={loading}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              {loading ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>

                {/* Store Content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {store.description}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[
                      {
                        label: "Products",
                        value: store.productCount || 0,
                        color: "blue",
                        icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
                      },
                      {
                        label: "Orders",
                        value: store.ordersCount || 0,
                        color: "green",
                        icon: "M16 11V7a4 4 0 00-8 0v4M8 11v6a2 2 0 002 2h4a2 2 0 002-2v-6M8 11h8",
                      },
                      {
                        label: "Categories",
                        value: store.categorieCount || 0,
                        color: "purple",
                        icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
                      },
                      {
                        label: "Coupons",
                        value: store.couponsUsed || 0,
                        color: "amber",
                        icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
                      },
                    ].map((stat, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 rounded-2xl p-4 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-md"
                      >
                        <div
                          className={`w-10 h-10 bg-${stat.color}-100 rounded-xl flex items-center justify-center mx-auto mb-2`}
                        >
                          <svg
                            className={`w-5 h-5 text-${stat.color}-600`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d={stat.icon}
                            />
                          </svg>
                        </div>
                        <p
                          className={`text-2xl font-bold text-${stat.color}-600 mb-1`}
                        >
                          {stat.value}
                        </p>
                        <p className="text-xs text-gray-600 font-medium">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Store Details */}
                  <div className="space-y-3 text-sm">
                    {store.address &&
                      (store.address.street ||
                        store.address.city ||
                        store.address.postalCode) && (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-red-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                            </svg>
                          </div>
                          <span className="text-gray-700 font-medium">
                            {[
                              store.address.street,
                              store.address.city,
                              store.address.postalCode,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </div>
                      )}

                    {store.policies?.shipping && (
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700">
                          {store.policies.shipping}
                        </span>
                      </div>
                    )}

                    {store.policies?.returns && (
                      <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h10a8 8 0 018 8v2M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m6 0l-5 5-3-3"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700">
                          {store.policies.returns}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-100">
                    <button
                      onClick={() => handleViewDetails(store)}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center justify-center gap-2"
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      {t('View Details')}
                    </button>
                    <button
                      onClick={() => handleManageStore(store)}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center justify-center gap-2"
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
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {t('Manage Store')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Components */}
      {modal === "details" && selectedStore && (
        <StoreDetailsView
          store={selectedStore}
          onClose={() => setModal(null)}
          onEdit={(store) => setEditMode(store)}
        />
      )}

      {modal === "manage" && selectedStore && (
        <StoreManagement
          store={selectedStore}
          onUpdate={(updated) => handleUpdate(updated)}
          onClose={() => setModal(null)}
        />
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
}
