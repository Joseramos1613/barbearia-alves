"use client";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
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

  const [loading, setLoading] =
    useState(true);

  const [dataSelecionada,
    setDataSelecionada] =
    useState(new Date());

  const [dataBloqueio,
    setDataBloqueio] =
    useState("");

  const [horarioBloqueio,
    setHorarioBloqueio] =
    useState("");

  const [barbeiroBloqueio,
    setBarbeiroBloqueio] =
    useState("");

  const [motivoBloqueio,
    setMotivoBloqueio] =
    useState("");

  async function carregarAgendamentos() {

    const { data, error } =
      await supabase
        .from("agendamentos")
        .select("*")
        .order("id", {
          ascending: false
        });

    if (!error && data) {
      setAgendamentos(data);
    }

    setLoading(false);
  }

  async function excluirAgendamento(
    id:number
  ) {

    const { error } =
      await supabase
      .from("agendamentos")
      .delete()
      .eq("id",id);

    if(error){
      alert("Erro ao excluir");
      return;
    }

    carregarAgendamentos();
  }

  async function editarHorario(
    id:number,
    novoHorario:string
  ) {

    const { error } =
      await supabase
      .from("agendamentos")
      .update({
        horario:novoHorario
      })
      .eq("id",id);

    if(error){
      alert("Erro ao editar");
      return;
    }

    alert("Horário atualizado");

    carregarAgendamentos();
  }

  async function bloquearHorario(){

    if(
      !dataBloqueio ||
      !horarioBloqueio ||
      !barbeiroBloqueio
    ){
      alert("Preencha os campos");
      return;
    }

    const { error } =
      await supabase
      .from("bloqueios")
      .insert([{
        data:dataBloqueio,
        horario:horarioBloqueio,
        barbeiro:barbeiroBloqueio,
        motivo:motivoBloqueio
      }]);

    if(error){
      alert("Erro ao bloquear");
      return;
    }

    alert("Horário bloqueado");

    setDataBloqueio("");
    setHorarioBloqueio("");
    setBarbeiroBloqueio("");
    setMotivoBloqueio("");
  }

  function fazerLogin(){

    if(
      usuario==="admin" &&
      senha==="123456"
    ){

      localStorage.setItem(
        "admin-logado",
        "true"
      );

      setLogado(true);

    }else{

      alert(
        "Usuário inválido"
      );

    }
  }

  function sair(){

    localStorage.removeItem(
      "admin-logado"
    );

    setLogado(false);

  }

  useEffect(()=>{

    const adminLogado =
      localStorage.getItem(
        "admin-logado"
      );

    if(
      adminLogado==="true"
    ){

      setLogado(true);

      carregarAgendamentos();

    }

  },[]);

  const totalAgendamentos =
    agendamentos.length;

  const faturamentoTotal =
    agendamentos.reduce(
      (total,item)=>{

      const partes =
      item.servico.split("-");

      const valor =
      Number(partes[1]);

      return total+valor;

    },0);

  const graficoData = [

    {
      nome:"Agendamentos",
      total:totalAgendamentos
    },

    {
      nome:"Faturamento",
      total:faturamentoTotal
    }

  ];

  if(!logado){

return(

<main className="min-h-screen bg-black text-white flex items-center justify-center p-6">

<div className="bg-zinc-900 p-10 rounded-[30px] w-full max-w-md">

<h1 className="text-4xl text-yellow-500 text-center font-black">

Login Admin

</h1>

<div className="space-y-5 mt-10">

<input
value={usuario}
onChange={(e)=>
setUsuario(e.target.value)
}
placeholder="Usuário"
className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4"
/>

<input
type="password"
value={senha}
onChange={(e)=>
setSenha(e.target.value)
}
placeholder="Senha"
className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4"
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

)

}

return(

<main className="min-h-screen bg-black text-white p-6">

<div className="max-w-7xl mx-auto">

<div className="flex justify-between mb-10">

<div>

<h1 className="text-5xl font-black text-yellow-500">

Painel Administrativo

</h1>

<p className="text-zinc-400">

Barbearia Alves

</p>

</div>

<button
onClick={sair}
className="bg-red-600 px-5 py-2 rounded-2xl"
>

Sair

</button>

</div>

<div className="grid md:grid-cols-2 gap-5 mb-8">

<div className="bg-zinc-900 rounded-3xl p-6">

<p>Total de Agendamentos</p>

<h1 className="text-5xl font-black text-yellow-500">

{totalAgendamentos}

</h1>

</div>

<div className="bg-zinc-900 rounded-3xl p-6">

<p>Faturamento</p>

<h1 className="text-5xl font-black text-green-500">

R$ {faturamentoTotal}

</h1>

</div>

</div>

<div className="bg-zinc-900 rounded-3xl p-6 mb-8">

<h2 className="text-3xl text-yellow-500 font-black mb-6">

Estatísticas

</h2>

<div className="w-full h-[300px]">

<ResponsiveContainer>

<BarChart data={graficoData}>
<XAxis dataKey="nome"/>
<YAxis/>
<Tooltip/>
<Bar dataKey="total"/>
</BarChart>

</ResponsiveContainer>

</div>

</div>

<div className="bg-zinc-900 p-5 rounded-3xl mb-8">

<Calendar
onChange={(value)=>
setDataSelecionada(
value as Date
)}
value={dataSelecionada}
/>

</div>

{loading ? (

<p>Carregando...</p>

):(

<div className="grid gap-6">

{agendamentos.map(
(agendamento)=>(

<div
key={agendamento.id}
className="bg-zinc-900 p-8 rounded-3xl"
>

<h2 className="text-2xl font-bold">

{agendamento.nome}

</h2>

<p>{agendamento.telefone}</p>

<p>{agendamento.barbeiro}</p>

<p>{agendamento.servico}</p>

<p>{agendamento.data_agendamento}</p>

<p>{agendamento.horario}</p>

<div className="flex gap-3 mt-6">

<button
onClick={()=>{

const mensagem=`
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
className="bg-green-600 px-5 py-3 rounded-2xl font-bold"
>

Enviar Lembrete

</button>

<button
onClick={()=>{

const novo=
prompt(
"Novo horário",
agendamento.horario
);

if(!novo)return;

editarHorario(
agendamento.id,
novo
);

}}
className="bg-yellow-500 text-black px-5 py-3 rounded-2xl font-bold"
>

Editar

</button>

<button
onClick={()=>
excluirAgendamento(
agendamento.id
)
}
className="bg-red-600 px-5 py-3 rounded-2xl font-bold"
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

)

}