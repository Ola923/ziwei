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
      const date = rawDate.replace(/\//g, '-'); 
      const hour = parseInt(formData.get("hour") as string);
      const gender = formData.get("gender") as string;

      // 雙重驗證引入方式
      const lib: any = iztro;
      const func = lib.functionalAstrolabe || (lib.default && lib.default.functionalAstrolabe);
      
      if (!func) {
        setReading("找不到排盤工具，請重新整理頁面。");
        setLoading(false);
        return;
      }

      const astrolabe = func(date, hour, gender, true);
      const palace = astrolabe.palaces.find((p: any) => p.name === "命宮");
      const stars = palace?.majorStars.map((s: any) => s.name).join('、') || "無主星";

      setReading(`【命宮主星】：${stars}\n\n大師偵測到妳的命格了！目前正在排除 AI 通訊障礙。`);
    } catch (err) { 
      setReading("日期格式可能有誤，請使用 YYYY-MM-DD (例如 1990-03-23)。");
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#09090b', color: '#e2e8f0', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1 style={{ color: '#8b5cf6', fontSize: '2rem', marginBottom: '30px' }}>犀利大師 · 雲端道場</h1>
      <form onSubmit={startAnalysis} style={{ maxWidth: '400px', margin: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
        <label>出生日期 (YYYY-MM-DD)</label>
        <input type="text" name="date" placeholder="1990-03-23" required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }} />
        <label>出生時辰</label>
        <select name="hour" style={{ padding: '12px', borderRadius: '8px', background: '#1e293b', color: '#fff', border: '1px solid #334155' }}>
          <option value="0">子時</option><option value="2">丑時</option><option value="4">寅時</option><option value="6">卯時</option>
          <option value="8">辰時</option><option value="10">巳時</option><option value="12">午時</option><option value="14">未時</option>
          <option value="16">申時</option><option value="18">酉時</option><option value="20">戌時</option><option value="22">亥時</option>
        </select>
        <button type="submit" disabled={loading} style={{ background: '#7c3aed', color: '#fff', padding: '1
