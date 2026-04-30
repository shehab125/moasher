import pandas as pd
import numpy as np
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib
from prophet import Prophet
import os

# Get directory of the current script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 1. تحميل البيانات
df = pd.read_csv(os.path.join(BASE_DIR, 'muasher_full_data.csv'))
df['التاريخ'] = pd.to_datetime(df['التاريخ'])

# --- الجزء الأول: مودل التقييم الحالي (XGBoost) ---
print("Training Valuation Model...")

# تجهيز الميزات
le_neighborhood = LabelEncoder()
le_type = LabelEncoder()

df['neighborhood_encoded'] = le_neighborhood.fit_transform(df['الحي'])
df['type_encoded'] = le_type.fit_transform(df['نوع العقار'])

X = df[['neighborhood_encoded', 'type_encoded', 'المساحة']]
y = df['سعر المتر']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

valuation_model = XGBRegressor(n_estimators=100, learning_rate=0.1, max_depth=5)
valuation_model.fit(X_train, y_train)

# حفظ المودل والمحولات
joblib.dump(valuation_model, os.path.join(BASE_DIR, 'valuation_model.pkl'))
joblib.dump(le_neighborhood, os.path.join(BASE_DIR, 'le_neighborhood.pkl'))
joblib.dump(le_type, os.path.join(BASE_DIR, 'le_type.pkl'))

import json

# --- الجزء الثاني: مودل التنبؤ المستقبلي (نظام CAGR المستقر) ---
print("Calculating Market Growth Rate...")

# سنقوم بحساب نسبة النمو الشهري بناءً على آخر 10 أشهر
df_monthly = df.groupby(df['التاريخ'].dt.to_period('M'))['سعر المتر'].mean().reset_index()
df_monthly['التاريخ'] = df_monthly['التاريخ'].dt.to_timestamp()

# حساب نسبة التغير بين أول شهر وآخر شهر في الداتا
first_price = df_monthly.iloc[0]['سعر المتر']
last_price = df_monthly.iloc[-1]['سعر المتر']
num_months = len(df_monthly)

if num_months > 1:
    # نسبة النمو الإجمالية في الفترة
    total_growth = (last_price - first_price) / first_price
    # متوسط النمو الشهري
    monthly_growth_rate = total_growth / num_months
else:
    monthly_growth_rate = 0.002 # افتراض 0.2% شهرياً كقيمة افتراضية (2.4% سنوياً)

# التأكد من أن النمو منطقي (بين -5% و +15% سنوياً كحد أقصى)
annual_growth_rate = monthly_growth_rate * 12
if annual_growth_rate > 0.15: annual_growth_rate = 0.15
if annual_growth_rate < -0.05: annual_growth_rate = -0.05

# حفظ بيانات التنبؤ في ملف JSON
prediction_data = {
    "annual_growth_rate": float(annual_growth_rate),
    "monthly_growth_rate": float(annual_growth_rate / 12),
    "last_market_avg": float(last_price),
    "num_data_months": int(num_months)
}

with open(os.path.join(BASE_DIR, 'prediction_stats.json'), 'w') as f:
    json.dump(prediction_data, f)

print(f"Market analysis complete. Annual Growth Rate: {annual_growth_rate*100:.2f}%")
print("All models and stats saved successfully!")
