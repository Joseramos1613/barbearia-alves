"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function Home() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [barbeiro, setBarbeiro] = useState("");
  const [servico, setServico] = useState("");
  const [horario, setHorario] = useState("");
  const [dataAgendamento, setDataAgendamento] =
    useState("");

  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  const [horariosOcupados, setHorariosOcupados] =
    useState<string[]>([]);

  async function carregarHorarios() {
    if (!dataAgendamento) return;

    const { data } = await supabase
      .from("agendamentos")
      .select("horario, data_agendamento")
      .eq("data_agendamento", dataAgendamento);

    if (data) {
      setHorariosOcupados(
        data.map((item) => item.horario)
      );
    }
  }

  useEffect(() => {
    carregarHorarios();
  }, [dataAgendamento]);

  async function agendar() {
    if (
      !nome ||
      !telefone ||
      !barbeiro ||
      !servico ||
      !horario ||
      !dataAgendamento
    ) {
      setMensagem("Preencha todos os campos.");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("agendamentos")
      .insert([
        {
          nome,
          telefone,
          barbeiro,
          servico,
          horario,
          data_agendamento: dataAgendamento,
        },
      ]);

    setLoading(false);

    if (error) {
      setMensagem("Erro ao salvar agendamento.");
      console.log(error);
      return;
    }

    setMensagem(
      "Agendamento realizado com sucesso!"
    );

    setNome("");
    setTelefone("");
    setBarbeiro("");
    setServico("");
    setHorario("");
    setDataAgendamento("");

    carregarHorarios();
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-[30px] p-10">
        <h1 className="text-5xl font-black text-yellow-500 text-center">
          Barbearia Alves
        </h1>

        <p className="text-center text-zinc-400 mt-3">
          Av. Ruda, 624
        </p>

        <div className="space-y-5 mt-10">
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome"
            className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-yellow-500"
          />

          <input
            value={telefone}
            onChange={(e) =>
              setTelefone(e.target.value)
            }
            placeholder="WhatsApp"
            className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-yellow-500"
          />

          <select
            value={barbeiro}
            onChange={(e) =>
              setBarbeiro(e.target.value)
            }
            className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-yellow-500"
          >
            <option value="">
              Escolha o barbeiro
            </option>

            <option>José Ramos</option>
            <option>Pierre Ramos</option>
          </select>

          <select
            value={servico}
            onChange={(e) =>
              setServico(e.target.value)
            }
            className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-yellow-500"
          >
            <option value="">
              Escolha o serviço
            </option>

            <option>Corte Masculino</option>
            <option>Barba</option>
            <option>Corte + Barba</option>
            <option>Pigmentação</option>
          </select>

          <input
            type="date"
            value={dataAgendamento}
            onChange={(e) =>
              setDataAgendamento(e.target.value)
            }
            className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-yellow-500"
          />

          <select
            value={horario}
            onChange={(e) =>
              setHorario(e.target.value)
            }
            className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-yellow-500"
          >
            <option value="">
              Escolha o horário
            </option>

            {[
              "09:00",
              "10:00",
              "11:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
            ]
              .filter(
                (hora) =>
                  !horariosOcupados.includes(hora)
              )
              .map((hora) => (
                <option key={hora}>
                  {hora}
                </option>
              ))}
          </select>

          <button
            onClick={agendar}
            disabled={loading}
            className="w-full bg-yellow-500 text-black py-4 rounded-2xl font-black text-lg hover:scale-105 transition disabled:opacity-50"
          >
            {loading
              ? "Salvando..."
              : "Confirmar Agendamento"}
          </button>

          {mensagem && (
            <div className="bg-green-500/20 border border-green-500 text-green-400 rounded-2xl p-4 text-center">
              {mensagem}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}