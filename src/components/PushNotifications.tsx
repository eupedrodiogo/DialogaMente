import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * Componente de Notificações Push
 * Gerencia permissões e envio de notificações push para engajamento do usuário
 */
export const PushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se notificações são suportadas
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
      
      // Verificar status atual da permissão
      if (Notification.permission === 'granted') {
        setIsSubscribed(true);
      }
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      toast({
        title: 'Não suportado',
        description: 'Seu navegador não suporta notificações push.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        setIsSubscribed(true);
        
        // Registrar service worker para notificações
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          
          // Criar subscription
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
              import.meta.env.VITE_VAPID_PUBLIC_KEY || ''
            ),
          });

          // Salvar subscription no backend (Supabase)
          await saveSubscription(subscription);
        }

        toast({
          title: 'Notificações ativadas!',
          description: 'Você receberá notificações sobre novos conteúdos e conquistas.',
        });

        // Enviar notificação de boas-vindas
        sendWelcomeNotification();
      } else {
        toast({
          title: 'Permissão negada',
          description: 'Você pode ativar as notificações nas configurações do navegador.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível ativar as notificações.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribe = async () => {
    setIsLoading(true);

    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        
        if (subscription) {
          await subscription.unsubscribe();
          await removeSubscription(subscription);
        }
      }

      setIsSubscribed(false);
      
      toast({
        title: 'Notificações desativadas',
        description: 'Você não receberá mais notificações push.',
      });
    } catch (error) {
      console.error('Erro ao desinscrever:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível desativar as notificações.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendWelcomeNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('Bem-vindo ao ComunicaPro! 🎉', {
        body: 'Notificações ativadas com sucesso. Você receberá atualizações sobre novos conteúdos e conquistas!',
        icon: '/icon-192.png',
        badge: '/icon-96.png',
        tag: 'welcome',
        requireInteraction: false,
      });
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {isSubscribed ? (
        <Button
          variant="outline"
          size="sm"
          onClick={unsubscribe}
          disabled={isLoading}
          className="gap-2"
        >
          <BellOff className="h-4 w-4" />
          Desativar Notificações
        </Button>
      ) : (
        <Button
          variant="default"
          size="sm"
          onClick={requestPermission}
          disabled={isLoading}
          className="gap-2"
        >
          <Bell className="h-4 w-4" />
          Ativar Notificações
        </Button>
      )}
    </div>
  );
};

// Funções auxiliares

/**
 * Converte chave VAPID de base64 para Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Salva subscription no Supabase
 */
async function saveSubscription(subscription: PushSubscription) {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from('push_subscriptions').upsert({
      user_id: user.id,
      subscription: subscription.toJSON(),
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao salvar subscription:', error);
  }
}

/**
 * Remove subscription do Supabase
 */
async function removeSubscription(subscription: PushSubscription) {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const endpoint = subscription.endpoint;
    
    await supabase
      .from('push_subscriptions')
      .delete()
      .eq('user_id', user.id)
      .eq('subscription->>endpoint', endpoint);
  } catch (error) {
    console.error('Erro ao remover subscription:', error);
  }
}

/**
 * Hook para enviar notificações programáticas
 */
export const usePushNotification = () => {
  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/icon-192.png',
        badge: '/icon-96.png',
        ...options,
      });
    }
  };

  const sendAchievementNotification = (achievementName: string) => {
    sendNotification('Nova Conquista Desbloqueada! 🏆', {
      body: `Parabéns! Você conquistou: ${achievementName}`,
      tag: 'achievement',
      requireInteraction: true,
    });
  };

  const sendTestReminderNotification = () => {
    sendNotification('Lembrete de Teste 📝', {
      body: 'Que tal fazer um novo teste de comunicação hoje?',
      tag: 'reminder',
      requireInteraction: false,
    });
  };

  return {
    sendNotification,
    sendAchievementNotification,
    sendTestReminderNotification,
  };
};

