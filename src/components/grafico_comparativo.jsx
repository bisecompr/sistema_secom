import React, { useState, useEffect } from "react";
import { Card, Spinner } from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { graficoMetrics } from "../data/graficoMetrics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const GraficoComparativo = ({ startDate, endDate, selectedCampaign }) => {
  const [metrics, setMetrics] = useState({ actual: [], previous: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMetrics = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await graficoMetrics(startDate, endDate, selectedCampaign);
        if (!data || !data.actual || !data.previous) {
          throw new Error("Dados incompletos ou inválidos");
        }
        setMetrics(data);
      } catch (error) {
        console.error("Erro ao carregar métricas:", error);
        setError(error.message || "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [startDate, endDate, selectedCampaign]);

  // Array com os nomes dos dias da semana
  const diasSemana = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
  ];

  // Função para formatar a data no formato "DD-MM-YYYY" utilizando métodos UTC
  const formatarData = (data) => {
    const dateObj = new Date(data);
    const dia = String(dateObj.getUTCDate()).padStart(2, "0");
    const mes = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
    const ano = dateObj.getUTCFullYear();
    return `${dia}-${mes}-${ano}`;
  };

  // Componente de spinner personalizado
  const LoadingSpinner = () => (
    <div className="d-flex flex-column justify-content-center align-items-center h-100">
      <Spinner 
        animation="border" 
        variant="danger" 
        style={{ width: "3rem", height: "3rem" }}
      />
      <p className="mt-3 text-muted">Carregando dados do gráfico...</p>
    </div>
  );

  // Componente de mensagem de erro
  const ErrorMessage = ({ message }) => (
    <div className="d-flex flex-column justify-content-center align-items-center h-100">
      <div className="text-danger mb-3">
        <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: "2rem" }}></i>
      </div>
      <p className="text-center text-danger">{message}</p>
      <button 
        className="btn btn-outline-danger mt-2" 
        onClick={() => window.location.reload()}
      >
        Tentar novamente
      </button>
    </div>
  );

  // Verifica se temos dados válidos para processar
  if (!loading && (!metrics || !metrics.actual || !metrics.previous)) {
    return (
      <Card className="campaign-card p-3 shadow" style={{ height: "500px" }}>
        <Card.Title className="text-center mb-3 fw-bold">
          Comparação de Impressões por Período
        </Card.Title>
        <ErrorMessage message="Não foi possível carregar os dados do gráfico" />
      </Card>
    );
  }

  // Função que, se o item.label for um dia da semana, retorna-o; senão, retorna a data formatada
  const getXValue = (item) =>
    diasSemana.includes(item.label) ? item.label : formatarData(item.date);

  // --- Lógica para montar os labels e os dados dos datasets ---
  let unionLabels = [];
  let actualData = [];
  let previousData = [];

  // Só processamos os dados se não estivermos carregando e tivermos dados válidos
  if (!loading && metrics.actual && metrics.previous) {
    if (metrics.actual.length === 7 && metrics.previous.length === 7) {
      // Caso comparativo: usa getXValue (que pode retornar dias da semana ou datas formatadas)
      const actualLabelsComparative = metrics.actual.map(getXValue);
      const previousLabelsComparative = metrics.previous.map(getXValue);

      // Se os dados atuais forem baseados em dias da semana, preserva a ordem conforme os dados
      if (metrics.actual.length > 0 && diasSemana.includes(metrics.actual[0].label)) {
        unionLabels = [...actualLabelsComparative];
        previousLabelsComparative.forEach((label) => {
          if (!unionLabels.includes(label)) {
            unionLabels.push(label);
          }
        });
      } else {
        // Caso sejam datas, une os labels e os ordena cronologicamente
        const labelsSet = new Set([...actualLabelsComparative, ...previousLabelsComparative]);
        unionLabels = Array.from(labelsSet);
        unionLabels.sort((a, b) => {
          const [diaA, mesA, anoA] = a.split("-").map(Number);
          const [diaB, mesB, anoB] = b.split("-").map(Number);
          return new Date(anoA, mesA - 1, diaA) - new Date(anoB, mesB - 1, diaB);
        });
      }
      actualData = unionLabels.map((label) => {
        const item = metrics.actual.find((item) => getXValue(item) === label);
        return item ? item.impressions : null;
      });
      previousData = unionLabels.map((label) => {
        const item = metrics.previous.find((item) => getXValue(item) === label);
        return item ? item.impressions : null;
      });
    } else {
      // Caso simples: usa somente a data (item.date) formatada para cada dataset
      const actualSimpleLabels = metrics.actual.map((item) => formatarData(item.date));
      const previousSimpleLabels = metrics.previous.map((item) => formatarData(item.date));

      const labelsSet = new Set([...actualSimpleLabels, ...previousSimpleLabels]);
      unionLabels = Array.from(labelsSet);
      unionLabels.sort((a, b) => {
        const [diaA, mesA, anoA] = a.split("-").map(Number);
        const [diaB, mesB, anoB] = b.split("-").map(Number);
        return new Date(anoA, mesA - 1, diaA) - new Date(anoB, mesB - 1, diaB);
      });
      actualData = unionLabels.map((label) => {
        const item = metrics.actual.find((item) => formatarData(item.date) === label);
        return item ? item.impressions : null;
      });
      previousData = unionLabels.map((label) => {
        const item = metrics.previous.find((item) => formatarData(item.date) === label);
        return item ? item.impressions : null;
      });
    }
  }

  // Função para calcular tamanhos dinâmicos para pontos e bordas
  const calculateDynamicSize = (numLabels, minSize, maxSize, maxLabels = 50) => {
    return Math.max(minSize, maxSize - (numLabels / maxLabels) * (maxSize - minSize));
  };

  const pointRadius = calculateDynamicSize(unionLabels.length, 1, 4);
  const borderWidth = calculateDynamicSize(unionLabels.length, 1, 4);

  const chartData = {
    labels: unionLabels,
    datasets: [
      {
        label: "Veiculação Atual",
        data: actualData,
        borderColor: "rgb(255, 0, 0)",
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) return null;
          
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(255, 0, 0, 0)');      
          gradient.addColorStop(0.2, 'rgba(255, 0, 0, 0.2)');  
          gradient.addColorStop(0.4, 'rgba(255, 0, 0, 0.4)'); 
          gradient.addColorStop(0.6, 'rgba(255, 0, 0, 0.5)');  
          gradient.addColorStop(0.8, 'rgba(255, 0, 0, 0.6)');  
          gradient.addColorStop(1, 'rgba(255, 0, 0, 0.6)');    
          return gradient;
        },
        borderWidth: borderWidth + 1,
        pointRadius: pointRadius + 1,
        pointBackgroundColor: "rgb(255, 0, 0)", 
        pointBorderWidth: 2,
        fill: true,
        tension: 0.4,
        order: 2
      },
      {
        label: "Veiculação Anterior",
        data: previousData,
        borderColor: "rgba(255, 208, 0)",
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) return null;
          
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(255, 208, 0, 0)');     
          gradient.addColorStop(0.2, 'rgba(255, 208, 0, 0.2)'); 
          gradient.addColorStop(0.4, 'rgba(255, 208, 0, 0.4)'); 
          gradient.addColorStop(0.6, 'rgba(255, 208, 0, 0.4)'); 
          gradient.addColorStop(0.8, 'rgba(255, 208, 0, 0.6)');  
          gradient.addColorStop(1, 'rgba(255, 208, 0, 0.7)');   
          return gradient;
        },
        borderWidth: borderWidth + 1,
        pointRadius: pointRadius + 1,
        pointBackgroundColor: "rgba(255, 208, 0, 0.8)",
        pointBorderWidth: 2,
        fill: true,
        tension: 0.4,
        order: 1
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 14 },
          color: "#333",
          boxWidth: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 10,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 12 }, color: "#666" },
      },
      y: {
        grid: { color: "rgba(200, 200, 200, 0.2)" },
        ticks: {
          font: { size: 12 },
          color: "#666",
          callback: (value) => value.toLocaleString(),
        },
      },
    },
  };

  return (
    <Card className="campaign-card p-3 shadow" style={{ height: "500px" }}>
      <Card.Title className="text-center mb-3 fw-bold">
        Comparação de Impressões por Período
      </Card.Title>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className="w-100 h-100">
          <Line options={options} data={chartData} />
        </div>
      )}
    </Card>
  );
};

export default GraficoComparativo;