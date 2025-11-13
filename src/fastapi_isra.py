# main.py (FastAPI application)
import myquery_db as query_db
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
from datetime import datetime
import numpy as np
from fastapi.responses import JSONResponse
import pandas as pd

app = FastAPI()

# 设置允许的前端地址
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://10.161.67.41:8015",
    # 如果以后有其他域名，也可以加到这里
    # "http://127.0.0.1:5173",
    # "https://yourdomain.com",
]

# 允许前端访问你的后端 API
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # 生产环境中应指定具体的域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
column_map = { 
    'crossweb_position_(mm)':'corssweb_position_mm',
    'downweb_position_(m)':'downweb_position_m',
    'length':'flaw_length',
    'width':'flaw_width',
    'area':'flaw_area',
    'avg':'area_avg',
    'std':'area_std'
  }
# 数据库连接字符串（根据你的实际情况修改）
# server: SQL Server 地址
# database: 数据库名
# trusted_connection: 信任连接（如果使用Windows身份验证）
# driver: ODBC 驱动名
tables = {'meta':'ks_project_yyk.ISRA_report.isra_result_meta',
          'detail':'ks_project_yyk.ISRA_report.isra_result_detail',
          'agg':'ks_project_yyk.ISRA_report.result_detail_agg',
          'imag_url':'ks_project_yyk.ISRA_report.result_meta_image_url_new'
          }

# 定义数据模型（对应前端的 TypeScript 类型）
# 在 Python 中，你可以用 Pydantic 来定义
from pydantic import BaseModel

class RawDataAll(BaseModel):
    id: int
    flaw_number: int
    lot: str
    line_speed_m_min: float
    reportdate: datetime
    product:str
    roll_number: str
    production_line: str
    country: str
    corssweb_position_mm:float
    downweb_position_m:float
    productid: int
    flaw_type: str
    flaw_area: float
    flaw_length: float
    flaw_width: float
    roll_length_m: float
    roll_width_mm: float
    image_url: str
    area_avg: float
    area_std: float
    flaw_id: int


class RawDataMeta(BaseModel):
    #id: str 
    #roll_width_mm: int
    #flaw_number: int
    #roll_length_m: float
    #lot: str
    #line_speed_m_min: float
    reportdate: datetime
    product:str
    roll_number: str
    production_line: str
    #country: str


class OtherData(BaseModel):
    reportdate: datetime
    product:str
    roll_number: str
    lot: str
    flaw_type: str
    area_catogry: str
    area_range: str
    flaw_numbers: int


  # 定义一个新的模型来包装所有返回的数据
class DashboardResponse(BaseModel):
    raw_meta_data: List[RawDataAll]
    other_data: List[OtherData] # 假设这是你的 df2 对应的数据模型


def my_agg(df):
    # 定义你的阈值
    df['l1'] = df['area_avg'] - 3 * df['area_std']
    df['l2'] = df['area_avg'] - 2 * df['area_std']
    df['l3'] = df['area_avg'] - 1 * df['area_std']
    df['l5'] = df['area_avg'] + 1 * df['area_std']
    df['l6'] = df['area_avg'] + 2 * df['area_std']
    df['l7'] = df['area_avg'] + 3 * df['area_std']
    # 定义条件列表和对应的选择值列表
    print('1'*10)


   
    # 简化后的代码如下：
    conditions_simplified = [
        df['flaw_area'] > df['l7'],
        df['flaw_area'] > df['l6'],
        df['flaw_area'] > df['l5'],
        df['flaw_area'] > df['area_avg'],
        df['flaw_area'] > df['l3'],
        df['flaw_area'] > df['l2'],
        df['flaw_area'] > df['l1'],
         df['flaw_area'] >0
    ]

    choices_simplified = [
        "LEVEL8",
        "LEVEL7",
        "LEVEL6",
        "LEVEL5",
        "LEVEL4",
        "LEVEL3",
        "LEVEL2",
        "LEVEL1"
    ]

    df['area_catogary'] = np.select(conditions_simplified, choices_simplified, default="LEVEL1")
    print('2'*10,df.head())
    choices_range = [
    '(' + df['l7'].astype(str) + ', +∞)',
    '(' + df['l6'].astype(str) + ', ' + df['l7'].astype(str) + ']',
    '(' + df['l5'].astype(str) + ', ' + df['l6'].astype(str) + ']',
    '(' + df['area_avg'].astype(str) + ', ' + df['l5'].astype(str) + ']',
    '(' + np.maximum(df['l3'], 0).astype(str) + ', ' + df['area_avg'].astype(str) + ']',
    '(' + np.maximum(df['l2'], 0).astype(str) + ', ' + df['l3'].astype(str) + ']',
    '(' + np.maximum(df['l1'], 0).astype(str) + ', ' + df['l2'].astype(str) + ']',
    '(0, ' + df['l1'].astype(str) + ']'
        ]
    # 使用 np.select 创建新的列
    df['area_range'] = np.select(conditions_simplified, choices_range, default=None)
    print('3'*10)
    df.head()

    #groupy by:
    df['lot'] = df['lot'].fillna('none')
    group_columns = ['reportdate','product','roll_number','lot','flaw_type','area_catogary','area_range']
    df_agg = df.groupby(group_columns).apply(lambda x: len(x))
    print('4'*10, df_agg.head())
    df_agg = df_agg.reset_index()
    df_agg.columns = group_columns+['flaw_numbers']
    df_agg['roll_number'] = df_agg['roll_number'].astype(str)
    return df_agg


