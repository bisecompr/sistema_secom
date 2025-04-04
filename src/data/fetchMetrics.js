// src/utils/api.js
import { format, subDays, differenceInDays, parseISO } from 'date-fns';
import campaigns from '../data/campaigns';
import ApiBase from '../services/ApiBase';

const calculateSums = (data) => {
  const sums = data.reduce(
    (acc, item) => {
      acc.investment += item.spend || 0;
      acc.impressions += item.impressions || 0;
      acc.views += item['video_view_25%'] || 0;
      acc.clicks += item.clicks || 0;
      acc.engagement += item.engagement || 0;
      return acc;
    },
    { investment: 0, impressions: 0, views: 0, clicks: 0, engagement: 0 }
  );
  
  // Calculate KPIs based on accumulated data
  // CPM = (Investment / Impressions) * 1000
  sums.CPM = sums.impressions > 0 ? (sums.investment / sums.impressions) * 1000 : 0;
  
  // CPV = Investment / Views
  sums.CPV = sums.views > 0 ? sums.investment / sums.views : 0;
  
  // CPC = Investment / Clicks
  sums.CPC = sums.clicks > 0 ? sums.investment / sums.clicks : 0;
  
  // CTR = (Clicks / Impressions) * 100
  sums.CTR = sums.impressions > 0 ? (sums.clicks / sums.impressions) * 100 : 0;
  
  // VTR = (Views / Impressions) * 100
  sums.VTR = sums.impressions > 0 ? (sums.views / sums.impressions) * 100 : 0;
  
  return sums;
};

export const fetchMetrics = async (metricCards, startDate = null, endDate = null, selectedCampaign = null) => {
  try {
    // Define as datas formatadas corretamente
    const end = endDate ? endDate : format(new Date(), 'yyyy-MM-dd');
    const start = startDate ? startDate : format(subDays(new Date(), 7), 'yyyy-MM-dd');

    // Calcula o período em dias
    const periodDays = differenceInDays(new Date(end), new Date(start));

    // Construção da URL para a requisição atual
    const url = selectedCampaign 
      ? `https://api-nest-alpha.vercel.app/plataforma_dia/campaigns?campaignName=${encodeURIComponent(selectedCampaign)}&startDate=${start}&endDate=${end}`
      : `https://api-nest-alpha.vercel.app/plataforma_dia/campaigns?startDate=${start}&endDate=${end}`;

    const responseCurrent = await fetch(url);
    if (!responseCurrent.ok) throw new Error(`Erro na requisição atual: ${responseCurrent.statusText}`);
    const dataCurrent = await responseCurrent.json();
    const sumsCurrent = calculateSums(dataCurrent);

    // Definição correta do período anterior
    const endDatePrevious = format(subDays(parseISO(start), 1), 'yyyy-MM-dd');
    const startDatePrevious = format(subDays(parseISO(endDatePrevious), periodDays), 'yyyy-MM-dd');

    // Construção da URL para a requisição do período anterior
    const url_previous = selectedCampaign 
      ? `https://api-nest-alpha.vercel.app/plataforma_dia/campaigns?campaignName=${encodeURIComponent(selectedCampaign)}&startDate=${startDatePrevious}&endDate=${endDatePrevious}`
      : `https://api-nest-alpha.vercel.app/plataforma_dia/campaigns?startDate=${startDatePrevious}&endDate=${endDatePrevious}`;

    const responsePrevious = await fetch(url_previous);
    if (!responsePrevious.ok) throw new Error(`Erro na requisição anterior: ${responsePrevious.statusText}`);
    const dataPrevious = await responsePrevious.json();
    const sumsPrevious = calculateSums(dataPrevious);

    // Mapeia os dados para os cards
    const updatedMetrics = metricCards.map((card) => ({
      ...card,
      currentValue: sumsCurrent[card.type] || 0,
      previousValue: sumsPrevious[card.type] || 0,
    }));

    return updatedMetrics;
  } catch (error) {
    console.error('Erro ao buscar métricas:', error.message);
    return [];
  }
};

export const fetchCampaigns = async (startDate = null, endDate = null) => {
  try {
    const end = endDate ? endDate : format(new Date(), 'yyyy-MM-dd');
    const start = startDate ? startDate : format(subDays(new Date(), 7), 'yyyy-MM-dd');

    const response = await fetch(
      `https://api-nest-alpha.vercel.app/plataforma_dia/campaigns?startDate=${start}&endDate=${end}`
    );
    
    if (!response.ok) throw new Error(`Erro na requisição: ${response.statusText}`);
    
    const data = await response.json();
    
    // Filtrando campanhas com pelo menos uma impressão ou investimento
    const validCampaigns = data.filter(c => (c.impressions > 1 || c.spend > 1));
    
    // Populando o array de campanhas
    campaigns.length = 0;
    campaigns.push(...validCampaigns);
    
    return validCampaigns;
  } catch (error) {
    console.error('Erro ao buscar campanhas:', error.message);
    throw error; // Relançando o erro para ser tratado no componente
  }
};

