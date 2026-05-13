import React from 'react'
import AccountCard from './AccountCard'
import { BsCreditCardFill } from "react-icons/bs";
import Currency from '../icons/Currency';
import { useLang } from "@/hooks/useLang";

function BillingHistory() {
  const { t } = useLang();

  return (
     <AccountCard
          title={t("payment.billingHistory")}
          action={
            <button className="text-xs text-foreground/70 font-medium flex items-center gap-1 hover:gap-2 transition-all">
              {t("payment.viewAllInvoices")} →
            </button>
          }
        >
          <div className="space-y-2">
            {[
              {
                date: "May 12, 2024",
                desc: t("payment.bitelySignatureMonthly"),
                amount: "750",
              },
              {
                date: "Apr 12, 2024",
                desc: t("payment.bitelySignatureMonthly"),
                amount: "750",
              },
              {
                date: "Mar 12, 2024",
                desc: t("payment.bitelySignatureMonthly"),
                amount: "750",
              },
            ].map((b, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2.5 border-b border-foreground/2 bg-background last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center">
                  <BsCreditCardFill className='size-3 text-primary'/>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-900">
                      {b.date}
                    </p>
                    <p className="text-[10px] text-foreground/40">{b.desc}</p>
                  </div>
                </div>
                <p className="text-xs font-semibold text-neutral-700 flex gap-1 items-center">
                  {b.amount} <Currency/>
                </p>
              </div>
            ))}
          </div>
        </AccountCard>
  )
}

export default BillingHistory