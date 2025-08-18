'use client';
import { useState } from 'react'
import { useTranslations } from 'use-intl'

function AddressesSection({ userData, setUserData }) {
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [newAddress, setNewAddress] = useState({
    buildingNo: '',
    street: '',
    nearestLandMark: '',
    city: '',
    governorate: '',
    country: 'Egypt',
    addressType: 'home',
    isDefault: false
  })

  const handleAddAddress = () => {
    const addressWithId = { ...newAddress, _id: Date.now().toString() }
    setUserData(prev => ({
      ...prev,
      addresses: [...prev.addresses, addressWithId]
    }))
    setNewAddress({
      buildingNo: '',
      street: '',
      nearestLandMark: '',
      city: '',
      governorate: '',
      country: 'Egypt',
      addressType: 'home',
      isDefault: false
    })
    setShowAddressForm(false)
  }

  const handleEditAddress = (address) => {
    setEditingAddress(address)
    setNewAddress({ ...address })
  }

  const handleUpdateAddress = () => {
    setUserData(prev => ({
      ...prev,
      addresses: prev.addresses.map(addr => 
        addr._id === editingAddress._id ? { ...newAddress } : addr
      )
    }))
    setNewAddress({
      buildingNo: '',
      street: '',
      nearestLandMark: '',
      city: '',
      governorate: '',
      country: 'Egypt',
      addressType: 'home',
      isDefault: false
    })
    setEditingAddress(null)
  }

  const handleCancelEdit = () => {
    setEditingAddress(null)
    setNewAddress({
      buildingNo: '',
      street: '',
      nearestLandMark: '',
      city: '',
      governorate: '',
      country: 'Egypt',
      addressType: 'home',
      isDefault: false
    })
    setShowAddressForm(false)
  }

  const handleDeleteAddress = (addressId) => {
    setUserData(prev => ({
      ...prev,
      addresses: prev.addresses.filter(addr => addr._id !== addressId)
    }))
  }

  const handleSetDefaultAddress = (addressId) => {
    setUserData(prev => ({
      ...prev,
      addresses: prev.addresses.map(addr => ({
        ...addr,
        isDefault: addr._id === addressId
      }))
    }))
  }
  const t = useTranslations('address');
  const t1 = useTranslations('defaultaddress')
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-slate-900">{t('delivery')}</h3>
        <button
          onClick={() => setShowAddressForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>{t('newaddress')}</span>
        </button>
      </div>

      {/* Add/Edit Address Form */}
      {(showAddressForm || editingAddress) && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('building')}</label>
              <input
                type="number"
                value={newAddress.buildingNo}
                onChange={(e) => setNewAddress(prev => ({ ...prev, buildingNo: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('building')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('street')}</label>
              <input
                type="text"
                value={newAddress.street}
                onChange={(e) => setNewAddress(prev => ({ ...prev, street: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('streetname')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('landmark')}</label>
              <input
                type="text"
                value={newAddress.nearestLandMark}
                onChange={(e) => setNewAddress(prev => ({ ...prev, nearestLandMark: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('landmark')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('city')}</label>
              <input
                type="text"
                value={newAddress.city}
                onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('city')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('government')}</label>
              <input
                type="text"
                value={newAddress.governorate}
                onChange={(e) => setNewAddress(prev => ({ ...prev, governorate: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('government')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('country')}</label>
              <input
                type="text"
                value={newAddress.country}
                onChange={(e) => setNewAddress(prev => ({ ...prev, country: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('country')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('type')}</label>
              <select
                value={newAddress.addressType}
                onChange={(e) => setNewAddress(prev => ({ ...prev, addressType: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="home">{t('home')}</option>
                <option value="work">{t('work')}</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={newAddress.isDefault}
                onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                className="mr-2"
              />
              <label className="text-sm font-medium text-slate-700">{t('defaultaddress')}</label>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleCancelEdit}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingAddress ? 'Update Address' : 'Add Address'}
            </button>
          </div>
        </div>
      )}

      {/* Address List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userData.addresses.map((address) => (
          <div key={address._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
            {address.isDefault && (
              <div className="absolute top-4 right-4 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                {t1('default')}
              </div>
            )}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="font-semibold text-slate-900 capitalize">{address.addressType}</span>
              </div>
            </div>
            
            <div className="space-y-2 text-slate-600">
              <p><span className="font-medium">{t1('building')}</span> {address.buildingNo}</p>
              <p><span className="font-medium">{t1('street')}</span> {address.street}</p>
              {address.nearestLandMark && (
                <p><span className="font-medium">{t1('near')}</span> {address.nearestLandMark}</p>
              )}
              <p><span className="font-medium">{t1('city')}</span> {address.city}</p>
              <p><span className="font-medium">{t1('government')}</span> {address.governorate}</p>
              <p><span className="font-medium">{t1('country')}</span> {address.country}</p>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              {!address.isDefault && (
                <button
                  onClick={() => handleSetDefaultAddress(address._id)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                  {t('defaultaddress')}
                </button>
              )}
              <div className="flex space-x-2 ml-auto">
                <button 
                  onClick={() => handleEditAddress(address)}
                  className="text-slate-500 hover:text-blue-600 transition-colors"
                  title="Edit address"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteAddress(address._id)}
                  className="text-slate-500 hover:text-red-600 transition-colors"
                  title="Delete address"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AddressesSection