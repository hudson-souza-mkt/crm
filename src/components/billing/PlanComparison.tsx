import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star, Crown, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CreditPlan } from "@/types/billing";

interface PlanComparisonProps {
  plans: CreditPlan[];
  currentPlan: string;
}

export function PlanComparison({ plans, currentPlan }: PlanComparisonProps) {
  const handleUpgrade = (planId: string) => {
    console.log('Upgrade to plan:', planId);
  };

  const formatPrice = (price: number, currency: string, period: string) => {
    if (price === 0) return "Sob consulta";
    return `${currency === 'BRL' ? 'R$' : '$'} ${price.toLocaleString()}/${period === 'mensal' ? 'mês' : 'ano'}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Escolha o Plano Ideal</h2>
        <p className="text-muted-foreground">
          Escale seu atendimento com IA de acordo com suas necessidades
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = plan.id === currentPlan;
          const isPopular = plan.popular;
          const isEnterprise = plan.enterprise;

          return (
            <Card 
              key={plan.id} 
              className={cn(
                "relative transition-all duration-200",
                isCurrentPlan && "ring-2 ring-primary",
                isPopular && "border-primary shadow-lg scale-105",
                isEnterprise && "border-purple-500"
              )}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    Mais Popular
                  </Badge>
                </div>
              )}

              {isEnterprise && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white">
                    <Crown className="h-3 w-3 mr-1" />
                    Enterprise
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {plan.id === 'starter' && <Zap className="h-5 w-5 text-blue-500" />}
                  {plan.id === 'professional' && <Star className="h-5 w-5 text-yellow-500" />}
                  {plan.id === 'business' && <Crown className="h-5 w-5 text-purple-500" />}
                  {plan.id === 'enterprise' && <Crown className="h-5 w-5 text-purple-600" />}
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                </div>
                
                <div className="text-3xl font-bold">
                  {formatPrice(plan.price, plan.currency, plan.period)}
                </div>
                
                <CardDescription className="mt-2">
                  {plan.description}
                </CardDescription>

                {plan.tokens > 0 && (
                  <div className="mt-3 p-2 bg-muted rounded-lg">
                    <p className="text-sm font-medium">
                      {plan.tokens === -1 ? 'Tokens Ilimitados' : `${plan.tokens.toLocaleString()} tokens/mês`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {plan.maxAgents === -1 ? 'Agentes ilimitados' : `Até ${plan.maxAgents} agentes`}
                    </p>
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature.id} className="flex items-start gap-2">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className={cn(
                          "text-sm font-medium",
                          !feature.included && "text-muted-foreground line-through"
                        )}>
                          {feature.name}
                          {feature.limit && feature.limit > 0 && (
                            <span className="text-xs text-muted-foreground ml-1">
                              (até {feature.limit})
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  {isCurrentPlan ? (
                    <Button variant="outline" className="w-full" disabled>
                      Plano Atual
                    </Button>
                  ) : isEnterprise ? (
                    <Button variant="outline" className="w-full">
                      Falar com Vendas
                    </Button>
                  ) : (
                    <Button 
                      className="w-full"
                      variant={isPopular ? "default" : "outline"}
                      onClick={() => handleUpgrade(plan.id)}
                    >
                      {plan.price > 0 ? 'Fazer Upgrade' : 'Escolher Plano'}
                    </Button>
                  )}
                </div>

                {isCurrentPlan && (
                  <div className="text-center">
                    <Badge variant="secondary">Plano Ativo</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Comparação Detalhada */}
      <Card>
        <CardHeader>
          <CardTitle>Comparação Detalhada</CardTitle>
          <CardDescription>
            Veja todas as diferenças entre os planos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Recurso</th>
                  {plans.map(plan => (
                    <th key={plan.id} className="text-center py-3 px-2">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-2 font-medium">Tokens por mês</td>
                  {plans.map(plan => (
                    <td key={plan.id} className="text-center py-3 px-2">
                      {plan.tokens === -1 ? 'Ilimitado' : plan.tokens.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-2 font-medium">Número de agentes</td>
                  {plans.map(plan => (
                    <td key={plan.id} className="text-center py-3 px-2">
                      {plan.maxAgents === -1 ? 'Ilimitado' : plan.maxAgents}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-2 font-medium">Canais de comunicação</td>
                  {plans.map(plan => (
                    <td key={plan.id} className="text-center py-3 px-2">
                      {plan.features.find(f => f.id === 'channels')?.name || 'Básico'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-2 font-medium">Suporte</td>
                  {plans.map(plan => (
                    <td key={plan.id} className="text-center py-3 px-2">
                      {plan.features.find(f => f.id === 'support')?.name || 'Email'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-2 font-medium">Analytics</td>
                  {plans.map(plan => (
                    <td key={plan.id} className="text-center py-3 px-2">
                      {plan.features.find(f => f.id === 'analytics')?.included ? (
                        <Check className="h-4 w-4 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-gray-400 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}