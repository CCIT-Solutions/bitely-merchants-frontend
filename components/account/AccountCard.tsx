import React from 'react'
import Animate from '../animation/Animate';
import { fade } from '@/lib/animation';

function AccountCard({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <Animate variants={fade} className="bg-background rounded-2xl p-5 border border-foreground/5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>
        {action}
      </div>
      {children}
    </Animate>
  );
}

export default AccountCard