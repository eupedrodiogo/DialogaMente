import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Link2, 
  Download,
  Instagram,
  MessageCircle 
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface SocialShareProps {
  title: string;
  description: string;
  url?: string;
  imageUrl?: string;
  hashtags?: string[];
  className?: string;
}

/**
 * Componente de Compartilhamento Social Avançado
 * Suporta Web Share API nativa e compartilhamento em múltiplas plataformas
 */
export const SocialShare = ({
  title,
  description,
  url = window.location.href,
  imageUrl,
  hashtags = ['ComunicaPro', 'PerfilDeComunicacao'],
  className = ''
}: SocialShareProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Verificar se Web Share API está disponível
  const canShare = navigator.share !== undefined;

  /**
   * Compartilhamento nativo usando Web Share API
   */
  const handleNativeShare = async () => {
    if (!canShare) {
      toast({
        title: 'Não suportado',
        description: 'Seu navegador não suporta compartilhamento nativo.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await navigator.share({
        title,
        text: description,
        url,
      });

      toast({
        title: 'Compartilhado!',
        description: 'Conteúdo compartilhado com sucesso.',
      });
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Erro ao compartilhar:', error);
      }
    }
  };

  /**
   * Compartilhar no Facebook
   */
  const shareOnFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
    trackShare('facebook');
  };

  /**
   * Compartilhar no Twitter/X
   */
  const shareOnTwitter = () => {
    const text = `${title}\n\n${description}`;
    const hashtagsStr = hashtags.join(',');
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${hashtagsStr}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
    trackShare('twitter');
  };

  /**
   * Compartilhar no LinkedIn
   */
  const shareOnLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
    trackShare('linkedin');
  };

  /**
   * Compartilhar no WhatsApp
   */
  const shareOnWhatsApp = () => {
    const text = `${title}\n\n${description}\n\n${url}`;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
    trackShare('whatsapp');
  };

  /**
   * Copiar link para área de transferência
   */
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Link copiado!',
        description: 'O link foi copiado para a área de transferência.',
      });
      trackShare('copy_link');
    } catch (error) {
      console.error('Erro ao copiar link:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível copiar o link.',
        variant: 'destructive',
      });
    }
  };

  /**
   * Baixar imagem de compartilhamento
   */
  const downloadShareImage = async () => {
    if (!imageUrl) {
      toast({
        title: 'Imagem não disponível',
        description: 'Não há imagem para download.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `comunicapro-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Download iniciado!',
        description: 'A imagem está sendo baixada.',
      });
      trackShare('download_image');
    } catch (error) {
      console.error('Erro ao baixar imagem:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível baixar a imagem.',
        variant: 'destructive',
      });
    }
  };

  /**
   * Rastrear compartilhamento
   */
  const trackShare = (platform: string) => {
    // Enviar evento para analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'share', {
        method: platform,
        content_type: 'result',
        item_id: url,
      });
    }

    // Salvar no Supabase
    saveShareEvent(platform);
  };

  /**
   * Salvar evento de compartilhamento no banco
   */
  const saveShareEvent = async (platform: string) => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: { user } } = await supabase.auth.getUser();

      await supabase.from('share_events').insert({
        user_id: user?.id,
        platform,
        content_type: 'result',
        url,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Erro ao salvar evento de compartilhamento:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          <Share2 className="mr-2 h-4 w-4" />
          Compartilhar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar Resultado</DialogTitle>
          <DialogDescription>
            Compartilhe seu resultado nas redes sociais ou copie o link
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Compartilhamento Nativo */}
          {canShare && (
            <Button
              onClick={handleNativeShare}
              className="w-full"
              variant="default"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar (Nativo)
            </Button>
          )}

          {/* Redes Sociais */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={shareOnFacebook}
              variant="outline"
              className="w-full"
            >
              <Facebook className="mr-2 h-4 w-4 text-blue-600" />
              Facebook
            </Button>

            <Button
              onClick={shareOnTwitter}
              variant="outline"
              className="w-full"
            >
              <Twitter className="mr-2 h-4 w-4 text-sky-500" />
              Twitter
            </Button>

            <Button
              onClick={shareOnLinkedIn}
              variant="outline"
              className="w-full"
            >
              <Linkedin className="mr-2 h-4 w-4 text-blue-700" />
              LinkedIn
            </Button>

            <Button
              onClick={shareOnWhatsApp}
              variant="outline"
              className="w-full"
            >
              <MessageCircle className="mr-2 h-4 w-4 text-green-600" />
              WhatsApp
            </Button>
          </div>

          {/* Ações Adicionais */}
          <div className="space-y-2">
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="w-full"
            >
              <Link2 className="mr-2 h-4 w-4" />
              Copiar Link
            </Button>

            {imageUrl && (
              <Button
                onClick={downloadShareImage}
                variant="outline"
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Baixar Imagem
              </Button>
            )}
          </div>

          {/* Preview da URL */}
          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs text-muted-foreground break-all">{url}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/**
 * Botão de compartilhamento rápido (versão compacta)
 */
export const QuickShareButton = ({
  title,
  description,
  url,
  className = ''
}: Omit<SocialShareProps, 'imageUrl' | 'hashtags'>) => {
  const canShare = navigator.share !== undefined;
  const { toast } = useToast();

  const handleQuickShare = async () => {
    if (canShare) {
      try {
        await navigator.share({ title, text: description, url });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Erro ao compartilhar:', error);
        }
      }
    } else {
      // Fallback: copiar link
      try {
        await navigator.clipboard.writeText(url || window.location.href);
        toast({
          title: 'Link copiado!',
          description: 'O link foi copiado para a área de transferência.',
        });
      } catch (error) {
        console.error('Erro ao copiar link:', error);
      }
    }
  };

  return (
    <Button
      onClick={handleQuickShare}
      variant="ghost"
      size="sm"
      className={className}
    >
      <Share2 className="h-4 w-4" />
    </Button>
  );
};

