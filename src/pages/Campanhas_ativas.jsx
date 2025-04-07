"use client"

import React, { useState, useEffect, useCallback } from "react"
import Cards from "../components/card"
import CardCampanha from "../components/card_campanha"
import { Col, Row, Button, Spinner, Alert } from "react-bootstrap"
import Veiculos_investimentos from "../components/veiculos_investimentos"
import Engajamento from "../components/engajamento"
import { format, subDays } from "date-fns"
import GraficoComparativo from "../components/grafico_comparativo"

const Campanhas_ativas = () => {
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd")
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 7), "yyyy-MM-dd"))
  const [endDate, setEndDate] = useState(yesterday)
  const [tempStartDate, setTempStartDate] = useState(startDate)
  const [tempEndDate, setTempEndDate] = useState(endDate)
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [autoRetrying, setAutoRetrying] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)

  // Função para buscar dados com mecanismo de retry
  const fetchInitialData = useCallback(async () => {
    setLoading(true)
    setError(null)
    setAutoRetrying(false)

    try {
      // Simulação de uma chamada à API que pode falhar
      // Na implementação real, substitua por sua chamada à API
      const response = await fetch(
        `https://api-nest-alpha.vercel.app/plataforma_dia/campaigns?startDate=${startDate}&endDate=${endDate}`,
      )

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`)
      }

      const data = await response.json()

      // Verificar se os dados são válidos
      if (!data || data.length === 0) {
        throw new Error("Nenhum dado retornado do servidor")
      }

      console.log("Dados buscados com sucesso para:", { startDate, endDate })
      setDataLoaded(true)
    } catch (err) {
      console.error("Erro ao buscar dados:", err)
      setError(`${err.message}. Tentativa ${retryCount + 1} de 3.`)

      // Se ainda não atingiu o número máximo de tentativas, agenda uma nova tentativa
      if (retryCount < 2) {
        setAutoRetrying(true)
        setTimeout(() => {
          setRetryCount((prev) => prev + 1)
        }, 3000) // Tenta novamente após 3 segundos
      } else {
        setError("Não foi possível carregar os dados após várias tentativas. Por favor, tente novamente manualmente.")
      }
    } finally {
      setLoading(false)
    }
  }, [startDate, endDate, retryCount])

  // Efeito para carregar dados iniciais e quando as datas ou contagem de retry mudam
  useEffect(() => {
    fetchInitialData()
  }, [fetchInitialData, retryCount])

  // Efeito para resetar a contagem de retry quando as datas mudam manualmente
  useEffect(() => {
    setRetryCount(0)
  }, [startDate, endDate])

  const handleStartDateChange = (e) => {
    setTempStartDate(e.target.value)
  }

  const handleEndDateChange = (e) => {
    setTempEndDate(e.target.value)
  }

  const handleDateChange = () => {
    const newEndDate = tempEndDate > yesterday ? yesterday : tempEndDate
    setStartDate(tempStartDate)
    setEndDate(newEndDate)
    setRetryCount(0) // Reset retry count on manual date change
  }

  const handleManualRetry = () => {
    setRetryCount(0) // Reset retry count for manual retry
  }

  // Componente de fallback para quando os componentes filhos falham
  const ComponentFallback = ({ componentName, onRetry }) => (
    <div className="bg-light p-4 rounded shadow-sm text-center">
      <p className="mb-3">Não foi possível carregar o componente {componentName}.</p>
      <Button variant="outline-primary" size="sm" onClick={onRetry}>
        Tentar novamente
      </Button>
    </div>
  )

  // Renderização condicional baseada no estado
  return (
    <>
      <div className="d-flex flex-column">
        <div
          className="d-flex flex-column flex-md-row justify-content-between align-items-center"
          style={{ marginBottom: "30px", marginTop: "0px" }}
        >
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
          <div
            className="d-flex flex-column flex-sm-row gap-2 justify-content-end align-items-center"
            style={{ minWidth: "280px" }}
          >
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
              Atualizar
            </Button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="success" style={{ width: "3rem", height: "3rem" }} />
          <p className="mt-3">Carregando dados das campanhas...</p>
        </div>
      )}

      {error && (
        <Alert variant="warning" className="mb-4">
          <Alert.Heading>Problema ao carregar dados</Alert.Heading>
          <p>{error}</p>
          {autoRetrying ? (
            <div className="d-flex align-items-center">
              <Spinner animation="border" size="sm" className="me-2" />
              <span>Tentando novamente automaticamente...</span>
            </div>
          ) : (
            <Button variant="outline-warning" onClick={handleManualRetry}>
              Tentar novamente
            </Button>
          )}
        </Alert>
      )}

      {!loading && !error && (
        <>
          <ErrorBoundary fallback={<ComponentFallback componentName="Cards" onRetry={handleManualRetry} />}>
            <Cards startDate={startDate} endDate={endDate} selectedCampaign={selectedCampaign} />
          </ErrorBoundary>
          <br />
          <Row className="g-4">
            <Col xs={12} md={6} lg={3} className="d-flex align-items-stretch">
              <ErrorBoundary fallback={<ComponentFallback componentName="Campanhas" onRetry={handleManualRetry} />}>
                <CardCampanha
                  startDate={startDate}
                  endDate={endDate}
                  onCampaignSelect={setSelectedCampaign}
                  selectedCampaign={selectedCampaign}
                />
              </ErrorBoundary>
            </Col>
            <Col xs={12} md={6} lg={7}>
              <ErrorBoundary fallback={<ComponentFallback componentName="Investimentos" onRetry={handleManualRetry} />}>
                <Veiculos_investimentos startDate={startDate} endDate={endDate} selectedCampaign={selectedCampaign} />
              </ErrorBoundary>
            </Col>
            <Col xs={12} lg={2}>
              <ErrorBoundary fallback={<ComponentFallback componentName="Engajamento" onRetry={handleManualRetry} />}>
                <Engajamento startDate={startDate} endDate={endDate} selectedCampaign={selectedCampaign} />
              </ErrorBoundary>
            </Col>
            <Col xs={12} lg={12}>
              <ErrorBoundary
                fallback={<ComponentFallback componentName="Gráfico Comparativo" onRetry={handleManualRetry} />}
              >
                <GraficoComparativo startDate={startDate} endDate={endDate} selectedCampaign={selectedCampaign} />
              </ErrorBoundary>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

// Componente ErrorBoundary para capturar erros nos componentes filhos
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Erro capturado pela ErrorBoundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

export default Campanhas_ativas