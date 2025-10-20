// === script/supabaseClient.js ===
// Supabase 接続設定（ブラウザ版）

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Supabase プロジェクト情報
const supabaseUrl = 'https://raduzrxytbhwdcoxcnds.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhZHV6cnh5dGJod2Rjb3hjbmRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NjU0NzQsImV4cCI6MjA3NjU0MTQ3NH0.4o87NWaUX8UOiTlMCElTG4AvfsF9nTZE9ywryIMnwzc'

// Supabaseクライアント生成
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 接続テスト（初回デバッグ用：成功すればConsoleに出力）
supabase.from('users').select('*').limit(1)
  .then(({ data, error }) => {
    if (error) console.error('❌ Supabase接続エラー:', error)
    else console.log('✅ Supabase接続成功:', data)
  })
  