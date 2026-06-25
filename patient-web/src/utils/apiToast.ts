import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipToast?: boolean;
    skipSuccessToast?: boolean;
    toastSuccess?: string;
  }
}

const MUTATION_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export function extractApiMessage(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined;
  const msg = (data as { message?: string }).message;
  return msg?.trim() ? msg.trim() : undefined;
}

export function handleApiSuccessToast(response: AxiosResponse) {
  const config = response.config as InternalAxiosRequestConfig;
  if (config.skipToast || config.skipSuccessToast) return;

  const method = config.method?.toUpperCase();
  if (!method || !MUTATION_METHODS.has(method)) return;

  const payload = response.data as { success?: boolean } | undefined;
  if (payload?.success === false) return;

  toast.success(config.toastSuccess || extractApiMessage(response.data) || 'Thao tác thành công');
}

export function handleApiErrorToast(error: AxiosError) {
  const config = error.config as InternalAxiosRequestConfig | undefined;
  if (config?.skipToast) return;

  if (error.response?.status === 401) return;

  const msg =
    extractApiMessage(error.response?.data) ||
    error.message ||
    'Có lỗi xảy ra, vui lòng thử lại';
  toast.error(msg);
}
