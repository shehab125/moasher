import requests
import json
import time
import pandas as pd
from datetime import datetime

# --- 1. الإعدادات ---
headers = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json;charset=UTF-8',
    'X-PowerBI-ResourceKey': '128ef46f-c52d-42a8-af0e-85a54e84c5f9', 
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

url = 'https://wabi-west-europe-d-primary-api.analysis.windows.net/public/reports/querydata?synchronous=true'

# متغير لتخزين آخر قيم تم رؤيتها (للتعامل مع ضغط البيانات)
last_row_values = [None] * 12

def get_payload(token=None):
    payload = {
        "version": "1.0.0",
        "queries": [{
            "Query": {
                "Commands": [{
                    "SemanticQueryDataShapeCommand": {
                        "Query": {
                            "Version": 2,
                            "From": [{"Name": "s", "Entity": "srem_moj_clean_data", "Type": 0}],
                            "Select": [
                                {'Column': {'Expression': {'SourceRef': {'Source': 's'}}, 'Property': 'التاريخ'}, 'Name': 'Date'},
                                {'Column': {'Expression': {'SourceRef': {'Source': 's'}}, 'Property': 'common_deed (groups)'}, 'Name': 'Type'},
                                {'Column': {'Expression': {'SourceRef': {'Source': 's'}}, 'Property': 'transaction_type'}, 'Name': 'Trans'},
                                {'Column': {'Expression': {'SourceRef': {'Source': 's'}}, 'Property': 'المدينة'}, 'Name': 'City'},
                                {'Column': {'Expression': {'SourceRef': {'Source': 's'}}, 'Property': 'المنطقة'}, 'Name': 'Reg'},
                                {'Column': {'Expression': {'SourceRef': {'Source': 's'}}, 'Property': 'المخطط'}, 'Name': 'Plan'},
                                {'Column': {'Expression': {'SourceRef': {'Source': 's'}}, 'Property': 'القطعة'}, 'Name': 'Plot'},
                                {'Column': {'Expression': {'SourceRef': {'Source': 's'}}, 'Property': 'السعر بالريال السعودي'}, 'Name': 'Price'},
                                {'Column': {'Expression': {'SourceRef': {'Source': 's'}}, 'Property': 'الحي'}, 'Name': 'Dist'},
                                {'Column': {'Expression': {'SourceRef': {'Source': 's'}}, 'Property': 'نوع العقار'}, 'Name': 'Kind'},
                                {'Column': {'Expression': {'SourceRef': {'Source': 's'}}, 'Property': 'المساحة بالمتر المربع'}, 'Name': 'Area'},
                                {'Column': {'Expression': {'SourceRef': {'Source': 's'}}, 'Property': 'سعر المتر المربع'}, 'Name': 'PPM'}
                            ],
                            "Where": [
                                {'Condition': {'In': {'Expressions': [{'Column': {'Expression': {'SourceRef': {'Source': 's'}}, 'Property': 'المدينة'}}], 'Values': [[{'Literal': {'Value': "'جدة'"}}]]}}},
                                {'Condition': {'In': {'Expressions': [{'Column': {'Expression': {'SourceRef': {'Source': 's'}}, 'Property': 'common_deed (groups)'}}], 'Values': [[{'Literal': {'Value': "'كامل العقار'"}}]]}}},
                                {'Condition': {'In': {'Expressions': [{'Column': {'Expression': {'SourceRef': {'Source': 's'}}, 'Property': 'نوع العقار'}}], 'Values': [[{'Literal': {'Value': "'قطعة أرض'"}}]]}}},
                                {'Condition': {'In': {'Expressions': [{'Column': {'Expression': {'SourceRef': {'Source': 's'}}, 'Property': 'transaction_type'}}], 'Values': [[{'Literal': {'Value': "'صفقة'"}}], [{'Literal': {'Value': "'صفقة بتمويل'"}}], [{'Literal': {'Value': "'صفقة بيع مرهون'"}}]]}}},
                                {'Condition': {'Comparison': {'ComparisonKind': 2, 'Left': {'Column': {'Expression': {'SourceRef': {'Source': 's'}}, 'Property': 'التاريخ'}}, 'Right': {'Literal': {'Value': "datetime'2019-01-01T00:00:00'"}}}}}
                            ],
                            "OrderBy": [{"Direction": 2, "Expression": {"Column": {"Expression": {"SourceRef": {"Source": "s"}}, "Property": "التاريخ"}}}]
                        },
                        "Binding": {
                            "Primary": {"Groupings": [{"Projections": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]}]},
                            "DataReduction": {"DataVolume": 3, "Primary": {"Window": {"Count": 500}}},
                            "Version": 1
                        }
                    }
                }]
            }
        }],
        "modelId": 4905601
    }
    if token:
        # تعديل مهم: التوكين غالباً بيجي كـ list، بنمرره زي ما هو من غير تغليف إضافي
        payload['queries'][0]['Query']['Commands'][0]['SemanticQueryDataShapeCommand']['Binding']['DataReduction']['Primary']['Window']['RestartTokens'] = token
    return payload

