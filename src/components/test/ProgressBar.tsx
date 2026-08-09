"use client";

import { motion } from "framer-motion";

interface Props {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: Props) {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex justify-between text-xs text-brand-muted">
        <span>测试进度</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-1 bg-brand-border rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-brand-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
