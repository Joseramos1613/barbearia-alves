"use client";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { useEffect, useState } from "react";
import { supabase } from "../supabase";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

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

  const [dataSelecionada, setDataSelecionada] =
    useState(new Date());

  const [dataBloqueio, setDataBloqueio] =
    useState("");

  const [horarioBloqueio, setHorarioBloqueio] =
    useState("");

  const [barbeiroBloqueio, setBarbeiroBloqueio] =
    useState("");

  const [motivoBloqueio, setMotivoBloqueio] =
    useState("");

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
    const { error } = await supabase
      .from("agendamentos")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Erro ao excluir");
      console.log(error);
      return;
    }

    carregarAgendamentos();
  }

  async function editarHorario(
    id: number,
    novoHorario: string
  ) {
    const { error } = await supabase
      .from("agendamentos")
      .update({
        horario: novoHorario,
      })
      .eq("id", id);

    if (error) {
      alert("Erro ao editar");
      console.log(error);
      return;
    }

    alert("Horário atualizado!");

    carregarAgendamentos();
  }

  async function bloquearHorario() {
    if (
      !dataBloqueio ||
      !horarioBloqueio ||
      !barbeiroBloqueio
    ) {
      alert("Preencha os campos");
      return;
    }

    const { error } = await supabase
      .from("bloqueios")
      .insert([
        {
          data: dataBloqueio,
          horario: horarioBloqueio,
          barbeiro: barbeiroBloqueio,
          motivo: motivoBloqueio,
        },
      ]);

    if (error) {
      alert("Erro ao bloquear");
      console.log(error);
      return;
    }

    alert("Horário bloqueado!");

    setDataBloqueio("");
    setHorarioBloqueio("");
    setBarbeiroBloqueio("");
    setMotivoBloqueio("");
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

  const joseTotal =
    agendamentos.filter(
      (item) =>
        item.barbeiro ===
        "José Ramos"
    ).length;

  const pierreTotal =
    agendamentos.filter(
      (item) =>
        item.barbeiro ===
        "Pierre Ramos"
    ).length;

  const graficoBarbeiros = [
    {
      nome: "José",
      total: joseTotal,
    },
    {
      nome: "Pierre",
      total: pierreTotal,
    },
  ];

  const graficoFinanceiro = [
    {
      nome: "Agendamentos",
      total: totalAgendamentos,
    },
    {
      nome: "Faturamento",
      total: faturamentoTotal,
    },
  ];

  const pieData = [
    {
      name: "José",
      value: joseTotal,
    },
    {
      name: "Pierre",
      value: pierreTotal,
    },
  ];

  const COLORS = [
    "#eab308",
    "#22c55e",
  ];

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
              className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4 outline-none"
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
              className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4 outline-none"
            />

            <button
              onClick={fazerLogin}
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
      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-5xl font-black text-yellow-500">
              Dashboard Premium
            </h1>

            <p className="text-zinc-400 mt-2">
              Barbearia Alves
            </p>
          </div>

          <button
            onClick={sair}
            className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-2xl font-bold"
          >
            Sair
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-5 mb-10">

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-400">
              Agendamentos
            </p>

            <h2 className="text-5xl font-black text-yellow-500 mt-3">
              {totalAgendamentos}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-400">
              Faturamento
            </p>

            <h2 className="text-5xl font-black text-green-500 mt-3">
              R$ {faturamentoTotal}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-400">
              José Ramos
            </p>

            <h2 className="text-5xl font-black text-blue-500 mt-3">
              {joseTotal}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-400">
              Pierre Ramos
            </p>

            <h2 className="text-5xl font-black text-purple-500 mt-3">
              {pierreTotal}
            </h2>
          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 h-[350px]">
            <h2 className="text-2xl font-black text-yellow-500 mb-5">
              Financeiro
            </h2>

            <ResponsiveContainer>
              <BarChart data={graficoFinanceiro}>
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#eab308" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 h-[350px]">
            <h2 className="text-2xl font-black text-yellow-500 mb-5">
              Barbeiros
            </h2>

            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  {pieData.map(
                    (_, index) => (
                      <Cell
                        key={index}
                        fill={
                          COLORS[index]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-10">
          <h2 className="text-3xl font-black text-yellow-500 mb-6">
            Bloquear Horário
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <input
              type="date"
              value={dataBloqueio}
              onChange={(e) =>
                setDataBloqueio(
                  e.target.value
                )
              }
              className="bg-black border border-zinc-700 rounded-2xl px-5 py-4"
            />

            <input
              value={horarioBloqueio}
              onChange={(e) =>
                setHorarioBloqueio(
                  e.target.value
                )
              }
              placeholder="Horário"
              className="bg-black border border-zinc-700 rounded-2xl px-5 py-4"
            />

            <select
              value={barbeiroBloqueio}
              onChange={(e) =>
                setBarbeiroBloqueio(
                  e.target.value
                )
              }
              className="bg-black border border-zinc-700 rounded-2xl px-5 py-4"
            >
              <option value="">
                Escolha o barbeiro
              </option>

              <option>
                José Ramos
              </option>

              <option>
                Pierre Ramos
              </option>
            </select>

            <input
              value={motivoBloqueio}
              onChange={(e) =>
                setMotivoBloqueio(
                  e.target.value
                )
              }
              placeholder="Motivo"
              className="bg-black border border-zinc-700 rounded-2xl px-5 py-4"
            />

          </div>

          <button
            onClick={bloquearHorario}
            className="mt-6 bg-yellow-500 text-black px-8 py-4 rounded-2xl font-black"
          >
            Bloquear Horário
          </button>
        </div>

        <div className="mb-10 bg-zinc-900 p-5 rounded-3xl border border-zinc-800">
          <Calendar
            onChange={(value) =>
              setDataSelecionada(
                value as Date
              )
            }
            value={dataSelecionada}
          />
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className="grid gap-6">
            {agendamentos
              .filter((agendamento) => {
                const dataFormatada =
                  dataSelecionada
                    .toISOString()
                    .split("T")[0];

                return (
                  agendamento.data_agendamento ===
                  dataFormatada
                );
              })

              .map((agendamento) => (
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
                        {agendamento.horario}
                      </h2>
                    </div>

                  </div>

                  <div className="flex flex-wrap gap-3 mt-6">

                    <button
                      onClick={() => {
                        const mensagem = `
Olá ${agendamento.nome}, passando para lembrar do seu horário na Barbearia Alves 💈

📅 Data: ${agendamento.data_agendamento}
⏰ Horário: ${agendamento.horario}
✂️ Serviço: ${agendamento.servico}

Aguardamos você 🔥
`;

                        window.open(
                          `https://wa.me/55${agendamento.telefone.replace(
                            /\D/g,
                            ""
                          )}?text=${encodeURIComponent(
                            mensagem
                          )}`,
                          "_blank"
                        );
                      }}
                      className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-2xl font-bold"
                    >
                      WhatsApp
                    </button>

                    <button
                      onClick={() => {
                        const novoHorario =
                          prompt(
                            "Novo horário:",
                            agendamento.horario
                          );

                        if (!novoHorario)
                          return;

                        editarHorario(
                          agendamento.id,
                          novoHorario
                        );
                      }}
                      className="bg-yellow-500 text-black px-6 py-3 rounded-2xl font-bold"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() =>
                        excluirAgendamento(
                          agendamento.id
                        )
                      }
                      className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-2xl font-bold"
                    >
                      Excluir
                    </button>

                  </div>
                </div>
              ))}
          </div>
        )}
           </div>
    </main>
  );
}