import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  User,
  BarChart3,
  Building,
  Tag,
  ShoppingCart,
  XCircle,
  List,
  PlusSquare,
  Users2,
  Puzzle,
  Wifi,
} from "lucide-react";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { CompanySettings } from "@/components/settings/CompanySettings";
import { TagsSettings } from "@/components/settings/TagsSettings";
import { CustomFieldsSettings } from "@/components/settings/CustomFieldsSettings";

const SettingsPlaceholder = ({ title }: { title: string }) => (
  <div>
    <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
    <p className="text-muted-foreground mt-2">
      Configurações para {title} estarão disponíveis em breve.
    </p>
  </div>
);

const navItems = [
  { id: "profile", label: "Meu perfil", icon: User, component: <ProfileSettings /> },
  { id: "plans", label: "Planos e uso", icon: BarChart3, component: <SettingsPlaceholder title="Planos e Uso" /> },
  { id: "company", label: "Empresa", icon: Building, component: <CompanySettings /> },
  { id: "tags", label: "Tags", icon: Tag, component: <TagsSettings /> },
  { id: "products", label: "Produtos", icon: ShoppingCart, component: <SettingsPlaceholder title="Produtos" /> },
  { id: "loss-reasons", label: "Motivos de perda", icon: XCircle, component: <SettingsPlaceholder title="Motivos de Perda" /> },
  { id: "lists", label: "Listas", icon: List, component: <SettingsPlaceholder title="Listas" /> },
  { id: "custom-fields", label: "Campos adicionais", icon: PlusSquare, component: <CustomFieldsSettings /> },
  { id: "departments", label: "Departamentos", icon: Users2, component: <SettingsPlaceholder title="Departamentos" /> },
  { id: "integrations", label: "Integrações", icon: Puzzle, component: <SettingsPlaceholder title="Integrações" /> },
  { id: "connections", label: "Conexões", icon: Wifi, component: <SettingsPlaceholder title="Conexões" /> },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  const activeComponent = navItems.find(item => item.id === activeTab)?.component;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors text-left",
                activeTab === item.id
                  ? "bg-muted text-primary font-semibold"
                  : "text-muted-foreground hover:bg-muted/50"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="md:border-l md:pl-8">
          {activeComponent}
        </div>
      </div>
    </div>
  );
}