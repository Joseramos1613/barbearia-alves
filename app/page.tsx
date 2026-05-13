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

  const [horariosBloqueados, setHorariosBloqueados] =
    useState<string[]>([]);

  async function carregarHorarios() {
    if (!dataAgendamento || !barbeiro) {
      setHorariosOcupados([]);
      setHorariosBloqueados([]);
      return;
    }

    const { data } = await supabase
      .from("agendamentos")
      .select("horario")
      .eq("data_agendamento", dataAgendamento)
      .eq("barbeiro", barbeiro);

    if (data) {
      setHorariosOcupados(
        data.map((item) => item.horario)
      );
    }

    const { data: bloqueios } = await supabase
      .from("bloqueios")
      .select("horario")
      .eq("data", dataAgendamento)
      .eq("barbeiro", barbeiro);

    if (bloqueios) {
      setHorariosBloqueados(
        bloqueios.map((item) => item.horario)
      );
    }
  }

  useEffect(() => {
    carregarHorarios();
  }, [dataAgendamento, barbeiro]);

  async function agendar() {
    const hoje = new Date();

    const hojeFormatado =
      hoje.toISOString().split("T")[0];

    if (dataAgendamento < hojeFormatado) {
      setMensagem(
        "Não é possível agendar datas passadas."
      );
      return;
    }

    const diaSemana = new Date(
      dataAgendamento + "T12:00:00"
    ).getDay();

    if (diaSemana === 0) {
      setMensagem(
        "A barbearia não abre aos domingos."
      );
      return;
    }

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
      setMensagem(
        "Erro ao salvar agendamento."
      );

      console.log(error);
      return;
    }

    setMensagem(
      "Agendamento realizado com sucesso!"
    );

    const mensagemWhats = `
Olá, meu agendamento foi realizado!

Nome: ${nome}
Barbeiro: ${barbeiro}
Serviço: ${servico}
Data: ${dataAgendamento}
Horário: ${horario}
`;

    const telefoneBarbearia =
      barbeiro === "José Ramos"
        ? "5551992329691"
        : "5551999999999";

    window.open(
      `https://wa.me/${telefoneBarbearia}?text=${encodeURIComponent(
        mensagemWhats
      )}`,
      "_blank"
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
    <main className="min-h-screen bg-black text-white relative overflow-hidden">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.15),transparent_40%)]" />

      <div className="relative z-10 flex items-center justify-center p-6 min-h-screen">
        <div className="w-full max-w-2xl bg-zinc-900/90 backdrop-blur-xl border border-yellow-500/20 shadow-2xl shadow-yellow-500/10 rounded-[35px] p-10">

          <div className="text-center">
            <h1 className="text-6xl font-black text-yellow-500 tracking-tight">
              Barbearia Alves
            </h1>

            <p className="text-zinc-400 mt-4 text-lg">
              Estilo • Precisão • Elegância
            </p>

            <div className="w-32 h-1 bg-yellow-500 mx-auto rounded-full mt-6" />
          </div>

          <div className="space-y-5 mt-12">

            <input
              value={nome}
              onChange={(e) =>
                setNome(e.target.value)
              }
              placeholder="Seu nome"
              className="w-full bg-black/70 border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-yellow-500 transition"
            />

            <input
              value={telefone}
              onChange={(e) =>
                setTelefone(e.target.value)
              }
              placeholder="WhatsApp"
              className="w-full bg-black/70 border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-yellow-500 transition"
            />

            <select
              value={barbeiro}
              onChange={(e) =>
                setBarbeiro(e.target.value)
              }
              className="w-full bg-black/70 border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-yellow-500 transition"
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

            <select
              value={servico}
              onChange={(e) =>
                setServico(e.target.value)
              }
              className="w-full bg-black/70 border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-yellow-500 transition"
            >
              <option value="">
                Escolha o serviço
              </option>

              <option value="Corte social - 45">
                Corte social - R$45
              </option>

              <option value="Barba - 40">
                Barba - R$40
              </option>

              <option value="Corte + Barba - 85">
                Corte + Barba - R$85
              </option>

              <option value="Sobrancelha - 15">
                Sobrancelha - R$15
              </option>

              <option value="Corte Máquina - 30">
                Corte Máquina - R$30
              </option>

              <option value="Corte Degradê - 50">
                Corte Degradê - R$50
              </option>

              <option value="Corte Navalhado - 60">
                Corte Navalhado - R$60
              </option>
            </select>

            <input
              type="date"
              value={dataAgendamento}
              onChange={(e) =>
                setDataAgendamento(
                  e.target.value
                )
              }
              className="w-full bg-black/70 border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-yellow-500 transition"
            />

            <select
              value={horario}
              onChange={(e) =>
                setHorario(e.target.value)
              }
              className="w-full bg-black/70 border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-yellow-500 transition"
            >
              <option value="">
                Escolha o horário
              </option>

              {(barbeiro === "José Ramos"
                ? [
                    "09:00",
                    "09:30",
                    "10:00",
                    "10:30",
                    "11:00",
                    "19:00",
                    "19:30",
                    "20:00",
                  ]
                : [
                    "09:00",
                    "09:30",
                    "10:00",
                    "10:30",
                    "11:00",
                    "14:00",
                    "14:30",
                    "15:00",
                    "15:30",
                    "16:00",
                    "16:30",
                    "17:00",
                    "17:30",
                    "18:00",
                    "18:30",
                    "19:00",
                  ])
                .filter(
                  (hora) =>
                    !horariosOcupados.includes(
                      hora
                    ) &&
                    !horariosBloqueados.includes(
                      hora
                    )
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
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-5 rounded-2xl font-black text-xl transition hover:scale-[1.02] disabled:opacity-50 shadow-lg shadow-yellow-500/20"
            >
              {loading
                ? "Salvando..."
                : "Confirmar Agendamento"}
            </button>

            {mensagem && (
              <div className="bg-green-500/20 border border-green-500 text-green-400 rounded-2xl p-4 text-center font-semibold">
                {mensagem}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}