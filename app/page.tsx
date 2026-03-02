"use client";
import React, { useState } from 'react';
import * as iztro from 'iztro';
const functionalAstrolabe = iztro.functionalAstrolabe;

export default function Home() {
  const [reading, setReading] = useState("");
  const [loading, setLoading] = useState(false);

  const startAnalysis = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const date = formData.get("date") as string;
    const hour = parseInt(formData.get("hour") as string);
    const gender = formData.get("gender") as string;

    try {
      // 1. 使用 iztro 執行物理排盤，確保主星絕對正確
      const astrolabe = functionalAstrolabe(date, hour, gender, true);
      const palace = astrolabe.palaces.find(p => p.name === "命宮");
      const stars = palace?.majorStars.map(s => s.name).join('、') || "無主星";

      // 2. 顯示結果 (稍後我們再連動 AI 毒舌功能)
      setReading(`【排盤成功】\n妳的主星是：${stars}\n\n大師正在觀察妳 2026 年的氣運... (AI 載入中)`);
    } catch (err) { 
      alert("日期或格式有誤，請再檢查一下喔！"); 
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#09090b', color: '#e2e8f0', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#8b5cf6', fontSize: '2.5rem', fontWeight: '900', textAlign: 'center' }}>犀利大師 · 雲端道場</h1>
      
      <form onSubmit={startAnalysis} style={{ maxWidth: '400px', margin: '40px auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label>出生日期</label>
        <input type="date" name="date" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }} />
        
        <label>出生時辰</label>
        <select name="hour" style={{ padding: '10px', borderRadius: '8px', background: '#1e293b', color: '#fff' }}>
          <option value="0">子 (23:00-01:00)</option>
          <option value="2">丑 (01:00-03:00)</option>
          <option value="4">寅 (03:00-05:00)</option>
          <option value="6">卯 (05:00-07:00)</option>
          <option value="8">辰 (07:00-09:00)</option>
          <option value="10">巳 (09:00-11:00)</option>
          <option value="12">午 (11:00-13:00)</option>
          <option value="14">未 (13:00-15:00)</option>
          <option value="16">申 (15:00-17:00)</option>
          <option value="18">酉 (17:00-19:00)</option>
          <option value="20">戌 (19:00-21:00)</option>
          <option value="22">亥 (21:00-23:00)</option>
        </select>

        <label>性別</label>
        <div style={{ display: 'flex', gap: '20px' }}>
          <label><input type="radio" name="gender" value="男" defaultChecked /> 男</label>
          <label><input type="radio" name="gender" value="女" /> 女</label>
        </div>

        <button type="submit" disabled={loading} style={{ background: '#7c3aed', color: '#fff', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: 'none', marginTop: '10px' }}>
          {loading ? "正在觀星..." : "開始解碼命格"}
        </button>
      </form>

      {reading && (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', background: '#1e293b', borderRadius: '20px', border: '1px solid #7c3aed', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
          {reading}
        </div>
      )}
    </div>
  );
}
