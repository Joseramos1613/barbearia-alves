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
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [logado, setLogado] = useState(false);

  const [agendamentos, setAgendamentos] =
    useState<Agendamento[]>([]);

  async function carregarAgendamentos() {
    const { data } = await supabase
      .from("agendamentos")
      .select("*")
      .order("id", {
        ascending: false,
      });

    if (data) {
      setAgendamentos(data);
    }
  }

  async function excluirAgendamento(
    id: number
  ) {
    await supabase
      .from("agendamentos")
      .delete()
      .eq("id", id);

    carregarAgendamentos();
  }

  function login() {
    if (
      usuario === "admin" &&
      senha === "123456"
    ) {
      setLogado(true);

      localStorage.setItem(
        "admin",
        "true"
      );
    }
  }

  useEffect(() => {
    const admin =
      localStorage.getItem("admin");

    if (admin === "true") {
      setLogado(true);
    }
  }, []);

  useEffect(() => {
    if (logado) {
      carregarAgendamentos();
    }
  }, [logado]);

  if (!logado) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="bg-zinc-900 p-10 rounded-3xl w-full max-w-md border border-zinc-800">

          <img
            src="/logo.png"
            alt="Logo"
            className="w-32 mx-auto mb-6"
          />

          <h1 className="text-4xl font-black text-yellow-500 text-center mb-8">
            Painel Admin
          </h1>

          <div className="space-y-5">
            <input
              value={usuario}
              onChange={(e) =>
                setUsuario(e.target.value)
              }
              placeholder="Usuário"
              className="w-full bg-black text-white border border-zinc-700 rounded-2xl px-5 py-4"
            />

            <input
              type="password"
              value={senha}
              onChange={(e) =>
                setSenha(e.target.value)
              }
              placeholder="Senha"
              className="w-full bg-black text-white border border-zinc-700 rounded-2xl px-5 py-4"
            />

            <button
              onClick={login}
              className="w-full bg-yellow-500 text-black py-4 rounded-2xl font-black"
            >
              Entrar
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center gap-4 mb-10">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-20"
          />

          <div>
            <h1 className="text-5xl font-black text-yellow-500">
              Painel Administrativo
            </h1>

            <p className="text-zinc-400">
              Barbearia Alves
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {agendamentos.map(
            (agendamento) => (
              <div
                key={agendamento.id}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
              >
                <div className="grid md:grid-cols-3 gap-5">

                  <div>
                    <p className="text-zinc-500">
                      Cliente
                    </p>

                    <h2 className="text-2xl font-bold">
                      {agendamento.nome}
                    </h2>
                  </div>

                  <div>
                    <p className="text-zinc-500">
                      Telefone
                    </p>

                    <h2 className="text-2xl font-bold">
                      {agendamento.telefone}
                    </h2>
                  </div>

                  <div>
                    <p className="text-zinc-500">
                      Barbeiro
                    </p>

                    <h2 className="text-2xl font-bold">
                      {agendamento.barbeiro}
                    </h2>
                  </div>

                  <div>
                    <p className="text-zinc-500">
                      Serviço
                    </p>

                    <h2 className="text-2xl font-bold">
                      {agendamento.servico}
                    </h2>
                  </div>

                  <div>
                    <p className="text-zinc-500">
                      Data
                    </p>

                    <h2 className="text-2xl font-bold">
                      {
                        agendamento.data_agendamento
                      }
                    </h2>
                  </div>

                  <div>
                    <p className="text-zinc-500">
                      Horário
                    </p>

                    <h2 className="text-2xl font-bold">
                      {agendamento.horario}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() =>
                    excluirAgendamento(
                      agendamento.id
                    )
                  }
                  className="mt-6 bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-2xl font-bold"
                >
                  Excluir
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}