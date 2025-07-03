import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import DashboardPage from '@/components/pages/DashboardPage'
import InvoicesPage from '@/components/pages/InvoicesPage'
import CreateInvoicePage from '@/components/pages/CreateInvoicePage'
import CustomersPage from '@/components/pages/CustomersPage'
import ProductsPage from '@/components/pages/ProductsPage'
import PurchaseBillsPage from '@/components/pages/PurchaseBillsPage'
import ReportsPage from '@/components/pages/ReportsPage'
import SettingsPage from '@/components/pages/SettingsPage'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="invoices/create" element={<CreateInvoicePage />} />
          <Route path="invoices/edit/:id" element={<CreateInvoicePage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="purchase-bills" element={<PurchaseBillsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastStyle={{ zIndex: 9999 }}
      />
    </>
  )
}

export default App