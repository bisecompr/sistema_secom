import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';
import { User, Home, LayoutDashboard, BarChart3, Clock, LogOut, BarChart2, Search, TrendingUp } from 'lucide-react';
import govLogo from '../assets/gov-logo.png';
import xLogo from '../assets/x-logo.png';
import googleLogo from '../assets/google-logo.png';
import trendingImage from '../assets/trending.png';
import instagramLogo from '../assets/instagram-logo.png';

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

 const menuItems = [
   { icon: <Home size={24} color="#666" />, label: "Menu" },
   { icon: <LayoutDashboard size={24} color="#666" />, label: "Campanhas Ativas" },
   { icon: <BarChart3 size={24} color="#666" />, label: "Dashboard Planilha" },
   { icon: <Clock size={24} color="#666" />, label: "Monitoramento" },
   { icon: <BarChart2 size={24} color="#666" />, label: "Power BI" },
   { icon: <TrendingUp size={24} color="#000" />, label: "Trending" },
 ];

 const trendingX = [
   { rank: 1, topic: "Trending 1", tweets: "252K" },
   { rank: 2, topic: "Trending 2", tweets: "41K" },
   { rank: 3, topic: "Trending 3", tweets: "38K" },
   { rank: 4, topic: "#TRENDING 1", tweets: "226K" },
   { rank: 5, topic: "Trending 4", tweets: "16K" },
   { rank: 6, topic: "Trending 5", tweets: "21K" },
   { rank: 7, topic: "Trending 6", tweets: "36K" },
   { rank: 8, topic: "Trending 7", tweets: "751K" },
   { rank: 9, topic: "Trending 8", tweets: "29K" },
   { rank: 10, topic: "#TRENDING 2", tweets: "21K" }
 ];

 const trendingGoogle = [
   { rank: 1, topic: "Pesquisado 1", searches: "5M+" },
   { rank: 2, topic: "Pesquisado 2", searches: "2.8M+" },
   { rank: 3, topic: "Pesquisado 3", searches: "1.5M+" },
   { rank: 4, topic: "Pesquisado 4", searches: "1.2M+" },
   { rank: 5, topic: "Pesquisado 5", searches: "980K+" },
   { rank: 6, topic: "Pesquisado 6", searches: "850K+" },
   { rank: 7, topic: "Pesquisado 7", searches: "720K+" },
   { rank: 8, topic: "Pesquisado 8", searches: "680K+" },
   { rank: 9, topic: "Pesquisado 9", searches: "580K+" },
   { rank: 10, topic: "Pesquisado 10", searches: "520K+" }
 ];

 const trendingInstagram = [
    { rank: 1, topic: "Instagram Trend 1", likes: "1.2M" },
    { rank: 2, topic: "#InstaViral", likes: "980K" },
    { rank: 3, topic: "Trend Reels", likes: "875K" },
    { rank: 4, topic: "#InstaChallenge", likes: "750K" },
    { rank: 5, topic: "Instagram Trend 2", likes: "680K" },
    { rank: 6, topic: "#InstaTrend", likes: "590K" },
    { rank: 7, topic: "Reels Trend", likes: "520K" },
    { rank: 8, topic: "#InstaFamous", likes: "470K" },
    { rank: 9, topic: "Instagram Trend 3", likes: "420K" },
    { rank: 10, topic: "#InstaMood", likes: "380K" }
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
          TRENDS
        </h1>
       </div>

       <Row className="g-4">
         {/* X Card */}
         <Col md={3}>
           <Card className="border-0 h-100 rounded-3">
             <Card.Body style={{ padding: '1rem' }}>
               <div className="d-flex align-items-center gap-2 mb-2">
                 <Image src={xLogo} alt="X Logo" style={{ width: '35px', height: '20px' }} />
                 <h3 className="mb-0" style={{ fontSize: '1.1rem', fontWeight: '500' }}>Trending Topics</h3>
               </div>
               {trendingX.map((trend, index) => (
                 <div 
                   key={index}
                   className="d-flex justify-content-between align-items-center py-2 border-bottom"
                   style={{ cursor: 'pointer' }}
                 >
                   <div className="d-flex gap-2">
                     <span className="text-secondary" style={{ fontSize: '0.9rem', fontWeight: '500' }}>{trend.rank}</span>
                     <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{trend.topic}</span>
                   </div>
                   <span className="text-secondary" style={{ fontSize: '0.8rem' }}>{trend.tweets}</span>
                 </div>
               ))}
               <div className="mt-2">
                 <Button 
                   variant="danger" 
                   className="w-100 py-2"
                   style={{ 
                     backgroundColor: '#ff4131', 
                     border: 'none',
                     fontSize: '0.9rem'
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
           <Card className="border-0 h-100 rounded-3">
             <Card.Body style={{ padding: '1rem' }}>
               <div className="d-flex align-items-center gap-2 mb-2">
               <Image src={googleLogo} alt="Google Logo" style={{ width: '20px', height: '20px' }} />
                 <h3 className="mb-0" style={{ fontSize: '1.1rem', fontWeight: '500' }}>Google Trends - Search</h3>
               </div>
               {trendingGoogle.map((trend, index) => (
                 <div 
                   key={index}
                   className="d-flex justify-content-between align-items-center py-2 border-bottom"
                   style={{ cursor: 'pointer' }}
                 >
                   <div className="d-flex gap-2">
                     <span className="text-secondary" style={{ fontSize: '0.9rem', fontWeight: '500' }}>{trend.rank}</span>
                     <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{trend.topic}</span>
                   </div>
                   <span className="text-secondary" style={{ fontSize: '0.8rem' }}>{trend.searches}</span>
                 </div>
               ))}
               <div className="mt-2">
                 <Button 
                   variant="danger" 
                   className="w-100 py-2"
                   style={{ 
                     backgroundColor: '#ff4131', 
                     border: 'none',
                     fontSize: '0.9rem'
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
            <Card className="border-0 h-100 rounded-3">
              <Card.Body style={{ padding: '1rem' }}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Image src={instagramLogo} alt="Instagram Logo" style={{ width: '20px', height: '20px' }} />
                  <h3 className="mb-0" style={{ fontSize: '1.1rem', fontWeight: '500' }}>Instagram Trends</h3>
                </div>
                {trendingInstagram.map((trend, index) => (
                  <div 
                    key={index}
                    className="d-flex justify-content-between align-items-center py-2 border-bottom"
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex gap-2">
                      <span className="text-secondary" style={{ fontSize: '0.9rem', fontWeight: '500' }}>{trend.rank}</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{trend.topic}</span>
                    </div>
                    <span className="text-secondary" style={{ fontSize: '0.8rem' }}>{trend.likes}</span>
                  </div>
                ))}
                <div className="mt-2">
                  <Button 
                    variant="danger" 
                    className="w-100 py-2"
                    style={{ 
                      backgroundColor: '#ff4131', 
                      border: 'none',
                      fontSize: '0.9rem'
                    }}
                  >
                    Ver mais no Instagram
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

         {/* Google Trends Donut Card */}
         <Col md={3}>
           <Card className="border-0 h-100 rounded-3">
             <Card.Body style={{ padding: '1rem' }}>
               <div className="d-flex align-items-center gap-2 mb-2">
                 <Image src={googleLogo} alt="Google Trends Logo" style={{ width: '20px', height: '20px' }} />
                 <h3 className="mb-0" style={{ fontSize: '1.1rem', fontWeight: '500' }}>Google Trends - Gráfico</h3>
               </div>
               <div 
                 id="google-trends-donut-container" 
                 style={{ 
                   width: '100%',
                   height: '400px',
                   overflow: 'hidden'
                 }}
               />
             </Card.Body>
           </Card>
         </Col>

         {/* Google Trends Queries Card */}
         <Col md={3}>
           <Card className="border-0 h-100 rounded-3">
             <Card.Body style={{ padding: '1rem' }}>
               <div className="d-flex align-items-center gap-2 mb-2">
                 <Image src={googleLogo} alt="Google Trends Logo" style={{ width: '20px', height: '20px' }} />
                 <h3 className="mb-0" style={{ fontSize: '1.1rem', fontWeight: '500' }}>Google Trends - Queries</h3>
               </div>
               <div 
                 id="google-trends-queries-container" 
                 style={{ 
                   width: '100%',
                   height: '400px',
                   overflow: 'hidden'
                 }}
               />
             </Card.Body>
           </Card>
         </Col>

         {/* Google Trends Related Queries Card */}
         <Col md={3}>
           <Card className="border-0 h-100 rounded-3">
             <Card.Body style={{ padding: '1rem' }}>
               <div className="d-flex align-items-center gap-2 mb-2">
                 <Image src={googleLogo} alt="Google Trends Logo" style={{ width: '20px', height: '20px' }} />
                 <h3 className="mb-0" style={{ fontSize: '1.1rem', fontWeight: '500' }}>Google Trends - Related Queries</h3>
               </div>
               <div 
                 id="google-trends-new-related-queries-container" 
                 style={{ 
                   width: '100%',
                   height: '400px',
                   overflow: 'hidden'
                 }}
               />
             </Card.Body>
           </Card>
         </Col>
       </Row>
     </Container>
   </div>
 );
}

export default TrendingTopics;