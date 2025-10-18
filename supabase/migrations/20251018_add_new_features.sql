-- Migration: Add New Features (v2.1.0)
-- Date: 2025-10-18
-- Description: Adiciona tabelas para notificações push, eventos de compartilhamento e insights de IA

-- ============================================================================
-- 1. Tabela de Subscriptions de Push Notifications
-- ============================================================================

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription JSONB NOT NULL,
  endpoint TEXT GENERATED ALWAYS AS (subscription->>'endpoint') STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);

-- RLS (Row Level Security)
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions"
  ON push_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
  ON push_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON push_subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions"
  ON push_subscriptions FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_push_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER push_subscriptions_updated_at
  BEFORE UPDATE ON push_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_push_subscriptions_updated_at();

-- ============================================================================
-- 2. Tabela de Eventos de Compartilhamento Social
-- ============================================================================

CREATE TABLE IF NOT EXISTS share_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  platform VARCHAR(50) NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance e analytics
CREATE INDEX IF NOT EXISTS idx_share_events_user_id ON share_events(user_id);
CREATE INDEX IF NOT EXISTS idx_share_events_platform ON share_events(platform);
CREATE INDEX IF NOT EXISTS idx_share_events_content_type ON share_events(content_type);
CREATE INDEX IF NOT EXISTS idx_share_events_created_at ON share_events(created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE share_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own share events"
  ON share_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own share events"
  ON share_events FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can view all share events"
  ON share_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================================================
-- 3. Tabela de Insights de IA
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  test_result_id UUID REFERENCES test_results(id) ON DELETE CASCADE,
  profile_data JSONB NOT NULL,
  insights JSONB NOT NULL,
  model_version VARCHAR(50) DEFAULT 'gpt-4',
  tokens_used INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_ai_insights_user_id ON ai_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_test_result_id ON ai_insights(test_result_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_created_at ON ai_insights(created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own AI insights"
  ON ai_insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI insights"
  ON ai_insights FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 4. Tabela de Histórico de Notificações
-- ============================================================================

CREATE TABLE IF NOT EXISTS notification_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_notification_history_user_id ON notification_history(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_history_type ON notification_history(notification_type);
CREATE INDEX IF NOT EXISTS idx_notification_history_sent_at ON notification_history(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_notification_history_read_at ON notification_history(read_at);

-- RLS (Row Level Security)
ALTER TABLE notification_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON notification_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notification_history FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 5. Views para Analytics
-- ============================================================================

-- View: Estatísticas de Compartilhamento
CREATE OR REPLACE VIEW share_statistics AS
SELECT
  platform,
  content_type,
  COUNT(*) as total_shares,
  COUNT(DISTINCT user_id) as unique_users,
  DATE_TRUNC('day', created_at) as share_date
FROM share_events
GROUP BY platform, content_type, DATE_TRUNC('day', created_at);

-- View: Estatísticas de Notificações
CREATE OR REPLACE VIEW notification_statistics AS
SELECT
  notification_type,
  COUNT(*) as total_sent,
  COUNT(read_at) as total_read,
  COUNT(clicked_at) as total_clicked,
  ROUND(COUNT(read_at)::NUMERIC / COUNT(*)::NUMERIC * 100, 2) as read_rate,
  ROUND(COUNT(clicked_at)::NUMERIC / COUNT(*)::NUMERIC * 100, 2) as click_rate,
  DATE_TRUNC('day', sent_at) as notification_date
FROM notification_history
GROUP BY notification_type, DATE_TRUNC('day', sent_at);

-- ============================================================================
-- 6. Funções Auxiliares
-- ============================================================================

-- Função: Obter subscriptions ativas de um usuário
CREATE OR REPLACE FUNCTION get_user_push_subscriptions(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  subscription JSONB,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT ps.id, ps.subscription, ps.created_at
  FROM push_subscriptions ps
  WHERE ps.user_id = p_user_id
  ORDER BY ps.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função: Registrar evento de compartilhamento
CREATE OR REPLACE FUNCTION log_share_event(
  p_user_id UUID,
  p_platform VARCHAR(50),
  p_content_type VARCHAR(50),
  p_url TEXT,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_event_id UUID;
BEGIN
  INSERT INTO share_events (user_id, platform, content_type, url, metadata)
  VALUES (p_user_id, p_platform, p_content_type, p_url, p_metadata)
  RETURNING id INTO v_event_id;
  
  RETURN v_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função: Marcar notificação como lida
CREATE OR REPLACE FUNCTION mark_notification_read(p_notification_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE notification_history
  SET read_at = NOW()
  WHERE id = p_notification_id
  AND user_id = auth.uid()
  AND read_at IS NULL;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função: Marcar notificação como clicada
CREATE OR REPLACE FUNCTION mark_notification_clicked(p_notification_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE notification_history
  SET 
    clicked_at = NOW(),
    read_at = COALESCE(read_at, NOW())
  WHERE id = p_notification_id
  AND user_id = auth.uid();
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 7. Comentários para Documentação
-- ============================================================================

COMMENT ON TABLE push_subscriptions IS 'Armazena subscriptions de push notifications dos usuários';
COMMENT ON TABLE share_events IS 'Registra eventos de compartilhamento social para analytics';
COMMENT ON TABLE ai_insights IS 'Armazena insights gerados por IA para perfis de comunicação';
COMMENT ON TABLE notification_history IS 'Histórico de notificações enviadas aos usuários';

COMMENT ON COLUMN push_subscriptions.subscription IS 'Objeto JSON da subscription do Push API';
COMMENT ON COLUMN share_events.platform IS 'Plataforma de compartilhamento (facebook, twitter, linkedin, etc)';
COMMENT ON COLUMN ai_insights.insights IS 'Objeto JSON com insights gerados pela IA';
COMMENT ON COLUMN notification_history.notification_type IS 'Tipo de notificação (achievement, reminder, update, etc)';

-- ============================================================================
-- 8. Dados Iniciais (Opcional)
-- ============================================================================

-- Inserir tipos de notificação padrão (para referência)
-- Não é necessário criar tabela separada, mas pode ser útil para validação

-- ============================================================================
-- Fim da Migration
-- ============================================================================

