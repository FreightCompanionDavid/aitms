import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

const VisualizerContainer = styled.div`
  margin-top: 20px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const InsightText = styled.p`
  font-size: 16px;
  margin-bottom: 16px;
`;

interface InsightData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
  }[];
}

interface InsightVisualizerProps {
  pageContent: string;
}

const InsightVisualizer: React.FC<InsightVisualizerProps> = ({ pageContent }) => {
  const [insight, setInsight] = useState<string>('');
  const [chartData, setChartData] = useState<InsightData | null>(null);

  useEffect(() => {
    analyzePageContent(pageContent);
  }, [pageContent]);

  const analyzePageContent = async (content: string) => {
    try {
      const response = await fetch('/api/analyze-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze content');
      }

      const analysisResult = await response.json();
      const { insight, chartData } = analysisResult;

      setInsight(insight);
      setChartData(chartData);
    } catch (error) {
      console.error('Error analyzing content:', error);
      setInsight('An error occurred while analyzing the content. Please try again.');
      setChartData(null);
    }
    const words = content.split(/\s+/);
    const wordCount = words.length;
    const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;

    setInsight(`This page contains ${wordCount} words, with ${uniqueWords} unique words.`);

    // Generate some dummy data for the chart
    const dummyData: InsightData = {
      labels: ['Total Words', 'Unique Words'],
      datasets: [{
        label: 'Word Count',
        data: [wordCount, uniqueWords],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
      }]
    };

    setChartData(dummyData);
  };

  return (
    <VisualizerContainer>
      <InsightText>{insight}</InsightText>
      {chartData && (
        <Chart type="bar" data={chartData} options={{ responsive: true }} />
      )}
    </VisualizerContainer>
  );
};

export default InsightVisualizer;
