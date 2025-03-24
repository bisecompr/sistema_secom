import React, { useState, useEffect } from "react";
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
  const [isFirstLoad, setIsFirstLoad] = useState(true); // Controla se é a primeira carga
  const [hasError, setHasError] = useState(false); // Controla se houve erro na primeira carga

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
    setIsFirstLoad(false); // Desativa a lógica de primeira carga após atualização manual
    setHasError(false); // Reseta o estado de erro
  };

  // Função para recarregar a página
  const reloadPage = () => {
    console.log("Erro na primeira requisição, recarregando a página...");
    window.location.reload();
  };

  // useEffect para monitorar erro na primeira carga
  useEffect(() => {
    if (isFirstLoad && hasError) {
      reloadPage();
    }
  }, [isFirstLoad, hasError]);

  // Função para verificar os dados carregados
  const handleDataLoaded = (data, error = false) => {
    if (isFirstLoad) {
      if (error || !data || (Array.isArray(data) && data.length === 0) || (typeof data === "object" && Object.keys(data).length === 0)) {
        console.log("Falha na primeira requisição:", { data, error });
        setHasError(true); // Define erro se os dados forem inválidos ou houver falha
      } else {
        console.log("Dados carregados com sucesso na primeira requisição:", data);
        setIsFirstLoad(false); // Desativa a lógica de primeira carga se os dados forem válidos
      }
    }
  };

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
              textAlign: "center"
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
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "4px",
                width: "auto",
                minWidth: "130px"
              }}
            />
            <input
              type="date"
              id="endDate"
              value={tempEndDate}
              onChange={handleEndDateChange}
              className="p-2 w-100 w-sm-auto"
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "4px",
                width: "auto",
                minWidth: "130px"
              }}
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

      <Cards startDate={startDate} endDate={endDate} selectedCampaign={selectedCampaign} onDataLoaded={handleDataLoaded} />
      <br />

      <Row className="g-4">
        <Col xs={12} md={6} lg={2} className="d-flex align-items-stretch">
          <CardCampanha 
            startDate={startDate} 
            endDate={endDate} 
            onCampaignSelect={setSelectedCampaign} 
            selectedCampaign={selectedCampaign} 
            onDataLoaded={handleDataLoaded}
          />
        </Col>
        <Col xs={12} md={6} lg={6}>
          <Veiculos_investimentos startDate={startDate} endDate={endDate} selectedCampaign={selectedCampaign} onDataLoaded={handleDataLoaded} />
        </Col>
        <Col xs={12} lg={4}>
          <Engajamento startDate={startDate} endDate={endDate} selectedCampaign={selectedCampaign} onDataLoaded={handleDataLoaded} />
        </Col>
        <Col xs={12} lg={12}>
          <GraficoComparativo startDate={startDate} endDate={endDate} selectedCampaign={selectedCampaign} onDataLoaded={handleDataLoaded} />
        </Col>
      </Row>
      <br />
    </>
  );
};

export default Campanhas_ativas;