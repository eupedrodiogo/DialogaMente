export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registrado com sucesso:', registration);

          // Verificar atualizações periodicamente
          setInterval(() => {
            registration.update();
          }, 60000); // Verificar a cada minuto

          // Listener para novas versões
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Nova versão disponível
                  if (confirm('Nova versão disponível! Deseja atualizar?')) {
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Erro ao registrar Service Worker:', error);
        });
    });
  }
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error('Erro ao desregistrar Service Worker:', error);
      });
  }
}

// Função para solicitar permissão de notificações
export async function requestNotificationPermission() {
  if ('Notification' in window && 'serviceWorker' in navigator) {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Permissão de notificação concedida');
      
      // Subscrever para push notifications
      const registration = await navigator.serviceWorker.ready;
      
      try {
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            // Substitua com sua chave VAPID pública
            'YOUR_VAPID_PUBLIC_KEY'
          ),
        });
        
        console.log('Subscrito para push notifications:', subscription);
        
        // Enviar subscription para o servidor
        // await sendSubscriptionToServer(subscription);
        
        return subscription;
      } catch (error) {
        console.error('Erro ao subscrever para push notifications:', error);
      }
    }
  }
  
  return null;
}

// Função auxiliar para converter chave VAPID
function urlBase64ToUint8Array(base64String: string) {
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

// Verificar se está offline
export function isOffline() {
  return !navigator.onLine;
}

// Listener para mudanças de status de conexão
export function setupConnectionListeners(
  onOnline?: () => void,
  onOffline?: () => void
) {
  window.addEventListener('online', () => {
    console.log('Conexão restaurada');
    if (onOnline) onOnline();
  });

  window.addEventListener('offline', () => {
    console.log('Conexão perdida');
    if (onOffline) onOffline();
  });
}

