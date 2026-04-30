from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
from datetime import datetime, timedelta
import json

import os

# Get directory of the current script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = FastAPI(title="Muasher API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# تحميل النماذج المدربة
valuation_model = joblib.load(os.path.join(BASE_DIR, 'valuation_model.pkl'))
le_neighborhood = joblib.load(os.path.join(BASE_DIR, 'le_neighborhood.pkl'))
le_type = joblib.load(os.path.join(BASE_DIR, 'le_type.pkl'))

# تحميل إحصائيات التنبؤ
with open(os.path.join(BASE_DIR, 'prediction_stats.json'), 'r') as f:
    prediction_stats = json.load(f)

# تحميل البيانات الأصلية للمرجعية
df_original = pd.read_csv(os.path.join(BASE_DIR, 'muasher_full_data.csv'))

# ===== نماذج الطلب والاستجابة =====
class ValuationRequest(BaseModel):
    neighborhood: str
    property_type: str  # "قطعة أرض" أو "شقة"
    area: float  # المساحة بالمتر المربع

class ValuationResponse(BaseModel):
    neighborhood: str
    property_type: str
    area: float
    current_price_per_meter: float
    total_current_price: float
    predicted_price_per_meter_1year: float
    total_predicted_price_1year: float
    market_avg_price_per_meter: float
    market_min_price_per_meter: float
    market_max_price_per_meter: float
    confidence: str

# ===== نقاط النهاية (Endpoints) =====

@app.get("/")
def root():
    return {"message": "مرحباً بك في منصة مؤشر للتحليل العقاري", "version": "1.0"}

@app.post("/valuate")
def valuate(request: ValuationRequest):
    """
    تقييم العقار وتوقع السعر المستقبلي
    """
    try:
        # التحقق من أن الحي موجود في البيانات التدريبية
        if request.neighborhood not in le_neighborhood.classes_:
            available_neighborhoods = le_neighborhood.classes_.tolist()[:10]
            raise HTTPException(
                status_code=400,
                detail=f"الحي '{request.neighborhood}' غير موجود. من الأحياء المتاحة: {available_neighborhoods}"
            )
        
        # التحقق من نوع العقار
        if request.property_type not in le_type.classes_:
            raise HTTPException(
                status_code=400,
                detail=f"نوع العقار يجب أن يكون: {list(le_type.classes_)}"
            )
        
        # تحويل المدخلات
        neighborhood_encoded = le_neighborhood.transform([request.neighborhood])[0]
        type_encoded = le_type.transform([request.property_type])[0]
        
        # التنبؤ بسعر المتر الحالي
        X_input = [[neighborhood_encoded, type_encoded, request.area]]
        current_price_per_meter = float(valuation_model.predict(X_input)[0])
        current_price_per_meter = max(100.0, current_price_per_meter) # الحد الأدنى 100 ريال
        total_current_price = current_price_per_meter * request.area
        
        # التنبؤ بسعر المتر بعد سنة باستخدام نسبة النمو السنوية
        # future_price = current_price * (1 + annual_growth_rate)
        annual_rate = prediction_stats.get("annual_growth_rate", 0.03)
        future_price_per_meter = current_price_per_meter * (1 + annual_rate)
        total_predicted_price_1year = future_price_per_meter * request.area
        
        # حساب إحصائيات السوق للحي
        neighborhood_data = df_original[(df_original['الحي'] == request.neighborhood) & 
                                        (df_original['نوع العقار'] == request.property_type)]
        
        if not neighborhood_data.empty:
            market_avg = neighborhood_data['سعر المتر'].mean()
            market_min = neighborhood_data['سعر المتر'].min()
            market_max = neighborhood_data['سعر المتر'].max()
        else:
            market_avg = df_original['سعر المتر'].mean()
            market_min = df_original['سعر المتر'].min()
            market_max = df_original['سعر المتر'].max()
        
        # تحديد مستوى الثقة
        if abs(current_price_per_meter - market_avg) / market_avg < 0.15:
            confidence = "عالية جداً"
        elif abs(current_price_per_meter - market_avg) / market_avg < 0.3:
            confidence = "عالية"
        else:
            confidence = "متوسطة"
        
        return ValuationResponse(
            neighborhood=request.neighborhood,
            property_type=request.property_type,
            area=request.area,
            current_price_per_meter=round(current_price_per_meter, 2),
            total_current_price=round(total_current_price, 2),
            predicted_price_per_meter_1year=round(future_price_per_meter, 2),
            total_predicted_price_1year=round(total_predicted_price_1year, 2),
            market_avg_price_per_meter=round(market_avg, 2),
            market_min_price_per_meter=round(market_min, 2),
            market_max_price_per_meter=round(market_max, 2),
            confidence=confidence
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"خطأ في المعالجة: {str(e)}")

@app.get("/neighborhoods")
def get_neighborhoods():
    """
    الحصول على قائمة الأحياء المتاحة
    """
    neighborhoods = le_neighborhood.classes_.tolist()
    return {"neighborhoods": neighborhoods, "total": len(neighborhoods)}

@app.get("/property-types")
def get_property_types():
    """
    الحصول على أنواع العقارات المتاحة
    """
    return {"property_types": le_type.classes_.tolist()}

@app.get("/market-stats")
def get_market_stats():
    """
    إحصائيات السوق العامة
    """
    stats = {
        "total_transactions": len(df_original),
        "total_neighborhoods": len(le_neighborhood.classes_),
        "avg_price_per_meter": round(df_original['سعر المتر'].mean(), 2),
        "annual_growth_rate": round(prediction_stats.get("annual_growth_rate", 0) * 100, 2),
        "property_type_distribution": df_original['نوع العقار'].value_counts().to_dict(),
        "data_date_range": f"{df_original['التاريخ'].min()} to {df_original['التاريخ'].max()}"
    }
    return stats

@app.get("/metrics")
def get_metrics():
    """
    بيانات كفاءة المودل
    """
    # للحصول على نتائج دقيقة، نقوم بحسابها من البيانات المخزنة
    neighborhood_encoded = le_neighborhood.transform(df_original['الحي'])
    type_encoded = le_type.transform(df_original['نوع العقار'])
    X = pd.DataFrame({
        'neighborhood_encoded': neighborhood_encoded,
        'type_encoded': type_encoded,
        'المساحة': df_original['المساحة']
    })
    y_true = df_original['سعر المتر']
    y_pred = valuation_model.predict(X)
    
    from sklearn.metrics import mean_absolute_error, r2_score
    mae = mean_absolute_error(y_true, y_pred)
    r2 = r2_score(y_true, y_pred)
    
    return {
        "mae": round(float(mae), 2),
        "r2": round(float(r2), 4),
        "accuracy_label": "High" if r2 > 0.8 else "Good" if r2 > 0.6 else "Moderate"
    }

# تشغيل الـ API
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
