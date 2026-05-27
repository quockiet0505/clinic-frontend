/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

interface ToastContextValue {
  toasts: Toast[];

  toast: (
    props: Omit<Toast, 'id'>,
  ) => void;

  removeToast: (id: string) => void;
}

const ToastContext =
  createContext<
    ToastContextValue | undefined
  >(undefined);

export const ToastProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [toasts, setToasts] =
    useState<Toast[]>([]);

  const toast = useCallback(
    ({
      title,
      description,
      variant = 'default',
    }: Omit<Toast, 'id'>) => {

      const id = Math.random()
        .toString(36)
        .substring(2, 9);

      setToasts((prev) => [
        ...prev,
        {
          id,
          title,
          description,
          variant,
        },
      ]);

      setTimeout(() => {
        setToasts((prev) =>
          prev.filter(
            (t) => t.id !== id,
          ),
        );
      }, 4000);
    },
    [],
  );

  const removeToast = useCallback(
    (id: string) => {
      setToasts((prev) =>
        prev.filter(
          (t) => t.id !== id,
        ),
      );
    },
    [],
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        toast,
        removeToast,
      }}
    >
      {children}

      <Toaster />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context =
    useContext(ToastContext);

  if (!context) {
    throw new Error(
      'useToast must be used within ToastProvider',
    );
  }

  return context;
};

const Toaster = () => {
  const {
    toasts,
    removeToast,
  } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3">

      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`w-[340px] rounded-2xl border p-4 shadow-xl backdrop-blur-sm animate-in slide-in-from-top-5 fade-in duration-300 ${
            toast.variant ===
            'destructive'
              ? 'bg-danger-50 border-red-200 text-red-800'
              : 'bg-success-50 border-green-200 text-green-800'
          }`}
        >

          <div className="flex items-start justify-between gap-3">

            <div className="flex-1">

              <h4 className="text-sm font-bold">
                {toast.title}
              </h4>

              {toast.description && (
                <p className="mt-1 text-xs opacity-90 leading-relaxed">
                  {toast.description}
                </p>
              )}

            </div>

            <button
              onClick={() =>
                removeToast(toast.id)
              }
              className="text-slate-400 hover:text-slate-700 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>

          </div>

        </div>
      ))}

    </div>
  );
};