import React, { useState, useEffect, useCallback } from "react";
import Cards from "../components/card";
import CardCampanha from "../components/card_campanha";
import { Col, Row, Button, Spinner, Alert } from "react-bootstrap";
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
  const [componentsStatus, setComponentsStatus] = useState({
    cards: false,
    cardCampanha: false,
    veiculos: false,
    engajamento: false,
    grafico: false
  });
  const [retryCount, setRetryCount] = useState(0);

  // Função de fetch melhorada com timeout e retry
  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // Reset dos status dos componentes
    setComponentsStatus({
      cards: false,
      cardCampanha: false,
      veiculos: false,
      engajamento: false,
      grafico: false
    });
    
    try {
      // Aqui simulamos sua chamada de API
      // Adicione um timeout para garantir que a operação não fique pendente indefinidamente
      const fetchWithTimeout = new Promise(async (resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Tempo limite de conexão excedido."));
        }, 15000); // 15 segundos de timeout
        
        try {
          // Substitua isso pela sua chamada de API real
          console.log("Buscando dados para:", { startDate, endDate });
          
          // Simule um atraso para testes
          await new Promise(r => setTimeout(r, 1000));
          
          // Limpe o timeout se a operação for bem-sucedida
          clearTimeout(timeout);
          resolve("Dados obtidos com sucesso");
        } catch (err) {
          clearTimeout(timeout);
          reject(err);
        }
      });
      
      await fetchWithTimeout;
      
      // Reset do contador de tentativas em caso de sucesso
      setRetryCount(0);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      
      if (retryCount < 3) {
        setError(`Tentando novamente... (${retryCount + 1}/3)`);
        setRetryCount(prev => prev + 1);
        
        // Tentar novamente em 2 segundos
        setTimeout(() => {
          fetchInitialData();
        }, 2000);
        return;
      } else {
        setError("Erro ao carregar os dados. Por favor, tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, retryCount]);

  // Carrega os dados na montagem inicial e quando as datas mudam
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

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
    // Reset do contador de tentativas ao atualizar manualmente
    setRetryCount(0);
  };

  // Função para registrar quando um componente termina de carregar
  const handleComponentLoaded = (componentName) => {
    setComponentsStatus(prev => ({
      ...prev,
      [componentName]: true
    }));
  };

  // Verifica se todos os componentes estão carregados
  const allComponentsLoaded = Object.values(componentsStatus).every(status => status === true);

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
              disabled={loading}
            />
            <input
              type="date"
              id="endDate"
              value={tempEndDate}
              onChange={handleEndDateChange}
              max={yesterday}
              className="p-2 w-100 w-sm-auto"
              style={{ border: "1px solid #e5e7eb", borderRadius: "4px", minWidth: "130px" }}
              disabled={loading}
            />
            <Button
              onClick={handleDateChange}
              style={{ backgroundColor: "#00D000", color: "white" }}
              className="px-4 py-2 w-100 w-sm-auto"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Atualizando...
                </>
              ) : "Atualizar"}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          <Alert.Heading>Erro ao carregar dados</Alert.Heading>
          <p>{error}</p>
          <div className="d-flex justify-content-end">
            <Button 
              onClick={() => {
                setRetryCount(0);
                fetchInitialData();
              }} 
              variant="outline-danger"
            >
              Tentar novamente
            </Button>
          </div>
        </Alert>
      )}

      {loading && !error && (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="success" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Carregando...</span>
          </Spinner>
          <p className="mt-3">Carregando dados das campanhas...</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <Cards 
            startDate={startDate} 
            endDate={endDate} 
            selectedCampaign={selectedCampaign} 
            onLoaded={() => handleComponentLoaded('cards')}
          />
          <br />
          <Row className="g-4">
            <Col xs={12} md={6} lg={2} className="d-flex align-items-stretch">
              <CardCampanha
                startDate={startDate}
                endDate={endDate}
                onCampaignSelect={setSelectedCampaign}
                selectedCampaign={selectedCampaign}
                onLoaded={() => handleComponentLoaded('cardCampanha')}
              />
            </Col>
            <Col xs={12} md={6} lg={8}>
              <Veiculos_investimentos 
                startDate={startDate} 
                endDate={endDate} 
                selectedCampaign={selectedCampaign}
                onLoaded={() => handleComponentLoaded('veiculos')}
              />
            </Col>
            <Col xs={12} lg={2}>
              <Engajamento 
                startDate={startDate} 
                endDate={endDate} 
                selectedCampaign={selectedCampaign}
                onLoaded={() => handleComponentLoaded('engajamento')}
              />
            </Col>
            <Col xs={12} lg={12}>
              <GraficoComparativo 
                startDate={startDate} 
                endDate={endDate} 
                selectedCampaign={selectedCampaign}
                onLoaded={() => handleComponentLoaded('grafico')}
              />
            </Col>
          </Row>
        </>
      )}

      {!allComponentsLoaded && !loading && !error && (
        <div className="text-center mt-3">
          <Spinner animation="grow" variant="success" size="sm" className="me-2" />
          <span>Aguarde enquanto carregamos os dados completos...</span>
        </div>
      )}
      <br />
    </>
  );
};

export default Campanhas_ativas;