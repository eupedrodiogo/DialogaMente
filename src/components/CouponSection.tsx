import { useState } from "react";
import { Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CouponSectionProps {
  initialCouponCode?: string;
  onRedeemSuccess?: () => void;
}

export const CouponSection = ({ initialCouponCode = "", onRedeemSuccess }: CouponSectionProps) => {
  const [couponCode, setCouponCode] = useState(initialCouponCode);
  const [showCouponInput, setShowCouponInput] = useState(!!initialCouponCode);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [validCoupon, setValidCoupon] = useState<any>(null);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const validateCoupon = async (code: string) => {
    if (!code.trim()) return;
    
    setValidatingCoupon(true);
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast({
          title: "Cupom inválido",
          description: "Código não encontrado ou inativo",
          variant: "destructive"
        });
        setValidCoupon(null);
        return;
      }

      if (data.current_uses >= data.max_uses) {
        toast({
          title: "Cupom esgotado",
          description: "Este cupom já atingiu o limite de usos",
          variant: "destructive"
        });
        setValidCoupon(null);
        return;
      }

      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        toast({
          title: "Cupom expirado",
          description: "Este cupom não é mais válido",
          variant: "destructive"
        });
        setValidCoupon(null);
        return;
      }

      setValidCoupon(data);
      toast({
        title: "✅ Cupom VIP Aplicado!",
        description: "Mês 1 GRÁTIS + Benefícios exclusivos",
      });
    } catch (error: any) {
      console.error("Erro ao validar cupom:", error);
      toast({
        title: "Erro",
        description: "Não foi possível validar o cupom",
        variant: "destructive"
      });
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRedeemCoupon = async () => {
    if (!email.trim()) {
      toast({
        title: "Email necessário",
        description: "Por favor, insira seu email",
        variant: "destructive"
      });
      return;
    }

    if (!validCoupon) {
      toast({
        title: "Cupom inválido",
        description: "Valide o cupom antes de resgatar",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('redeem-coupon', {
        body: { email: email.toLowerCase(), coupon_code: validCoupon.code }
      });

      if (error) throw error;

      toast({
        title: "🎉 Cupom resgatado com sucesso!",
        description: "Acesso PRO ativado. Redirecionando...",
      });

      if (onRedeemSuccess) {
        setTimeout(() => onRedeemSuccess(), 2000);
      }
    } catch (error: any) {
      console.error("Erro ao resgatar cupom:", error);
      toast({
        title: "Erro ao resgatar",
        description: error.message || "Tente novamente",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {!showCouponInput ? (
        <button
          onClick={() => setShowCouponInput(true)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
        >
          Tem um código especial? Clique aqui
          <ChevronDown className="w-4 h-4" />
        </button>
      ) : (
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
          <div className="text-center mb-4">
            <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-bold text-lg">Cupom VIP</h3>
            <p className="text-sm text-muted-foreground">
              Insira seu código exclusivo
            </p>
          </div>
          
          {!validCoupon ? (
            <>
              <Input
                placeholder="CODIGO-VIP"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="mb-3"
              />
              <Button
                onClick={() => validateCoupon(couponCode)}
                disabled={validatingCoupon || !couponCode.trim()}
                className="w-full"
                variant="outline"
              >
                {validatingCoupon ? "Validando..." : "Validar Cupom"}
              </Button>
            </>
          ) : (
            <div className="space-y-3">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-green-700 dark:text-green-300 font-semibold text-center">
                  ✅ Cupom Válido!
                </p>
                <p className="text-sm text-center mt-1 text-green-600 dark:text-green-400">
                  Mês 1: GRÁTIS<br />
                  Mês 2: R$ 9,90<br />
                  Mês 3+: R$ 29,90
                </p>
              </div>
              <Input
                type="email"
                placeholder="Seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-2"
              />
              <Button
                onClick={handleRedeemCoupon}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                disabled={!email.trim()}
              >
                🎉 Resgatar Acesso VIP
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
