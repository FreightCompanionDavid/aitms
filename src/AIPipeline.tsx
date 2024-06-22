import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { processData, updateAIModel } from '../actions/aiActions';
import { RootState } from '../store/rootReducer';
import styled from 'styled-components';
import { DataPoint, AIModelType } from '../types';
import { socket } from '../services/socketService';
import { UserActivityTracker } from '../utils/UserActivityTracker';
import { APIDocManager } from '../utils/APIDocManager';

const PipelineContainer = styled.div`
  background-color: #f0f8ff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #333;
  font-size: 24px;
  margin-bottom: 16px;
`;

const InfoText = styled.p`
  color: #666;
  font-size: 16px;
  margin-bottom: 8px;
`;

const ModelInfo = styled.div`
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  padding: 12px;
  margin-top: 16px;
`;

const AIPipeline: React.FC = () => {
  const dispatch = useDispatch();
  const [pipelineData, setPipelineData] = useState<DataPoint[]>([]);
  const aiModel = useSelector((state: RootState) => state.ai.model);
  const userActivityTracker = useRef(new UserActivityTracker());
  const apiDocManager = useRef(new APIDocManager());

  const convertData = useCallback((data: any): DataPoint => {
    return {
      id: Date.now(),
      value: data.value,
      timestamp: new Date().toISOString(),
      source: data.source || 'unknown',
      type: data.type || 'general'
    };
  }, []);

  const convertToNativeFormat = useCallback((data: DataPoint[]): AIModelType => {
    return {
      dataPoints: data,
      lastUpdated: new Date().toISOString(),
      metadata: {
        totalPoints: data.length,
        sources: [...new Set(data.map(d => d.source))],
        types: [...new Set(data.map(d => d.type))]
      }
    };
  }, []);

  useEffect(() => {
    const dataListener = (event: CustomEvent) => {
      const newData = event.detail;
      const convertedData = convertData(newData);
      setPipelineData(prevData => [...prevData, convertedData]);
    };

    window.addEventListener('newDataPoint', dataListener as EventListener);
    socket.on('realTimeData', (data) => {
      const convertedData = convertData(data);
      setPipelineData(prevData => [...prevData, convertedData]);
    });
    userActivityTracker.current.startTracking();
    apiDocManager.current.loadDocs();

    return () => {
      window.removeEventListener('newDataPoint', dataListener as EventListener);
      socket.off('realTimeData');
      userActivityTracker.current.stopTracking();
    };
  }, [convertData]);

  useEffect(() => {
    if (pipelineData.length > 0) {
      const nativeData = convertToNativeFormat(pipelineData);
      dispatch(processData(nativeData));
      userActivityTracker.current.logActivity('data_processed');
    }
  }, [pipelineData, dispatch, convertToNativeFormat]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(updateAIModel());
      userActivityTracker.current.logActivity('model_updated');
    }, 60000); // Update AI model every minute

    return () => clearInterval(intervalId);
  }, [dispatch]);

  return (
    <PipelineContainer>
      <Title>AI Pipeline</Title>
      <InfoText>Current data points: {pipelineData.length}</InfoText>
      <InfoText>Data sources: {[...new Set(pipelineData.map(d => d.source))].join(', ')}</InfoText>
      <InfoText>Data types: {[...new Set(pipelineData.map(d => d.type))].join(', ')}</InfoText>
      <ModelInfo>
        <InfoText>AI Model: {aiModel.name}</InfoText>
        <InfoText>Version: {aiModel.version}</InfoText>
        <InfoText>Last Updated: {new Date(aiModel.lastUpdated).toLocaleString()}</InfoText>
        <InfoText>Total Processed Data Points: {aiModel.metadata?.totalProcessedPoints || 0}</InfoText>
      </ModelInfo>
    </PipelineContainer>
  );
};

export default AIPipeline;
