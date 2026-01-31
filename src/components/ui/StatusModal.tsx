"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { useEffect } from "react";

interface StatusModalProps {
  isOpen: boolean;
  type: "success" | "error";
  title: string;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
}

export function StatusModal({
  isOpen,
  type,
  title,
  message,
  onClose,
  autoClose = true,
}: StatusModalProps) {
  useEffect(() => {
    if (isOpen && autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`w-full max-w-sm bg-white dark:bg-gamer-card border ${
              type === "success" ? "border-green-500/50" : "border-red-500/50"
            } rounded-2xl p-6 text-center shadow-2xl dark:box-glow`}
          >
            <div
              className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                type === "success" ? "bg-green-500/10" : "bg-red-500/10"
              }`}
            >
              {type === "success" ? (
                <CheckCircle className="h-10 w-10 text-green-500" />
              ) : (
                <XCircle className="h-10 w-10 text-red-500" />
              )}
            </div>
            <h3 className="mb-2 text-xl font-bold font-display text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{message}</p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