export const fetchCampaignMetrics = async (campaignName, startDate, endDate) => {
    try {
      const url = `https://api-nest-alpha.vercel.app/plataforma_dia/campaigns?campaignName=${encodeURIComponent(campaignName)}&startDate=${startDate}&endDate=${endDate}`;
      const response = await fetch(url);
  
      if (!response.ok) throw new Error(`Erro na requisição: ${response.statusText}`);
  
      const data = await response.json();
      const validCampaigns = data.filter(c => (c.impressions > 1 || c.spend > 1));
      
      const sumsCurrent = calculateSums(validCampaigns);

      // Return all calculated metrics for campaign
      return {
        investment: sumsCurrent.investment || 0,
        impressions: sumsCurrent.impressions || 0,
        views: sumsCurrent.views || 0,
        clicks: sumsCurrent.clicks || 0,
        engagement: sumsCurrent.engagement || 0,
        CPM: sumsCurrent.CPM || 0,
        CPV: sumsCurrent.CPV || 0,
        CPC: sumsCurrent.CPC || 0,
        CTR: sumsCurrent.CTR || 0,
        VTR: sumsCurrent.VTR || 0
      };
    } catch (error) {
      console.error("Erro ao buscar métricas da campanha:", error.message);
      return {};
    }
  };

export const fetchPlatformMetrics = async (startDate = null, endDate = null, selectedCampaign = null) => {
    try {
      const end = endDate ? endDate : format(new Date(), 'yyyy-MM-dd');
      const start = startDate ? startDate : format(subDays(new Date(), 7), 'yyyy-MM-dd');
  
      // Construção da URL com ou sem o parâmetro de campanha
      const url = selectedCampaign
        ? `https://api-nest-alpha.vercel.app/plataforma_dia/platform?campaignName=${encodeURIComponent(selectedCampaign)}&startDate=${start}&endDate=${end}`
        : `https://api-nest-alpha.vercel.app/plataforma_dia/platform?startDate=${start}&endDate=${end}`;
  
      const response = await fetch(url);
  
      if (!response.ok) throw new Error(`Erro na requisição: ${response.statusText}`);
  
      const data = await response.json();
  
      return data;
    } catch (error) {
      console.error('Erro ao buscar métricas da plataforma:', error.message);
      return null;
    }
  };

export const fetchPlatformEngagement = async (startDate = null, endDate = null, selectedCampaign = null) => {
    try {
      const end = endDate ? endDate : format(new Date(), 'yyyy-MM-dd');
      const start = startDate ? startDate : format(subDays(new Date(), 7), 'yyyy-MM-dd');
  
      // Construção da URL com ou sem o parâmetro de campanha
      const url = selectedCampaign
        ? `https://api-nest-alpha.vercel.app/plataforma_dia/platform/meta/engagement?campaignName=${encodeURIComponent(selectedCampaign)}&startDate=${start}&endDate=${end}`
        : `https://api-nest-alpha.vercel.app/plataforma_dia/platform/meta/engagement?startDate=${start}&endDate=${end}`;
  
      const response = await fetch(url);
  
      if (!response.ok) throw new Error(`Erro na requisição: ${response.statusText}`);
  
      const data = await response.json();
  
      return data;
    } catch (error) {
      console.error('Erro ao buscar métricas da plataforma:', error.message);
      return null;
    }
  };

export const fetchHistoricMetrics = async () => {
  try {
    const response = await ApiBase.get('/platformDay/historic');
    console.log("Resposta bruta do endpoint /platformDay/historic:", response);

    const data = response.data;
    console.log("Dados (data) retornados:", data);

    // Se data for um objeto simples (ex.: { cpm: 123, cpv: 456, ... })
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const arrayConvertido = Object.keys(data).map(key => ({
        type: key.toUpperCase(),  // ou sem toUpperCase se já vier em maiúsculo
        value: data[key]
      }));
      console.log("Array convertido:", arrayConvertido);
      return arrayConvertido;
    }

    // Se já for um array, checamos se cada item tem .type e .value
    if (Array.isArray(data)) {
      console.log("Data é um array, itens:", data);
      // Exemplo de map para garantir que cada item tenha .type/.value
      return data.map(item => {
        console.log("Item do array:", item);
        return {
          type: item.type?.toUpperCase?.() || 'UNKNOWN',
          value: item.value ?? 0
        };
      });
    }

    // Se chegar aqui, significa que não é array nem objeto
    return [];
  } catch (error) {
    console.error("Erro ao buscar métricas históricas:", error);
    return [];
  }
};

export const fetchMetricsCampaign = async (campaignId, startDate, endDate) => {
  const response = await ApiBase.get('/platformDay/campaign', {
    params: { campaignId, startDate, endDate }
  });
  return response.data;
};