def image_url_create(df0):
    if df0.empty:
        return
    
    df = df0.copy()
    
    image_url_common = "https://10.161.67.41:8443/korean_api/images/"
    df['image_type'] = '.JPG.jpg'
    conda_BMP = df['production_line'] =='K1'
    df.loc[conda_BMP,'image_type'] = '.BMP.jpg'
    df['file_path_temp'] = df['file_path'].str.split(r'K1\\|K1\\|Data\\', regex=True).str[-1].str.split(r'\\').str[:-1].str.join('/')
    

    df['file_path_temp2'] = df['file_path_temp'] \
    +"/Images/Images0001/" \
    + df['roll_number'].astype(str) \
    + df['file_path_temp'].str.split('/').str[1:3].str.join('') \
    + "-" \
    + df['flaw_id'].astype(str) \
    + df['image_type']


    df['image_url'] = image_url_common + df['production_line']+'/'+df['file_path_temp2']
    #note: for linux server only: use mirror address:
    
    df.drop(['file_path_temp2','file_path_temp','image_type','file_path'], axis=1, inplace=True)
    return df


# 定义 API 端点
@app.get("/api/meta-data1day", response_model=List[DashboardResponse])
async def get_meta_data_1day(production_line):
    if (not production_line) or (production_line==' '):
        return JSONResponse(content={})
    hour_gap = 9 if production_line=='K1' else 8
    #hour_gap = hour_gap-70
    #time_thresh = f"FORMAT(DATEADD(hour, {hour_gap}, GETUTCDATE()), 'yyyy-MM-dd')"
    results =  {'raw_meta_data':[],'other_data':[]}
    try:
        query = f'''SELECT d.*, 
            m.[roll_width_(mm)] as roll_width_mm,
            m.[roll_length_(m)] as roll_length_m,
            m.[line_speed_(m/min)] as line_speed_m_min,
            m.flaw_number, 
            m.lot, 
            m.reportdate, 
            m.product, 
            m.roll_number, 
            m.production_line, 
            m.country,
            u.file_path, 
            a.avg_area as avg, 
            a.std_area as std
        FROM {tables['detail']} d
            INNER join {tables['meta']} m on d.productid = m.id
            left join {tables['agg']} a on d.flaw_type = a.flaw_type
            left join {tables['imag_url']} u on u.productid = d.productid and u.flaw_id=d.flaw_id
        where 1=1
        and m.production_line ='{production_line}'
        and m.reportdate>=FORMAT(DATEADD(hour, {hour_gap}, GETUTCDATE()), 'yyyy-MM-dd')
        
        '''
        print(query)
        df = query_db.query_ksdata(query)
        if df.empty:
            print('df is empty')
        
        #add image _url
        df = image_url_create(df0=df)
        #df = pd.read_csv('test.csv')
        df.rename(columns=column_map,inplace=True)

        df['reportdate'] = pd.to_datetime(df['reportdate'] ).dt.strftime('%Y-%m-%d %H:%M')
        #df['reportdate_day'] = pd.to_datetime(df['reportdate'] ).dt.strftime('%Y-%m-%d')
        df['roll_number'] = df['roll_number'].astype(str)
        print('df', df.head())
        df_agg = my_agg(df)
        print('df_agg------------------------------', df_agg.head())
      
        results_df = df.to_dict(orient="records")
        results_agg = df_agg.to_dict(orient="records")
        results = {'raw_meta_data':results_df,'other_data':results_agg}
        #return JSONResponse(content=results)

        #return {'raw_meta_data':results_df,'other_data':results_agg}
    except Exception as e:
        print(f"Error connecting to database: {e}")
        
    return JSONResponse(content=results)
    


