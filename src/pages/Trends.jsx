import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';
import xLogo from '../assets/x-logo.png';
import googleLogo from '../assets/google-logo.png';
import instagramLogo from '../assets/instagram-logo.png';
import tiktokLogo from '../assets/tiktok-logo.png';

function TrendingTopics() {

 useEffect(() => {
  // Criar iframe para o gráfico donut
  const iframeDonut = document.createElement('iframe');
  iframeDonut.style.width = '100%';
  iframeDonut.style.height = '400px';
  iframeDonut.style.border = 'none';

  // Criar iframe para consultas relacionadas
  const iframeQueries = document.createElement('iframe');
  iframeQueries.style.width = '100%';
  iframeQueries.style.height = '400px';
  iframeQueries.style.border = 'none';

  // Criar iframe para o novo related queries
  const iframeNewRelatedQueries = document.createElement('iframe');
  iframeNewRelatedQueries.style.width = '100%';
  iframeNewRelatedQueries.style.height = '400px';
  iframeNewRelatedQueries.style.border = 'none';

  // Referências para os containers
  const containerDonut = document.getElementById('google-trends-donut-container');
  const containerQueries = document.getElementById('google-trends-queries-container');
  const containerNewRelatedQueries = document.getElementById('google-trends-new-related-queries-container');

  // Widget para o gráfico donut
  if (containerDonut) {
    containerDonut.appendChild(iframeDonut);
    const iframeDonutDoc = iframeDonut.contentDocument || iframeDonut.contentWindow.document;
    iframeDonutDoc.open();
    iframeDonutDoc.write(`
      <script type="text/javascript" src="https://ssl.gstatic.com/trends_nrtr/3975_RC01/embed_loader.js"></script>
      <script type="text/javascript">
        trends.embed.renderWidget(
          "BR_cu_oh8DNIcBAAAmqM_en", 
          "fe_donut_chart_a08ec8f7-f60f-4371-b32a-c989353fdc7d", 
          {"guestPath":"https://trends.google.com.br:443/trends/embed/"}
        );
      </script>
      <style>
        body { margin: 0; padding: 0; }
      </style>
    `);
    iframeDonutDoc.close();
  }

  // Widget para consultas relacionadas
  if (containerQueries) {
    containerQueries.appendChild(iframeQueries);
    const iframeQueriesDoc = iframeQueries.contentDocument || iframeQueries.contentWindow.document;
    iframeQueriesDoc.open();
    iframeQueriesDoc.write(`
      <script type="text/javascript" src="https://ssl.gstatic.com/trends_nrtr/3975_RC01/embed_loader.js"></script>
      <script type="text/javascript">
        trends.embed.renderWidget(
          "BR_cu_oh8DNIcBAAAmqM_en", 
          "fe_related_queries_1cf5e585-773f-4b77-a48b-aca73d95f1b0", 
          {"guestPath":"https://trends.google.com.br:443/trends/embed/"}
        );
      </script>
      <style>
        body { margin: 0; padding: 0; }
      </style>
    `);
    iframeQueriesDoc.close();
  }

  // Widget para o novo related queries
  if (containerNewRelatedQueries) {
    containerNewRelatedQueries.appendChild(iframeNewRelatedQueries);
    const iframeNewRelatedQueriesDoc = iframeNewRelatedQueries.contentDocument || iframeNewRelatedQueries.contentWindow.document;
    iframeNewRelatedQueriesDoc.open();
    iframeNewRelatedQueriesDoc.write(`
      <script type="text/javascript" src="https://ssl.gstatic.com/trends_nrtr/3975_RC01/embed_loader.js"></script>
      <script type="text/javascript">
        trends.embed.renderWidget(
          "BR_cu_oh8DNIcBAAAmqM_en", 
          "fe_related_queries_07e81ff0-870e-4c6b-a4d4-ca5a1172f8af", 
          {"guestPath":"https://trends.google.com.br:443/trends/embed/"}
        );
      </script>
      <style>
        body { margin: 0; padding: 0; }
      </style>
    `);
    iframeNewRelatedQueriesDoc.close();
  }

  // Limpar os iframes ao desmontar o componente
  return () => {
    if (containerDonut && iframeDonut) {
      containerDonut.removeChild(iframeDonut);
    }
    if (containerQueries && iframeQueries) {
      containerQueries.removeChild(iframeQueries);
    }
    if (containerNewRelatedQueries && iframeNewRelatedQueries) {
      containerNewRelatedQueries.removeChild(iframeNewRelatedQueries);
    }
  };
}, []);
 
 const trendingX = [
   { rank: 1, topic: "Neymar", tweets: "252K" },
   { rank: 2, topic: "Cristiano Ronaldo", tweets: "41K" },
   { rank: 3, topic: "#ReverseWithMeEP1", tweets: "38K" },
   { rank: 4, topic: "Banco Inter", tweets: "226K" },
   { rank: 5, topic: "Jonathan Bailey", tweets: "16K" }
 ];

 const trendingGoogle = [
   { rank: 1, topic: "atlético-mg x athletic", searches: "5M+" },
   { rank: 2, topic: "sport recife x fortaleza", searches: "2.8M+" },
   { rank: 3, topic: "atlético madrid x getafe", searches: "1.5M+" },
   { rank: 4, topic: "sintonia 5 temporada", searches: "1.2M+" },
   { rank: 5, topic: "aniversário do neymar", searches: "980K+" }
 ];

 const trendingInstagram = [
    { rank: 1, topic: "#brasil", likes: "1.2M" },
    { rank: 2, topic: "#brazil", likes: "980K" },
    { rank: 3, topic: "#love", likes: "875K" },
    { rank: 4, topic: "#instagood", likes: "750K" },
    { rank: 5, topic: "#riodejaneiro", likes: "680K" }
  ];

 return (
  <div className="d-flex" style={{ fontFamily: 'Rawline' }}>
     {/* Main Content */}
     <Container fluid className="py-4 px-5 bg-light">
       <div className="d-flex justify-content-between align-items-center mb-5">
       <h1 style={{ 
          fontSize: '2rem', 
          fontFamily: 'Rawline',
          fontWeight: '600',  // Semibold
          textAlign: 'center',
          width: '100%'
        }}>
          ASSUNTOS DO MOMENTO
        </h1>
       </div>

       <Row className="g-4">
         
                    
                  {/* Google Trends Donut Card */}
          <Col md={3}>
            <Card className="h-100 rounded-4 shadow-sm border-1" style={{ borderColor: '#e0e0e0' }}>
              <Card.Body style={{ padding: '1.25rem' }}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <Image src={googleLogo} alt="Google Trends Logo" style={{ width: '24px', height: '24px' }} />
                  <h3 className="mb-0" style={{ fontSize: '1.2rem', fontWeight: '600' }}>Google Trends - Gráfico</h3>
                </div>
                <div 
                  id="google-trends-donut-container" 
                  style={{ 
                    width: '100%',
                    height: '400px',
                    overflow: 'hidden',
                    borderRadius: '8px'
                  }}
                />
                <div className="mt-3">
                <Button 
                  variant="primary" 
                  className="w-100 py-2 rounded-3"
                  style={{ 
                    backgroundColor: '#3C3C3C', 
                    border: 'none',
                    fontSize: '0.95rem',
                    fontWeight: '500'
                  }}
                  href="https://trends.google.com.br/trends/story/BR_cu_oh8DNIcBAAAmqM_en"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Ver mais detalhes
                </Button>

                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Google Trends Queries Card */}
          <Col md={3}>
            <Card className="h-100 rounded-4 shadow-sm border-1" style={{ borderColor: '#e0e0e0' }}>
              <Card.Body style={{ padding: '1.25rem' }}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <Image src={googleLogo} alt="Google Trends Logo" style={{ width: '24px', height: '24px' }} />
                  <h3 className="mb-0" style={{ fontSize: '1.2rem', fontWeight: '600' }}>Google Trends - Queries</h3>
                </div>
                <div 
                  id="google-trends-queries-container" 
                  style={{ 
                    width: '100%',
                    height: '400px',
                    overflow: 'hidden',
                    borderRadius: '8px'
                  }}
                />
                <div className="mt-3">
                  <Button 
                    variant="primary" 
                    className="w-100 py-2 rounded-3"
                    style={{ 
                      backgroundColor: '#3C3C3C', 
                      border: 'none',
                      fontSize: '0.95rem',
                      fontWeight: '500'
                    }}
                  >
                    Ver mais detalhes
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Google Trends Related Queries Card */}
          <Col md={3}>
            <Card className="h-100 rounded-4 shadow-sm border-1" style={{ borderColor: '#e0e0e0' }}>
              <Card.Body style={{ padding: '1.25rem' }}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <Image src={googleLogo} alt="Google Trends Logo" style={{ width: '24px', height: '24px' }} />
                  <h3 className="mb-0" style={{ fontSize: '1.2rem', fontWeight: '600' }}>Google Trends - Related Queries</h3>
                </div>
                <div 
                  id="google-trends-new-related-queries-container" 
                  style={{ 
                    width: '100%',
                    height: '380px',
                    overflow: 'hidden',
                    borderRadius: '8px'
                  }}
                />
                <div className="mt-3">
                  <Button 
                    variant="primary" 
                    className="w-100 py-2 rounded-3"
                    style={{ 
                      backgroundColor: '#3C3C3C', 
                      border: 'none',
                      fontSize: '0.95rem',
                      fontWeight: '500'
                    }}
                  >
                    Ver mais detalhes
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          {/* TikTok Embed Card */}
          <Col 
                      md={3} 
                      style={{ 
                        position: 'relative', 
                        zIndex: 1,
                        '@media (max-width: 767px)': {
                          position: 'static',
                          zIndex: 'auto'
                        }
                      }}
                    >
                      <Card 
                        className="shadow-sm border-1" 
                        style={{ 
                          position: 'absolute', 
                          top: 0, 
                          left: 0, 
                          zIndex: 10, 
                          width: '100%',
                          borderColor: '#e0e0e0',
                          '@media (max-width: 767px)': {
                            position: 'static',
                            height: 'auto'
                          }
                        }}
                      >
                        <Card.Body style={{ padding: '1.25rem' }}>
                          <div className="d-flex align-items-center gap-2 mb-3">
                            <Image src={tiktokLogo} alt="TikTok Logo" style={{ width: '24px', height: '24px' }} />
                            <h3 className="mb-0" style={{ fontSize: '1.2rem', fontWeight: '600' }}>TikTok Trending</h3>
                          </div>
                          
                          {/* Desktop Version - Large */}
                          <div 
                            className="d-none d-md-block" 
                            style={{ 
                              width: '100%', 
                              height: '808px', 
                              overflow: 'hidden',
                              borderRadius: '8px'
                            }}
                          >
                            <iframe 
                              src="https://ads.tiktok.com/business/creativecenter/inspiration/popular/hashtag/pc/pt" 
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                border: 'none',
                                borderRadius: '8px'
                              }} 
                              title="TikTok Trending Desktop" 
                            />
                          </div>

                          {/* Mobile Version - Small */}
                          <div 
                            className="d-md-none" 
                            style={{ 
                              width: '100%', 
                              height: '400px', 
                              overflow: 'hidden',
                              borderRadius: '8px'
                            }}
                          >
                            <iframe 
                              src="https://ads.tiktok.com/business/creativecenter/inspiration/popular/hashtag/pc/pt" 
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                border: 'none',
                                borderRadius: '8px'
                              }} 
                              title="TikTok Trending Mobile" 
                            />
                          </div>

                          <div className="mt-3">
                            <Button 
                              variant="dark" 
                              className="w-100 py-2 rounded-3"
                              style={{ 
                                backgroundColor: '#3C3C3C', 
                                border: 'none',
                                fontSize: '0.95rem',
                                fontWeight: '500'
                              }}
                            >
                              Ver mais no TikTok
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
          {/* X Card */}
          <Col md={3}>
            <Card className="h-100 rounded-4 shadow-sm border-1" style={{ borderColor: '#e0e0e0' }}>
              <Card.Body style={{ padding: '1.25rem' }}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <Image src={xLogo} alt="X Logo" style={{ width: '35px', height: '20px' }} />
                  <h3 className="mb-0" style={{ fontSize: '1.2rem', fontWeight: '600' }}>Trending Topics</h3>
                </div>
                {trendingX.map((trend, index) => (
                  <div 
                    key={index}
                    className="d-flex justify-content-between align-items-center py-2 mb-2 hover-bg-light rounded"
                    style={{ 
                      cursor: 'pointer',
                      borderBottom: '1px solid #f0f0f0',
                      transition: 'all 0.2s ease',
                      padding: '0.5rem'
                    }}
                  >
                    <div className="d-flex gap-3">
                      <span className="text-secondary fw-medium">{trend.rank}</span>
                      <span className="fw-medium">{trend.topic}</span>
                    </div>
                    <span className="text-secondary" style={{ fontSize: '0.9rem' }}>{trend.tweets}</span>
                  </div>
                ))}
                <div className="mt-3">
                  <Button 
                    variant="dark" 
                    className="w-100 py-2 rounded-3"
                    style={{ 
                      backgroundColor: '#3C3C3C', 
                      border: 'none',
                      fontSize: '0.95rem',
                      fontWeight: '500'
                    }}
                  >
                    Ver mais no X
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Google Card */}
          <Col md={3}>
            <Card className="h-100 rounded-4 shadow-sm border-1" style={{ borderColor: '#e0e0e0' }}>
              <Card.Body style={{ padding: '1.25rem' }}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <Image src={googleLogo} alt="Google Logo" style={{ width: '24px', height: '24px' }} />
                  <h3 className="mb-0" style={{ fontSize: '1.2rem', fontWeight: '600' }}>Google Trends - Search</h3>
                </div>
                {trendingGoogle.map((trend, index) => (
                  <div 
                    key={index}
                    className="d-flex justify-content-between align-items-center py-2 mb-2 hover-bg-light rounded"
                    style={{ 
                      cursor: 'pointer',
                      borderBottom: '1px solid #f0f0f0',
                      transition: 'all 0.2s ease',
                      padding: '0.5rem'
                    }}
                  >
                    <div className="d-flex gap-3">
                      <span className="text-secondary fw-medium">{trend.rank}</span>
                      <span className="fw-medium">{trend.topic}</span>
                    </div>
                    <span className="text-secondary" style={{ fontSize: '0.9rem' }}>{trend.searches}</span>
                  </div>
                ))}
                <div className="mt-3">
                  <Button 
                    variant="primary" 
                    className="w-100 py-2 rounded-3"
                    style={{ 
                      backgroundColor: '#3C3C3C', 
                      border: 'none',
                      fontSize: '0.95rem',
                      fontWeight: '500'
                    }}
                  >
                    Ver mais no Google
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Instagram Card */}
          <Col md={3}>
            <Card className="h-100 rounded-4 shadow-sm border-1" style={{ borderColor: '#e0e0e0' }}>
              <Card.Body style={{ padding: '1.25rem' }}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <Image src={instagramLogo} alt="Instagram Logo" style={{ width: '24px', height: '24px' }} />
                  <h3 className="mb-0" style={{ fontSize: '1.2rem', fontWeight: '600' }}>Instagram Trends</h3>
                </div>
                {trendingInstagram.map((trend, index) => (
                  <div 
                    key={index}
                    className="d-flex justify-content-between align-items-center py-2 mb-2 hover-bg-light rounded"
                    style={{ 
                      cursor: 'pointer',
                      borderBottom: '1px solid #f0f0f0',
                      transition: 'all 0.2s ease',
                      padding: '0.5rem'
                    }}
                  >
                    <div className="d-flex gap-3">
                      <span className="text-secondary fw-medium">{trend.rank}</span>
                      <span className="fw-medium">{trend.topic}</span>
                    </div>
                    <span className="text-secondary" style={{ fontSize: '0.9rem' }}>{trend.likes}</span>
                  </div>
                ))}
                <div className="mt-3">
                  <Button 
                    variant="danger" 
                    className="w-100 py-2 rounded-3"
                    style={{ 
                      backgroundColor: '#3C3C3C', 
                      border: 'none',
                      fontSize: '0.95rem',
                      fontWeight: '500'
                    }}
                  >
                    Ver mais no Instagram
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
       </Row>
     </Container>
   </div>
 );
}

export default TrendingTopics;