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
  useEffect(() => {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Rawline:wght@300;400;500;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
    
    return () => {
      // Cleanup font link when component unmounts
      document.head.removeChild(fontLink);
    };
  }, []);

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

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

  // Monitoramento da largura e altura da janela para responsividade
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    
    // Initial call to set correct values
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Função para calcular o tamanho da fonte da badge dinamicamente
  const calculateBadgeFontSize = () => {
    if (windowWidth <= 375) return 0.5; // Extra small devices
    if (windowWidth <= 576) return 0.55; // Small phones
    if (windowWidth <= 768) return 0.6; // Medium devices
    if (windowWidth <= 992) return 0.65; // Tablets
    return 0.7; // Default size for larger screens
  };

  const badgeFontSize = calculateBadgeFontSize();

  // Função para calcular o padding do card baseado no tamanho da tela
  const calculateCardPadding = () => {
    if (windowWidth <= 576) return '16px'; // Small devices
    if (windowWidth <= 992) return '20px'; // Medium devices
    return '24px'; // Large devices
  };

  // Função para calcular a altura máxima da lista baseado na altura da tela
  const calculateListMaxHeight = () => {
    const cardHeaderHeight = 70; // Estimated header height
    const cardPadding = parseInt(calculateCardPadding()) * 2;
    const availableHeight = windowHeight * 0.7; // Use 70% of viewport height as maximum
    
    return Math.min(400, availableHeight - cardHeaderHeight - cardPadding);
  };

  // Estilos responsivos
  const styles = {
    card: {
      border: `1px solid ${colors.border}`,
      borderRadius: windowWidth <= 576 ? '12px' : '16px',
      padding: calculateCardPadding(),
      width: '100%',
      minHeight: windowWidth <= 576 ? '300px' : '500px',
      maxHeight: windowHeight * 0.9, // 90% da altura da viewport no máximo
      fontFamily: 'Rawline, sans-serif',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(to bottom, white, #F8FAFC)',
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      overflow: 'hidden', // Previne que o conteúdo vaze
    },
    header: {
      marginBottom: windowWidth <= 576 ? '12px' : '20px',
      paddingBottom: windowWidth <= 576 ? '8px' : '12px',
      borderBottom: `1px solid ${colors.border}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '8px',
    },
    title: {
      fontSize: windowWidth <= 576 ? '0.875rem' : '1rem',
      fontWeight: '700',
      color: colors.secondary,
      margin: 0
    },
    badge: {
      backgroundColor: colors.primary,
      padding: windowWidth <= 576 ? '2px 6px' : '4px 8px',
      borderRadius: '20px',
      fontSize: `${badgeFontSize}rem`,
      fontWeight: '600',
      color: 'white',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      whiteSpace: 'nowrap',
      maxWidth: '100%',
    },
    campaignsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: windowWidth <= 576 ? '6px' : '8px',
      flex: 1,
      overflowY: 'auto',
      maxHeight: `${calculateListMaxHeight()}px`,
      padding: '4px',
      WebkitOverflowScrolling: 'touch', // Improve scrolling on iOS
    },
    campaignItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: windowWidth <= 576 ? '8px' : '12px',
      padding: windowWidth <= 576 ? '10px 12px' : '12px 16px',
      cursor: 'pointer',
      borderRadius: windowWidth <= 576 ? '8px' : '12px',
      border: `1px solid transparent`,
      transition: 'all 0.2s ease',
      backgroundColor: 'white',
      minHeight: windowWidth <= 576 ? '50px' : '60px',
      position: 'relative',
      overflow: 'visible',
      width: '100%',
      touchAction: 'manipulation', // Improves touch response
    },
    selectedCampaign: {
      backgroundColor: `${colors.primary}40`,
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
    },
    statusDot: {
      width: windowWidth <= 576 ? '10px' : '12px',
      height: windowWidth <= 576 ? '10px' : '12px',
      borderRadius: '50%',
      backgroundColor: colors.primary,
      flexShrink: 0,
      boxShadow: '0 0 0 2px rgba(0, 208, 0, 0.2)',
      marginTop: '4px',
      position: 'relative',
      zIndex: 2
    },
    campaignName: {
      flex: 1,
      fontWeight: '500',
      color: colors.text.primary,
      fontSize: windowWidth <= 576 ? '13px' : '14px',
      lineHeight: '1.4',
      wordBreak: 'break-word',
      whiteSpace: 'normal',
      overflow: 'visible',
      display: 'block',
      width: '100%',
      position: 'relative',
      zIndex: 2,
      marginBottom: '0'
    },
    campaignItemContent: {
      display: 'flex',
      flexDirection: 'column',
      width: `calc(100% - ${windowWidth <= 576 ? '18px' : '24px'})`,
      overflow: 'visible',
      position: 'relative',
      zIndex: 2
    },
    errorMessage: {
      padding: windowWidth <= 576 ? '12px' : '16px',
      borderRadius: '8px',
      color: colors.error,
      backgroundColor: `${colors.error}10`,
      fontWeight: '500',
      marginBottom: windowWidth <= 576 ? '12px' : '16px',
      fontSize: windowWidth <= 576 ? '13px' : '14px',
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: windowWidth <= 576 ? '20px 0' : '40px 0',
      color: colors.text.secondary,
      textAlign: 'center',
      flex: 1
    },
    emptyStateText: {
      marginTop: '16px',
      fontWeight: '500',
      fontSize: windowWidth <= 576 ? '13px' : '14px',
    },
    spinner: {
      color: colors.primary,
      width: windowWidth <= 576 ? '2rem' : '3rem',
      height: windowWidth <= 576 ? '2rem' : '3rem'
    },
    // Custom scrollbar styles
    '@global': {
      '.custom-scrollbar::-webkit-scrollbar': {
        width: '6px',
      },
      '.custom-scrollbar::-webkit-scrollbar-track': {
        background: colors.lightBg,
        borderRadius: '10px',
      },
      '.custom-scrollbar::-webkit-scrollbar-thumb': {
        background: colors.text.light,
        borderRadius: '10px',
      }
    }
  };

  // Add global styles for custom scrollbar
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: ${colors.lightBg};
        borderRadius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: ${colors.text.light};
        borderRadius: 10px;
      }
      .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: ${colors.text.light} ${colors.lightBg};
      }
      @media (max-width: 576px) {
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
    // Base height for all items (adjusted for smaller screens)
    const baseHeight = windowWidth <= 576 ? 50 : 60; 
    
    // Estimativa de caracteres por linha (ajustada para telas menores)
    const charsPerLine = windowWidth <= 576 ? 15 : 20;
    
    // Comprimento do nome / caracteres por linha = número estimado de linhas
    const estimatedLines = name ? Math.ceil(name.length / charsPerLine) : 1;
    
    // Altura por linha (baseada no line-height e font-size)
    const lineHeight = windowWidth <= 576 ? 18 : 20;
    
    // Altura total: base + linhas adicionais * altura da linha + padding
    const padding = windowWidth <= 576 ? 20 : 24; // 10px ou 12px top + 10px ou 12px bottom
    return Math.max(baseHeight, lineHeight * estimatedLines + padding);
  };
  
  // Media query helper
  const isSmallScreen = windowWidth <= 576;

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
            <div 
              style={styles.campaignsList} 
              className="custom-scrollbar"
              role="list"
              aria-label="Lista de campanhas"
            >
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
                
                // Calculate dynamic height based on campaign name and screen size
                const dynamicHeight = getItemHeight(campaign.Nome_Interno_Campanha);

                return (
                  <div 
                    key={campaign.Nome_Interno_Campanha}
                    style={{
                      ...styles.campaignItem,
                      ...(isSelected ? styles.selectedCampaign : {}),
                      minHeight: `${dynamicHeight}px`
                    }}
                    onClick={() => handleCampaignSelect(campaign.Nome_Interno_Campanha)}
                    role="button"
                    aria-pressed={isSelected}
                    tabIndex="0"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleCampaignSelect(campaign.Nome_Interno_Campanha);
                      }
                    }}
                  >
                    {/* Status dot */}
                    <span 
                      style={dotStyle}
                      aria-hidden="true"
                    ></span>
                    
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
              <svg 
                width={isSmallScreen ? "32" : "48"} 
                height={isSmallScreen ? "32" : "48"} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke={colors.text.light} 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p style={styles.emptyStateText}>
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