export interface Cidade {
  nome: string;
}

export interface Pais {
  nome: string;
  codigo: string;
  cidades: Cidade[];
}

export const paisesECidades: Pais[] = [
  {
    nome: "Portugal",
    codigo: "PT",
    cidades: [
      { nome: "Lisboa" },
      { nome: "Porto" },
      { nome: "Braga" },
      { nome: "Coimbra" },
      { nome: "Faro" },
      { nome: "Aveiro" },
    ]
  },
  {
    nome: "Brasil",
    codigo: "BR",
    cidades: [
      { nome: "São Paulo" },
      { nome: "Rio de Janeiro" },
      { nome: "Brasília" },
      { nome: "Salvador" },
      { nome: "Belo Horizonte" },
      { nome: "Curitiba" },
      { nome: "Fortaleza" },
      { nome: "Recife" },
    ]
  },
  {
    nome: "Estados Unidos",
    codigo: "US",
    cidades: [
      { nome: "Nova York" },
      { nome: "Los Angeles" },
      { nome: "Chicago" },
      { nome: "Houston" },
      { nome: "Miami" },
      { nome: "São Francisco" },
      { nome: "Seattle" },
      { nome: "Boston" },
    ]
  },
  {
    nome: "China",
    codigo: "CN",
    cidades: [
      { nome: "Pequim" },
      { nome: "Xangai" },
      { nome: "Guangzhou" },
      { nome: "Shenzhen" },
      { nome: "Chengdu" },
      { nome: "Tianjin" },
    ]
  },
  {
    nome: "Alemanha",
    codigo: "DE",
    cidades: [
      { nome: "Berlim" },
      { nome: "Munique" },
      { nome: "Frankfurt" },
      { nome: "Hamburgo" },
      { nome: "Colônia" },
      { nome: "Stuttgart" },
    ]
  },
  {
    nome: "França",
    codigo: "FR",
    cidades: [
      { nome: "Paris" },
      { nome: "Lyon" },
      { nome: "Marselha" },
      { nome: "Toulouse" },
      { nome: "Nice" },
      { nome: "Bordeaux" },
    ]
  },
  {
    nome: "Itália",
    codigo: "IT",
    cidades: [
      { nome: "Roma" },
      { nome: "Milão" },
      { nome: "Nápoles" },
      { nome: "Turim" },
      { nome: "Florença" },
      { nome: "Veneza" },
    ]
  },
  {
    nome: "Espanha",
    codigo: "ES",
    cidades: [
      { nome: "Madrid" },
      { nome: "Barcelona" },
      { nome: "Valência" },
      { nome: "Sevilha" },
      { nome: "Bilbau" },
      { nome: "Málaga" },
    ]
  },
  {
    nome: "Reino Unido",
    codigo: "GB",
    cidades: [
      { nome: "Londres" },
      { nome: "Manchester" },
      { nome: "Birmingham" },
      { nome: "Glasgow" },
      { nome: "Liverpool" },
      { nome: "Edimburgo" },
    ]
  },
  {
    nome: "Japão",
    codigo: "JP",
    cidades: [
      { nome: "Tóquio" },
      { nome: "Osaka" },
      { nome: "Quioto" },
      { nome: "Yokohama" },
      { nome: "Kobe" },
      { nome: "Nagoya" },
    ]
  },
  {
    nome: "Coreia do Sul",
    codigo: "KR",
    cidades: [
      { nome: "Seul" },
      { nome: "Busan" },
      { nome: "Incheon" },
      { nome: "Daegu" },
      { nome: "Daejeon" },
    ]
  },
  {
    nome: "Canadá",
    codigo: "CA",
    cidades: [
      { nome: "Toronto" },
      { nome: "Montreal" },
      { nome: "Vancouver" },
      { nome: "Calgary" },
      { nome: "Ottawa" },
      { nome: "Edmonton" },
    ]
  },
  {
    nome: "Austrália",
    codigo: "AU",
    cidades: [
      { nome: "Sydney" },
      { nome: "Melbourne" },
      { nome: "Brisbane" },
      { nome: "Perth" },
      { nome: "Adelaide" },
      { nome: "Canberra" },
    ]
  },
  {
    nome: "Países Baixos",
    codigo: "NL",
    cidades: [
      { nome: "Amesterdão" },
      { nome: "Roterdão" },
      { nome: "Haia" },
      { nome: "Utrecht" },
      { nome: "Eindhoven" },
    ]
  },
  {
    nome: "Bélgica",
    codigo: "BE",
    cidades: [
      { nome: "Bruxelas" },
      { nome: "Antuérpia" },
      { nome: "Gante" },
      { nome: "Bruges" },
      { nome: "Liège" },
    ]
  },
  {
    nome: "Suíça",
    codigo: "CH",
    cidades: [
      { nome: "Zurique" },
      { nome: "Genebra" },
      { nome: "Basileia" },
      { nome: "Berna" },
      { nome: "Lausana" },
    ]
  },
  {
    nome: "Suécia",
    codigo: "SE",
    cidades: [
      { nome: "Estocolmo" },
      { nome: "Gotemburgo" },
      { nome: "Malmö" },
      { nome: "Uppsala" },
    ]
  },
  {
    nome: "Noruega",
    codigo: "NO",
    cidades: [
      { nome: "Oslo" },
      { nome: "Bergen" },
      { nome: "Trondheim" },
      { nome: "Stavanger" },
    ]
  },
  {
    nome: "Dinamarca",
    codigo: "DK",
    cidades: [
      { nome: "Copenhague" },
      { nome: "Aarhus" },
      { nome: "Odense" },
      { nome: "Aalborg" },
    ]
  },
  {
    nome: "África do Sul",
    codigo: "ZA",
    cidades: [
      { nome: "Joanesburgo" },
      { nome: "Cidade do Cabo" },
      { nome: "Durban" },
      { nome: "Pretória" },
      { nome: "Port Elizabeth" },
    ]
  },
  {
    nome: "Emirados Árabes Unidos",
    codigo: "AE",
    cidades: [
      { nome: "Dubai" },
      { nome: "Abu Dhabi" },
      { nome: "Sharjah" },
      { nome: "Ajman" },
    ]
  },
  {
    nome: "Índia",
    codigo: "IN",
    cidades: [
      { nome: "Nova Deli" },
      { nome: "Mumbai" },
      { nome: "Bangalore" },
      { nome: "Calcutá" },
      { nome: "Chennai" },
      { nome: "Hyderabad" },
    ]
  },
  {
    nome: "Singapura",
    codigo: "SG",
    cidades: [
      { nome: "Singapura" },
    ]
  },
  {
    nome: "Rússia",
    codigo: "RU",
    cidades: [
      { nome: "Moscovo" },
      { nome: "São Petersburgo" },
      { nome: "Novosibirsk" },
      { nome: "Ecaterimburgo" },
    ]
  },
  {
    nome: "México",
    codigo: "MX",
    cidades: [
      { nome: "Cidade do México" },
      { nome: "Guadalajara" },
      { nome: "Monterrey" },
      { nome: "Puebla" },
      { nome: "Tijuana" },
    ]
  },
  {
    nome: "Argentina",
    codigo: "AR",
    cidades: [
      { nome: "Buenos Aires" },
      { nome: "Córdoba" },
      { nome: "Rosário" },
      { nome: "Mendoza" },
    ]
  },
  {
    nome: "Chile",
    codigo: "CL",
    cidades: [
      { nome: "Santiago" },
      { nome: "Valparaíso" },
      { nome: "Concepción" },
      { nome: "La Serena" },
    ]
  },
  {
    nome: "Turquia",
    codigo: "TR",
    cidades: [
      { nome: "Istambul" },
      { nome: "Ancara" },
      { nome: "Esmirna" },
      { nome: "Bursa" },
    ]
  },
];
