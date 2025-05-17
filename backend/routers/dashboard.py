from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
import pandas as pd
from routers.files import processed_results

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/data/{process_id}")
async def get_dashboard_data(process_id: str):
    """Obtiene datos para el dashboard"""
    if process_id not in processed_results or "resumen_data" not in processed_results[process_id]:
        raise HTTPException(status_code=404, detail="Datos no encontrados")
    
    resumen_data = processed_results[process_id]["resumen_data"]
    
    # Preparar datos para gráficos
    dashboard_data = {
        "totales_por_unidad": get_totales_por_unidad(resumen_data),
        "top_impresoras": get_top_impresoras(resumen_data),
        "top_usuarios": get_top_usuarios(resumen_data),
        "distribucion_por_ubicacion": get_distribucion_por_ubicacion(resumen_data),
        "resumen_general": get_resumen_general(resumen_data)
    }
    
    return dashboard_data

def get_totales_por_unidad(resumen_data):
    """Calcula totales por unidad de negocio"""
    # Filtrar filas de total y agrupar por unidad de negocio
    totales = resumen_data[
        resumen_data['Número de Serie de la Impresora'].astype(str).str.startswith('Total -')
    ].groupby('Unidad de Negocio').agg({
        'Páginas': 'sum',
        'Total paginas': 'sum',
        'Número de Serie de la Impresora': 'count'
    }).reset_index()
    
    totales.columns = ['unidad_negocio', 'paginas', 'total_facturado', 'cantidad_impresoras']
    return totales.to_dict(orient='records')

def get_top_impresoras(resumen_data, top_n=10):
    """Obtiene las top N impresoras por uso"""
    # Agrupar por impresora y sumar páginas
    top = resumen_data.groupby('Nombre de la impresora').agg({
        'Páginas': 'sum',
        'Unidad de Negocio': 'first'
    }).sort_values('Páginas', ascending=False).head(top_n).reset_index()
    
    top.columns = ['impresora', 'paginas', 'unidad_negocio']
    return top.to_dict(orient='records')

def get_top_usuarios(resumen_data, top_n=10):
    """Obtiene los top N usuarios por uso"""
    # Filtrar filas que no son totales y agrupar por usuario
    usuarios = resumen_data[
        ~resumen_data['Número de Serie de la Impresora'].astype(str).str.startswith('Total -')
    ].groupby(['Nombre Completo', 'Departamento del Usuario']).agg({
        'Páginas': 'sum',
        'Unidad de Negocio': 'first'
    }).sort_values('Páginas', ascending=False).head(top_n).reset_index()
    
    usuarios.columns = ['usuario', 'departamento', 'paginas', 'unidad_negocio']
    return usuarios.to_dict(orient='records')

def get_distribucion_por_ubicacion(resumen_data):
    """Obtiene distribución de páginas por ubicación"""
    ubicaciones = resumen_data.groupby(['Ciudad', 'Ubicación']).agg({
        'Páginas': 'sum'
    }).reset_index()
    
    ubicaciones.columns = ['ciudad', 'ubicacion', 'paginas']
    return ubicaciones.to_dict(orient='records')

def get_resumen_general(resumen_data):
    """Obtiene estadísticas generales"""
    total_paginas = resumen_data['Páginas'].sum()
    total_facturado = resumen_data['Total paginas'].sum()
    
    # Contar valores únicos, excluyendo filas de total
    datos_filtrados = resumen_data[
        ~resumen_data['Número de Serie de la Impresora'].astype(str).str.startswith('Total -')
    ]
    
    return {
        "total_paginas": int(total_paginas),
        "total_facturado": int(total_facturado) if not pd.isna(total_facturado) else 0,
        "total_impresoras": datos_filtrados['Nombre de la impresora'].nunique(),
        "total_usuarios": datos_filtrados['Nombre de Usuario'].nunique(),
        "total_unidades": datos_filtrados['Unidad de Negocio'].nunique()
    }