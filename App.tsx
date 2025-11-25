import React, { useState, useEffect, useCallback } from 'react';
import { AppView, UserAccount } from './types';
import { CreateOrder } from './components/CreateOrder';
import { ValidateOrder } from './components/ValidateOrder';
import { Customers } from './components/Customers';
import { ProductList } from './components/ProductList';
import { OrderItemsList } from './components/OrderItemsList';
import { DataSync } from './components/DataSync';
import { OrderReleasesReport } from './components/OrderReleasesReport';
import { InventoryReport } from './components/InventoryReport';
import { Navbar } from './components/Navbar';
import { Login } from './components/Login'; 
import { ForcePasswordChange } from './components/ForcePasswordChange'; // Import new component
import { ShieldAlert } from 'lucide-react';
import { getUsers } from './services/storageService';

function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.VALIDATE_ORDER);
  const [forcePasswordChange, setForcePasswordChange] = useState(false);

  const isViewAllowed = useCallback((view: AppView): boolean => {
      if (!currentUser) return false;
      const role = currentUser.role;
      if (role === 'Admin') return true;
      
      if (role === 'Almoxarifado') {
          return [AppView.VALIDATE_ORDER, AppView.INVENTORY, AppView.ORDER_RELEASES].includes(view);
      }
      
      if (role === 'Vendas' || role === 'Compras') {
          return [AppView.CREATE_ORDER, AppView.ORDERS_LIST, AppView.CUSTOMERS, AppView.PRODUCTS, AppView.INVENTORY, AppView.ORDER_RELEASES].includes(view);
      }
      
      return false;
  }, [currentUser]);

  // Hooks must be called unconditionally at the top of the component.
  useEffect(() => {
      if (currentUser && !isViewAllowed(currentView)) {
          if (currentUser.role === 'Almoxarifado') setCurrentView(AppView.VALIDATE_ORDER);
          else if (currentUser.role === 'Admin') setCurrentView(AppView.DATA_SYNC);
          else setCurrentView(AppView.CREATE_ORDER);
      }
  }, [currentUser, currentView, isViewAllowed]);


  const handleLogin = (user: UserAccount) => {
      setCurrentUser(user);
      // Check if this is the first login
      if (!user.hasSetPassword) {
          setForcePasswordChange(true);
      } else {
          // Normal login flow
          setForcePasswordChange(false);
          if (user.role === 'Almoxarifado') setCurrentView(AppView.VALIDATE_ORDER);
          else if (user.role === 'Admin') setCurrentView(AppView.DATA_SYNC);
          else setCurrentView(AppView.CREATE_ORDER);
      }
  };
  
  const onPasswordChanged = () => {
      // After password is changed, update state to reflect this
      if(currentUser) {
        const users = getUsers();
        const updatedUser = users.find(u => u.email === currentUser.email);
        if (updatedUser) {
            handleLogin(updatedUser); // Re-run login logic with updated user data
        }
      }
  };

  const handleLogout = () => {
      setCurrentUser(null);
      setForcePasswordChange(false);
  };

  if (!currentUser) {
      return <Login onLogin={handleLogin} />;
  }
  
  if (forcePasswordChange) {
      return <ForcePasswordChange user={currentUser} onPasswordChanged={onPasswordChanged} />;
  }
  
  const renderView = () => {
    if (!isViewAllowed(currentView)) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-gray-100 text-red-600">
                <ShieldAlert className="w-16 h-16 mb-4" />
                <h2 className="text-2xl font-bold">Acesso Negado</h2>
                <p>Seu perfil ({currentUser.role}) não tem permissão para acessar esta tela.</p>
            </div>
        );
    }

    switch (currentView) {
      case AppView.CREATE_ORDER:
        // Fix: Pass currentUser to the CreateOrder component.
        return <CreateOrder currentUser={currentUser} onOrderCreated={() => setCurrentView(AppView.ORDERS_LIST)} onCancel={() => setCurrentView(AppView.ORDERS_LIST)} />;
      case AppView.VALIDATE_ORDER:
        return <ValidateOrder currentUser={currentUser} onBack={() => setCurrentView(AppView.VALIDATE_ORDER)} />;
      case AppView.CUSTOMERS:
        return <Customers />;
      case AppView.PRODUCTS:
        return <ProductList />;
      case AppView.ORDERS_LIST:
        return <OrderItemsList />;
      case AppView.ORDER_RELEASES:
        return <OrderReleasesReport />;
      case AppView.DATA_SYNC:
        return <DataSync currentUser={currentUser} />;
      case AppView.INVENTORY:
        return <InventoryReport />;
      default:
        return <ValidateOrder currentUser={currentUser} onBack={() => setCurrentView(AppView.VALIDATE_ORDER)} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 font-sans overflow-hidden">
      <Navbar 
        currentView={currentView} 
        setView={setCurrentView} 
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 overflow-y-auto relative flex flex-col">
        {renderView()}
      </main>
    </div>
  );
}

export default App;