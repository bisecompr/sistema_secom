import { useState, useEffect } from "react";
import { fetchCampaigns } from "../data/fetchMetrics";
import { Card, Spinner } from "react-bootstrap"; // Importe o Spinner

const CardCampanha = ({    
  onCampaignSelect, 
  startDate, 
  endDate, 
  selectedCampaign 
}) => {
  // Importação da fonte Rawline
  const fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Rawline:wght@300;400;600;700&display=swap';
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const rawlineStyles = {
    container: {
      fontFamily: 'Rawline, sans-serif',
    },
    title: {
      fontSize: '1.5rem', 
      fontWeight: '600', 
      marginBottom: '16px',
      fontFamily: 'Rawline, sans-serif',
    },
    card: {
      border: '1px solid #d3d3d3', // Borda sutil
      borderRadius: '8px', // Bordas arredondadas
      padding: '20px', 
      width: '100%', 
      minHeight: '500px',  // Mantém altura mínima
      fontFamily: 'Rawline, sans-serif',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // Sombreamento sutil
      display: 'flex',  // Flex para ajustar o conteúdo internamente
      flexDirection: 'column',  // Organiza o conteúdo em coluna
    },
    input: {
      padding: '8px',
      border: '1px solid #e5e7eb',
      borderRadius: '4px',
      height: '38px',
      flex: '1',
      minWidth: '100px',
      fontFamily: 'Rawline, sans-serif',
    },
    button: {
      backgroundColor: '#00D000',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '8px 16px',
      height: '38px',
      minWidth: '100px',
      fontFamily: 'Rawline, sans-serif',
      fontWeight: '600',
    },
    campaignItem: {
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px', 
      padding: '8px', 
      cursor: 'pointer',
      width: '100%',
      fontFamily: 'Rawline, sans-serif',
    },
    selectedCampaign: {
      backgroundColor: '#FF0000',
      color: '#ffffff',
      fontFamily: 'Rawline, sans-serif',
      borderRadius: '12px',
    },    
    campaignName: {
      flex: 1,
      fontFamily: 'Rawline, sans-serif',
      fontWeight: '400',
    },
    statusDot: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: 'green',
      flexShrink: 0
    },
    errorMessage: {
      fontFamily: 'Rawline, sans-serif',
      color: 'red',
      fontWeight: '400',
    }
  };

  const loadCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCampaigns(startDate, endDate);
      setCampaigns(data);
    } catch (error) {
      setError("Erro ao carregar campanhas. Por favor, tente novamente.");
      console.error("Erro ao carregar campanhas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();    
  }, [startDate, endDate]);
 
  const handleCampaignSelect = (campaignName) => {
    onCampaignSelect(campaignName === selectedCampaign ? null : campaignName);
  };

  return (
    <Card style={{...rawlineStyles.card, ...rawlineStyles.container}}>
      <div style={rawlineStyles.container}>
        <h2 className="fw-bold" style={rawlineStyles.title}>Em veiculação</h2>
        <br/>
        {error && <p style={rawlineStyles.errorMessage}>{error}</p>}
        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Carregando...</span>
            </Spinner>
          </div>
        ) : null}
        
        {campaigns.length > 0 ? (
          <div className="campaigns-list">
            {campaigns.map((campaign) => (
              <div 
                key={campaign.Nome_Interno_Campanha}
                onClick={() => handleCampaignSelect(campaign.Nome_Interno_Campanha)}
                style={{
                  ...rawlineStyles.campaignItem,
                  ...(selectedCampaign === campaign.Nome_Interno_Campanha ? rawlineStyles.selectedCampaign : {})
                }}
              >
                <span
                  style={rawlineStyles.statusDot}
                ></span>
              
                <span style={rawlineStyles.campaignName}>
                  {campaign.Nome_Interno_Campanha || 'Sem nome'}
                </span>
              </div>            
            ))}
          </div>
        ) : (
          <p style={rawlineStyles.container}>Nenhuma campanha ativa encontrada.</p>
        )}
      </div>
    </Card>
  );
};

export default CardCampanha;