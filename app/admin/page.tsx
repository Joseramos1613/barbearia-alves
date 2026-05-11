"use client";

import { useEffect, useState } from "react";
import { supabase } from "../supabase";

interface Agendamento {
  id: number;
  nome: string;
  telefone: string;
  barbeiro: string;
  servico: string;
  horario: string;
  data_agendamento: string;
}

export default function AdminPage() {
  const [agendamentos, setAgendamentos] =
    useState<Agendamento[]>([]);

  const [loading, setLoading] = useState(true);

  async function carregarAgendamentos() {
    const { data, error } = await supabase
      .from("agendamentos")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) {
      setAgendamentos(data);
    }

    setLoading(false);
  }

  async function excluirAgendamento(id: number) {
    await supabase
      .from("agendamentos")
      .delete()
      .eq("id", id);

    carregarAgendamentos();
  }

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black text-yellow-500 mb-2">
          Painel Administrativo
        </h1>

        <p className="text-zinc-400 mb-10">
          Barbearia Alves
        </p>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className="grid gap-6">
            {agendamentos.map((agendamento) => (
              <div
                key={agendamento.id}
                className="bg-zinc-900 border border-zinc-800 rounded-[30px] p-8"
              >
                <div className="grid md:grid-cols-3 gap-5">
                  <div>
                    <p className="text-zinc-500 text-sm">
                      Cliente
                    </p>

                    <h2 className="text-2xl font-bold">
                      {agendamento.nome}
                    </h2>
                  </div>

                  <div>
                    <p className="text-zinc-500 text-sm">
                      WhatsApp
                    </p>

                    <h2 className="text-2xl font-bold">
                      {agendamento.telefone}
                    </h2>
                  </div>

                  <div>
                    <p className="text-zinc-500 text-sm">
                      Barbeiro
                    </p>

                    <h2 className="text-2xl font-bold">
                      {agendamento.barbeiro}
                    </h2>
                  </div>

                  <div>
                    <p className="text-zinc-500 text-sm">
                      Serviço
                    </p>

                    <h2 className="text-2xl font-bold">
                      {agendamento.servico}
                    </h2>
                  </div>

                  <div>
                    <p className="text-zinc-500 text-sm">
                      Data
                    </p>

                    <h2 className="text-2xl font-bold">
                      {agendamento.data_agendamento}
                    </h2>
                  </div>

                  <div>
                    <p className="text-zinc-500 text-sm">
                      Horário
                    </p>

                    <h2 className="text-2xl font-bold">
                      {agendamento.horario}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() =>
                    excluirAgendamento(agendamento.id)
                  }
                  className="mt-6 bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-2xl font-bold"
                >
                  Excluir Agendamento
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}