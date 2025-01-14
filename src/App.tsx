import React, { useState } from 'react';
import { ScanLine, ShoppingCart, CreditCard, Trash2 } from 'lucide-react';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  price: number;
}

function App() {
  const [barcode, setBarcode] = useState('');
  const [cart, setCart] = useState<Product[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();

    if (barcode.trim() === '') {
      alert('Please enter a valid product ID.');
      return;
    }

    try {
      // API call to fetch product based on the barcode or ID
      const response = await axios.get(`http://127.0.0.1:8000/api/products/${barcode}`);
      const product = response.data;

      // Check if the product is already in the cart, if not add it
      setCart(prev => {
        const existingProduct = prev.find(p => p.id === product.id);
        if (!existingProduct) {
          return [...prev, product];
        }
        return prev;
      });

      setBarcode(''); // Clear barcode input field
    } catch (error) {
      console.error('Error fetching product data:', error);
      alert('Product not found!');
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-3">
              <ShoppingCart className="w-10 h-10 text-blue-600" />
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
                Kasir
              </span>
            </h1>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Scanner Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
              <form onSubmit={handleScan} className="mb-8">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label htmlFor="barcode" className="block text-sm font-semibold text-gray-700 mb-2">
                      Scan Barcode
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="barcode"
                        className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all pl-12 py-3 text-lg"
                        placeholder="Enter or scan barcode..."
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                      />
                      <ScanLine className={`absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 ${isScanning ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`mt-8 px-6 py-3 rounded-lg ${
                      isScanning 
                        ? 'bg-red-500 hover:bg-red-600 shadow-red-200' 
                        : 'bg-blue-500 hover:bg-blue-600 shadow-blue-200'
                    } text-white font-medium shadow-lg transition-all duration-200 hover:scale-105`}
                    onClick={() => setIsScanning(!isScanning)}
                  >
                    {isScanning ? 'Stop Scanning' : 'Start Scanning'}
                  </button>
                </div>
              </form>

              {/* Products List */}
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} 
                    className="flex items-center justify-between bg-blue-50 p-5 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-200">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-gray-500 text-sm">ID: {item.id}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <p className="text-lg font-semibold text-blue-800">${item.price.toFixed(2)}</p>
                      <button
                        onClick={() => setCart(cart.filter(p => p.id !== item.id))}
                        className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Total Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Ringkasan Pesanan</h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name}
                    </span>
                    <span className="text-gray-900 font-medium">${item.price.toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-blue-100 pt-4 mt-6">
                  <div className="flex justify-between text-lg font-bold text-blue-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  className="w-full mt-8 bg-green-500 text-white py-4 rounded-lg hover:bg-green-600 font-semibold shadow-lg shadow-green-200 flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105"
                >
                  <CreditCard className="w-5 h-5" />
                  Proses Pembayaran
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