def parse_pbi_data(response_json):
    global last_row_values
    results = []
    try:
        dsr = response_json['results'][0]['result']['data']['dsr']
        ds0 = dsr['DS'][0]
        value_dicts = ds0.get('ValueDicts', {})
        rows = ds0.get('PH', [{}])[0].get('DM0', [])
        
        def get_val(dict_key, idx):
            if idx is None: return None
            try: return value_dicts.get(dict_key, [])[idx]
            except: return None

        for row in rows:
            c = row.get('C', [])
            
            # آلية الـ Forward Fill: لو الـ JSON باعت صف ناقص، بنكمله من آخر قيم شفناها
            current_row = []
            for i in range(12):
                if i < len(c) and c[i] is not None:
                    last_row_values[i] = c[i] # تحديث آخر قيمة
                current_row.append(last_row_values[i])

            date_str = None
            if current_row[0] is not None:
                try: date_str = datetime.fromtimestamp(current_row[0] / 1000.0).strftime('%Y-%m-%d')
                except: pass

            parsed_row = {
                'التاريخ': date_str,
                'مشاع؟': get_val('D0', current_row[1]),
                'نوع العملية': get_val('D1', current_row[2]),
                'المدينة': get_val('D2', current_row[3]),
                'المنطقة': get_val('D3', current_row[4]),
                'المخطط': get_val('D4', current_row[5]),
                'القطعة': get_val('D5', current_row[6]),
                'السعر (ريال)': current_row[7],
                'الحي': get_val('D6', current_row[8]),
                'نوع العقار': get_val('D7', current_row[9]),
                'المساحة (م2)': current_row[10],
                'سعر المتر': current_row[11]
            }
            results.append(parsed_row)
            
        # استخراج التوكين الجديد
        next_token = ds0.get('RT')
        return results, next_token
    except Exception as e:
        print(f"Error: {e}")
        return [], None

# --- اللوب الرئيسي ---
all_data = []
current_token = None
page = 1

while True:
    print(f"⏳ سحب الصفحة {page}...")
    payload = get_payload(current_token)
    response = requests.post(url, headers=headers, json=payload)
    
    if response.status_code != 200:
        print(f"❌ خطأ {response.status_code}. الـ Token قد يكون انتهى أو الـ RestartToken غير سليم.")
        break
        
    page_data, current_token = parse_pbi_data(response.json())
    if not page_data: break
    
    all_data.extend(page_data)
    print(f"✅ تم سحب {len(page_data)} صف. الإجمالي: {len(all_data)}")
    
    if not current_token: break
    page += 1
    time.sleep(2)

if all_data:
    df = pd.DataFrame(all_data)
    df.to_excel("Jeddah_RealEstate_V2.xlsx", index=False)
    print(f"🎉 تم الحفظ! الإجمالي النهائي: {len(df)} صف.")