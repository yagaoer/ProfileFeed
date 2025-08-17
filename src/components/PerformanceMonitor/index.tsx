import React, { useEffect, useState, useCallback } from 'react';
import './styles.css';

interface PerformanceMetrics {
  fps: number;
  renderTime: number;
  memoryUsage?: number;
  domNodes: number;
}

interface PerformanceMonitorProps {
  enabled?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  enabled = true,
  position = 'top-right',
  onMetricsUpdate
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    renderTime: 0,
    memoryUsage: 0,
    domNodes: 0
  });
  const [isVisible, setIsVisible] = useState(false);

  // FPS 监控
  const measureFPS = useCallback(() => {
    let frames = 0;
    let lastTime = performance.now();
    
    const countFrames = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
        
        setMetrics(prev => {
          const newMetrics = { ...prev, fps };
          onMetricsUpdate?.(newMetrics);
          return newMetrics;
        });
        
        frames = 0;
        lastTime = currentTime;
      }
      
      if (enabled) {
        requestAnimationFrame(countFrames);
      }
    };
    
    if (enabled) {
      requestAnimationFrame(countFrames);
    }
  }, [enabled, onMetricsUpdate]);

  // 渲染时间监控
  const measureRenderTime = useCallback(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'measure' && entry.name.includes('React')) {
          setMetrics(prev => ({
            ...prev,
            renderTime: Math.round(entry.duration * 100) / 100
          }));
        }
      });
    });

    if ('PerformanceObserver' in window) {
      observer.observe({ entryTypes: ['measure'] });
    }

    return () => observer.disconnect();
  }, []);

  // 内存使用监控
  const measureMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as Performance & { memory: { usedJSHeapSize: number } }).memory;
      const memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024 * 100) / 100;
      
      setMetrics(prev => ({
        ...prev,
        memoryUsage
      }));
    }
  }, []);

  // DOM 节点数监控
  const measureDOMNodes = useCallback(() => {
    const domNodes = document.querySelectorAll('*').length;
    setMetrics(prev => ({
      ...prev,
      domNodes
    }));
  }, []);

  useEffect(() => {
    if (!enabled) return;

    measureFPS();
    const renderCleanup = measureRenderTime();
    
    // 定期更新其他指标
    const interval = setInterval(() => {
      measureMemoryUsage();
      measureDOMNodes();
    }, 2000);

    return () => {
      clearInterval(interval);
      renderCleanup?.();
    };
  }, [enabled, measureFPS, measureRenderTime, measureMemoryUsage, measureDOMNodes]);

  if (!enabled) return null;

  return (
    <div className={`performance-monitor ${position}`}>
      <button 
        className="performance-toggle"
        onClick={() => setIsVisible(!isVisible)}
        title="性能监控"
      >
        📊 {metrics.fps}fps
      </button>
      
      {isVisible && (
        <div className="performance-panel">
          <div className="performance-header">
            <h4>性能监控</h4>
            <button onClick={() => setIsVisible(false)}>✕</button>
          </div>
          
          <div className="performance-metrics">
            <div className="metric">
              <span className="metric-label">FPS:</span>
              <span className={`metric-value ${metrics.fps < 30 ? 'warning' : metrics.fps < 50 ? 'caution' : 'good'}`}>
                {metrics.fps}
              </span>
            </div>
            
            <div className="metric">
              <span className="metric-label">渲染时间:</span>
              <span className="metric-value">
                {metrics.renderTime}ms
              </span>
            </div>
            
            {metrics.memoryUsage !== undefined && (
              <div className="metric">
                <span className="metric-label">内存使用:</span>
                <span className="metric-value">
                  {metrics.memoryUsage}MB
                </span>
              </div>
            )}
            
            <div className="metric">
              <span className="metric-label">DOM节点:</span>
              <span className="metric-value">
                {metrics.domNodes}
              </span>
            </div>
          </div>
          
          <div className="performance-tips">
            {metrics.fps < 30 && (
              <div className="tip warning">
                ⚠️ FPS过低，建议优化渲染性能
              </div>
            )}
            {metrics.domNodes > 1000 && (
              <div className="tip caution">
                💡 DOM节点较多，考虑使用虚拟列表
              </div>
            )}
            {metrics.memoryUsage && metrics.memoryUsage > 100 && (
              <div className="tip caution">
                💡 内存使用较高，注意内存泄漏
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;
