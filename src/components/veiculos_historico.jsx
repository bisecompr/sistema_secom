import React, { useState, useEffect } from 'react';
import { Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaInstagram, FaFacebook, FaPinterest, FaLinkedin, FaGoogle, FaCaretUp, FaCaretDown } from "react-icons/fa";
import { fetchPlatformMetrics } from '../data/fetchMetrics';
import tiktokLogo from "../assets/tiktok-logo.png";
import kwaiLogo from "../assets/kwai-logo.png";
import youtubeLogo from "../assets/youtube-logo.png";
import gdnLogo from "../assets/gdn-logo.png";

const VeiculosHistoricos = ({ startDate, endDate, selectedCampaign }) => {
  useEffect(() => {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
    
    return () => {
      document.head.removeChild(fontLink);
    };
  }, []);

  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showCampaign, setShowCampaign] = useState(false);
  const [hoveredPlatform, setHoveredPlatform] = useState(null);

  const colors = {
    primary: '#000000',
    secondary: '#1E293B',
    border: '#E2E8F0',
    background: '#F8FAFC',
    lightBg: '#F1F5F9',
    cardBg: 'linear-gradient(145deg, #ffffff, #f5f7fa)',
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
      light: '#272727'
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
    },
    comparison: {
      positive: '#10B981',
      negative: '#EF4444'
    }
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!loading && selectedCampaign) {
      const timer = setTimeout(() => {
        setShowCampaign(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, selectedCampaign]);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 992;

  const styles = {
    card: {
      border: '1px solid #E2E8F0',
      borderRadius: isMobile ? '16px' : '24px',
      padding: isMobile ? '12px' : '30px',
      width: '100%',
      maxWidth: isMobile ? '100%' : '1200px',
      margin: isMobile ? '0 auto' : '0 auto',
      fontFamily: 'Inter, sans-serif',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      display: 'flex',
      flexDirection: 'column',
      background: colors.cardBg,
      overflow: 'hidden',
    },
    header: {
      marginBottom: isMobile ? '12px' : '24px',
      paddingBottom: isMobile ? '8px' : '16px',
      borderBottom: `2px solid ${colors.border}`,
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: isMobile ? 'flex-start' : 'center',
      gap: isMobile ? '8px' : '0'
    },
    title: {
      fontSize: isMobile ? '1rem' : '1.2rem',
      fontWeight: '700',
      color: colors.primary,
      margin: 0,
      position: 'relative',
      paddingLeft: '0px',
      letterSpacing: '-0.02em',
    },
    platformsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '12px' : '20px',
      marginTop: isMobile ? '8px' : '16px'
    },
    platformCard: {
      padding: isMobile ? '12px' : '24px',
      borderRadius: isMobile ? '12px' : '16px',
      backgroundColor: 'white',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      border: `1px solid ${colors.border}`,
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
    platformHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: isMobile ? '12px' : '16px',
      gap: isMobile ? '12px' : '16px',
      flexWrap: isMobile ? 'wrap' : 'nowrap'
    },
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: isMobile ? '36px' : '48px',
      height: isMobile ? '36px' : '48px',
      borderRadius: '50%',
      backgroundColor: colors.lightBg,
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.3s ease',
    },
    platformName: {
      fontSize: isMobile ? '0.95rem' : '1.25rem',
      fontWeight: '600',
      color: colors.text.primary,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'wrap'
    },
    platformNameHighlight: {
      width: isMobile ? '6px' : '8px',
      height: isMobile ? '6px' : '8px',
      borderRadius: '50%',
      display: 'inline-block',
      marginRight: isMobile ? '4px' : '6px'
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)',
      gap: isMobile ? '8px' : '16px',
      width: '100%',
    },
    metricItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '6px' : '8px',
      padding: isMobile ? '12px' : '16px',
      borderRadius: isMobile ? '8px' : '12px',
      backgroundColor: colors.lightBg,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    metricLabel: {
      fontSize: isMobile ? '0.75rem' : '0.85rem',
      fontWeight: '600',
      color: colors.text.secondary,
    },
    metricValues: {
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '6px' : '8px',
    },
    historicalValue: {
      fontSize: isMobile ? '0.95rem' : '1.1rem',
      fontWeight: '700',
      color: colors.text.primary,
    },
    campaignValue: {
      fontSize: isMobile ? '0.85rem' : '1rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '6px' : '8px',
      padding: isMobile ? '4px 8px' : '6px 10px',
      borderRadius: '8px',
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      opacity: showCampaign ? 1 : 0,
      transform: showCampaign ? 'translateY(0)' : 'translateY(10px)',
      transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out'
    },
    comparison: {
      fontSize: isMobile ? '0.7rem' : '0.8rem',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontWeight: '600',
      padding: isMobile ? '2px 4px' : '2px 6px',
      borderRadius: '4px',
    },
    campaignStatus: {
      fontSize: isMobile ? '0.65rem' : '0.75rem',
      fontWeight: '500',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: isMobile ? '2px 6px' : '2px 8px',
      borderRadius: '12px',
      marginLeft: isMobile ? '6px' : '8px',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: isMobile ? '150px' : '200px',
      gap: '10px'
    },
    loader: {
      display: 'inline-block',
      width: isMobile ? '40px' : '50px',
      height: isMobile ? '40px' : '50px',
      border: '5px solid rgba(79, 70, 229, 0.2)',
      borderRadius: '50%',
      borderTop: '5px solid #002bec',
      animation: 'spin 1s linear infinite',
    }
  };

  useEffect(() => {
    const getMetrics = async () => {
      setLoading(true);
      setShowCampaign(false);
      try {
        // Obtém dados históricos e da campanha
        const historicData = await fetchPlatformMetrics('2024-01-01', '2024-12-31');
        const campaignData = selectedCampaign ? await fetchPlatformMetrics(startDate, endDate, selectedCampaign) : [];

        // Lista de todas as plataformas possíveis
        const allPlatforms = [
          { platform: "Instagram", CPM: 0, CPV: 0, CPC: 0, CTR: 0, VTR: 0 },
          { platform: "Facebook", CPM: 0, CPV: 0, CPC: 0, CTR: 0, VTR: 0 },
          { platform: "Pinterest", CPM: 0, CPV: 0, CPC: 0, CTR: 0, VTR: 0 },
          { platform: "Linkedin", CPM: 0, CPV: 0, CPC: 0, CTR: 0, VTR: 0 },
          { platform: "Google Search", CPM: 0, CPV: 0, CPC: 0, CTR: 0, VTR: 0 },
          { platform: "Tiktok", CPM: 0, CPV: 0, CPC: 0, CTR: 0, VTR: 0 },
          { platform: "Kwai", CPM: 0, CPV: 0, CPC: 0, CTR: 0, VTR: 0 },
          { platform: "Youtube", CPM: 0, CPV: 0, CPC: 0, CTR: 0, VTR: 0 },
          { platform: "Google GDN", CPM: 0, CPV: 0, CPC: 0, CTR: 0, VTR: 0 },
        ];

        const keysToCheck = ["CPM", "CPV", "CPC", "CTR", "VTR"];

        // Mescla os dados históricos e da campanha
        const mergedMetrics = allPlatforms.map(platform => {
          const hist = historicData.find(item => 
            item.platform.toLowerCase() === platform.platform.toLowerCase()
          ) || { CPM: 0, CPV: 0, CPC: 0, CTR: 0, VTR: 0 };
          const camp = campaignData.find(item => 
            item.platform.toLowerCase() === platform.platform.toLowerCase()
          ) || null;

          // Verifica se há pelo menos um valor válido nos dados históricos
          const hasValidHistoricalData = keysToCheck.some(key => hist[key] && hist[key] !== 0);
          // Verifica se há pelo menos um valor válido nos dados da campanha
          const hasValidCampaignData = camp && keysToCheck.some(key => camp[key] && camp[key] !== 0);

          // Se houver campanha selecionada, só inclui se tiver dados válidos de campanha
          if (selectedCampaign && !hasValidCampaignData) {
            return null; // Não exibe o card se não houver métricas novas para comparativo
          }
          // Se não houver campanha selecionada, exibe apenas se tiver dados históricos
          if (!selectedCampaign && !hasValidHistoricalData) {
            return null;
          }

          const comparisons = {};
          if (camp && hasValidCampaignData) {
            keysToCheck.forEach(metric => {
              const histValue = hist[metric] || 0;
              const campValue = camp[metric] || 0;

              if (histValue !== 0 && campValue !== 0) {
                const percentChange = ((campValue - histValue) / histValue) * 100;
                const isUp = campValue > histValue;
                const isCostMetric = ["CPM", "CPV", "CPC"].includes(metric);
                const isPositive = isCostMetric ? !isUp : isUp;

                comparisons[metric] = {
                  percent: percentChange,
                  isPositive: isPositive,
                  isUp: isUp
                };
              }
            });
          }

          return { 
            ...platform, 
            historical: hist, 
            campaign: camp,
            comparisons
          };
        }).filter(item => item !== null);

        // Filtra por plataformas ativas da campanha, se aplicável
        const activePlatforms = selectedCampaign?.platforms?.map(p => p.toLowerCase()) || null;
        const finalMetrics = activePlatforms 
          ? mergedMetrics.filter(item => activePlatforms.includes(item.platform.toLowerCase()))
          : mergedMetrics;

        setMetrics(finalMetrics);
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
      case "instagram": return <FaInstagram size={isMobile ? 20 : 24} style={{ color: colors.platforms.instagram }} />;
      case "facebook": return <FaFacebook size={isMobile ? 20 : 24} style={{ color: colors.platforms.facebook }} />;
      case "pinterest": return <FaPinterest size={isMobile ? 20 : 24} style={{ color: colors.platforms.pinterest }} />;
      case "linkedin": return <FaLinkedin size={isMobile ? 20 : 24} style={{ color: colors.platforms.linkedin }} />;
      case "google search": return <FaGoogle size={isMobile ? 20 : 24} style={{ color: colors.platforms.google }} />;
      case "tiktok": return <img src={tiktokLogo} alt="TikTok Logo" width={isMobile ? "20" : "24"} height={isMobile ? "20" : "24"} />;
      case "kwai": return <img src={kwaiLogo} alt="Kwai Logo" width={isMobile ? "20" : "24"} height={isMobile ? "20" : "24"} />;
      case "youtube": return <img src={youtubeLogo} alt="Youtube Logo" width={isMobile ? "20" : "24"} height={isMobile ? "18" : "20"} />;
      case "google gdn": return <img src={gdnLogo} alt="GDN Logo" width={isMobile ? "20" : "24"} height={isMobile ? "20" : "24"} />;
      default: return null;
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform.toLowerCase()) {
      case "instagram": return colors.platforms.instagram;
      case "facebook": return colors.platforms.facebook;
      case "pinterest": return colors.platforms.pinterest;
      case "linkedin": return colors.platforms.linkedin;
      case "google search": return colors.platforms.google;
      case "tiktok": return colors.platforms.tiktok;
      case "kwai": return colors.platforms.kwai;
      case "youtube": return colors.platforms.youtube;
      case "google gdn": return colors.platforms.gdn;
      default: return colors.primary;
    }
  };

  const renderComparison = (comparison, metric) => {
    if (!comparison || comparison.percent === null || comparison.percent === undefined) return null;
    
    const percentValue = Math.abs(comparison.percent).toFixed(1);

    return (
      <div 
        style={{
          ...styles.comparison,
          backgroundColor: comparison.isPositive 
            ? `${colors.comparison.positive}15` 
            : `${colors.comparison.negative}15`,
          color: comparison.isPositive 
            ? colors.comparison.positive 
            : colors.comparison.negative
        }}
      >
        {comparison.isUp ? <FaCaretUp /> : <FaCaretDown />}
        {percentValue}%
      </div>
    );
  };

  if (loading) {
    return (
      <Card style={styles.card}>
        <div style={styles.header}>
          <div style={{position: 'relative'}}>
            <h2 style={styles.title}>Métricas por veículo</h2>
          </div>
        </div>
        <div style={styles.loadingContainer}>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
          <div style={styles.loader}></div>
          <span style={{ color: colors.text.secondary, marginLeft: '12px', fontWeight: '500' }}>
            Carregando métricas...
          </span>
        </div>
      </Card>
    );
  }

  const sortedMetrics = [...metrics];

  return (
    <Card style={styles.card}>
      <div style={styles.header}>
        <div style={{position: 'relative'}}>
          <h2 style={styles.title}>Métricas por veículo</h2>
        </div>
        {selectedCampaign && (
          <div style={{
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            fontWeight: '500',
            color: colors.primary,
            backgroundColor: `${colors.primary}10`,
            padding: isMobile ? '4px 8px' : '6px 12px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{width: isMobile ? '6px' : '8px', height: isMobile ? '6px' : '8px', borderRadius: '50%', backgroundColor: colors.primary}}></span>
            Campanha selecionada
          </div>
        )}
      </div>
      
      <motion.div 
        style={styles.platformsList}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {sortedMetrics.map((item, index) => {
          const platformColor = getPlatformColor(item.platform);
          const isHovered = hoveredPlatform === index;
          
          return (
            <motion.div 
              key={index} 
              style={{
                ...styles.platformCard,
                boxShadow: isHovered 
                  ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                  : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                transform: isHovered && !isMobile ? 'translateY(-4px)' : 'translateY(0)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onMouseEnter={() => !isMobile && setHoveredPlatform(index)}
              onMouseLeave={() => !isMobile && setHoveredPlatform(null)}
            >
              <div style={styles.platformHeader}>
                <motion.div 
                  style={{
                    ...styles.iconContainer,
                    backgroundColor: `${platformColor}15`
                  }}
                  whileHover={{ rotate: isMobile ? 0 : 5 }}
                >
                  {getIcon(item.platform)}
                </motion.div>
                <div style={styles.platformName}>
                  <span 
                    style={{
                      ...styles.platformNameHighlight,
                      backgroundColor: platformColor
                    }}
                  ></span>
                  {item.platform}
                  {item.campaign && (
                    <span style={{
                      ...styles.campaignStatus,
                      backgroundColor: `${platformColor}15`,
                      color: platformColor
                    }}>
                      Ativo
                    </span>
                  )}
                </div>
              </div>
              
              <div style={styles.metricsGrid}>
                {["CPM", "CPV", "CPC", "CTR", "VTR"].map((kpi) => (
                  <motion.div 
                    key={kpi} 
                    style={{
                      ...styles.metricItem,
                    }}
                    whileHover={{ scale: isMobile ? 1 : 1.03, boxShadow: isMobile ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.08)' }}
                  >
                    <div style={{...styles.metricLabel, color: platformColor}}>
                      {kpi}
                    </div>
                    <div style={styles.metricValues}>
                      <div style={styles.historicalValue}>
                        {item.historical[kpi] !== undefined && item.historical[kpi] !== null ? 
                          (kpi === "CTR" || kpi === "VTR" ? 
                            `${(item.historical[kpi] * 100).toFixed(2)}%` : 
                            `R$ ${item.historical[kpi].toFixed(2)}`) : 
                          "—"}
                      </div>
                      {selectedCampaign && item.campaign && (
                        <div style={{
                          ...styles.campaignValue,
                          color: platformColor,
                        }}>
                          {item.campaign[kpi] !== undefined && item.campaign[kpi] !== null ? 
                            (kpi === "CTR" || kpi === "VTR" ? 
                              `${(item.campaign[kpi] * 100).toFixed(2)}%` : 
                              `R$ ${item.campaign[kpi].toFixed(2)}`) : 
                            "—"}
                          {item.comparisons && item.comparisons[kpi] && renderComparison(item.comparisons[kpi], kpi)}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </Card>
  );
};

export default VeiculosHistoricos;