"use client";
import { useState } from "react";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Settings, 
  MapPin, 
  Package, 
  ShoppingBag, 
  Grid3x3, 
  Tag, 
  Truck, 
  RotateCcw,
  Store,
  AlertCircle,
  Loader2,
  Navigation,
  Building2,
  Shield,
  XCircle
} from "lucide-react";
import { StoreManagement } from "./StoreMangement";
import StoreDetailsView from "./StoreView";
import {
  useVendorStores,
  useCreateStore,
  useUpdateStore,
  useDeleteStore,
} from "@/service/store";

// Import validation functions
import { validateStoreForm, validateField } from "./storeValidation";

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
} from "@/components/ui/alert-dialog";
import { useTranslations } from "use-intl";
import StoreSkeleton, { StoreSkeletonSimple } from "./storeSkelton";

export default function StoresSection() {
  const [showStoreForm, setShowStoreForm] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [modal, setModal] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [fieldTouched, setFieldTouched] = useState({});
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

  const userStores = vendorStoresData?.stores || vendorStoresData?.data?.stores || [];

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

  // Validation helper function
  const validateFormData = (data, isUpdate = false) => {
    const validation = validateStoreForm(data, isUpdate);
    setValidationErrors(validation.errors || {});
    return validation.isValid;
  };

  // Real-time field validation
  const handleFieldValidation = (fieldName, value) => {
    const validation = validateField(fieldName, value, !!editingStore);
    
    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: validation.isValid ? null : validation.error
    }));
    
    return validation.isValid;
  };

  // Field blur handler
  const handleFieldBlur = (fieldName, value) => {
    setFieldTouched(prev => ({ ...prev, [fieldName]: true }));
    handleFieldValidation(fieldName, value);
  };

  // Enhanced field change handler
  const handleFieldChange = (fieldName, value, nestedField = null) => {
    if (nestedField) {
      setNewStore(prev => ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          [nestedField]: value
        }
      }));
      
      // Validate nested field
      const fullFieldName = `${fieldName}.${nestedField}`;
      if (fieldTouched[fullFieldName]) {
        handleFieldValidation(fullFieldName, value);
      }
    } else {
      setNewStore(prev => ({ ...prev, [fieldName]: value }));
      
      // Validate field if it has been touched
      if (fieldTouched[fieldName]) {
        handleFieldValidation(fieldName, value);
      }
    }
  };

  const handleAddStore = async () => {
    // Mark all fields as touched for validation display
    console.log("hi from create")
    const allFields = {
      name: true,
      description: true,
      logoUrl: true,
      'address.city': true,
      'address.postalCode': true,
      'address.street': true,
      'location.coordinates': true,
      'policies.shipping': true,
      'policies.returns': true,
    };
    setFieldTouched(allFields);

    // Prepare data for validation
    const storeData = {
      ...newStore,
      address: {
        city: newStore.address?.city || "",
        postalCode: newStore.address?.postalCode || "",
        street: newStore.address?.street || "",
      },
      location: {
        type: "Point",
        coordinates: newStore.location?.coordinates || [0, 0],
      },
      policies: {
        shipping: newStore.policies?.shipping || "",
        returns: newStore.policies?.returns || "",
      },
    };
    console.log(storeData)
    console.log(validateFormData(storeData, false))
    if (!validateFormData(storeData, false)) {
      console.log("true")
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newStore.name);
      formData.append("description", newStore.description);

      if (newStore.logoUrl instanceof File) {
        formData.append("logoUrl", newStore.logoUrl);
      } else if (typeof newStore.logoUrl === "string") {
        formData.append("logoUrl", newStore.logoUrl);
      }

      formData.append("address", JSON.stringify(newStore.address));
      formData.append("location", JSON.stringify(newStore.location));
      formData.append("policies", JSON.stringify(newStore.policies));
      console.log("hi from back")
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
      setValidationErrors({});
      setFieldTouched({});
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
    setValidationErrors({});
    setFieldTouched({});
  };

  const handleUpdateStore = async () => {
    // Mark all fields as touched
    const allFields = {
      name: true,
      description: true,
      logoUrl: true,
      'address.city': true,
      'address.postalCode': true,
      'address.street': true,
      'location.coordinates': true,
      'policies.shipping': true,
      'policies.returns': true,
    };
    setFieldTouched(allFields);

    const storeData = {
      ...newStore,
      address: {
        city: newStore.address?.city || "",
        postalCode: newStore.address?.postalCode || "",
        street: newStore.address?.street || "",
      },
      location: {
        type: "Point",
        coordinates: newStore.location?.coordinates || [0, 0],
      },
      policies: {
        shipping: newStore.policies?.shipping || "",
        returns: newStore.policies?.returns || "",
      },
    };

    if (!validateFormData(storeData, true)) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newStore.name);
      formData.append("description", newStore.description);

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
      setValidationErrors({});
      setFieldTouched({});
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
    setValidationErrors({});
    setFieldTouched({});
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
    console.log("Store updated:", updatedStore);
  };

  const setEditMode = (store) => {
    setEditingStore(store);
    setNewStore({ ...store });
    setModal(null);
    setValidationErrors({});
    setFieldTouched({});
  };

  const handleViewDetails = (store) => {
    setSelectedStore(store);
    setModal("details");
  };

  const handleManageStore = (store) => {
    setSelectedStore(store);
    setModal("manage");
  };

  // Helper function to render validation error
  const renderFieldError = (fieldName) => {
    if (fieldTouched[fieldName] && validationErrors[fieldName]) {
      return (
        <div className="flex items-center gap-2 mt-2 text-red-600">
          <XCircle className="w-4 h-4" />
          <span className="text-sm font-medium">{validationErrors[fieldName]}</span>
        </div>
      );
    }
    return null;
  };

  // Helper function to get input border class based on validation
  const getInputBorderClass = (fieldName, baseClass) => {
    if (fieldTouched[fieldName] && validationErrors[fieldName]) {
      return baseClass.replace('border-slate-200', 'border-red-300').replace('focus:border-orange-400', 'focus:border-red-400').replace('focus:ring-orange-200', 'focus:ring-red-200');
    }
    return baseClass;
  };

  const t = useTranslations('vendorstore');

  if (loading) {
    return <StoreSkeleton/>
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-orange-100">
        <div className="space-y-3">
          <h3 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
            {t('title')}
          </h3>
          <p className="text-slate-600 text-lg font-medium">
            {t('desc')}
          </p>
        </div>
        <button
          onClick={() => setShowStoreForm(true)}
          className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:ring-4 focus:ring-orange-200 focus:outline-none font-semibold text-lg"
        >
          <Plus className="w-6 h-6 transition-transform group-hover:rotate-90" />
          <span>{t('addstore')}</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-800 mb-1">Error</h4>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Validation Summary */}
      {Object.keys(validationErrors).some(key => validationErrors[key]) && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-800 mb-2">Please fix the following errors:</h4>
            <ul className="text-red-700 text-sm space-y-1">
              {Object.entries(validationErrors).map(([field, error]) => 
                error && (
                  <li key={field} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    {error}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Add/Edit Store Form */}
      {(showStoreForm || editingStore) && (
        <div className="bg-white rounded-3xl border border-orange-100 shadow-2xl overflow-hidden animate-slide-down">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-10 py-8 border-b border-orange-100">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-3xl font-bold text-slate-800">
                  {editingStore ? "Edit Store" : "Create New Store"}
                </h4>
                <p className="text-slate-600 text-lg mt-1">
                  {editingStore
                    ? "Update your store information and settings"
                    : "Fill in the details to create your professional store"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-10">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              {/* Basic Information */}
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                    {t('name')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newStore.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    onBlur={(e) => handleFieldBlur('name', e.target.value)}
                    className={getInputBorderClass('name', "w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300 hover:border-slate-300 text-lg font-medium")}
                    placeholder={t('storename')}
                  />
                  {renderFieldError('name')}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                    {t('sdesc')} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={newStore.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    onBlur={(e) => handleFieldBlur('description', e.target.value)}
                    rows={5}
                    className={getInputBorderClass('description', "w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300 hover:border-slate-300 resize-none text-lg")}
                    placeholder="Describe your store and what makes it unique..."
                  />
                  {renderFieldError('description')}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                    {t('Logo')}
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFieldChange('logoUrl', e.target.files[0])}
                      onBlur={(e) => handleFieldBlur('logoUrl', e.target.files[0])}
                      className={getInputBorderClass('logoUrl', "w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300 hover:border-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-orange-50 file:text-orange-700 file:font-semibold hover:file:bg-orange-100")}
                    />
                  </div>
                  {renderFieldError('logoUrl')}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                    {t('storelocation')}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-600 uppercase">
                        {t('Longitude')}
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={newStore.location?.coordinates[0] || ""}
                        onChange={(e) => {
                          const coords = [parseFloat(e.target.value) || 0, newStore.location?.coordinates[1] || 0];
                          handleFieldChange('location', { ...newStore.location, coordinates: coords });
                        }}
                        onBlur={(e) => handleFieldBlur('location.coordinates', [parseFloat(e.target.value) || 0, newStore.location?.coordinates[1] || 0])}
                        className={getInputBorderClass('location.coordinates', "w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300")}
                        placeholder="-74.0060"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-600 uppercase">
                        {t('Latitude')}
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={newStore.location?.coordinates[1] || ""}
                        onChange={(e) => {
                          const coords = [newStore.location?.coordinates[0] || 0, parseFloat(e.target.value) || 0];
                          handleFieldChange('location', { ...newStore.location, coordinates: coords });
                        }}
                        onBlur={(e) => handleFieldBlur('location.coordinates', [newStore.location?.coordinates[0] || 0, parseFloat(e.target.value) || 0])}
                        className={getInputBorderClass('location.coordinates', "w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300")}
                        placeholder="40.7128"
                      />
                    </div>
                  </div>
                  {renderFieldError('location.coordinates')}
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-sm text-slate-500 font-medium">
                      {t('location')}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition((position) => {
                            handleFieldChange('location', {
                              ...newStore.location,
                              coordinates: [position.coords.longitude, position.coords.latitude],
                            });
                          });
                        }
                      }}
                      className="text-sm text-orange-600 hover:text-orange-800 font-bold flex items-center gap-2 transition-colors duration-200 hover:bg-orange-50 px-3 py-1 rounded-lg"
                    >
                      <Navigation className="w-4 h-4" />
                      Use Current Location
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Address & Policies */}
              <div className="space-y-8">
                <div className="bg-slate-50 rounded-3xl p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Building2 className="w-6 h-6 text-orange-600" />
                    <h5 className="text-xl font-bold text-slate-800">
                      {t('Store Address')} <span className="text-red-500">*</span>
                    </h5>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-600 uppercase tracking-wide">
                        {t('city')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newStore.address?.city || ""}
                        onChange={(e) => handleFieldChange('address', e.target.value, 'city')}
                        onBlur={(e) => handleFieldBlur('address.city', e.target.value)}
                        className={getInputBorderClass('address.city', "w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300")}
                        placeholder="San Francisco"
                      />
                      {renderFieldError('address.city')}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-600 uppercase tracking-wide">
                        {t('postal')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newStore.address?.postalCode || ""}
                        onChange={(e) => handleFieldChange('address', e.target.value, 'postalCode')}
                        onBlur={(e) => handleFieldBlur('address.postalCode', e.target.value)}
                        className={getInputBorderClass('address.postalCode', "w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300")}
                        placeholder="94105"
                      />
                      {renderFieldError('address.postalCode')}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-600 uppercase tracking-wide">
                      {t('street')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newStore.address?.street || ""}
                      onChange={(e) => handleFieldChange('address', e.target.value, 'street')}
                      onBlur={(e) => handleFieldBlur('address.street', e.target.value)}
                      className={getInputBorderClass('address.street', "w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300")}
                      placeholder="123 Main Street"
                    />
                    {renderFieldError('address.street')}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-3xl p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-6 h-6 text-orange-600" />
                    <h5 className="text-xl font-bold text-slate-800">
                      {t('storepolicy')}
                    </h5>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-600 uppercase tracking-wide">
                        {t('policy')}
                      </label>
                      <input
                        type="text"
                        value={newStore.policies?.shipping || ""}
                        onChange={(e) => handleFieldChange('policies', e.target.value, 'shipping')}
                        onBlur={(e) => handleFieldBlur('policies.shipping', e.target.value)}
                        className={getInputBorderClass('policies.shipping', "w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300")}
                        placeholder={t('policyp')}
                      />
                      {renderFieldError('policies.shipping')}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-600 uppercase tracking-wide">
                        {t('return')}
                      </label>
                      <input
                        type="text"
                        value={newStore.policies?.returns || ""}
                        onChange={(e) => handleFieldChange('policies', e.target.value, 'returns')}
                        onBlur={(e) => handleFieldBlur('policies.returns', e.target.value)}
                        className={getInputBorderClass('policies.returns', "w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300")}
                        placeholder={t('retrunp')}
                      />
                      {renderFieldError('policies.returns')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row justify-end gap-4">
              <button
                onClick={handleCancelEdit}
                disabled={submitting}
                className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-2xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 transform hover:scale-105 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('cancel')}
              </button>
              <button
                onClick={editingStore ? handleUpdateStore : handleAddStore}
                disabled={submitting || Object.keys(validationErrors).some(key => validationErrors[key])}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 font-bold text-lg shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
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
      <div className="space-y-8">
        {userStores.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-orange-100 shadow-sm">
            <div className="w-32 h-32 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Store className="w-16 h-16 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">
              {t('nostore')}
            </h3>
            <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
              {t('getstarted')}
            </p>
            <button
              onClick={() => setShowStoreForm(true)}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 font-bold text-lg shadow-xl"
            >
              <Plus className="w-5 h-5" />
              {t('firststore')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {userStores.map((store, index) => (
              <div
                key={store._id}
                className="group bg-white rounded-3xl border border-orange-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Store Header */}
                <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <img
                          src={
                            store.logoUrl ||
                            "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=120&h=120&fit=crop&crop=center"
                          }
                          alt={store.name}
                          className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-xl transform group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=120&h=120&fit=crop&crop=center";
                          }}
                        />
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-3 border-white animate-pulse shadow-lg"></div>
                      </div>
                      <div className="text-white">
                        <h4 className="font-bold text-2xl mb-2 tracking-tight">{store.name}</h4>
                        <span
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                            store.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : store.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : store.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-slate-100 text-slate-800"
                          } backdrop-blur-sm shadow-lg`}
                        >
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${
                              store.status === "approved"
                                ? "bg-green-500"
                                : store.status === "pending"
                                ? "bg-yellow-500 animate-pulse"
                                : store.status === "rejected"
                                ? "bg-red-500"
                                : "bg-slate-500"
                            }`}
                          ></div>
                          {store.status?.charAt(0).toUpperCase() + store.status?.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEditStore(store)}
                        className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-110 shadow-lg"
                        title="Edit store"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-red-500/80 transition-all duration-300 transform hover:scale-110 shadow-lg"
                            title="Delete store"
                          >
                            <Trash2 className="w-5 h-5" />
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
                <div className="p-8">
                  <p className="text-slate-600 mb-8 leading-relaxed text-lg font-medium">
                    {store.description}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                      {
                        label: "Products",
                        value: store.productCount || 0,
                        color: "orange",
                        icon: Package,
                      },
                      {
                        label: "Orders",
                        value: store.ordersCount || 0,
                        color: "green",
                        icon: ShoppingBag,
                      },
                      {
                        label: "Categories",
                        value: store.categorieCount || 0,
                        color: "purple",
                        icon: Grid3x3,
                      },
                      {
                        label: "Coupons",
                        value: store.couponsUsed || 0,
                        color: "blue",
                        icon: Tag,
                      },
                    ].map((stat, idx) => (
                      <div
                        key={idx}
                        className={`bg-${stat.color}-50 rounded-2xl p-5 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg border border-${stat.color}-100`}
                      >
                        <div
                          className={`w-12 h-12 bg-${stat.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-3`}
                        >
                          <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                        </div>
                        <p
                          className={`text-3xl font-bold text-${stat.color}-600 mb-2`}
                        >
                          {stat.value}
                        </p>
                        <p className="text-sm text-slate-600 font-bold uppercase tracking-wide">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Store Details */}
                  <div className="space-y-4 mb-8">
                    {store.address &&
                      (store.address.street ||
                        store.address.city ||
                        store.address.postalCode) && (
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-orange-600" />
                          </div>
                          <span className="text-slate-700 font-semibold text-lg">
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
                      <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Truck className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-slate-700 font-semibold text-lg">
                          {store.policies.shipping}
                        </span>
                      </div>
                    )}

                    {store.policies?.returns && (
                      <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-100">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                          <RotateCcw className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-slate-700 font-semibold text-lg">
                          {store.policies.returns}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
                    <button
                      onClick={() => handleViewDetails(store)}
                      className="flex-1 px-6 py-4 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 font-bold text-lg flex items-center justify-center gap-3 shadow-lg"
                    >
                      <Eye className="w-5 h-5" />
                      {t('View Details')}
                    </button>
                    <button
                      onClick={() => handleManageStore(store)}
                      className="flex-1 px-6 py-4 border-2 border-orange-200 text-orange-600 rounded-2xl hover:bg-orange-50 hover:border-orange-300 transition-all duration-300 transform hover:scale-105 font-bold text-lg flex items-center justify-center gap-3"
                    >
                      <Settings className="w-5 h-5" />
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
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
}