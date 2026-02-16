import { useEffect, useState } from 'react';
import { supabase } from '@/core/configs/supabase-client';
import { OrderStatus } from '@/types/order';

export const useRealtimeStatus = (orderId: string) => {
  const [status, setStatus] = useState<OrderStatus | null>(null);

  useEffect(() => {
    if (!orderId) return;

    // Supabase හරහා Order status එකෙහි වෙනස්කම් වලට සවන් දීම (Subscribe)
    const channel = supabase
      .channel('order-status-updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
        (payload) => {
          setStatus(payload.new.status);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  return status;
};