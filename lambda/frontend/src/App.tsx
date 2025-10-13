import React from 'react';

type Order = {
  id: string;
  customer: string;
  total: string;
  items: { name: string; qty: number }[];
};

function App({ order }: { order: any }) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        {/* Header */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order #{order.id}
          </h1>
          <div className="space-y-2">
            <p className="text-lg text-gray-700">
              <span className="font-medium">Customer:</span> {order.customerAccountId}
            </p>
            <p className="text-xl font-semibold text-green-600">
              Total: {order.total}
            </p>
          </div>
        </div>

        {/* Items Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Order Items
          </h2>
          <ul className="space-y-3">
            {order.items.map((item: any, idx: any) => (
              <li
                key={idx}
                className="flex justify-between items-center bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex-1">
                  <span className="font-medium text-gray-900">
                    {item.product.productCode}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    Qty: {item.quantity}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;

// import React, { useEffect, useState } from 'react';

// function App() {
//   const [msg, setMsg] = useState<string>('');

//   useEffect(() => {
//     fetch('/api/hello')
//       .then((res) => res.json())
//       .then((data) => setMsg(data.message))
//       .catch((err) => console.error('Error calling API', err));
//   }, []);

//   return (
//     <div>
//       <h1>Fullstack in Lambda</h1>
//       <p>Message from API: {msg}</p>
//     </div>
//   );
// }