import { useState, useEffect } from "react";
import { fetchCampaigns } from "../data/fetchMetrics";
import { Card, Spinner, Badge } from "react-bootstrap"; 
import { graficoMetrics } from "../data/graficoMetrics";

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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Paleta de cores
  const colors = {
    primary: '#00D000',
    secondary: '#1E293B',
    selected: '#008500',
    border: '#E2E8F0',
    background: '#F8FAFC',
    lightBg: '#F1F5F9',
    error: '#EF4444',
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
      light: '#94A3B8'
    }
  };

  // Monitoramento da largura da janela para responsividade
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Função para calcular o tamanho da fonte da badge dinamicamente
  const calculateBadgeFontSize = () => {
    const baseFontSize = 0.7; // Tamanho base em rem
    const minFontSize = 0.5; // Tamanho mínimo em rem
    const scaleFactor = Math.min(1, windowWidth / 1440); // Escala com base em uma largura de referência (1440px)
    return Math.max(minFontSize, baseFontSize * scaleFactor); // Garante que não fique menor que o mínimo
  };

  const badgeFontSize = calculateBadgeFontSize();

  const styles = {
    card: {
      border: `1px solid ${colors.border}`,
      borderRadius: '16px',
      padding: '24px',
      width: '100%',
      minHeight: '500px',
      fontFamily: 'Rawline, sans-serif',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(to bottom, white, #F8FAFC)',
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    },
    header: {
      marginBottom: '20px',
      paddingBottom: '12px',
      borderBottom: `1px solid ${colors.border}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap', // Permite que a badge quebre para a próxima linha se necessário
      gap: '8px', // Espaço entre título e badge
    },
    title: {
      fontSize: '1rem',
      fontWeight: '700',
      color: colors.secondary,
      margin: 0
    },
    badge: {
      backgroundColor: colors.primary,
      padding: windowWidth < 768 ? '2px 6px' : '4px 8px', // Padding responsivo
      borderRadius: '20px',
      fontSize: `${badgeFontSize}rem`, // Tamanho da fonte dinâmico
      fontWeight: '600',
      color: 'white',
      display: 'inline-flex', // Melhor controle sobre o tamanho
      alignItems: 'center',
      justifyContent: 'center',
      whiteSpace: 'nowrap', // Impede quebra de linha no texto da badge
      maxWidth: '100%', // Garante que não exceda o contêiner
    },
    campaignsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      flex: 1,
      overflowY: 'auto',
      maxHeight: '400px',
      padding: '4px'
    },
    campaignItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '12px 16px',
      cursor: 'pointer',
      borderRadius: '12px',
      border: `1px solid transparent`,
      transition: 'all 0.2s ease',
      backgroundColor: 'white',
      minHeight: '60px',
      position: 'relative', // Necessário para posicionamento absoluto dos elementos internos
      overflow: 'visible', // Permite que o conteúdo seja visível mesmo se ultrapassar os limites
      width: '100%' // Garante que ocupe toda a largura disponível
    },
    selectedCampaign: {
      backgroundColor: `${colors.primary}40`,
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
    },
    statusDot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: colors.primary,
      flexShrink: 0,
      boxShadow: '0 0 0 2px rgba(0, 208, 0, 0.2)',
      marginTop: '4px',
      position: 'relative', // Mantém a posição em relação ao fluxo normal
      zIndex: 2 // Acima da área clicável
    },
    campaignName: {
      flex: 1,
      fontWeight: '500',
      color: colors.text.primary,
      fontSize: '14px',
      lineHeight: '1.4',
      wordBreak: 'break-word',
      whiteSpace: 'normal',
      overflow: 'visible',
      display: 'block',
      width: '100%', // Ocupa toda a largura disponível
      position: 'relative', // Para que fique acima da área clicável
      zIndex: 2, // Acima da área clicável para garantir interatividade
      marginBottom: '0' // Remove margem inferior
    },
    campaignItemContent: {
      display: 'flex',
      flexDirection: 'column',
      width: 'calc(100% - 24px)', // Garante espaço para o status dot
      overflow: 'visible', // Permite que o texto apareça completo
      position: 'relative', // Para posicionamento correto
      zIndex: 2 // Acima da área clicável
    },
    errorMessage: {
      padding: '16px',
      borderRadius: '8px',
      color: colors.error,
      backgroundColor: `${colors.error}10`,
      fontWeight: '500',
      marginBottom: '16px'
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 0',
      color: colors.text.secondary,
      textAlign: 'center',
      flex: 1
    },
    spinner: {
      color: colors.primary,
      width: '3rem',
      height: '3rem'
    },
    // Área clicável que cobre todo o item
    campaignItemClickable: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%', // Garante que cubra toda a largura
      height: '100%', // Garante que cubra toda a altura
      zIndex: 1,
      cursor: 'pointer'
    }
  };

  const loadCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCampaigns(startDate, endDate);
      
      const yesterday = new Date(endDate);
      yesterday.setDate(yesterday.getDate() - 1);
  
      const campaignsWithStatus = await Promise.all(
        data.map(async (campaign) => {
          const metrics = await graficoMetrics(startDate, endDate, campaign.Nome_Interno_Campanha);
          
          const yesterdayMetric = metrics.actual.find(item => {
            const metricDate = new Date(item.date);
            return metricDate.toDateString() === yesterday.toDateString();
          });
          
          const isActive = yesterdayMetric && yesterdayMetric.impressions > 0;
          
          return {
            ...campaign,
            isActive,
          };
        })
      );
      
      setCampaigns(campaignsWithStatus);
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

  const renderCampaignName = (name) => {
    return (
      <div style={styles.campaignName}>
        {name || 'Sem nome'}
      </div>
    );
  };

  // Função para calcular a altura dinâmica do item com base no conteúdo
  const getItemHeight = (name) => {
    // Base height for all items
    const baseHeight = 60; 
    
    // Estimativa de caracteres por linha (ajuste conforme necessário)
    const charsPerLine = 20;
    
    // Comprimento do nome / caracteres por linha = número estimado de linhas
    const estimatedLines = name ? Math.ceil(name.length / charsPerLine) : 1;
    
    // Altura por linha (baseada no line-height e font-size)
    const lineHeight = 20; // 14px font-size * 1.4 line-height ≈ 20px
    
    // Altura total: base + linhas adicionais * altura da linha + padding
    return Math.max(baseHeight, lineHeight * estimatedLines + 24); // 24px for padding (12px top + 12px bottom)
  };

  return (
    <Card style={styles.card}>
      <div style={styles.header}>
        <h2 style={styles.title}>Em veiculação</h2>
        <Badge style={styles.badge}>
          {campaigns.length} campanhas
        </Badge>
      </div>

      {error && (
        <div style={styles.errorMessage}>
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="d-flex justify-content-center align-items-center flex-grow-1">
          <Spinner animation="border" style={styles.spinner}>
            <span className="visually-hidden">Carregando...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {campaigns.length > 0 ? (
            <div style={styles.campaignsList} className="custom-scrollbar">
              {campaigns.map((campaign) => {
                const isSelected = selectedCampaign === campaign.Nome_Interno_Campanha;
                
                const dotColor = campaign.isActive ? (isSelected ? colors.selected : colors.primary) : "#afafaf";
                const dotStyle = campaign.isActive 
                  ? { 
                      ...styles.statusDot,
                      backgroundColor: dotColor,
                      boxShadow: '0 0 0 2px rgba(0, 208, 0, 0.2)' 
                    }
                  : {
                      ...styles.statusDot, 
                      backgroundColor: dotColor,
                      boxShadow: 'none'
                    };
                
                // Calcula altura dinâmica com base no nome da campanha
                const dynamicHeight = getItemHeight(campaign.Nome_Interno_Campanha);

                return (
                  <div 
                    key={campaign.Nome_Interno_Campanha}
                    style={{
                      ...styles.campaignItem,
                      ...(isSelected ? styles.selectedCampaign : {}),
                      minHeight: `${dynamicHeight}px` // Altura dinâmica baseada no conteúdo
                    }}
                    onClick={() => handleCampaignSelect(campaign.Nome_Interno_Campanha)}
                  >
                    {/* Status dot */}
                    <span style={dotStyle}></span>
                    
                    {/* Campaign name content */}
                    <div style={styles.campaignItemContent}>
                      {renderCampaignName(campaign.Nome_Interno_Campanha)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={colors.text.light} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p style={{ marginTop: '16px', fontWeight: '500' }}>
                Nenhuma campanha ativa encontrada.
              </p>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default CardCampanha;