"use client";
import React, { useState } from 'react';
// @ts-ignore
import * as iztro from 'iztro';

export default function Home() {
  const [reading, setReading] = useState("");
  const [loading, setLoading] = useState(false);

  const startAnalysis = async (e: any) => {
    e.preventDefault();
    setReading("");
    setLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const rawDate = formData.get("date") as string;
      const date = rawDate ? rawDate.replace(/\//g, '-') : ""; 
      const hour = parseInt(formData.get("hour") as string || "0");
      const gender = formData.get("gender") as string || "女";

      // 雙重驗證引入方式
      const lib: any = iztro;
      const func = lib.functionalAstrolabe || (lib.default && lib.default.functionalAstrolabe);
      
      if (!func) {
        setReading("排盤工具載入中，請稍候。");
        setLoading(false);
        return;
      }

      const astrolabe = func(date, hour, gender, true);
      const palace = astrolabe.palaces.find((p: any) => p.name === "命宮");
      const stars = palace?.majorStars.map((s: any) => s.name).join('、') || "無主星";

      setReading(`【命宮主星】：${stars}\n\n大師偵測到妳的命格了！連線 AI 模組中...`);
    } catch (err) { 
      setReading("格式可能有誤，請輸入 YYYY-MM-DD (如 1990-03-23)。");
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#09090b', color: '#e2e8f0', minHeight: '100vh', padding: '40px', textAlign: 'center' }}>
      <h1 style={{ color: '#8b5cf6', fontSize: '2rem', marginBottom: '30px' }}>犀利大師 · 雲端道場</h1>
      <form onSubmit={startAnalysis} style={{ maxWidth: '400px', margin: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
        <label>出生日期 (YYYY-MM-DD)</label>
        <input type="text" name="date" placeholder="1990-03-23" required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }} />
        <label>出生時辰</label>
        <select name="hour" style={{ padding: '12px', borderRadius: '8px', background: '#1e293b', color: '#fff', border: '1px solid #334155' }}>
