"use client";

import { useState } from "react";

export default function Home() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [barbeiro, setBarbeiro] = useState("");
  const [servico, setServico] = useState("");
  const [mensagem, setMensagem] = useState("");

  function agendar() {
    if (!nome || !telefone || !barbeiro || !servico) {
      setMensagem("Preencha todos os campos.");
      return;
    }

    setMensagem(
      `Agendamento realizado para ${nome} com ${barbeiro}.`
    );

    setNome("");
    setTelefone("");
    setBarbeiro("");
    setServico("");
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-[30px] p-10">
        <h1 className="text-5xl font-black text-yellow-500 text-center">
          Barbearia Alves
        </h1>

        <p className="text-center text-zinc-400 mt-3">
          Av. Ruda, 624, loja 4, Centro, Capão da Canoa - RS
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
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="WhatsApp"
            className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-yellow-500"
          />

          <select
            value={barbeiro}
            onChange={(e) => setBarbeiro(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-yellow-500"
          >
            <option value="">Escolha o barbeiro</option>
            <option>José Ramos</option>
            <option>Pierre Ramos</option>
          </select>

          <select
            value={servico}
            onChange={(e) => setServico(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-yellow-500"
          >
            <option value="">Escolha o serviço</option>
            <option>Corte </option>
            <option>Barba</option>
            <option>Corte + Barba</option>
            <option>Sobrancelha</option>
          </select>

          <button
            onClick={agendar}
            className="w-full bg-yellow-500 text-black py-4 rounded-2xl font-black text-lg hover:scale-105 transition"
          >
            Confirmar Agendamento
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