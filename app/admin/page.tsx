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

  function fazerLogin() {
    if (
      usuario === "admin" &&
      senha === "123456"
    ) {
      localStorage.setItem(
        "admin-logado",
        "true"
      );

      setLogado(true);
    } else {
      alert("Usuário ou senha inválidos.");
    }
  }

  function sair() {
    localStorage.removeItem(
      "admin-logado"
    );

    setLogado(false);
  }

  useEffect(() => {
    const adminLogado =
      localStorage.getItem(
        "admin-logado"
      );

    if (adminLogado === "true") {
      setLogado(true);

      carregarAgendamentos();
    }
  }, []);

  useEffect(() => {
    if (logado) {
      carregarAgendamentos();
    }
  }, [logado]);

  const totalAgendamentos =
    agendamentos.length;

  const faturamentoTotal =
    agendamentos.reduce(
      (total, item) => {
        const partes =
          item.servico.split("-");

        const valor = Number(
          partes[1]
        );

        return total + valor;
      },
      0
    );

  if (!logado) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-[30px] p-10">
          <h1 className="text-4xl font-black text-yellow-500 text-center">
            Login Admin
          </h1>

          <div className="space-y-5 mt-10">
            <input
              value={usuario}
              onChange={(e) =>
                setUsuario(
                  e.target.value
                )
              }
              placeholder="Usuário"
              className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-yellow-500"
            />

            <input
              type="password"
              value={senha}
              onChange={(e) =>
                setSenha(
                  e.target.value
                )
              }
              placeholder="Senha"
              className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-yellow-500"
            />

            <button
              onClick={fazerLogin}
              className="w-full bg-yellow-500 text-black py-4 rounded-2xl font-black text-lg hover:scale-105 transition"
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
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black text-yellow-500 mb-2">
          Painel Administrativo
        </h1>

        <div className="flex items-center justify-between mb-10">
          <p className="text-zinc-400">
            Barbearia Alves
          </p>

          <button
            onClick={sair}
            className="bg-red-600 hover:bg-red-700 transition px-5 py-2 rounded-2xl font-bold"
          >
            Sair
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-400">
              Total de Agendamentos
            </p>

            <h2 className="text-5xl font-black text-yellow-500 mt-3">
              {totalAgendamentos}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-400">
              Faturamento Total
            </p>

            <h2 className="text-5xl font-black text-green-500 mt-3">
              R$ {faturamentoTotal}
            </h2>
          </div>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className="grid gap-6">
            {agendamentos.map(
              (agendamento) => (
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
                        {
                          agendamento.nome
                        }
                      </h2>
                    </div>

                    <div>
                      <p className="text-zinc-500 text-sm">
                        WhatsApp
                      </p>

                      <h2 className="text-2xl font-bold">
                        {
                          agendamento.telefone
                        }
                      </h2>
                    </div>

                    <div>
                      <p className="text-zinc-500 text-sm">
                        Barbeiro
                      </p>

                      <h2 className="text-2xl font-bold">
                        {
                          agendamento.barbeiro
                        }
                      </h2>
                    </div>

                    <div>
                      <p className="text-zinc-500 text-sm">
                        Serviço
                      </p>

                      <h2 className="text-2xl font-bold">
                        {
                          agendamento.servico
                        }
                      </h2>
                    </div>

                    <div>
                      <p className="text-zinc-500 text-sm">
                        Data
                      </p>

                      <h2 className="text-2xl font-bold">
                        {
                          agendamento.data_agendamento
                        }
                      </h2>
                    </div>

                    <div>
                      <p className="text-zinc-500 text-sm">
                        Horário
                      </p>

                      <h2 className="text-2xl font-bold">
                        {
                          agendamento.horario
                        }
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
                    Excluir Agendamento
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}