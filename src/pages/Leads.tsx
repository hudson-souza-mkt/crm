// ... imports omitidos

export default function Leads() {
  const queryClient = useQueryClient();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  // outros estados omitidos...

  const createLeadMutation = useMutation({
    mutationFn: async (formData: any) => {
      // Garante que o usuário está logado
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) {
        console.error("Erro ao obter usuário:", userError);
        throw new Error("Falha ao verificar autenticação");
      }
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      // Insere o lead no Supabase
      const { error } = await supabase.from("leads").insert({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        company: formData.company,
        source: formData.source,
        value: formData.value,
        notes: formData.notes,
        status: 'new',
        user_id: user.id,
      });

      // Se houver erro, lança um Error JS com a mensagem do Supabase
      if (error) {
        console.error("Erro do Supabase ao inserir lead:", error);
        throw new Error(error.message || "Erro desconhecido ao criar lead");
      }
    },
    onSuccess: () => {
      toast.success("Lead criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setAddDialogOpen(false);
    },
    onError: (err: any) => {
      // Garante exibição da mensagem, mesmo que seja genérica
      console.error("Erro na mutação createLeadMutation:", err);
      toast.error(`Falha ao criar lead: ${err.message || err}`);
    },
  });

  // ... restante do componente
}