import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { PricingCard } from "@/components/PricingCard";
import { CouponSection } from "@/components/CouponSection";
import { PRICING_PLANS } from "@/lib/constants";

const Pricing = () => {
  const [email, setEmail] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCoupon = params.get('coupon') || params.get('c');
    if (urlCoupon) {
      setCouponCode(urlCoupon);
    }
  }, []);

  const handleCheckout = async (priceId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { price_id: priceId, email }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error("Erro no checkout:", error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar o checkout",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
              Oferta de Lançamento
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Desbloqueie Seu Potencial
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Acesse análises profundas, conteúdo exclusivo e ferramentas premium
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <PricingCard
            {...PRICING_PLANS.free}
            actionLabel="Começar Grátis"
            onAction={() => navigate('/')}
          />

          <PricingCard
            {...PRICING_PLANS.promo}
            highlighted
            email={email}
            onEmailChange={setEmail}
            actionLabel={`Garantir Vaga - R$ ${PRICING_PLANS.promo.price.toFixed(2).replace('.', ',')}/${PRICING_PLANS.promo.period}`}
            onAction={() => handleCheckout(PRICING_PLANS.promo.priceId!)}
            actionDisabled={!email.trim()}
          />

          <PricingCard
            {...PRICING_PLANS.normal}
            actionLabel="Disponível em breve"
          />
        </div>

        {/* Coupon Section */}
        <CouponSection
          initialCouponCode={couponCode}
          onRedeemSuccess={() => navigate('/dashboard')}
        />
      </div>
    </div>
  );
};

export default Pricing;
