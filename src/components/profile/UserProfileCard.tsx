import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Globe, Twitter, Github, Linkedin } from 'lucide-react';

export const UserProfileCard: React.FC = () => {
  return (
    <Card className="w-full max-w-md overflow-hidden border shadow-sm">
      <div className="h-24 bg-gradient-to-r from-primary to-primary/60" />
      <CardHeader className="relative pb-0 px-6">
        <div className="absolute -top-12 left-6 border-4 border-background rounded-2xl overflow-hidden shadow-lg h-24 w-24 bg-muted">
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200" 
            alt="User" 
            className="h-full w-full object-cover"
          />
        </div>
        <div className="pt-14 space-y-1">
          <h3 className="text-2xl font-bold">Johnathan Doe</h3>
          <p className="text-muted-foreground text-sm font-medium italic">Senior Product Architect</p>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-6 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>john.doe@enterprise-saas.com</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>San Francisco, CA</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-primary hover:underline cursor-pointer">johndoe.dev</span>
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" size="sm" className="flex-1">Message</Button>
          <Button size="sm" className="flex-1">Follow</Button>
        </div>

        <div className="flex justify-center gap-6 pt-4 border-t">
          <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
          <Github className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
          <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
        </div>
      </CardContent>
    </Card>
  );
};
