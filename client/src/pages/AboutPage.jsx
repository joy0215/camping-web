import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AboutPage() {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');

  return (
    <div className="pt-24 md:pt-28 pb-20 bg-stone-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        
        {/* Story */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="eyebrow">{t('about.subtitle')}</p>
            <h1 className="mt-3 font-serif font-medium text-4xl md:text-5xl text-stone-900 tracking-tight">{t('about.title')}</h1>

            <div className="mt-8 space-y-6 text-lg text-stone-700 leading-relaxed max-w-2xl">
              <p>{t('about.p1')}</p>
              <p>{t('about.p2')}</p>
              <p>{t('about.p3')}</p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <img
              src="/images/vibe-stand.jpg"
              alt="CampingTour campervan parked in nature"
              className="w-full aspect-[4/5] object-cover rounded-md bg-stone-200"
            />
          </div>
        </div>

        {/* Contact and Company Info */}
        <div className="mt-16 md:mt-24 pt-12 border-t border-stone-200 grid md:grid-cols-2 gap-12 md:gap-16">
          
          <section>
            <h2 className="font-serif text-2xl text-stone-900">{t('about.contact')}</h2>
            <ul className="mt-6 space-y-5">
              <li className="flex items-start gap-4">
                <Phone size={18} strokeWidth={1.5} className="mt-1 text-orange-600 shrink-0"/>
                <div>
                  <span className="block text-sm text-stone-500">{t('about.phone')}</span>
                  <a href="tel:+886963823606" className="text-stone-900 hover:underline underline-offset-4" dir="ltr">0963-823-606</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Mail size={18} strokeWidth={1.5} className="mt-1 text-orange-600 shrink-0"/>
                <div>
                  <span className="block text-sm text-stone-500">{t('about.email')}</span>
                  <a href="mailto:jchenghe06@gmail.com" className="text-stone-900 hover:underline underline-offset-4 break-all">jchenghe06@gmail.com</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <MapPin size={18} strokeWidth={1.5} className="mt-1 text-orange-600 shrink-0"/>
                <div>
                  <span className="block text-sm text-stone-500">{t('about.location')}</span>
                  <span className="text-stone-900 leading-relaxed">{t('about.locationValue', '北投奇岩捷運站 2 號出口 (抵達後將安排接駁車至車輛所在地)')}</span>
                </div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-stone-900">{t('about.info')}</h2>
            <dl className="mt-6 border-t border-stone-200 text-sm">
              <div className="flex justify-between gap-6 py-3.5 border-b border-stone-200">
                <dt className="text-stone-500">{t('about.company')}</dt>
                <dd className="text-stone-900 text-end">{isZh ? '悠遊旅行社股份有限公司' : 'Yoyo Travel Service Co., Ltd.'}</dd>
              </div>
              <div className="flex justify-between gap-6 py-3.5 border-b border-stone-200">
                <dt className="text-stone-500">{t('about.taxId')}</dt>
                <dd className="text-stone-900 text-end">84293135</dd>
              </div>
              <div className="flex justify-between gap-6 py-3.5 border-b border-stone-200">
                <dt className="text-stone-500">{t('about.rep')}</dt>
                <dd className="text-stone-900 text-end">林繼城</dd>
              </div>
              <div className="flex justify-between gap-6 py-3.5 border-b border-stone-200">
                <dt className="text-stone-500">{t('about.license')}</dt>
                <dd className="text-stone-900 text-end">交觀甲字 5307 號</dd>
              </div>
            </dl>
          </section>

        </div>
      </div>
    </div>
  );
}
