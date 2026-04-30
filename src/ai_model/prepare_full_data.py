import os
import pandas as pd
import numpy as np

# Get directory of the current script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# قراءة الملف الأصلي
file_path = os.path.join(BASE_DIR, 'muasher_full_data.csv')
df = pd.read_csv(file_path)

# تنظيف أسماء الأعمدة
df.columns = [c.strip() for c in df.columns]

# 1. الفلترة: جدة + (قطعة أرض أو شقة) + كامل العقار
allowed_types = ['قطعة أرض', 'شقة']
df_filtered = df[
    (df['المدينة'] == 'جدة') & 
    (df['نوع العقار'].isin(allowed_types)) & 
    (df['مشاع؟'] == 'كامل العقار')
].copy()

# 2. تنظيف البيانات الرقمية
def clean_numeric(x):
    if pd.isna(x): return np.nan
    if isinstance(x, str):
        x = x.replace(',', '').strip()
        if x == '' or x == '-': return np.nan
        try: return float(x)
        except: return np.nan
    return float(x)

df_filtered['سعر العملية'] = df_filtered['سعر العملية'].apply(clean_numeric)
df_filtered['المساحة'] = df_filtered['المساحة'].apply(clean_numeric)
df_filtered['سعر المتر'] = df_filtered['سعر المتر'].apply(clean_numeric)

# حذف الصفوف غير المكتملة
df_filtered = df_filtered.dropna(subset=['سعر العملية', 'المساحة', 'سعر المتر', 'الحي', 'التاريخ'])

# 3. تنظيف متقدم: إزالة الأصفار والقيم غير المنطقية
# استبعاد أي سعر متر أقل من أو يساوي 500 ريال (غير منطقي في جدة كصفقة تجارية)
df_filtered = df_filtered[df_filtered['سعر المتر'] > 500]

# إزالة القيم الشاذة جداً (Outliers) - مثلاً أعلى 1% (الأسعار الفلكية)
q_high = df_filtered['سعر المتر'].quantile(0.99)
df_filtered = df_filtered[df_filtered['سعر المتر'] < q_high]

# 4. معالجة التواريخ
df_filtered['التاريخ'] = pd.to_datetime(df_filtered['التاريخ'])

# 5. حفظ البيانات النهائية
df_filtered.to_csv(os.path.join(BASE_DIR, 'muasher_full_data.csv'), index=False)

print(f"--- Full Data Statistics ---")
print(f"Total Rows: {len(df_filtered)}")
print(f"Property Types: {df_filtered['نوع العقار'].value_counts().to_dict()}")
print(f"Date Range: {df_filtered['التاريخ'].min().date()} to {df_filtered['التاريخ'].max().date()}")
print(f"Cleaned data saved to muasher_full_data.csv")
