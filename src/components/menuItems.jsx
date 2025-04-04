import { Home, LayoutDashboard, ArrowUpNarrowWide, Clock, BarChart2, MapIcon, ChartBar } from 'lucide-react';

export const menuItems = [
  { name: 'Início', icon: <Home size={24} color="#000" />, path: '/' },
  { name: 'Campanhas Ativas', icon: <LayoutDashboard size={24} color="#000" />, path: '/campanhas_ativas' },
  //{ name: 'Comparativo Histórico', icon: <ArrowUpNarrowWide size={24} color="#000" />, path: '/comparativo_historico' },
  { name: 'Assuntos do Momento', icon: <BarChart2 size={24} color="#000" />, path: '/trends' },
  { name: 'Análise Detalhada', icon: <Clock size={24} color="#000" />, path: '/powerbi' },
  { name: 'Análise Demográfica', icon: <MapIcon size={24} color="#000" />, path: '/demografico' },
  { name: 'Debate Digital', icon: <ChartBar size={24} color="#000" />, path: '/stilingue' }
];