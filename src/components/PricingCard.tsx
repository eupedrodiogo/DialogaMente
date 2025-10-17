import { Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface PricingFeature {
  text: string;
  available?: boolean;
  highlighted?: boolean;
}

interface PricingCardProps {
  name: string;
  price: number;
  period: string;
  description?: string;
  badge?: string;
  features: PricingFeature[];
  comingSoon?: boolean;
  highlighted?: boolean;
  email?: string;
  onEmailChange?: (email: string) => void;
  onAction?: () => void;
  actionLabel?: string;
  actionDisabled?: boolean;
}

export const PricingCard = ({
  name,
  price,
  period,
  description,
  badge,
  features,
  comingSoon,
  highlighted,
  email,
  onEmailChange,
  onAction,
  actionLabel,
  actionDisabled
}: PricingCardProps) => {
  return (
    <Card 
      className={`p-8 relative ${
        highlighted 
          ? 'border-2 border-purple-500 shadow-2xl scale-105' 
          : comingSoon 
          ? 'opacity-75' 
          : ''
      }`}
    >
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-full">
          {badge}
        </div>
      )}
      
      {comingSoon && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-gray-200 dark:bg-gray-800 text-xs rounded-full">
          Em breve
        </div>
      )}
      
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      
      <div className="mb-6">
        <span className="text-4xl font-bold">R$ {price.toFixed(2).replace('.', ',')}</span>
        <span className="text-muted-foreground">/{period}</span>
        {description && (
          <div className="text-sm text-muted-foreground mt-1">
            {description}
          </div>
        )}
      </div>
      
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            {feature.available === false ? (
              <>
                <Lock className="w-5 h-5 mt-0.5 opacity-50" />
                <span className="opacity-50">{feature.text}</span>
              </>
            ) : (
              <>
                <Check 
                  className={`w-5 h-5 mt-0.5 ${
                    highlighted 
                      ? 'text-purple-500' 
                      : comingSoon 
                      ? 'text-gray-400' 
                      : 'text-green-500'
                  }`} 
                />
                <span className={feature.highlighted ? 'font-semibold' : ''}>
                  {feature.text}
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
      
      {onEmailChange && (
        <Input
          type="email"
          placeholder="Seu melhor email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="mb-3"
        />
      )}
      
      <Button 
        variant={highlighted ? 'default' : 'outline'}
        className={
          highlighted 
            ? 'w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
            : 'w-full'
        }
        onClick={onAction}
        disabled={actionDisabled || comingSoon}
      >
        {actionLabel || 'Começar'}
      </Button>
    </Card>
  );
};
