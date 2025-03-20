import React, { useState, useEffect } from 'react';
import { Card, Spinner } from "react-bootstrap";
import { FaInstagram, FaFacebook, FaPinterest, FaLinkedin, FaGoogle } from "react-icons/fa";
import { fetchPlatformMetrics } from '../data/fetchMetrics';
import tiktokLogo from "../assets/tiktok-logo.png";
import kwaiLogo from "../assets/kwai-logo.png";
import youtubeLogo from "../assets/youtube-logo.png";
import gdnLogo from "../assets/gdn-logo.png";

const Veiculos_investimentos = ({ startDate, endDate, selectedCampaign }) => {
  // Importação da fonte Rawline
  const fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Rawline:wght@300;400;600;700&display=swap';
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);

  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Paleta de cores
  const colors = {
    primary: '#00D000',
    secondary: '#1E293B',
    border: '#E2E8F0',
    background: '#F8FAFC',
    lightBg: '#F1F5F9',
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
      light: '#94A3B8'
    },
    platforms: {
      instagram: '#E1306C',
      facebook: '#4267B2',
      pinterest: '#E60023',
      linkedin: '#0077B5',
      google: '#DB4437',
      tiktok: '#000000',
      kwai: '#FF7300',
      youtube: '#FF0000',
      gdn: '#4285F4'
    }
  };

  // Monitora redimensionamentos de tela
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Define o layout com base no tamanho da tela
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 992;

  const styles = {
    card: {
      border: `1px solid ${colors.border}`,
      borderRadius: '16px',
      padding: isMobile ? '16px' : '24px',
      width: '100%',
      fontFamily: 'Rawline, sans-serif',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(to bottom, white, #F8FAFC)',
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    },
    header: {
      marginBottom: isMobile ? '12px' : '20px',
      paddingBottom: isMobile ? '8px' : '12px',
      borderBottom: `1px solid ${colors.border}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      fontSize: isMobile ? '1rem' : '1rem',
      fontWeight: '700',
      color: colors.secondary,
      margin: 0
    },
    platformsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '12px' : '16px',
      marginTop: isMobile ? '8px' : '10px'
    },
    platformRow: {
      padding: isMobile ? '12px' : '16px',
      borderRadius: '12px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      border: `1px solid ${colors.border}`
    },
    platformHeader: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: isMobile ? 'flex-start' : 'center',
      width: '100%',
      gap: '10px',
      position: 'relative',
      zIndex: 1
    },
    platformTopRow: {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      marginBottom: isMobile ? '10px' : 0
    },
    icon: {
      width: '30px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      marginRight: '10px'
    },
    platformInfo: {
      width: isMobile ? 'calc(100% - 40px)' : '150px',
      marginRight: isMobile ? 0 : '20px'
    },
    platformName: {
      fontSize: isMobile ? '0.9rem' : '1rem',
      fontWeight: '600',
      display: 'block',
      color: colors.text.primary
    },
    investment: {
      fontSize: isMobile ? '0.9rem' : '1.2rem',
      fontWeight: '700',
      color: colors.text.secondary
    },
    metricsContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      flex: 1,
      border: `1px solid ${colors.border}`,
      borderRadius: '8px',
      padding: isMobile ? '8px 5px' : '10px',
      backgroundColor: colors.lightBg,
      transition: 'all 0.2s ease',
      width: isMobile ? '100%' : 'auto',
      overflowX: isMobile ? 'auto' : 'visible'
    },
    metrics: {
      display: 'flex',
      justifyContent: isMobile ? 'flex-start' : 'space-between',
      gap: isMobile ? '10px' : '15px',
      width: '100%',
      minWidth: isMobile ? '400px' : 'auto'
    },
    metricItem: {
      width: isMobile ? '60px' : '55px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 0,
      flexShrink: 0
    },
    metricLabel: {
      fontSize: isMobile ? '1rem' : '1.2rem',
      fontWeight: '600',
      color: colors.text.secondary,
      marginBottom: '4px'
    },
    metricValue: {
      fontSize: isMobile ? '0.8rem' : '1.2rem',
      fontWeight: '700',
      color: colors.text.primary,
      whiteSpace: 'nowrap'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
      gap: '10px'
    },
    spinner: {
      color: colors.primary
    },
  };

  useEffect(() => {
    const getMetrics = async () => {
      setLoading(true);
      try {
        const result = await fetchPlatformMetrics(startDate, endDate, selectedCampaign);
        
        // Lista de todas as plataformas que devem ser exibidas
        const allPlatforms = [
          { platform: "Instagram", spend: 0, CPM: 0, CPV: 0, CPC: 0, CTR: 0, VTR: 0, impressions: 0 },
          { platform: "Facebook", spend: 0, CPM: 0, CPV: 0, CPC: 0, CTR: 0, VTR: 0, impressions: 0 },
          { platform: "Pinterest", spend: 0, CPM: 0, CPV: 0, CPC: 0, CTR: 0, VTR: 0, impressions: 0 },
          { platform: "Linkedin", spend: 0, CPM: 0, CPV: 0, CPC: 0, CTR: 0, VTR: 0, impressions: 0 },
          { platform: "Google Search", spend: 0, CPM: 0, CPV: 0, CPC: 0, CTR: 0, VTR: 0, impressions: 0 },
          { platform: "Tiktok", spend: 0, CPM: 0, CPV: 0, CPC: 0, CTR: 0, VTR: 0, impressions: 0 },
          { platform: "Kwai", spend: 0, CPM: 0, CPV: 0, CPC: 0, CTR: 0, VTR: 0, impressions: 0 },
          { platform: "Youtube", spend: 0, CPM: 0, CPV: 0, CPC: 0, CTR: 0, VTR: 0, impressions: 0 },
          { platform: "Google GDN", spend: 0, CPM: 0, CPV: 0, CPC: 0, CTR: 0, VTR: 0, impressions: 0 },
        ];

        // Mescla os dados retornados com a lista de todas as plataformas
        const mergedMetrics = allPlatforms.map(platform => {
          const found = result.find(item => item.platform.toLowerCase() === platform.platform.toLowerCase());
          return found ? found : platform;
        });

        setMetrics(mergedMetrics);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    getMetrics();
  }, [startDate, endDate, selectedCampaign]);

  const getIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case "instagram": return <FaInstagram style={{ color: colors.platforms.instagram }} />;
      case "facebook": return <FaFacebook style={{ color: colors.platforms.facebook }} />;
      case "pinterest": return <FaPinterest style={{ color: colors.platforms.pinterest }} />;
      case "linkedin": return <FaLinkedin style={{ color: colors.platforms.linkedin }} />;
      case "google search": return <FaGoogle style={{ color: colors.platforms.google }} />;
      case "tiktok": return <img src={tiktokLogo} alt="TikTok Logo" width="24" height="24" />;
      case "kwai": return <img src={kwaiLogo} alt="Kwai Logo" width="24" height="24" />;
      case "youtube": return <img src={youtubeLogo} alt="Youtube Logo" width="34" height="22" />;
      case "google gdn": return <img src={gdnLogo} alt="GDN Logo" width="24" height="24" />;
      default: return null;
    }
  };

  const calculateProgress = (platform) => {
    if (platform.spend && platform.impressions) {
      return Math.min(100, (platform.spend / platform.impressions) * 100);
    }
    return 0;
  };

  if (loading) {
    return (
      <Card style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Investimento por veículo</h2>
        </div>
        <div style={styles.loadingContainer}>
          <Spinner animation="border" style={styles.spinner} />
          <span style={{ color: colors.text.secondary }}>Carregando métricas...</span>
        </div>
      </Card>
    );
  }

  const sortedMetrics = [...metrics].sort((a, b) => (b.spend || 0) - (a.spend || 0));

  return (
    <Card style={styles.card}>
      <div style={styles.header}>
        <h2 style={styles.title}>Investimento por veículo</h2>
      </div>
      
      <div style={styles.platformsList}>
        {sortedMetrics.map((item, index) => (
          <div 
            key={index} 
            style={styles.platformRow}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              
              // Adiciona hover no contêiner de métricas
              const metricsContainer = e.currentTarget.querySelector('[data-metrics-container]');
              if (metricsContainer) {
                metricsContainer.style.borderColor = 'blue';
                metricsContainer.style.backgroundColor = 'white';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
              
              // Remove hover no contêiner de métricas
              const metricsContainer = e.currentTarget.querySelector('[data-metrics-container]');
              if (metricsContainer) {
                metricsContainer.style.borderColor = colors.border;
                metricsContainer.style.backgroundColor = colors.lightBg;
              }
            }}
          >
            <div style={styles.platformHeader}>
              {isMobile ? (
                <>
                  <div style={styles.platformTopRow}>
                    <div style={styles.icon}>{getIcon(item.platform)}</div>
                    <div style={styles.platformInfo}>
                      <span style={styles.platformName}>
                        {item.platform}
                      </span>
                      <div style={styles.investment}>
                        {item.spend
                          ? `R$ ${item.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          : "R$ 0,00"}
                      </div>
                    </div>
                  </div>
                  <div style={styles.metricsContainer} data-metrics-container>
                    <div style={styles.metrics}>
                      <div style={styles.metricItem}>
                        <span style={styles.metricLabel}>CPM</span>
                        <span style={styles.metricValue}>
                          {item.CPM ? `R$ ${item.CPM.toFixed(2)}` : "R$0,00"}
                        </span>
                      </div>
                      <div style={styles.metricItem}>
                        <span style={styles.metricLabel}>CPV</span>
                        <span style={styles.metricValue}>
                          {item.CPV ? `R$ ${item.CPV.toFixed(2)}` : "R$0,00"}
                        </span>
                      </div>
                      <div style={styles.metricItem}>
                        <span style={styles.metricLabel}>CPC</span>
                        <span style={styles.metricValue}>
                          {item.CPC ? `R$ ${item.CPC.toFixed(2)}` : "R$0,00"}
                        </span>
                      </div>
                      <div style={styles.metricItem}>
                        <span style={styles.metricLabel}>CTR</span>
                        <span style={styles.metricValue}>
                          {item.CTR ? `${(item.CTR * 100).toFixed(2)}%` : "0%"}
                        </span>
                      </div>
                      <div style={styles.metricItem}>
                        <span style={styles.metricLabel}>VTR</span>
                        <span style={styles.metricValue}>
                          {item.VTR ? `${(item.VTR * 100).toFixed(2)}%` : "0%"}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div style={styles.icon}>{getIcon(item.platform)}</div>
                  <div style={styles.platformInfo}>
                    <span style={styles.platformName}>
                      {item.platform}
                    </span>
                    <div style={styles.investment}>
                      {item.spend
                        ? `R$ ${item.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : "R$ 0,00"}
                    </div>
                  </div>
                  <div style={styles.metricsContainer} data-metrics-container>
                    <div style={styles.metrics}>
                      <div style={styles.metricItem}>
                        <span style={styles.metricLabel}>CPM</span>
                        <span style={styles.metricValue}>
                          {item.CPM ? `R$ ${item.CPM.toFixed(2)}` : "R$0,00"}
                        </span>
                      </div>
                      <div style={styles.metricItem}>
                        <span style={styles.metricLabel}>CPV</span>
                        <span style={styles.metricValue}>
                          {item.CPV ? `R$ ${item.CPV.toFixed(2)}` : "R$0,00"}
                        </span>
                      </div>
                      <div style={styles.metricItem}>
                        <span style={styles.metricLabel}>CPC</span>
                        <span style={styles.metricValue}>
                          {item.CPC ? `R$ ${item.CPC.toFixed(2)}` : "R$0,00"}
                        </span>
                      </div>
                      <div style={styles.metricItem}>
                        <span style={styles.metricLabel}>CTR</span>
                        <span style={styles.metricValue}>
                          {item.CTR ? `${(item.CTR * 100).toFixed(2)}%` : "0%"}
                        </span>
                      </div>
                      <div style={styles.metricItem}>
                        <span style={styles.metricLabel}>VTR</span>
                        <span style={styles.metricValue}>
                          {item.VTR ? `${(item.VTR * 100).toFixed(2)}%` : "0%"}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div 
              style={{
                ...styles.progressBar,
                width: `${calculateProgress(item)}%`
              }}
            ></div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default Veiculos_investimentos;