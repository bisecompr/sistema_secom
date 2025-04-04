import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { fetchMetrics, fetchCampaignMetrics } from '../data/fetchMetrics';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';

// Define os cards com os KPIs
const metricCards = [
  { type: 'CPM', title: 'Custo por Mil Impressões (CPM)', format: 'currency' },
  { type: 'CPV', title: 'Custo por Visualização (CPV)', format: 'currency' },
  { type: 'CPC', title: 'Custo por Clique (CPC)', format: 'currency' },
  { type: 'CTR', title: 'Taxa de Cliques (CTR)', format: 'percentage' },
  { type: 'VTR', title: 'Taxa de Visualização (VTR)', format: 'percentage' }
];

function CardsHistorico({ startDate, endDate, selectedCampaign }) {
  const [historicalMetrics, setHistoricalMetrics] = useState({});
  const [campaignMetrics, setCampaignMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCampaign, setShowCampaign] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
    
    return () => {
      document.head.removeChild(fontLink);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setShowCampaign(false);
      
      try {
        const histData = await fetchMetrics(metricCards, '2024-01-01', '2024-12-31');
        const histObj = histData.reduce((acc, metric) => {
          acc[metric.type] = metric.currentValue;
          return acc;
        }, {});
        setHistoricalMetrics(histObj);
        
        if (selectedCampaign) {
          const campData = await fetchCampaignMetrics(selectedCampaign, startDate, endDate);
          setCampaignMetrics(campData);
          setTimeout(() => {
            setShowCampaign(true);
          }, 300);
        } else {
          setCampaignMetrics({});
        }
      } catch (error) {
        console.error("Erro ao buscar métricas", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [startDate, endDate, selectedCampaign]);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 992;

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
    comparison: {
      positive: '#10B981', // Verde do VeiculosHistoricos
      negative: '#EF4444'  // Vermelho do VeiculosHistoricos
    }
  };

  const styles = {
    card: {
      borderRadius: isMobile ? '12px' : '16px',
      border: `1px solid ${colors.border}`,
      background: colors.cardBg,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      overflow: 'hidden',
      position: 'relative',
      height: isMobile ? '180px' : '220px',
      fontFamily: 'Inter, sans-serif',
    },
    cardBody: {
      padding: isMobile ? '12px' : '24px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 2,
      height: '100%',
    },
    title: {
      fontSize: isMobile ? '0.9rem' : '1rem',
      color: colors.text.primary,
      fontWeight: '600',
      marginBottom: isMobile ? '8px' : '12px',
    },
    metricsContainer: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: isMobile ? 'flex-start' : 'center',
      gap: isMobile ? '4px' : '12px',
      flexWrap: 'wrap',
      flexGrow: 1,
    },
    historicalValue: {
      fontSize: isMobile ? '1.1rem' : '1.4rem',
      fontWeight: '700',
      color: colors.text.secondary,
    },
    campaignValue: {
      fontSize: isMobile ? '1rem' : '1.2rem',
      fontWeight: '600',
      color: '#224dda',
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '6px' : '8px',
      opacity: showCampaign ? 1 : 0,
      transition: 'opacity 0.5s ease-in-out',
    },
    comparison: {
      fontSize: isMobile ? '0.8rem' : '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontWeight: '600',
      padding: isMobile ? '2px 4px' : '4px 6px',
      borderRadius: '4px',
      marginTop: isMobile ? '4px' : '8px',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      flexGrow: 1,
    }
  };

  const formatValue = (value, format) => {
    if (value === undefined || value === null) return '—';
    switch (format) {
      case 'currency':
        return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'percentage':
        return `${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
      default:
        return value.toLocaleString('pt-BR');
    }
  };

  const calculatePercentageDiff = (campaignValue, historicalValue, metric) => {
    if (!campaignValue || !historicalValue || historicalValue === 0) return null;
    const percentChange = ((campaignValue - historicalValue) / historicalValue) * 100;
    const isUp = campaignValue > historicalValue;
    const isCostMetric = ['CPM', 'CPV', 'CPC'].includes(metric);
    const isPositive = isCostMetric ? !isUp : isUp;
    return { percent: percentChange, isPositive, isUp };
  };

  const getIcon = (type) => {
    const iconSize = isMobile ? 80 : 120;
    const iconContainerStyle = {
      position: 'absolute',
      top: '-20px',
      right: '-20px',
      opacity: 0.2,
      zIndex: 1,
    };
    switch (type) {
      case 'CPM':
        return (
          <div style={iconContainerStyle}>
            <img src="https://img.icons8.com/?size=100&id=aNNKpmr4wFqy&format=png&color=000000" alt="CPM" width={iconSize} height={iconSize} />
          </div>
        );
      case 'CPV':
        return (
          <div style={iconContainerStyle}>
            <img src="https://img.icons8.com/?size=100&id=cNMeoarsRjIB&format=png&color=000000" alt="CPV" width={iconSize} height={iconSize} />
          </div>
        );
      case 'CPC':
        return (
          <div style={iconContainerStyle}>
            <img src="https://img.icons8.com/?size=100&id=rt10HSNWQOvx&format=png&color=000000" alt="CPC" width={iconSize} height={iconSize} />
          </div>
        );
      case 'CTR':
        return (
          <div style={iconContainerStyle}>
            <img src="https://img.icons8.com/?size=100&id=WWgXYpYTltbk&format=png&color=000000" alt="CTR" width={iconSize} height={iconSize} />
          </div>
        );
      case 'VTR':
        return (
          <div style={iconContainerStyle}>
            <img src="https://img.icons8.com/?size=100&id=aLWI1DFiVtY2&format=png&color=000000" alt="VTR" width={iconSize} height={iconSize} />
          </div>
        );
      default:
        return null;
    }
  };

  const renderComparison = (comparison) => {
    if (!comparison || comparison.percent === null || comparison.percent === undefined) return null;
    const percentValue = Math.abs(comparison.percent).toFixed(1); // Ajustado para 1 casa decimal como no VeiculosHistoricos
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

  return (
    <Row xs={1} sm={2} md={3} lg={5} className="g-4">
      {metricCards.map((metric, idx) => {
        const historicalValue = historicalMetrics[metric.type];
        const campaignValue = campaignMetrics[metric.type];
        const comparison = calculatePercentageDiff(campaignValue, historicalValue, metric.type);

        return (
          <Col key={idx}>
            <Card style={styles.card} className="w-100">
              {getIcon(metric.type)}
              <Card.Body style={styles.cardBody}>
                <Card.Title style={styles.title}>{metric.title}</Card.Title>
                {loading ? (
                  <div style={styles.loadingContainer}>
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  <div className="flex-grow-1">
                    <div style={styles.metricsContainer}>
                      <div style={styles.historicalValue}>
                        Histórico: {formatValue(historicalValue, metric.format)}
                      </div>
                      <AnimatePresence>
                        {selectedCampaign && showCampaign && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <div style={styles.campaignValue}>
                              Campanha: {formatValue(campaignValue, metric.format)}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {selectedCampaign && showCampaign && comparison && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        {renderComparison(comparison)}
                      </motion.div>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}

export default CardsHistorico;