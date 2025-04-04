import React, { useState, useEffect, useRef } from "react";
import Cards from "../components/card";
import CardCampanha from "../components/card_campanha";
import { Col, Row, Button } from "react-bootstrap";
import Veiculos_investimentos from "../components/veiculos_investimentos";
import Engajamento from "../components/engajamento";
import { format, subDays } from "date-fns";
import GraficoComparativo from "../components/grafico_comparativo";

const Campanhas_ativas = () => {
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 7), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(yesterday);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dados carregados para cada componente
  const [componentData, setComponentData] = useState({
    cards: null,
    cardCampanha: null,
    veiculos: null,
    engajamento: null,
    grafico: null
  });
  
  // Referências para verificar se os componentes foram montados
  const componentsRef = useRef({
    cards: false,
    cardCampanha: false,
    veiculos: false,
    engajamento: false,
    grafico: false
  });
  
  // Contador de tentativas e flag para reload forçado
  const retryCountRef = useRef(0);
  const forceReloadRef = useRef(false);
  
  // Função para buscar dados com verificação de dados vazios
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulação da sua API - substitua por suas chamadas reais
      console.log("Buscando dados para:", { startDate, endDate });
      
      // Aqui você faria suas chamadas de API reais
      // Este é apenas um placeholder que simula o recebimento de dados
      const mockData = {
        cards: { data: ["dados simulados para cards"] },
        cardCampanha: { data: ["dados simulados para cardCampanha"] },
        veiculos: { data: ["dados simulados para veiculos"] },
        engajamento: { data: ["dados simulados para engajamento"] },
        grafico: { data: ["dados simulados para grafico"] }
      };
      
      // Simular um pequeno atraso para simular a chamada de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualizar os dados de cada componente
      setComponentData(mockData);
      
      // Resetar contador de tentativas
      retryCountRef.current = 0;
      forceReloadRef.current = false;
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setError("Erro ao carregar os dados. Tente novamente.");
      
      // Incrementar contador de tentativas
      retryCountRef.current += 1;
    } finally {
      setLoading(false);
    }
  };
  
  // Hook para verificar se algum componente está sendo renderizado com dados em branco
  useEffect(() => {
    // Verificar se dados em branco após um intervalo
    const checkBlankData = setTimeout(() => {
      if (!loading && !error) {
        // Verificar se algum componente que deveria ter dados está com dados vazios
        const hasBlankData = Object.entries(componentsRef.current).some(
          ([key, isMounted]) => isMounted && !componentData[key]
        );
        
        if (hasBlankData && retryCountRef.current < 3) {
          console.log("Detectados dados em branco, tentando recarregar...");
          retryCountRef.current += 1;
          forceReloadRef.current = true;
          fetchData();
        }
      }
    }, 2000); // Verifica 2 segundos após o carregamento
    
    return () => clearTimeout(checkBlankData);
  }, [loading, error, componentData]);
  
  // Carregar dados iniciais e quando as datas mudam
  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);
  
  // Registrar quando os componentes são montados
  useEffect(() => {
    // Função para registrar componentes montados e verificar seus dados
    const registerComponent = (componentName) => {
      componentsRef.current[componentName] = true;
    };
    
    // Registrar que todos os componentes estão sendo montados
    registerComponent('cards');
    registerComponent('cardCampanha');
    registerComponent('veiculos');
    registerComponent('engajamento');
    registerComponent('grafico');
    
    // Verificar periodicamente se algum componente não está recebendo dados
    const intervalId = setInterval(() => {
      const anyComponentMissingData = Object.entries(componentsRef.current).some(
        ([key, isMounted]) => isMounted && !componentData[key] && !loading
      );
      
      if (anyComponentMissingData && !forceReloadRef.current && retryCountRef.current < 3) {
        console.log("Componente com dados ausentes detectado, recarregando...");
        forceReloadRef.current = true;
        fetchData();
      }
    }, 3000); // Verificar a cada 3 segundos
    
    return () => {
      clearInterval(intervalId);
    };
  }, [componentData, loading]);
  
  const handleStartDateChange = (e) => {
    setTempStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setTempEndDate(e.target.value);
  };

  const handleDateChange = () => {
    const newEndDate = tempEndDate > yesterday ? yesterday : tempEndDate;
    setStartDate(tempStartDate);
    setEndDate(newEndDate);
    // Resetar contadores de tentativas
    retryCountRef.current = 0;
    forceReloadRef.current = false;
  };
  
  // Função para forçar o recarregamento manual
  const handleReload = () => {
    retryCountRef.current = 0;
    forceReloadRef.current = false;
    fetchData();
  };

  // Renderização condicional baseada no estado
  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <Button onClick={handleReload}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <>
      <div className="d-flex flex-column">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center" style={{ marginBottom: "30px", marginTop: "0px" }}>
          <h1
            style={{
              fontFamily: "Rawline",
              fontWeight: "600",
              margin: 0,
              flex: "1",
              textAlign: "center",
            }}
            className="mb-3 mb-md-0"
          >
            CAMPANHAS ATIVAS
          </h1>
          <div className="d-flex flex-column flex-sm-row gap-2 justify-content-end align-items-center" style={{ minWidth: "280px" }}>
            <input
              type="date"
              id="startDate"
              value={tempStartDate}
              onChange={handleStartDateChange}
              max={yesterday}
              className="p-2 w-100 w-sm-auto"
              style={{ border: "1px solid #e5e7eb", borderRadius: "4px", minWidth: "130px" }}
            />
            <input
              type="date"
              id="endDate"
              value={tempEndDate}
              onChange={handleEndDateChange}
              max={yesterday}
              className="p-2 w-100 w-sm-auto"
              style={{ border: "1px solid #e5e7eb", borderRadius: "4px", minWidth: "130px" }}
            />
            <Button
              onClick={handleDateChange}
              style={{ backgroundColor: "#00D000", color: "white" }}
              className="px-4 py-2 w-100 w-sm-auto"
            >
              Atualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Botão de recarregar que aparece apenas se detectarmos problemas */}
      {retryCountRef.current > 0 && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Button 
            onClick={handleReload} 
            variant="warning"
            style={{ backgroundColor: '#ffc107', color: 'black' }}
          >
            Recarregar Dados
          </Button>
        </div>
      )}

      <Cards 
        startDate={startDate} 
        endDate={endDate} 
        selectedCampaign={selectedCampaign} 
        key={`cards-${startDate}-${endDate}-${forceReloadRef.current}`}
      />
      <br />
      <Row className="g-4">
        <Col xs={12} md={6} lg={2} className="d-flex align-items-stretch">
          <CardCampanha
            startDate={startDate}
            endDate={endDate}
            onCampaignSelect={setSelectedCampaign}
            selectedCampaign={selectedCampaign}
            key={`cardCampanha-${startDate}-${endDate}-${forceReloadRef.current}`}
          />
        </Col>
        <Col xs={12} md={6} lg={8}>
          <Veiculos_investimentos 
            startDate={startDate} 
            endDate={endDate} 
            selectedCampaign={selectedCampaign}
            key={`veiculos-${startDate}-${endDate}-${forceReloadRef.current}`}
          />
        </Col>
        <Col xs={12} lg={2}>
          <Engajamento 
            startDate={startDate} 
            endDate={endDate} 
            selectedCampaign={selectedCampaign}
            key={`engajamento-${startDate}-${endDate}-${forceReloadRef.current}`}
          />
        </Col>
        <Col xs={12} lg={12}>
          <GraficoComparativo 
            startDate={startDate} 
            endDate={endDate} 
            selectedCampaign={selectedCampaign}
            key={`grafico-${startDate}-${endDate}-${forceReloadRef.current}`}
          />
        </Col>
      </Row>
      <br />
    </>
  );
};

export default Campanhas_ativas;