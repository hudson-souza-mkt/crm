import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, HelpCircle, Search, BookOpen } from "lucide-react";
import { useState } from "react";
import type { AIAgent, FAQ, KnowledgeItem } from "@/types/aiAgent";

interface AgentFAQConfigProps {
  data: Partial<AIAgent>;
  onChange: (updates: Partial<AIAgent>) => void;
  onSave: () => void;
}

export function AgentFAQConfig({ data, onChange, onSave }: AgentFAQConfigProps) {
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [faqForm, setFaqForm] = useState<Partial<FAQ>>({});
  const [editingKnowledge, setEditingKnowledge] = useState<KnowledgeItem | null>(null);
  const [knowledgeForm, setKnowledgeForm] = useState<Partial<KnowledgeItem>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddFAQ = () => {
    setEditingFAQ(null);
    setFaqForm({
      question: "",
      answer: "",
      category: "",
      keywords: [],
      priority: "media"
    });
  };

  const handleEditFAQ = (faq: FAQ) => {
    setEditingFAQ(faq);
    setFaqForm(faq);
  };

  const handleSaveFAQ = () => {
    if (!faqForm.question || !faqForm.answer) return;

    const newFAQ: FAQ = {
      id: editingFAQ?.id || `faq-${Date.now()}`,
      question: faqForm.question || "",
      answer: faqForm.answer || "",
      category: faqForm.category || "Geral",
      keywords: faqForm.keywords || [],
      priority: faqForm.priority || "media"
    };

    const currentFAQs = data.faqs || [];
    const updatedFAQs = editingFAQ
      ? currentFAQs.map(f => f.id === editingFAQ.id ? newFAQ : f)
      : [...currentFAQs, newFAQ];

    onChange({ faqs: updatedFAQs });
    setEditingFAQ(null);
    setFaqForm({});
  };

  const handleDeleteFAQ = (faqId: string) => {
    const updatedFAQs = (data.faqs || []).filter(f => f.id !== faqId);
    onChange({ faqs: updatedFAQs });
  };

  const handleAddKnowledge = () => {
    setEditingKnowledge(null);
    setKnowledgeForm({
      title: "",
      content: "",
      category: "",
      tags: []
    });
  };

  const handleEditKnowledge = (knowledge: KnowledgeItem) => {
    setEditingKnowledge(knowledge);
    setKnowledgeForm(knowledge);
  };

  const handleSaveKnowledge = () => {
    if (!knowledgeForm.title || !knowledgeForm.content) return;

    const newKnowledge: KnowledgeItem = {
      id: editingKnowledge?.id || `knowledge-${Date.now()}`,
      title: knowledgeForm.title || "",
      content: knowledgeForm.content || "",
      category: knowledgeForm.category || "Geral",
      tags: knowledgeForm.tags || [],
      lastUpdated: new Date()
    };

    const currentKnowledge = data.knowledgeBase || [];
    const updatedKnowledge = editingKnowledge
      ? currentKnowledge.map(k => k.id === editingKnowledge.id ? newKnowledge : k)
      : [...currentKnowledge, newKnowledge];

    onChange({ knowledgeBase: updatedKnowledge });
    setEditingKnowledge(null);
    setKnowledgeForm({});
  };

  const handleDeleteKnowledge = (knowledgeId: string) => {
    const updatedKnowledge = (data.knowledgeBase || []).filter(k => k.id !== knowledgeId);
    onChange({ knowledgeBase: updatedKnowledge });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta": return "bg-red-100 text-red-700";
      case "media": return "bg-yellow-100 text-yellow-700";
      case "baixa": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filteredFAQs = (data.faqs || []).filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredKnowledge = (data.knowledgeBase || []).filter(knowledge =>
    knowledge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    knowledge.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    knowledge.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">FAQ e Base de Conhecimento</h3>
        <p className="text-sm text-muted-foreground">
          Configure perguntas frequentes e documentos que o agente deve conhecer
        </p>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar FAQs e conhecimento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FAQ Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-medium flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Perguntas Frequentes
            </h4>
            <Button onClick={handleAddFAQ} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar FAQ
            </Button>
          </div>

          {/* Lista de FAQs */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {filteredFAQs.map((faq) => (
              <Card key={faq.id} className="hover:shadow-sm transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-sm font-medium line-clamp-2">
                        {faq.question}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {faq.category}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(faq.priority)}`}>
                          {faq.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditFAQ(faq)}
                        className="h-6 w-6"
                      >
                        <HelpCircle className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteFAQ(faq.id)}
                        className="h-6 w-6 text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {faq.answer}
                  </p>
                  {faq.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {faq.keywords.slice(0, 3).map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                      {faq.keywords.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{faq.keywords.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Formulário de FAQ */}
          {(editingFAQ !== null || Object.keys(faqForm).length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {editingFAQ ? "Editar FAQ" : "Nova FAQ"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="faqQuestion">Pergunta</Label>
                  <Input
                    id="faqQuestion"
                    value={faqForm.question || ""}
                    onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                    placeholder="Ex: Qual o tempo de implementação?"
                  />
                </div>

                <div>
                  <Label htmlFor="faqAnswer">Resposta</Label>
                  <Textarea
                    id="faqAnswer"
                    value={faqForm.answer || ""}
                    onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                    placeholder="Resposta completa..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="faqCategory">Categoria</Label>
                    <Input
                      id="faqCategory"
                      value={faqForm.category || ""}
                      onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                      placeholder="Ex: Implementação"
                    />
                  </div>
                  <div>
                    <Label htmlFor="faqPriority">Prioridade</Label>
                    <Select
                      value={faqForm.priority}
                      onValueChange={(value) => setFaqForm({ ...faqForm, priority: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="baixa">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveFAQ} size="sm">
                    {editingFAQ ? "Atualizar" : "Adicionar"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingFAQ(null);
                      setFaqForm({});
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Knowledge Base Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-medium flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Base de Conhecimento
            </h4>
            <Button onClick={handleAddKnowledge} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Documento
            </Button>
          </div>

          {/* Lista de Conhecimento */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {filteredKnowledge.map((knowledge) => (
              <Card key={knowledge.id} className="hover:shadow-sm transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-sm font-medium line-clamp-2">
                        {knowledge.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {knowledge.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {knowledge.lastUpdated.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditKnowledge(knowledge)}
                        className="h-6 w-6"
                      >
                        <BookOpen className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteKnowledge(knowledge.id)}
                        className="h-6 w-6 text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {knowledge.content}
                  </p>
                  {knowledge.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {knowledge.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {knowledge.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{knowledge.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Formulário de Conhecimento */}
          {(editingKnowledge !== null || Object.keys(knowledgeForm).length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {editingKnowledge ? "Editar Documento" : "Novo Documento"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="knowledgeTitle">Título</Label>
                  <Input
                    id="knowledgeTitle"
                    value={knowledgeForm.title || ""}
                    onChange={(e) => setKnowledgeForm({ ...knowledgeForm, title: e.target.value })}
                    placeholder="Ex: Como configurar automações"
                  />
                </div>

                <div>
                  <Label htmlFor="knowledgeContent">Conteúdo</Label>
                  <Textarea
                    id="knowledgeContent"
                    value={knowledgeForm.content || ""}
                    onChange={(e) => setKnowledgeForm({ ...knowledgeForm, content: e.target.value })}
                    placeholder="Conteúdo do documento..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="knowledgeCategory">Categoria</Label>
                  <Input
                    id="knowledgeCategory"
                    value={knowledgeForm.category || ""}
                    onChange={(e) => setKnowledgeForm({ ...knowledgeForm, category: e.target.value })}
                    placeholder="Ex: Tutoriais"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveKnowledge} size="sm">
                    {editingKnowledge ? "Atualizar" : "Adicionar"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingKnowledge(null);
                      setKnowledgeForm({});
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Ações */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancelar</Button>
        <Button onClick={onSave}>Salvar FAQ e Conhecimento</Button>
      </div>
    </div>
  );
}