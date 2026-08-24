/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { MobileNav } from './components/common/MobileNav';
import { ToastContainer } from './components/common/ToastContainer';
import { LocationModal } from './components/modals/LocationModal';
import { AuthModal } from './components/modals/AuthModal';
import { CartConflictModal } from './components/modals/CartConflictModal';
import { ProductDetailModal } from './components/modals/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';

// Customer Pages
import { HomePage } from './components/customer/HomePage';
import { ShopListing } from './components/customer/ShopListing';
import { ShopDetail } from './components/customer/ShopDetail';
import { CheckoutPage } from './components/customer/CheckoutPage';
import { OrderTracking } from './components/customer/OrderTracking';
import { OrderHistoryPage } from './components/customer/OrderHistoryPage';
import { CustomerProfile } from './components/customer/CustomerProfile';

// Portals
import { ShopkeeperDashboard } from './components/shopkeeper/ShopkeeperDashboard';
import { DeliveryDashboard } from './components/delivery/DeliveryDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

// Authentication Pages
import { AdminLoginPage } from './components/auth/AdminLoginPage';
import { ShopkeeperLoginPage } from './components/auth/ShopkeeperLoginPage';
import { ShopkeeperRegisterPage } from './components/auth/ShopkeeperRegisterPage';
import { DeliveryLoginPage } from './components/auth/DeliveryLoginPage';
import { DeliveryRegisterPage } from './components/auth/DeliveryRegisterPage';
import { RolePortalHub } from './components/auth/RolePortalHub';

const AppContent: React.FC = () => {
  const { currentRole, customerView, authView } = useApp();

  const renderCustomerView = () => {
    switch (customerView) {
      case 'home':
        return <HomePage />;
      case 'shops':
        return <ShopListing />;
      case 'shop-details':
        return <ShopDetail />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-tracking':
        return <OrderTracking />;
      case 'order-history':
        return <OrderHistoryPage />;
      case 'profile':
        return <CustomerProfile />;
      default:
        return <HomePage />;
    }
  };

  const renderAuthView = () => {
    switch (authView) {
      case 'admin-login':
        return <AdminLoginPage />;
      case 'shopkeeper-login':
        return <ShopkeeperLoginPage />;
      case 'shopkeeper-register':
        return <ShopkeeperRegisterPage />;
      case 'delivery-login':
        return <DeliveryLoginPage />;
      case 'delivery-register':
        return <DeliveryRegisterPage />;
      case 'role-hub':
        return <RolePortalHub />;
      default:
        return null;
    }
  };

  const renderMainView = () => {
    if (authView) {
      return renderAuthView();
    }

    switch (currentRole) {
      case 'shopkeeper':
        return <ShopkeeperDashboard />;
      case 'delivery':
        return <DeliveryDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'customer':
      default:
        return renderCustomerView();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900 pb-16 md:pb-0">
      {/* Global Sticky Header */}
      <Header />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {renderMainView()}
      </main>

      {/* Global Bottom Navigation for Mobile */}
      <MobileNav />

      {/* Global Drawers & Modals */}
      <CartDrawer />
      <LocationModal />
      <AuthModal />
      <CartConflictModal />
      <ProductDetailModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
