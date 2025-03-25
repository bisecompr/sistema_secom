import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Badge from 'react-bootstrap/Badge';
import { fetchMetrics } from '../data/fetchMetrics';
import metricCards from '../data/metricsCard';

function Cards({ startDate, endDate, selectedCampaign }) {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await fetchMetrics(metricCards, startDate, endDate, selectedCampaign);
      setMetrics(data);
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, [startDate, endDate, selectedCampaign]);

  const getPercentageDiff = (current, previous) => {
    if (!previous || previous === 0) {
      return current > 0 ? '100.00' : '0.00';
    }
    return (((current - previous) / previous) * 100).toFixed(2);
  };

  // Paleta de cores para diferentes tipos de cards
  const cardColors = {
    investment: { bg: '#ffffff', border: '#E2E8F0', gradient: 'linear-gradient(135deg, #ffffff 0%, #f7f7f7 100%)' },
    clicks: { bg: '#ffffff', border: '#E2E8F0', gradient: 'linear-gradient(135deg, #ffffff 0%, #f7f7f7 100%)' },
    engagement: { bg: '#ffffff', border: '#E2E8F0', gradient: 'linear-gradient(135deg, #ffffff 0%, #f7f7f7 100%)' },
    views: { bg: '#ffffff', border: '#E2E8F0', gradient: 'linear-gradient(135deg, #ffffff 0%, #f7f7f7 100%)' },
    impressions: { bg: '#ffffff', border: '#E2E8F0', gradient: 'linear-gradient(135deg, #ffffff 0%, #f7f7f7 100%)' }
  };

  // Mantendo a função getIcon original
  const getIcon = (type) => {
    const iconSize = 120;
    const iconContainerStyle = {
      position: 'absolute',
      top: '-20px',
      right: '-20px',
      opacity: 0.1,
      zIndex: 1,
    };
  
    switch (type) {
      case 'investment':
        return (
          <div style={iconContainerStyle}>
            <img 
              src="https://img.icons8.com/?size=100&id=isKLtsMbtVgn&format=png&color=000000" 
              alt="investment" 
              width={iconSize} 
              height={iconSize} 
            />
          </div>
        );
      case 'clicks':
        return (
          <div style={iconContainerStyle}>
            <img 
              src="https://img.icons8.com/?size=100&id=11202&format=png&color=000000" 
              alt="clicks" 
              width={iconSize} 
              height={iconSize} 
            />
          </div>
        );
      case 'views':
        return (
          <div style={iconContainerStyle}>
            <img 
              src="https://img.icons8.com/?size=100&id=60022&format=png&color=000000" 
              alt="views" 
              width={iconSize} 
              height={iconSize} 
            />
          </div>
        );
      case 'engagement':
        return (
          <div style={iconContainerStyle}>
            <img 
              src="https://img.icons8.com/?size=100&id=qtmxiFzhBiJq&format=png&color=000000" 
              alt="engagement" 
              width={iconSize} 
              height={iconSize} 
            />
          </div>
        );
      case 'impressions':
        return (
          <div style={iconContainerStyle}>
            <img 
              src="https://img.icons8.com/?size=100&id=d9LlgLF7QeYY&format=png&color=000000" 
              alt="impressions" 
              width={iconSize} 
              height={iconSize} 
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }}>
      {metricCards.map((metric, idx) => {
        const matchedMetric = metrics.find(m => m.type === metric.type);
        const currentValue = matchedMetric ? matchedMetric.currentValue : null;
        const previousValue = matchedMetric ? matchedMetric.previousValue : null;
        let percentageDiff = currentValue !== null ? getPercentageDiff(currentValue, previousValue) : null;

        const isPositive = percentageDiff > 0;
        const isZero = percentageDiff === '0.00' || percentageDiff === null;
        
        // Obter cores específicas para este tipo de card
        const colors = cardColors[metric.type] || { 
          bg: '#F8FAFC', 
          border: '#CBD5E1',
          gradient: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)'
        };

        return (
          <Col key={idx} className="d-flex">
            <Card 
              style={{ 
                minHeight: '220px', 
                position: 'relative', 
                borderRadius: '16px', 
                border: `1px solid ${colors.border}`,
                background: colors.gradient,
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                overflow: 'hidden'
              }}
              className="w-100 h-100"
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
              }}
            >
              {getIcon(metric.type)}
              <Card.Body className="d-flex flex-column p-4" style={{ zIndex: 2, position: 'relative' }}>
                <Card.Title 
                  style={{ 
                    fontSize: '16px', 
                    color: '#1E293B',
                    fontWeight: '600',
                    letterSpacing: '0.025em',
                    marginBottom: '20px'
                  }}
                >
                  {metric.title}
                </Card.Title>
                <div className="flex-grow-1 d-flex align-items-center">
                  {loading ? (
                    <div className="d-flex justify-content-center w-100">
                      <Spinner 
                        animation="border" 
                        style={{ 
                          color: colors.border,
                          width: '2.5rem',
                          height: '2.5rem'
                        }} 
                      />
                    </div>
                  ) : (
                    <div className="d-flex flex-column">
                      <div 
                        style={{ 
                          fontSize: '1.7rem', 
                          fontWeight: '700',
                          color: '#1E293B',
                          lineHeight: '1.2'
                        }}
                      >
                        {currentValue !== null && currentValue !== undefined
                          ? metric.type === 'investment'
                            ? `R$ ${currentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            : Math.round(currentValue).toLocaleString('pt-BR')
                          : '—'}
                      </div>
                    </div>
                  )}
                </div>
              </Card.Body>
              <Card.Footer 
                style={{ 
                  backgroundColor: 'transparent', 
                  borderTop: `1px solid ${colors.border}20`,
                  padding: '12px 16px'
                }}
              >
                <div className="d-flex align-items-center">
                  {loading ? (
                    <Spinner animation="border" variant="secondary" size="sm" />
                  ) : (
                    <>
                      {!isZero && (
                        <Badge 
                          pill 
                          bg={isPositive ? 'success' : 'danger'} 
                          style={{ 
                            opacity: 0.9, 
                            padding: '0.4rem 0.75rem',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}
                        >
                          {isPositive ? '↑' : '↓'} {Math.abs(percentageDiff)}%
                        </Badge>
                      )}
                      <span 
                        style={{ 
                          fontSize: '13px', 
                          color: '#64748B',
                          marginLeft: isZero ? '0' : '10px',
                          fontWeight: '500'
                        }}
                      >
                        {isZero ? 'Sem alteração' : 'em relação ao período anterior'}
                      </span>
                    </>
                  )}
                </div>
              </Card.Footer>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}

export default Cards;