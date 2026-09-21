import React from 'react';
import SecureVideoPlayer from '@/components/SecureVideoPlayer';

export default function VideoDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-5xl bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-4">
          Korumalı Video Demo
        </h1>
        <p className="text-gray-600 mb-8">
          Aşağıdaki video doğrudan dışarıdan değil, bizim API'miz üzerinden güvenli bir şekilde (Proxy edilerek) gelmektedir. Sağ tık kapalıdır ve rastgele zıplayan bir filigran eklenmiştir.
        </p>

        <SecureVideoPlayer 
          productId="DEMO" 
          userEmail="ogrenci@deneme.com" 
        />
        
        <div className="mt-8 bg-blue-50 text-blue-800 p-4 rounded-lg text-sm font-medium">
          <strong>Not:</strong> İncele (F12) yapıp Network sekmesine bakarsanız orijinal video kaynağını göremezsiniz.
        </div>
      </div>
    </div>
  );
}