@app.get("/api/meta_data", response_model=List[RawDataMeta])
async def get_meta_data():
    try:
        
        query = f'''SELECT
                        --[roll_width_(mm)] as roll_width_mm,
                        --flaw_number,
                        --[roll_length_(m)] as roll_length_m,
                        --lot,
                        --[line_speed_(m/min)] as line_speed_m_min,
                        reportdate,
                        product,
                        roll_number,
                        production_line
                        --country 
                    FROM {tables['meta']}
                    '''
        print(query)
        df = query_db.query_ksdata(query)
        #df = pd.read_csv('test_demo.csv')
        df.rename(columns=column_map,inplace=True)
        df['reportdate'] = pd.to_datetime(df['reportdate'] ).dt.strftime('%Y-%m-%d %H:%M')
        df['roll_number'] = df['roll_number'].astype(str)
        results = df.to_dict(orient="records")

        #return results
        return JSONResponse(content=results)
    except Exception as e:
        print(f"Error connecting to database: {e}")
        #return [{}]
        return JSONResponse(content=[{}])
   



class SelectedOptions(BaseModel):
    production_line: str
    reportdate: str
    product: str
    roll_number: str
    startDate: str
    endDate: str
    # Pydantic handles validation and type conversion automatically


# 定义 API 端点
@app.post("/api/data_query_options", response_model=List[DashboardResponse])
async def data_query_options(selected: SelectedOptions):
    options_dict = selected.model_dump()
    flag_label = False
    for i in  options_dict.values():
        if (not i) or (i=='') or (i==' '):
            continue
        else:
            flag_label=True
            break
    if not flag_label:
        return JSONResponse(content={})

    print('options_dict', options_dict)
    query = f'''SELECT d.*, 
            m.[roll_width_(mm)] as roll_width_mm,
            m.[roll_length_(m)] as roll_length_m,
            m.[line_speed_(m/min)] as line_speed_m_min,
            m.flaw_number, 
            m.lot, 
            m.reportdate, 
            m.product, 
            m.roll_number, 
            m.production_line, 
            m.country,
            u.file_path, 
            a.avg_area as avg, 
            a.std_area as std
        FROM {tables['detail']} d
            INNER  join {tables['meta']} m on d.productid = m.id
            left join {tables['agg']} a on d.flaw_type = a.flaw_type
            left join {tables['imag_url']} u on u.productid = d.productid and u.flaw_id=d.flaw_id
        where 1=1
        '''
    
    #print(query)
    #df = query_db.query_ksdata(query)
    #if df.empty:
    #    print('df is empty')
    
    #add image _url
    #df = image_url_create(df0=df)
    #options_dict_new = {}
    for k, v in options_dict.items():
        if v=='ALL' or v=='':
            continue
        elif k=='startDate':
            query += f''' and m.reportdate >='{v}' '''
        elif k=='endDate':
            query += f''' and m.reportdate <='{v}' '''
        elif k=='roll_number':
            query += f' and m.{k}={v}'
        
        else:
            query += f''' and m.{k}='{v}' '''

    results = {'raw_meta_data':[{}],'other_data':[{}]}
    try:
        print(query)

        df = query_db.query_ksdata(query)
        if df.empty:
            print('df is empty')
        #add image _url
        df = image_url_create(df0=df)
        df.rename(columns=column_map,inplace=True)
        print('df', df.head())
        
        df['reportdate'] = pd.to_datetime(df['reportdate'] ).dt.strftime('%Y-%m-%d %H:%M')
        #df['reportdate'] = pd.to_datetime(df['reportdate'] ).dt.strftime('%Y-%m-%d')
        df['roll_number'] = df['roll_number'].astype(str)

        ##df = pd.read_csv('test.csv')
        df_agg = my_agg(df)
        print('df_agg', df_agg.head())
        #df_agg['roll_number'] = df_agg['roll_number'].astype(str)
      
        results_df = df.to_dict(orient="records")
        results_agg = df_agg.to_dict(orient="records")

        results = {'raw_meta_data':results_df,'other_data':results_agg}
        #return JSONResponse(content=results)

        #return {'raw_meta_data':results_df,'other_data':results_agg}
    except Exception as e:
        print(f"Error connecting to database: {e}")
        
    return JSONResponse(content=results)
    
if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8000)