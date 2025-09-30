import { useState } from 'react';
import { ChevronDown, ChevronRight, Sparkles, Bot } from 'lucide-react';
import { SamplingRequestContent, SamplingResponseContent, Content } from '../types/message';
import MarkdownContent from './MarkdownContent';
import { cn } from '../utils';

interface SamplingMessageProps {
  samplingRequest?: SamplingRequestContent;
  samplingResponse?: SamplingResponseContent;
  isStreaming?: boolean;
}

export default function SamplingMessage({
  samplingRequest,
  samplingResponse,
  isStreaming = false,
}: SamplingMessageProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getContentText = (content: Content): string => {
    if ('text' in content) {
      return content.text;
    }
    return '[Non-text content]';
  };

  const renderSamplingRequest = () => {
    if (!samplingRequest) return null;

    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Sparkles className="w-4 h-4" />
          <span>Sampling request to {samplingRequest.extensionName}</span>
        </div>
        {isExpanded && (
          <div className="ml-6 space-y-2 text-sm">
            <div className="p-2 bg-bg-subtle rounded">
              <div className="font-medium mb-1">Messages:</div>
              {samplingRequest.messages.map((msg, idx) => (
                <div key={idx} className="mb-1">
                  <span className="font-medium">{msg.role}:</span> {getContentText(msg.content)}
                </div>
              ))}
            </div>
            {samplingRequest.systemPrompt && (
              <div className="p-2 bg-bg-subtle rounded">
                <div className="font-medium mb-1">System Prompt:</div>
                <div className="text-text-muted">{samplingRequest.systemPrompt}</div>
              </div>
            )}
            {samplingRequest.modelPreferences && (
              <div className="p-2 bg-bg-subtle rounded">
                <div className="font-medium mb-1">Model Preferences:</div>
                <div className="text-text-muted">
                  {samplingRequest.modelPreferences.hints?.map((h) => h.name).join(', ')}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderSamplingResponse = () => {
    if (!samplingResponse) return null;

    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-text-success">
          <Bot className="w-4 h-4" />
          <span>Sampling response from {samplingResponse.model}</span>
          {samplingResponse.stopReason && (
            <span className="text-xs text-text-muted">({samplingResponse.stopReason})</span>
          )}
        </div>
        {isExpanded && (
          <div className="ml-6 p-3 bg-bg-subtle rounded">
            <div className="text-sm">
              <MarkdownContent content={getContentText(samplingResponse.content)} />
            </div>
          </div>
        )}
      </div>
    );
  };

  const hasContent = samplingRequest || samplingResponse;
  if (!hasContent) return null;

  return (
    <div
      className={cn(
        'border border-border-subtle rounded-lg p-3 my-2',
        'bg-bg-base hover:bg-bg-subtle transition-colors',
        isStreaming && 'animate-pulse'
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 w-full text-left"
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-text-muted" />
        ) : (
          <ChevronRight className="w-4 h-4 text-text-muted" />
        )}
        <div className="flex-1">
          {samplingRequest && renderSamplingRequest()}
          {samplingResponse && renderSamplingResponse()}
        </div>
      </button>
    </div>
  );
}
