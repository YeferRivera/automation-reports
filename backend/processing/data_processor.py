import pandas as pd
from collections import defaultdict

class DataProcessor:
    def __init__(self):
        self.serie_unidad_negocio = {}
        self.serie_ciudad = {}
        self.serie_ubicacion = {}
        self.series_por_unidad = defaultdict(list)
    
    def assign_business_units(self, factura_data, unidades_negocio):
        """Asigna unidades de negocio a los números de serie"""
        for i, serie_row in factura_data.iterrows():
            serie = serie_row['Número de Serie']
            fila = serie_row['fila']
            ciudad = serie_row['Ciudad']
            ubicacion = serie_row['Ubicación']
            
            # Guardar ciudad y ubicación (si no son nulos)
            if pd.notna(ciudad):
                self.serie_ciudad[str(serie)] = ciudad
            if pd.notna(ubicacion):
                self.serie_ubicacion[str(serie)] = ubicacion
            
            # Encontrar la unidad de negocio correspondiente
            unidad_asignada = None
            for unidad in reversed(unidades_negocio):
                if unidad['fila'] < fila:
                    unidad_asignada = unidad['nombre']
                    break
            
            if unidad_asignada:
                self.serie_unidad_negocio[str(serie)] = unidad_asignada
                self.series_por_unidad[unidad_asignada].append(str(serie))
    
    def get_series_por_unidad(self):
        """Retorna un diccionario con series por unidad de negocio"""
        return {k: list(v) for k, v in self.series_por_unidad.items()}
    
    def process_data(self, maestro_df, factura_data):
        """Procesa los datos y genera el resumen"""
        # Preparar datos de factura para el merge
        factura_data_merge = factura_data[['Número de Serie', 'Factura']].copy()
        factura_data_merge.columns = ['Número de Serie de la Impresora', 'Factura']
        
        # Columnas para agrupación
        columnas_grupo = [
            'Nombre de la impresora',
            'Tipo/Modelo impresora',
            'Número de Serie de la Impresora',
            'Nombre Completo',
            'Nombre de Usuario',
            'Departamento del Usuario'
        ]
        
        # Agrupar y sumar
        resumen_df = maestro_df.groupby(columnas_grupo, as_index=False)['Páginas'].sum()
        
        # Cruce por Número de Serie de la Impresora
        resumen_con_factura = pd.merge(
            resumen_df,
            factura_data_merge,
            on='Número de Serie de la Impresora',
            how='left'  # Mantener todo lo del resumen aunque falte en factura
        )
        
        # Calcular totales por impresora para porcentajes
        totales_impresora = {}
        facturas_impresora = {}
        for impresora, grupo in resumen_con_factura.groupby('Nombre de la impresora'):
            totales_impresora[impresora] = grupo['Páginas'].sum()
            # Guardar el primer valor no nulo de factura
            factura_valores = grupo['Factura'].dropna()
            if not factura_valores.empty:
                facturas_impresora[impresora] = factura_valores.iloc[0]
            else:
                facturas_impresora[impresora] = None
        
        # Crear lista con totales por impresora incluyendo factura
        final_data = []
        for impresora, grupo in resumen_con_factura.groupby('Nombre de la impresora'):
            # Obtener totales para esta impresora
            total_paginas_impresora = totales_impresora[impresora]
            factura_valor = facturas_impresora.get(impresora)
            
            # Obtener la unidad de negocio, ciudad y ubicación
            numero_serie = str(grupo['Número de Serie de la Impresora'].iloc[0])
            unidad_negocio = self.serie_unidad_negocio.get(numero_serie, "No identificada")
            ciudad = self.serie_ciudad.get(numero_serie, "No identificada")
            ubicacion = self.serie_ubicacion.get(numero_serie, "No identificada")
            
            # Añadir filas de detalle con promedio y total páginas
            grupo_sin_factura = grupo.copy()
            grupo_sin_factura['Factura'] = None  # Eliminar factura de filas de detalle
            
            # Calcular promedio y total páginas
            grupo_sin_factura['Promedio_exacto'] = grupo_sin_factura['Páginas'] / total_paginas_impresora * 100
            grupo_sin_factura['Promedio'] = grupo_sin_factura['Promedio_exacto'].round().astype(int)
            
            if factura_valor is not None:
                grupo_sin_factura['Total paginas'] = ((grupo_sin_factura['Promedio_exacto'] / 100) * factura_valor).round().astype(int)
            else:
                grupo_sin_factura['Total paginas'] = None
            
            grupo_sin_factura = grupo_sin_factura.drop(columns=['Promedio_exacto'])
            
            # Añadir columnas de información adicional
            grupo_sin_factura['Unidad de Negocio'] = unidad_negocio
            grupo_sin_factura['Ciudad'] = ciudad
            grupo_sin_factura['Ubicación'] = ubicacion
            
            final_data.append(grupo_sin_factura)
            
            # Crear fila de total con factura
            total_row = {
                'Nombre de la impresora': impresora,
                'Tipo/Modelo impresora': '',
                'Número de Serie de la Impresora': f'Total - {grupo["Número de Serie de la Impresora"].iloc[0]}',
                'Nombre Completo': '',
                'Nombre de Usuario': '',
                'Departamento del Usuario': '',
                'Páginas': total_paginas_impresora,
                'Factura': factura_valor,
                'Promedio': 100,  # El total representa el 100%
                'Total paginas': factura_valor if factura_valor is not None else None,
                'Unidad de Negocio': unidad_negocio,
                'Ciudad': ciudad,
                'Ubicación': ubicacion
            }
            final_data.append(pd.DataFrame([total_row]))
        
        # Concatenar resultados
        return pd.concat(final_data, ignore_index=True)