import React from 'react';
import { Shield, FileText, AlertCircle, Phone, MapPin, Mail, Building, CreditCard } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="pt-28 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-700">
            <FileText size={32} />
          </div>
          <h2 className="text-4xl font-serif font-bold text-stone-900 mb-3">服務條款與退費政策</h2>
          <p className="text-stone-500">Terms of Service & Refund Policy</p>
        </div>

        <div className="space-y-8 animate-fade-in delay-100">

          {/* 1. 服務條款與保險 */}
          <section className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-stone-100">
            <h3 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-3 border-b border-stone-100 pb-4">
              <Shield className="text-orange-600" /> 一、 承租條件與保險規範 (Terms & Insurance)
            </h3>
            <ul className="space-y-4 text-stone-600 leading-relaxed list-disc list-inside ml-2">
              <li>
                <span className="font-bold text-stone-800">年齡與駕照：</span>駕駛須持護照、原國家駕照及國際駕照(IDP)。
                <p className="block text-sm text-stone-500 ml-6 mt-1">Drivers must have a passport, home license, and an International Driving Permit (IDP).</p>
              </li>
              <li>
                <span className="font-bold text-stone-800">保險規定 (重要)：</span>本車已含「強制第三責任險」。外國旅客<span className="text-red-600 font-bold">必須購買租車自負額保險 (Car Hire Excess Insurance)</span>，保險類別須為 CAMPERVAN。若無提供有效保險，我們可能取消訂單，或需支付最高 NT$ 80,000 保證金。
                <p className="block text-sm text-stone-500 ml-6 mt-1">Foreign guests MUST provide Car Hire Excess Insurance (CAMPERVAN category). If no valid insurance is provided, we may cancel your reservation or require a security deposit up to NT$ 80,000.</p>
              </li>
              <li>
                <span className="font-bold text-stone-800">損害責任：</span>車體碰撞、水浸、車內設備(電池/冷氣/床架等)損壞，所有維修費皆由租客負擔。
                <p className="block text-sm text-stone-500 ml-6 mt-1">Renter is responsible for any collision, water damage, and interior equipment damage. All repair costs are the renter's responsibility.</p>
              </li>
            </ul>
          </section>

          {/* 2. 付款與保證金 */}
          <section className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-stone-100">
            <h3 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-3 border-b border-stone-100 pb-4">
              <CreditCard className="text-orange-600" /> 二、 付款與保證金 (Payment & Deposit)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
                <h4 className="font-bold text-stone-800 mb-2">付款時程 Payments</h4>
                <ul className="text-sm text-stone-600 space-y-2">
                  <li>• <span className="font-bold">訂金 30%：</span>下單後 3 日內完成 (Deposit: 30% within 3 days after booking)</li>
                  <li>• <span className="font-bold">尾款：</span>租借日前 14 天付清 (Balance: 14 days before rental date)</li>
                  <li className="text-red-500">• 未如期付款，訂單將自動失效。</li>
                </ul>
              </div>
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
                <h4 className="font-bold text-stone-800 mb-2">保證金 Security Deposit</h4>
                <ul className="text-sm text-stone-600 space-y-2">
                  <li>• 需支付 <span className="font-bold">NT$ 5,000</span> 保證金，用於扣抵 ETC、停車費及罰單。</li>
                  <li>• 扣除相關費用後，餘額將於 30-45 個工作日內退款。</li>
                  <li>• (Refund within 30-45 working days after deductions for tolls and fines).</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. 取消與退費政策 */}
          <section className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-stone-100">
            <h3 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-3 border-b border-stone-100 pb-4">
              <AlertCircle className="text-orange-600" /> 三、 訂單取消與退費政策 (Cancellation Policy)
            </h3>
            
            <div className="bg-stone-50 rounded-2xl p-6 md:p-8 border border-stone-200 mb-6">
              <ul className="space-y-6 text-stone-800">
                <li className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-stone-200 pb-4 gap-2">
                  <div>
                    <span className="block font-bold">出發日前 <span className="text-orange-600 text-lg">14 天(含)以上</span> 取消</span>
                    <span className="block text-sm text-stone-500 mt-1">14 days or more before departure</span>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="block font-bold">退還 <span className="text-green-600 text-lg">100%</span></span>
                    <span className="block text-sm text-stone-500 mt-1">100% of deposit and balance refunded</span>
                  </div>
                </li>
                <li className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-stone-200 pb-4 gap-2">
                  <div>
                    <span className="block font-bold">出發日前 <span className="text-orange-600 text-lg">7 至 13 天內</span> 取消</span>
                    <span className="block text-sm text-stone-500 mt-1">7 to 13 days before departure</span>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="block font-bold">退還 <span className="text-orange-600 text-lg">70%</span></span>
                    <span className="block text-sm text-stone-500 mt-1">70% refunded</span>
                  </div>
                </li>
                <li className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-stone-200 pb-4 gap-2">
                  <div>
                    <span className="block font-bold">出發日前 <span className="text-orange-600 text-lg">4 至 6 天內</span> 取消</span>
                    <span className="block text-sm text-stone-500 mt-1">4 to 6 days before departure</span>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="block font-bold">退還 <span className="text-orange-600 text-lg">60%</span></span>
                    <span className="block text-sm text-stone-500 mt-1">60% refunded</span>
                  </div>
                </li>
                <li className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-stone-200 pb-4 gap-2">
                  <div>
                    <span className="block font-bold">出發日前 <span className="text-orange-600 text-lg">1 至 3 天內</span> 取消</span>
                    <span className="block text-sm text-stone-500 mt-1">1 to 3 days before departure</span>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="block font-bold">退還 <span className="text-orange-600 text-lg">50%</span></span>
                    <span className="block text-sm text-stone-500 mt-1">50% refunded</span>
                  </div>
                </li>
                <li className="flex flex-col md:flex-row md:justify-between md:items-center pt-2 gap-2">
                  <div>
                    <span className="block font-bold text-red-600">出發當日取消</span>
                    <span className="block text-sm text-stone-500 mt-1">On the day of departure</span>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="block font-bold">退還 <span className="text-red-600 text-lg">20%</span></span>
                    <span className="block text-sm text-stone-500 mt-1">20% refunded</span>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="text-sm text-stone-500 bg-stone-100 p-4 rounded-xl leading-relaxed">
              <p className="mb-2">⚠️ 取消須以書面提出，並以原訂出發日為計算基準 (Cancellation requests must be made in writing).</p>
              <p>⚠️ 每筆退款將扣除 <span className="font-bold">NT$ 30 手續費</span>。PayPal 收款人須自行承擔 5% 的平台手續費（由 PayPal 系統直接扣除），實際收到的金額可能會略少於退款總額 (A handling fee of NT$30 applies. PayPal recipients are responsible for the 5% transaction fee).</p>
            </div>
          </section>

          {/* 4. 公司資訊 */}
          <section className="bg-stone-900 text-white p-8 md:p-10 rounded-3xl shadow-xl">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 border-b border-stone-700 pb-4">
              <Building className="text-orange-500" /> 四、 營運公司與聯絡資訊 (Company & Contact)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-stone-300">
              <div className="space-y-4">
                <p className="font-bold text-lg text-white mb-2">悠遊旅行社股份有限公司 <span className="block text-sm font-normal text-stone-400 mt-1">Yoyo Travel Service Co., Ltd.</span></p>
                <p className="flex items-center gap-3"><FileText size={18} className="text-orange-500 shrink-0"/> <span>統一編號 (Tax ID)：84293135</span></p>
                <p className="flex items-center gap-3"><Building size={18} className="text-orange-500 shrink-0"/> <span>交觀甲字 (License No.)：5307 號</span></p>
                <p className="flex items-start gap-3"><MapPin size={18} className="text-orange-500 shrink-0 mt-1"/> <span>公司地址 (Address)：<br/>桃園市蘆竹區光明路二段251號</span></p>
              </div>
              <div className="space-y-4">
                <p className="font-bold text-lg text-white mb-2">客戶服務窗口 <span className="block text-sm font-normal text-stone-400 mt-1">Customer Support</span></p>
                <p className="flex items-center gap-3"><Building size={18} className="text-orange-500 shrink-0"/> <span>聯絡人 (Contact)：楊哲 Che Yang</span></p>
                <p className="flex items-center gap-3"><Phone size={18} className="text-orange-500 shrink-0"/> <span>客服專線 (Phone)：0965-720-586</span></p>
                <p className="flex items-center gap-3"><Mail size={18} className="text-orange-500 shrink-0"/> <span>客服信箱 (Email)：cheyang0326@gmail.com</span></p>
                <p className="flex items-start gap-3"><MapPin size={18} className="text-orange-500 shrink-0 mt-1"/> <span>取車地址 (Pickup Location)：<br/>台北市北投區大度路一段157-2號</span></p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}