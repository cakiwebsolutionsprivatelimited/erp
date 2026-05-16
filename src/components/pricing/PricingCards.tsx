import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/utils';

const tiers = [
  {
    name: 'Starter',
    price: '$0',
    description: 'Perfect for side projects and small teams.',
    features: ['Up to 5 users', 'Basic analytics', 'Community support', '1GB storage'],
    buttonText: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$49',
    description: 'Advanced features for scaling businesses.',
    features: ['Unlimited users', 'Advanced reporting', 'Priority support', '50GB storage', 'Custom domains'],
    buttonText: 'Go Pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$999',
    description: 'Custom solutions for large organizations.',
    features: ['SSO/SAML', 'Dedicated account manager', '24/7 phone support', 'Unlimited storage', 'Custom contracts'],
    buttonText: 'Contact Sales',
    popular: false,
  },
];

export const PricingCards: React.FC = () => {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {tiers.map((tier) => (
        <Card key={tier.name} className={cn(
          "relative flex flex-col justify-between border shadow-sm transition-all hover:shadow-md",
          tier.popular && "border-primary ring-1 ring-primary"
        )}>
          {tier.popular && (
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-0 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
              Most Popular
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
            <CardDescription>{tier.description}</CardDescription>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight">{tier.price}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3 text-sm">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant={tier.popular ? 'default' : 'outline'}>
              {tier.buttonText}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
