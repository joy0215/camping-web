import React from 'react';
import { useTranslation } from 'react-i18next'; // 引入翻譯

export default function TermsPage() {
  const { t, i18n } = useTranslation(); // 啟動翻譯
  const isZh = i18n.language.startsWith('zh');

  const refunds = [
    { when: t('terms.sec3_14'), refund: t('terms.sec3_14_ref') },
    { when: t('terms.sec3_7'), refund: t('terms.sec3_7_ref') },
    { when: t('terms.sec3_4'), refund: t('terms.sec3_4_ref') },
    { when: t('terms.sec3_1'), refund: t('terms.sec3_1_ref') },
    { when: t('terms.sec3_0'), refund: t('terms.sec3_0_ref'), none: true },
  ];

  return (
    <div className="pt-24 md:pt-28 pb-20 bg-stone-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        
        <h1 className="font-serif font-medium text-4xl md:text-5xl text-stone-900 tracking-tight">{t('terms.title')}</h1>

        {/* 1. 服務條款與保險 */}
        <section className="mt-12 pt-8 border-t border-stone-200">
          <h2 className="font-serif text-2xl text-stone-900">{t('terms.sec1Title')}</h2>
          <ul className="mt-5 space-y-4 text-stone-600 leading-relaxed">
            <li><span className="font-semibold text-stone-900">{t('terms.sec1_1')}</span> {t('terms.sec1_1_desc')}</li>
            <li><span className="font-semibold text-stone-900">{t('terms.sec1_2')}</span> {t('terms.sec1_2_desc')}</li>
            <li><span className="font-semibold text-stone-900">{t('terms.sec1_3')}</span> {t('terms.sec1_3_desc')}</li>
          </ul>
        </section>

        {/* 2. 付款與保證金 */}
        <section className="mt-12 pt-8 border-t border-stone-200">
          <h2 className="font-serif text-2xl text-stone-900">{t('terms.sec2Title')}</h2>
          <div className="mt-5 grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-stone-900">{t('terms.sec2Pay')}</h3>
              <ul className="mt-3 space-y-2 text-stone-600 leading-relaxed list-disc ps-5 marker:text-stone-400">
                <li>{t('terms.sec2Pay_1')}</li>
                <li>{t('terms.sec2Pay_2')}</li>
                <li className="text-red-700">{t('terms.sec2Pay_3')}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-stone-900">{t('terms.sec2Dep')}</h3>
              <ul className="mt-3 space-y-2 text-stone-600 leading-relaxed list-disc ps-5 marker:text-stone-400">
                <li>{t('terms.sec2Dep_1')}</li>
                <li>{t('terms.sec2Dep_2')}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. 取消與退費政策 */}
        <section className="mt-12 pt-8 border-t border-stone-200">
          <h2 className="font-serif text-2xl text-stone-900">{t('terms.sec3Title')}</h2>
          
          <dl className="mt-5 bg-white border border-stone-200 rounded-md divide-y divide-stone-200">
            {refunds.map((r, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-6 px-5 py-4">
                <dt className="text-stone-700">{r.when}</dt>
                <dd className={`font-semibold sm:text-end ${r.none ? 'text-red-700' : 'text-stone-900'}`}>{r.refund}</dd>
              </div>
            ))}
          </dl>
          
          <div className="mt-5 text-sm text-stone-500 leading-relaxed space-y-2">
            <p>{t('terms.sec3_note1')}</p>
            <p>{t('terms.sec3_note2')}</p>
          </div>
        </section>

        {/* 4. 公司資訊 */}
        <section className="mt-12 pt-8 border-t border-stone-200">
          <h2 className="font-serif text-2xl text-stone-900">{t('terms.sec4Title')}</h2>
          <div className="mt-5 grid md:grid-cols-2 gap-8 text-stone-600 leading-relaxed">
            <div>
              <h3 className="font-semibold text-stone-900">{isZh ? '悠遊旅行社股份有限公司' : 'Yoyo Travel Service Co., Ltd.'}</h3>
              <dl className="mt-3 space-y-2">
                <div><dt className="inline text-stone-500">{t('terms.taxId')}: </dt><dd className="inline">84293135</dd></div>
                <div><dt className="inline text-stone-500">{t('terms.license')}: </dt><dd className="inline">5307</dd></div>
                <div><dt className="text-stone-500">{t('terms.address')}</dt><dd>{isZh ? '桃園市蘆竹區光明路二段251號' : 'No. 251, Sec. 2, Guangming Rd., Luzhu Dist., Taoyuan City'}</dd></div>
              </dl>
            </div>
            <div>
              <h3 className="font-semibold text-stone-900">{t('terms.support')}</h3>
              <dl className="mt-3 space-y-2">
                <div><dt className="inline text-stone-500">{t('terms.contact')}: </dt><dd className="inline">{isZh ? '何錦程' : 'Jace He'}</dd></div>
                <div><dt className="inline text-stone-500">{t('terms.phone')}: </dt><dd className="inline" dir="ltr">0963-823-606</dd></div>
                <div><dt className="inline text-stone-500">{t('terms.email')}: </dt><dd className="inline">jchenghe@gmail.com</dd></div>
                <div><dt className="text-stone-500">{t('terms.pickup')}</dt><dd>{isZh ? '北投奇岩捷運站 2 號出口 (抵達後將安排接駁車至車輛所在地)' : 'No. 157-2, Sec. 1, Dadu Rd., Beitou Dist., Taipei City'}</dd></div>
              </dl>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
