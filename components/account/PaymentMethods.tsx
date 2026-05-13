import React from 'react'
import AccountCard from './AccountCard'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { TbDotsVertical } from "react-icons/tb";
import { useLang } from "@/hooks/useLang";

function PaymentMethods() {
  const { t } = useLang();

  return (
       <AccountCard
          title={t("payment.paymentMethods")}
          action={
            <button className="text-xs text-green-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
              + {t("payment.addNewCard")}
            </button>
          }
        >
          <div className="space-y-2">
            {[
              {
                brand: "VISA",
                image: "visa",
                last4: "4242",
                exp: "04/26",
                name: "Jamal Al Maktoum",
                isDefault: true,
              },
              {
                brand: "MC",
                image: "mastercard",
                last4: "8888",
                exp: "11/25",
                name: "Jamal Al Maktoum",
                isDefault: false,
              },
            ].map((card) => (
              <div
                key={card.last4}
                className="flex items-center justify-between p-3 rounded-xl border border-foreground/5 bg-foreground/2 hover:border-foreground/2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-9 h-6 rounded flex items-center justify-center text-[9px] font-black relative",
                    )}
                  >
                    <Image src={`/media/images/payments/${card.image}.png`} alt={card.brand} fill className='object-contain'/>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-900">
                      •••• •••• •••• {card.last4}
                    </p>
                    <p className="text-[10px] text-foreground/40">
                      {t("payment.expires")} {card.exp} · {card.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {card.isDefault && (
                    <span className="text-[10px] bg-foreground/5 text-foreground/60 px-2 py-0.5 rounded-full font-medium">
                      {t("payment.default")}
                    </span>
                  )}
                  <button className="text-foreground/40 hover:text-foreground/60">
                    <TbDotsVertical/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </AccountCard>
  )
}

export default PaymentMethods