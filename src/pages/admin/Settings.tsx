import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, Palette, Bell, Shield, Globe } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações da plataforma
        </p>
      </div>

      {/* Settings Sections */}
      <div className="grid gap-6">
        {/* Branding */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <CardTitle>Branding</CardTitle>
            </div>
            <CardDescription>Personalize a identidade visual da plataforma</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="logo">Logo da Plataforma</Label>
                <Input id="logo" type="file" accept="image/*" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="background">Background Login</Label>
                <Input id="background" type="file" accept="image/*" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Cor Principal</Label>
              <div className="flex gap-2">
                <Input id="primaryColor" type="color" defaultValue="#3b82f6" className="w-16 h-10" />
                <Input defaultValue="#3b82f6" className="flex-1" />
              </div>
            </div>
            <Button>Salvar Branding</Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notificações</CardTitle>
            </div>
            <CardDescription>Configure as notificações do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações por E-mail</p>
                <p className="text-sm text-muted-foreground">Receba alertas importantes por e-mail</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Alertas de Pagamento</p>
                <p className="text-sm text-muted-foreground">Notificar sobre pagamentos pendentes</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Novos Cadastros</p>
                <p className="text-sm text-muted-foreground">Notificar quando novas empresas se cadastrarem</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Segurança</CardTitle>
            </div>
            <CardDescription>Configurações de segurança e acesso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Autenticação em Duas Etapas</p>
                <p className="text-sm text-muted-foreground">Exigir 2FA para administradores</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Expiração de Sessão</p>
                <p className="text-sm text-muted-foreground">Tempo de inatividade antes do logout</p>
              </div>
              <div className="flex items-center gap-2">
                <Input type="number" defaultValue="30" className="w-20" />
                <span className="text-sm text-muted-foreground">minutos</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* General */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle>Geral</CardTitle>
            </div>
            <CardDescription>Configurações gerais da plataforma</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platformName">Nome da Plataforma</Label>
              <Input id="platformName" defaultValue="CRM PRO" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">E-mail de Suporte</Label>
              <Input id="supportEmail" type="email" defaultValue="suporte@crmpro.com" />
            </div>
            <Button>Salvar Configurações</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
