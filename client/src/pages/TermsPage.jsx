import React from 'react';
import { Shield, FileText, AlertCircle, Phone, MapPin, Mail, Building, CreditCard, User } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // 🌟 引入翻譯

export default function TermsPage() {
  const { t, i18n } = useTranslation(); // 🌟 啟動翻譯
  const isZh = i18n.language.startsWith('zh');

  return (
    <div className="pt-28 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-700">
            <FileText size={32} />
          </div>
          <h2 className="text-4xl font-serif font-bold text-stone-900 mb-3">{t('terms.title')}</h2>
        </div>

        <div className="space-y-8 animate-fade-in delay-100">

          {/* 1. 服務條款與保險 */}
          <section className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-stone-100">
            <h3 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-3 border-b border-stone-100 pb-4">
              <Shield className="text-orange-600" /> {t('terms.sec1Title')}
            </h3>
            <ul className="space-y-4 text-stone-600 leading-relaxed list-disc list-inside ml-2">
              <li>
                <span className="font-bold text-stone-800">{t('terms.sec1_1')}</span> {t('terms.sec1_1_desc')}
              </li>
              <li>
                <span className="font-bold text-stone-800">{t('terms.sec1_2')}</span> {t('terms.sec1_2_desc')}
              </li>
              <li>
                <span className="font-bold text-stone-800">{t('terms.sec1_3')}</span> {t('terms.sec1_3_desc')}
              </li>
            </ul>
          </section>

          {/* 2. 付款與保證金 */}
          <section className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-stone-100">
            <h3 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-3 border-b border-stone-100 pb-4">
              <CreditCard className="text-orange-600" /> {t('terms.sec2Title')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
                <h4 className="font-bold text-stone-800 mb-2">{t('terms.sec2Pay')}</h4>
                <ul className="text-sm text-stone-600 space-y-2">
                  <li>• {t('terms.sec2Pay_1')}</li>
                  <li>• {t('terms.sec2Pay_2')}</li>
                  <li className="text-red-500">• {t('terms.sec2Pay_3')}</li>
                </ul>
              </div>
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
                <h4 className="font-bold text-stone-800 mb-2">{t('terms.sec2Dep')}</h4>
                <ul className="text-sm text-stone-600 space-y-2">
                  <li>• {t('terms.sec2Dep_1')}</li>
                  <li>• {t('terms.sec2Dep_2')}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. 取消與退費政策 */}
          <section className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-stone-100">
            <h3 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-3 border-b border-stone-100 pb-4">
              <AlertCircle className="text-orange-600" /> {t('terms.sec3Title')}
            </h3>
            
            <div className="bg-stone-50 rounded-2xl p-6 md:p-8 border border-stone-200 mb-6">
              <ul className="space-y-6 text-stone-800">
                <li className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-stone-200 pb-4 gap-2">
                  <span className="block font-bold">{t('terms.sec3_14')}</span>
                  <span className="block font-bold text-green-600 text-lg md:text-right">{t('terms.sec3_14_ref')}</span>
                </li>
                <li className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-stone-200 pb-4 gap-2">
                  <span className="block font-bold">{t('terms.sec3_7')}</span>
                  <span className="block font-bold text-orange-600 text-lg md:text-right">{t('terms.sec3_7_ref')}</span>
                </li>
                <li className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-stone-200 pb-4 gap-2">
                  <span className="block font-bold">{t('terms.sec3_4')}</span>
                  <span className="block font-bold text-orange-600 text-lg md:text-right">{t('terms.sec3_4_ref')}</span>
                </li>
                <li className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-stone-200 pb-4 gap-2">
                  <span className="block font-bold">{t('terms.sec3_1')}</span>
                  <span className="block font-bold text-orange-600 text-lg md:text-right">{t('terms.sec3_1_ref')}</span>
                </li>
                <li className="flex flex-col md:flex-row md:justify-between md:items-center pt-2 gap-2">
                  <span className="block font-bold text-red-600">{t('terms.sec3_0')}</span>
                  <span className="block font-bold text-red-600 text-lg md:text-right">{t('terms.sec3_0_ref')}</span>
                </li>
              </ul>
            </div>
            
            <div className="text-sm text-stone-500 bg-stone-100 p-4 rounded-xl leading-relaxed">
              <p className="mb-2">{t('terms.sec3_note1')}</p>
              <p>{t('terms.sec3_note2')}</p>
            </div>
          </section>

          {/* 4. 公司資訊 */}
          <section className="bg-stone-900 text-white p-8 md:p-10 rounded-3xl shadow-xl">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 border-b border-stone-700 pb-4">
              <Building className="text-orange-500" /> {t('terms.sec4Title')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-stone-300">
              <div className="space-y-4">
                <p className="font-bold text-lg text-white mb-2">{isZh ? '悠遊旅行社股份有限公司' : 'Yoyo Travel Service Co., Ltd.'}</p>
                <p className="flex items-center gap-3"><FileText size={18} className="text-orange-500 shrink-0"/> <span>{t('terms.taxId')}：84293135</span></p>
                <p className="flex items-center gap-3"><Building size={18} className="text-orange-500 shrink-0"/> <span>{t('terms.license')}：5307</span></p>
                <p className="flex items-start gap-3"><MapPin size={18} className="text-orange-500 shrink-0 mt-1"/> <span>{t('terms.address')}：<br/>{isZh ? '桃園市蘆竹區光明路二段251號' : 'No. 251, Sec. 2, Guangming Rd., Luzhu Dist., Taoyuan City'}</span></p>
              </div>
              <div className="space-y-4">
                <p className="font-bold text-lg text-white mb-2">{t('terms.support')}</p>
                <p className="flex items-center gap-3"><User size={18} className="text-orange-500 shrink-0"/> <span>{t('terms.contact')}：{isZh ? '楊哲' : 'Che Yang'}</span></p>
                <p className="flex items-center gap-3"><Phone size={18} className="text-orange-500 shrink-0"/> <span>{t('terms.phone')}：0965-720-586</span></p>
                <p className="flex items-center gap-3"><Mail size={18} className="text-orange-500 shrink-0"/> <span>{t('terms.email')}：cheyang0326@gmail.com</span></p>
                <p className="flex items-start gap-3"><MapPin size={18} className="text-orange-500 shrink-0 mt-1"/> <span>{t('terms.pickup')}：<br/>{isZh ? '台北市北投區大度路一段157-2號' : 'No. 157-2, Sec. 1, Dadu Rd., Beitou Dist., Taipei City'}</span></p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}